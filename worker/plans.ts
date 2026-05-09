/**
 * Private editable plan pages.
 *
 * Each slug maps to a markdown document. Content is seeded at build time from
 * `worker/plans-seed.json` (baked from `docs/plans-allowlist.json` via
 * `scripts/build-plans-seed.mjs`). The first PUT inserts the row in D1; from
 * then on D1 is the source of truth and the seed is only used as a fallback
 * when D1 has no row for the slug.
 *
 * Routes (mounted by worker/index.ts):
 *   POST /api/plans/unlock                  → { pin } → 200 { ok: true } or 401
 *   GET  /api/plans?slug=<slug>             → 200 { content, etag, updatedAt, fromSeed? }
 *   PUT  /api/plans                         → { slug, content, pin, etag? }
 *                                             → 200 { etag, updatedAt }
 *                                             → 409 if etag mismatch (stale write)
 *
 * Bindings:
 *   LEADS_DB     D1Database     (required for persistence — falls back to seed if absent)
 *   LEADS_KV     KVNamespace    (optional — IP rate limit on PUT/unlock)
 *   PLANS_PIN    secret         (required — gates all reads + writes)
 *
 * Seed payload shape (worker/plans-seed.json):
 *   { v: 1, builtAt: ISO, plans: { [slug]: { title: string, content: string, etag: string } } }
 */
import seed from "./plans-seed.json" assert { type: "json" };

interface SeedPayload {
  v: number;
  builtAt: string;
  plans: Record<string, { title: string; content: string; etag: string }>;
}

const SEED = seed as SeedPayload;

export interface PlansEnv {
  LEADS_DB?: D1Database;
  LEADS_KV?: KVNamespace;
  PLANS_PIN?: string;
}

const SLUG_RE = /^[a-z0-9][a-z0-9_\-]{0,80}$/i;
const MAX_CONTENT_LEN = 200_000; // 200 KB raw markdown — generous for any plan
const MIN_CONTENT_LEN = 10;

const RATE_LIMIT_WINDOW_SECS = 3600;
const RATE_LIMIT_PUT_MAX = 30;
const RATE_LIMIT_UNLOCK_MAX = 20;

export async function handlePlans(
  req: Request,
  env: PlansEnv,
  ctx: ExecutionContext,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (url.pathname === "/api/plans/unlock") {
    return handleUnlock(req, env, ctx, corsHeaders);
  }

  if (url.pathname === "/api/plans") {
    if (req.method === "GET") return handleGet(req, env, corsHeaders);
    if (req.method === "PUT") return handlePut(req, env, ctx, corsHeaders);
    return json({ error: "Method not allowed" }, 405, corsHeaders);
  }

  return json({ error: "Not found" }, 404, corsHeaders);
}

async function handleUnlock(
  req: Request,
  env: PlansEnv,
  ctx: ExecutionContext,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, corsHeaders);
  }
  if (!env.PLANS_PIN) {
    return json(
      { error: "Plans are not configured. Set PLANS_PIN via `wrangler secret put`." },
      503,
      corsHeaders,
    );
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.LEADS_KV) {
    const limited = await checkRateLimit(env.LEADS_KV, `plans-unlock:${ip}`, RATE_LIMIT_UNLOCK_MAX, ctx);
    if (limited) {
      return json({ error: "Too many attempts. Try again in an hour." }, 429, corsHeaders);
    }
  }

  let body: { pin?: string };
  try {
    body = (await req.json()) as { pin?: string };
  } catch {
    return json({ error: "Invalid JSON" }, 400, corsHeaders);
  }

  if (typeof body.pin !== "string" || !timingSafeEqual(body.pin.trim(), env.PLANS_PIN)) {
    return json({ error: "Invalid PIN" }, 401, corsHeaders);
  }

  return json({ ok: true }, 200, corsHeaders);
}

async function handleGet(
  req: Request,
  env: PlansEnv,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  const url = new URL(req.url);
  const slug = (url.searchParams.get("slug") ?? "").trim().toLowerCase();
  const pin = req.headers.get("X-Plans-Pin") ?? "";

  if (!env.PLANS_PIN) {
    return json({ error: "Plans are not configured." }, 503, corsHeaders);
  }
  if (!timingSafeEqual(pin, env.PLANS_PIN)) {
    return json({ error: "Unauthorized" }, 401, corsHeaders);
  }

  if (!slug || !SLUG_RE.test(slug) || !SEED.plans[slug]) {
    return json({ error: "Unknown plan" }, 404, corsHeaders);
  }

  if (env.LEADS_DB) {
    try {
      const row = await env.LEADS_DB
        .prepare(`SELECT content, etag, updated_at AS updatedAt FROM plans WHERE slug = ?`)
        .bind(slug)
        .first<{ content: string; etag: string; updatedAt: string }>();
      if (row) {
        return json(
          {
            ok: true,
            slug,
            title: SEED.plans[slug].title,
            content: row.content,
            etag: row.etag,
            updatedAt: row.updatedAt,
            fromSeed: false,
          },
          200,
          corsHeaders,
        );
      }
    } catch (err) {
      console.error("plans get failed", err);
      // Fall through to seed.
    }
  }

  const seedPlan = SEED.plans[slug];
  return json(
    {
      ok: true,
      slug,
      title: seedPlan.title,
      content: seedPlan.content,
      etag: seedPlan.etag,
      updatedAt: SEED.builtAt,
      fromSeed: true,
    },
    200,
    corsHeaders,
  );
}

async function handlePut(
  req: Request,
  env: PlansEnv,
  ctx: ExecutionContext,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (!env.PLANS_PIN) {
    return json({ error: "Plans are not configured." }, 503, corsHeaders);
  }

  let body: { slug?: string; content?: string; pin?: string; etag?: string; author?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON" }, 400, corsHeaders);
  }

  if (typeof body.pin !== "string" || !timingSafeEqual(body.pin.trim(), env.PLANS_PIN)) {
    return json({ error: "Unauthorized" }, 401, corsHeaders);
  }

  const slug = (body.slug ?? "").trim().toLowerCase();
  if (!slug || !SLUG_RE.test(slug) || !SEED.plans[slug]) {
    return json({ error: "Unknown plan" }, 404, corsHeaders);
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (content.length < MIN_CONTENT_LEN) {
    return json({ error: "Content too short." }, 422, corsHeaders);
  }
  if (content.length > MAX_CONTENT_LEN) {
    return json({ error: `Content too long (max ${MAX_CONTENT_LEN} chars).` }, 422, corsHeaders);
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.LEADS_KV) {
    const limited = await checkRateLimit(env.LEADS_KV, `plans-put:${ip}`, RATE_LIMIT_PUT_MAX, ctx);
    if (limited) {
      return json({ error: "Slow down — too many edits in the last hour." }, 429, corsHeaders);
    }
  }

  if (!env.LEADS_DB) {
    return json(
      { error: "Plans persistence unavailable. The D1 binding isn't configured yet." },
      503,
      corsHeaders,
    );
  }

  const newEtag = await sha256Hex(content);
  const updatedAt = new Date().toISOString();
  const author = ((body.author ?? "").trim() || "anon").slice(0, 60);

  // Optimistic concurrency: if etag is supplied, it must match the row's current etag.
  if (typeof body.etag === "string" && body.etag.length > 0) {
    try {
      const current = await env.LEADS_DB
        .prepare(`SELECT etag FROM plans WHERE slug = ?`)
        .bind(slug)
        .first<{ etag: string }>();
      if (current && current.etag !== body.etag) {
        return json(
          {
            error: "This plan was edited elsewhere since you opened it. Reload to merge.",
            currentEtag: current.etag,
          },
          409,
          corsHeaders,
        );
      }
    } catch (err) {
      console.error("etag check failed", err);
    }
  }

  try {
    await env.LEADS_DB
      .prepare(
        `INSERT INTO plans (slug, content, etag, updated_at, updated_by)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           content    = excluded.content,
           etag       = excluded.etag,
           updated_at = excluded.updated_at,
           updated_by = excluded.updated_by`,
      )
      .bind(slug, content, newEtag, updatedAt, author)
      .run();
  } catch (err) {
    console.error("plans put failed", err);
    return json({ error: "Couldn't save. Try again in a minute." }, 500, corsHeaders);
  }

  return json(
    { ok: true, slug, etag: newEtag, updatedAt, author },
    200,
    corsHeaders,
  );
}

async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  max: number,
  ctx: ExecutionContext,
): Promise<boolean> {
  const current = parseInt((await kv.get(key)) ?? "0", 10);
  if (current >= max) return true;
  ctx.waitUntil(kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECS }));
  return false;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
