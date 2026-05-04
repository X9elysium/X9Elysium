/**
 * X9Elysium chat Worker — proxies a PIN-gated chat to Anthropic Claude.
 *
 * Request:
 *   POST /api/chat
 *   { pin: string, messages: [{ role: "user"|"assistant", content: string }, ...] }
 *
 * Response:
 *   - 200 text/event-stream — passthrough of Anthropic's SSE stream
 *   - 401 — missing/invalid PIN
 *   - 422 — malformed payload
 *   - 429 — rate limited
 *   - 503 — ANTHROPIC_API_KEY not configured
 *   - 502 — upstream Anthropic error
 *
 * Bindings (see wrangler.toml + secrets):
 *   ANTHROPIC_API_KEY   secret    — required to actually answer
 *   CHAT_PIN            secret    — required; gates access to the chat
 *   LEADS_KV            KV (opt)  — reused for IP rate limiting
 */
import context from "./chat-context.json";

export interface ChatEnv {
  ANTHROPIC_API_KEY?: string;
  CHAT_PIN?: string;
  LEADS_KV?: KVNamespace;
}

interface ChatPayload {
  pin?: string;
  messages?: Array<{ role?: string; content?: string }>;
}

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const MAX_MESSAGES = 40;
const MAX_MESSAGE_LEN = 8000;
const MAX_TOTAL_LEN = 60_000;

const RATE_LIMIT_WINDOW_SECS = 3600;
const RATE_LIMIT_MAX = 40;

const SYSTEM_PERSONA = `You are X9, the in-house assistant for X9Elysium — a founder-led Shopify Plus consulting agency in Mississauga, Ontario (Greater Toronto Area), founded 2021 by Darshan Patel and Adhvait Jadav. The agency ships Shopify Plus migrations, custom apps, headless storefronts, and unified commerce work for Canadian and US retailers.

Voice: direct, terse, founder-led. No marketing fluff, no hedging, no false humility. Match Darshan's register from the documentation — opinionated where the docs are opinionated, plain where the docs are plain.

Root value: Vasudhaiva Kutumbakam — "the world is one family." (Maha Upanishad 6.71.) Every engagement is a shared ledger of trust between people. The five pillars and ten operating rules on /foundation all answer to this one idea.

Sourcing rules:
- The documentation block below is authoritative. When you cite a fact, mention the source file in parentheses (e.g., "(docs/marketing/6-month-organic-growth-plan.md)").
- Never fabricate numbers, names, dates, case studies, or quotes. If a fact isn't in the docs and isn't general knowledge, say so plainly.
- Do not invent client names. Anonymized testimonials in the docs stay anonymized in your answers.
- The encrypted journal at /docs/journal is intentionally excluded — you have no access to it. If asked about journal contents, say so.

Domain depth: Shopify Plus (migrations from Magento / WooCommerce / BigCommerce / Salesforce CC; custom apps; headless on Hydrogen + Oxygen; B2B; performance / Core Web Vitals), Odoo (ERP + eCommerce), WooCommerce (custom plugins, headless Next.js), unified commerce architecture, Canadian DTC market dynamics, founder-led consulting economics. Talk shop when asked.

Format: short paragraphs, clean lists. Code blocks for code only. No emojis. Don't pad answers; one tight paragraph beats three loose ones.`;

const SYSTEM_DOCS_PREFIX = `Below is the full X9Elysium internal documentation corpus, built ${(context as { builtAt?: string }).builtAt ?? "at deploy time"} from ${(context as { files?: number }).files ?? 0} files (${(((context as { bytes?: number }).bytes ?? 0) / 1024).toFixed(0)} KB). Files are separated by "===== path =====" headers.\n\n`;

export async function handleChat(req: Request, env: ChatEnv, ctx: ExecutionContext, corsHeaders: Record<string, string>): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405, corsHeaders);
  }

  if (!env.ANTHROPIC_API_KEY) {
    return jsonError("Chat is not configured. Set ANTHROPIC_API_KEY via `wrangler secret put`.", 503, corsHeaders);
  }
  if (!env.CHAT_PIN) {
    return jsonError("Chat is not configured. Set CHAT_PIN via `wrangler secret put`.", 503, corsHeaders);
  }

  let body: ChatPayload;
  try {
    body = (await req.json()) as ChatPayload;
  } catch {
    return jsonError("Invalid JSON", 400, corsHeaders);
  }

  if (!constantTimeEqual(body.pin ?? "", env.CHAT_PIN)) {
    return jsonError("Invalid PIN", 401, corsHeaders);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("messages array required", 422, corsHeaders);
  }
  if (body.messages.length > MAX_MESSAGES) {
    return jsonError("Conversation too long. Start a fresh chat.", 422, corsHeaders);
  }

  const cleanMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
  let totalLen = 0;
  for (const m of body.messages) {
    const role = m.role === "user" || m.role === "assistant" ? m.role : null;
    const content = typeof m.content === "string" ? m.content.trim() : "";
    if (!role || !content) continue;
    if (content.length > MAX_MESSAGE_LEN) {
      return jsonError(`Message too long (>${MAX_MESSAGE_LEN} chars)`, 422, corsHeaders);
    }
    totalLen += content.length;
    cleanMessages.push({ role, content });
  }
  if (cleanMessages.length === 0) {
    return jsonError("messages array is empty after validation", 422, corsHeaders);
  }
  if (totalLen > MAX_TOTAL_LEN) {
    return jsonError("Conversation too large. Start a fresh chat.", 422, corsHeaders);
  }
  if (cleanMessages[cleanMessages.length - 1].role !== "user") {
    return jsonError("Last message must be from user", 422, corsHeaders);
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.LEADS_KV) {
    const limited = await checkRateLimit(env.LEADS_KV, ip, ctx);
    if (limited) {
      return jsonError("Too many messages. Try again in an hour.", 429, corsHeaders);
    }
  }

  const corpus = (context as { context?: string }).context ?? "";
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      stream: true,
      system: [
        { type: "text", text: SYSTEM_PERSONA },
        {
          type: "text",
          text: SYSTEM_DOCS_PREFIX + corpus,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: cleanMessages,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Anthropic error", upstream.status, detail);
    return jsonError(
      `Upstream error (${upstream.status}). The chat is temporarily unavailable.`,
      502,
      corsHeaders,
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

async function checkRateLimit(kv: KVNamespace, ip: string, ctx: ExecutionContext): Promise<boolean> {
  const key = `cl:${ip}`;
  const current = parseInt((await kv.get(key)) ?? "0", 10);
  if (current >= RATE_LIMIT_MAX) return true;
  ctx.waitUntil(kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECS }));
  return false;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function jsonError(error: string, status: number, extraHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
