/**
 * Sanctuary cloud-track handler.
 *
 * GET  /api/sanctuary/manifest        — list available tracks from R2
 * GET  /api/sanctuary/track/:key      — stream a single track from R2 (with Range support)
 *
 * Truth posture: if the R2 bucket isn't bound (Darsh hasn't provisioned it yet)
 * the manifest returns { tracks: [], synthesis: true } and the client falls
 * through to in-browser Web Audio synthesis. The site does not lie about
 * available tracks — empty means empty.
 *
 * Bindings:
 *   SANCTUARY    R2 bucket   (optional)
 */

export interface SanctuaryEnv {
  SANCTUARY?: R2Bucket;
}

type ManifestTrack = {
  key: string;
  title: string;
  durationSec: number | null;
  sizeBytes: number;
  contentType: string;
  uploadedAt: string;
  url: string;
};

const ALLOWED_AUDIO_PREFIXES = ["audio/"];
const TRACK_PATH_RE = /^\/api\/sanctuary\/track\/(.+)$/;

export async function handleSanctuary(
  req: Request,
  env: SanctuaryEnv,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (url.pathname === "/api/sanctuary/manifest") {
    return handleManifest(env, corsHeaders);
  }

  const trackMatch = url.pathname.match(TRACK_PATH_RE);
  if (trackMatch) {
    const key = decodeURIComponent(trackMatch[1]);
    return handleTrack(req, env, key, corsHeaders);
  }

  return json({ error: "Not found" }, 404, corsHeaders);
}

async function handleManifest(
  env: SanctuaryEnv,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (!env.SANCTUARY) {
    return json(
      {
        tracks: [],
        synthesis: true,
        message:
          "The cloud library is not yet provisioned. Until it is, Sanctuary plays in-browser Web Audio synthesis only.",
      },
      200,
      corsHeaders,
    );
  }

  try {
    const listing = await env.SANCTUARY.list({ limit: 1000 });
    const tracks: ManifestTrack[] = listing.objects
      .filter((obj) => {
        const ct = obj.httpMetadata?.contentType ?? "";
        return ALLOWED_AUDIO_PREFIXES.some((p) => ct.startsWith(p));
      })
      .map((obj) => ({
        key: obj.key,
        title: deriveTitle(obj.key, obj.customMetadata?.title),
        durationSec: parseDuration(obj.customMetadata?.durationSec),
        sizeBytes: obj.size,
        contentType: obj.httpMetadata?.contentType ?? "audio/mpeg",
        uploadedAt: obj.uploaded.toISOString(),
        url: `/api/sanctuary/track/${encodeURIComponent(obj.key)}`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    return json({ tracks, synthesis: false }, 200, corsHeaders);
  } catch (err) {
    console.error("Sanctuary manifest list failed", err);
    return json(
      { tracks: [], synthesis: true, error: "manifest_unavailable" },
      200,
      corsHeaders,
    );
  }
}

async function handleTrack(
  req: Request,
  env: SanctuaryEnv,
  key: string,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (!env.SANCTUARY) {
    return json({ error: "Bucket not provisioned" }, 503, corsHeaders);
  }

  if (key.length === 0 || key.length > 500 || key.includes("..")) {
    return json({ error: "Invalid key" }, 400, corsHeaders);
  }

  const range = parseRange(req.headers.get("Range"));
  const obj = range
    ? await env.SANCTUARY.get(key, { range })
    : await env.SANCTUARY.get(key);

  if (!obj) {
    return json({ error: "Not found" }, 404, corsHeaders);
  }

  const headers = new Headers(corsHeaders);
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

  if (range && obj.range) {
    const start = "offset" in obj.range ? obj.range.offset ?? 0 : 0;
    const length = "length" in obj.range && obj.range.length ? obj.range.length : obj.size - start;
    const end = start + length - 1;
    headers.set("Content-Range", `bytes ${start}-${end}/${obj.size}`);
    headers.set("Content-Length", String(length));
    return new Response(obj.body, { status: 206, headers });
  }

  headers.set("Content-Length", String(obj.size));
  return new Response(obj.body, { status: 200, headers });
}

function parseRange(header: string | null): R2Range | undefined {
  if (!header) return undefined;
  const match = header.match(/bytes=(\d*)-(\d*)/);
  if (!match) return undefined;
  const startStr = match[1];
  const endStr = match[2];
  if (startStr === "" && endStr !== "") {
    return { suffix: parseInt(endStr, 10) };
  }
  const offset = parseInt(startStr, 10);
  if (Number.isNaN(offset)) return undefined;
  if (endStr === "") return { offset };
  const end = parseInt(endStr, 10);
  if (Number.isNaN(end) || end < offset) return { offset };
  return { offset, length: end - offset + 1 };
}

function deriveTitle(key: string, override?: string): string {
  if (override && override.trim().length > 0) return override.trim();
  const fileName = key.split("/").pop() ?? key;
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function parseDuration(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
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
