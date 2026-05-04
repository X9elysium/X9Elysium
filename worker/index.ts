/**
 * X9Elysium Worker. Handles API routes; falls through to static assets for everything else.
 *
 * Routes:
 *   POST /api/lead     — accept contact-form submissions, email Darshan, auto-reply the lead
 *   POST /api/chat     — PIN-gated Claude chat grounded on the docs corpus (worker/chat.ts)
 *   GET  /api/health   — liveness probe
 *   *                  — fall through to the static-asset binding (the Next.js export in ./out)
 *
 * Bindings (wrangler.toml + secrets):
 *   ASSETS              static-asset Fetcher  (required)
 *   RESEND_API_KEY      secret                (required — set via `wrangler secret put`)
 *   LEAD_TO_EMAIL       var                   (required — recipient inbox)
 *   LEAD_FROM_EMAIL     var                   (required — verified Resend sender)
 *   ANTHROPIC_API_KEY   secret                (required for /api/chat)
 *   CHAT_PIN            secret                (required for /api/chat)
 *   LEADS_KV            KV namespace          (optional — IP rate-limit, shared with /api/chat)
 *   LEADS_DB            D1 database           (optional — lead persistence)
 *   SLACK_WEBHOOK_URL   secret                (optional — push notification)
 */

import { renderLeadEmail, renderLeadText, renderAutoReply, renderAutoReplyText } from "./email";
import { handleChat } from "./chat";

export interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
  LEAD_TO_EMAIL: string;
  LEAD_FROM_EMAIL: string;
  LEADS_KV?: KVNamespace;
  LEADS_DB?: D1Database;
  SLACK_WEBHOOK_URL?: string;
  ANTHROPIC_API_KEY?: string;
  CHAT_PIN?: string;
}

interface LeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  revenue?: string;
  platform?: string;
  service?: string;
  message?: string;
  _gotcha?: string;
  _ts?: number;
}

export interface NormalizedLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  revenue: string;
  platform: string;
  service: string;
  message: string;
  ip: string;
  userAgent: string;
  referer: string;
  receivedAt: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://x9elysium.com",
  "https://www.x9elysium.com",
  "http://localhost:3000",
  "http://localhost:8787",
]);

const RATE_LIMIT_WINDOW_SECS = 3600;
const RATE_LIMIT_MAX = 5;
const MIN_FORM_DWELL_MS = 2000;

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/lead") {
      return handleLead(req, env, ctx);
    }
    if (url.pathname === "/api/chat") {
      const origin = req.headers.get("Origin") ?? "";
      const corsHeaders = buildCorsHeaders(origin);
      if (origin && !ALLOWED_ORIGINS.has(origin)) {
        return json({ error: "Forbidden" }, 403, corsHeaders);
      }
      return handleChat(req, env, ctx, corsHeaders);
    }
    if (url.pathname === "/api/health") {
      return json({ ok: true, ts: Date.now() });
    }

    return env.ASSETS.fetch(req);
  },
};

async function handleLead(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const origin = req.headers.get("Origin") ?? "";
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, corsHeaders);
  }

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "Forbidden" }, 403, corsHeaders);
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return json({ error: "Invalid JSON" }, 400, corsHeaders);
  }

  // Honeypot — bots fill hidden fields, humans never see them.
  if (typeof body._gotcha === "string" && body._gotcha.trim().length > 0) {
    return json({ ok: true }, 200, corsHeaders);
  }

  // Time-trap — humans take longer than 2s to fill a real form.
  if (typeof body._ts === "number" && Number.isFinite(body._ts)) {
    const dwell = Date.now() - body._ts;
    if (dwell >= 0 && dwell < MIN_FORM_DWELL_MS) {
      return json({ ok: true }, 200, corsHeaders);
    }
  }

  const errors = validate(body);
  if (errors.length) {
    return json({ error: "Validation failed", fields: errors }, 422, corsHeaders);
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";

  if (env.LEADS_KV) {
    const limited = await checkRateLimit(env.LEADS_KV, ip, ctx);
    if (limited) {
      return json(
        { error: "Too many submissions from this network. Try again in an hour or email us directly." },
        429,
        corsHeaders,
      );
    }
  }

  const lead: NormalizedLead = {
    firstName: (body.firstName ?? "").trim(),
    lastName: (body.lastName ?? "").trim(),
    email: (body.email ?? "").trim().toLowerCase(),
    phone: (body.phone ?? "").trim(),
    company: (body.company ?? "").trim(),
    website: (body.website ?? "").trim(),
    revenue: (body.revenue ?? "").trim(),
    platform: (body.platform ?? "").trim(),
    service: (body.service ?? "").trim(),
    message: (body.message ?? "").trim(),
    ip,
    userAgent: req.headers.get("User-Agent") ?? "",
    referer: req.headers.get("Referer") ?? "",
    receivedAt: new Date().toISOString(),
  };

  // Persist before emailing — leads land in storage even if the email provider blips.
  if (env.LEADS_DB) {
    ctx.waitUntil(persistLead(env.LEADS_DB, lead));
  }

  // Notification email is the primary contract: if it doesn't send, surface the error.
  const notifyResult = await sendNotificationEmail(env, lead);
  if (!notifyResult.ok) {
    return json(
      { error: "We couldn't send your message. Please email darshan@x9elysium.com directly." },
      502,
      corsHeaders,
    );
  }

  // Auto-reply + Slack are best-effort — they don't gate the response.
  ctx.waitUntil(sendAutoReply(env, lead));
  if (env.SLACK_WEBHOOK_URL) {
    ctx.waitUntil(sendSlack(env.SLACK_WEBHOOK_URL, lead));
  }

  return json({ ok: true }, 200, corsHeaders);
}

function validate(body: LeadPayload): string[] {
  const errors: string[] = [];
  if (!body.firstName || body.firstName.trim().length < 1) errors.push("firstName");
  if (!body.lastName || body.lastName.trim().length < 1) errors.push("lastName");
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) errors.push("email");
  if (!body.message || body.message.trim().length < 10) errors.push("message");
  // Cap pathological payloads.
  if (body.message && body.message.length > 5000) errors.push("message");
  return errors;
}

async function checkRateLimit(kv: KVNamespace, ip: string, ctx: ExecutionContext): Promise<boolean> {
  const key = `rl:${ip}`;
  const current = parseInt((await kv.get(key)) ?? "0", 10);
  if (current >= RATE_LIMIT_MAX) return true;
  ctx.waitUntil(kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECS }));
  return false;
}

async function persistLead(db: D1Database, lead: NormalizedLead): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO leads
         (received_at, first_name, last_name, email, phone, company, website, revenue, platform, service, message, ip, user_agent, referer)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        lead.receivedAt,
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone || null,
        lead.company || null,
        lead.website || null,
        lead.revenue || null,
        lead.platform || null,
        lead.service || null,
        lead.message,
        lead.ip,
        lead.userAgent,
        lead.referer,
      )
      .run();
  } catch (err) {
    console.error("D1 insert failed", err);
  }
}

async function sendNotificationEmail(env: Env, lead: NormalizedLead): Promise<{ ok: boolean }> {
  const subject = `New lead — ${lead.firstName} ${lead.lastName}${lead.company ? ` · ${lead.company}` : ""}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL,
      to: [env.LEAD_TO_EMAIL],
      reply_to: lead.email,
      subject,
      html: renderLeadEmail(lead),
      text: renderLeadText(lead),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend notify failed", res.status, detail);
    return { ok: false };
  }
  return { ok: true };
}

async function sendAutoReply(env: Env, lead: NormalizedLead): Promise<void> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.LEAD_FROM_EMAIL,
        to: [lead.email],
        reply_to: env.LEAD_TO_EMAIL,
        subject: "We got your message — X9Elysium",
        html: renderAutoReply(lead),
        text: renderAutoReplyText(lead),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend auto-reply failed", res.status, detail);
    }
  } catch (err) {
    console.error("Resend auto-reply threw", err);
  }
}

async function sendSlack(webhookUrl: string, lead: NormalizedLead): Promise<void> {
  const lines = [
    `:rocket: *New lead — x9elysium.com*`,
    `*${lead.firstName} ${lead.lastName}* <${lead.email}>`,
    [lead.company, lead.revenue, lead.platform, lead.service].filter(Boolean).join(" · ") || "no metadata",
    "",
    `> ${lead.message.slice(0, 500)}${lead.message.length > 500 ? "…" : ""}`,
  ];
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
    });
  } catch (err) {
    console.error("Slack notify failed", err);
  }
}

function buildCorsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://x9elysium.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
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
