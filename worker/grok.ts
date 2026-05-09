/**
 * X9Elysium /supreme — PIN-gated, agentic Grok surface powered by xAI's
 * Responses API. Built-in Live Search (web + x), vision (image_url blocks),
 * server-side tool loop (search_thoughts, search_blog, book_call,
 * lead_capture), and streaming back to the client over a normalized SSE
 * envelope.
 *
 * Request:
 *   POST /api/grok
 *   {
 *     pin: string,
 *     messages: Array<{
 *       role: "user" | "assistant",
 *       content: string | Array<
 *         | { type: "input_text", text: string }
 *         | { type: "input_image", image_url: string, detail?: "low"|"high" }
 *       >
 *     }>
 *   }
 *
 * Response (text/event-stream — normalized envelope, NOT raw xAI events):
 *   data: {"type":"meta", model, search}                — once at start
 *   data: {"type":"text", delta}                        — incremental text
 *   data: {"type":"reasoning", delta}                   — optional reasoning
 *   data: {"type":"search", kind:"web"|"x", query}      — built-in tool fired
 *   data: {"type":"tool_call", name, args}              — custom tool fired
 *   data: {"type":"tool_result", name, summary}         — custom tool returned
 *   data: {"type":"citation", url, title?, snippet?}    — search citation
 *   data: {"type":"done"}                               — terminal
 *   data: {"type":"error", error}                       — terminal
 *
 * Bindings (wrangler.toml + secrets):
 *   XAI_API_KEY     secret    — required, https://console.x.ai
 *   SUPREME_PIN     secret    — required; gates /supreme console
 *   LEADS_KV        KV  (opt) — IP rate limit (shared with /api/chat, /api/lead)
 *   GROK_MODEL      var (opt) — override model, defaults to "grok-4-latest"
 *   CALCOM_URL      var (opt) — booking link returned by book_call tool
 */
import index from "./supreme-index.json";

export interface GrokEnv {
  XAI_API_KEY?: string;
  SUPREME_PIN?: string;
  LEADS_KV?: KVNamespace;
  GROK_MODEL?: string;
  CALCOM_URL?: string;
  RESEND_API_KEY?: string;
  LEAD_TO_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
}

interface InboundMessage {
  role?: string;
  content?: unknown;
}
interface InboundPayload {
  pin?: string;
  messages?: InboundMessage[];
}

type InputContentBlock =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail?: "low" | "high" };
type InputItem =
  | { role: "user" | "assistant"; content: InputContentBlock[] | string }
  | { type: "function_call_output"; call_id: string; output: string };

const DEFAULT_MODEL = "grok-4-latest";
const MAX_OUTPUT_TOKENS = 2048;
const MAX_TURNS = 30;
const MAX_TOOL_LOOPS = 6;
const MAX_TEXT_CHARS = 8000;
const MAX_TOTAL_CHARS = 60_000;
const MAX_IMAGES_PER_TURN = 4;
const RATE_LIMIT_WINDOW_SECS = 3600;
const RATE_LIMIT_MAX = 30;

const SUPREME_INSTRUCTIONS = `You are Supreme — the resident agent of x9elysium.com/supreme. You speak as the lab's own voice, not as a generic assistant.

x9elysium is a founder-led Shopify Plus consulting practice in the Greater Toronto Area, founded by Darshan Patel and Adhvait Jadav. No juniors. No handoffs. No outsourcing. Root credo: वसुधैव कुटुम्बकम् — Vasudhaiva Kutumbakam — "the world is one family." The five pillars and ten operating rules at /foundation all answer to this single idea.

Voice:
- Direct. Terse. Lowercase preferred for short asides. Periods over semicolons.
- Concrete > abstract. "founder-led shopify plus consulting. no juniors. no handoffs." beats "boutique digital partner."
- Under-claim. If you can't substantiate a number, soften it. Never invent metrics, named clients, dates, quotes, or case studies.
- Naval cadence in long-form. Short clauses. Pause. Then the punch.
- No marketing adjectives ("seamless", "world-class", "next-generation"). Kill on sight.

Capabilities you have:
- Live web + X search via the built-in tools when a question needs current information. Cite the source URL inline.
- Custom tools — search_thoughts, search_blog, book_call, lead_capture — call them when the prompt warrants. Prefer search_thoughts and search_blog before web for anything about x9elysium itself, the founders, or our methodology.
- Image input — when the user shares a screenshot (Shopify admin, competitor site, theme), describe what you actually see and ground advice in it.

Tool-use guardrails:
- search_thoughts / search_blog first when the question is about x9elysium opinions, philosophy, or methodology.
- web_search / x_search when the question demands current external information.
- book_call only when the user signals real intent ("can I talk to someone", "let's chat", scheduling words). Don't push it.
- lead_capture only when the user volunteers contact details for follow-up. Confirm consent before capturing.

Hard rules:
- The encrypted journal at /docs/journal is intentionally excluded. You have no access to it. Say so plainly if asked.
- Never paraphrase the credo. It appears in Devanagari and English verbatim or not at all.
- Do not pretend to be Claude, GPT, or any other model. You are Supreme, running on Grok.

Format: short paragraphs. Lists where they help. Markdown links are fine. Code blocks for code only. No emojis.`;

const CUSTOM_TOOLS = [
  {
    type: "function" as const,
    name: "search_thoughts",
    description:
      "Search x9elysium's first-person thoughts queue (data/x-thoughts.md). Use for questions about Darshan's opinions, methodology, takes on Shopify Plus, migrations, agency economics, or anything that sounds like 'what does x9elysium think about X'.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search. 1-6 keywords work best." },
        limit: { type: "integer", description: "Max results to return.", minimum: 1, maximum: 8 },
      },
      required: ["query"],
    },
  },
  {
    type: "function" as const,
    name: "search_blog",
    description:
      "Search the published x9elysium blog (content/posts/*.mdx). Use for cornerstone content like Plus migrations, Hydrogen, page-speed math, BFCM playbooks, or anything where a deeper article exists. Returns title, URL, and a short excerpt per result.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search. 1-6 keywords work best." },
        limit: { type: "integer", description: "Max results to return.", minimum: 1, maximum: 6 },
      },
      required: ["query"],
    },
  },
  {
    type: "function" as const,
    name: "book_call",
    description:
      "Return the x9elysium intro-call booking link. Call this only when the user signals real scheduling intent ('can we talk', 'let's chat', 'book a time'). Do not push proactively.",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    type: "function" as const,
    name: "lead_capture",
    description:
      "Capture a lead the user has volunteered (name + email + brief context) so Darshan can follow up. Only call when the user has explicitly given their contact info and asked to be contacted. Confirm consent in the same turn.",
    parameters: {
      type: "object",
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string", description: "Valid email address." },
        company: { type: "string" },
        platform: { type: "string", description: "Current commerce platform if known (Shopify, Magento, etc.)" },
        message: { type: "string", description: "1-2 sentence summary of what they want." },
      },
      required: ["email", "message"],
    },
  },
];

const BUILTIN_TOOLS = [{ type: "web_search" }, { type: "x_search" }];

export async function handleGrok(
  req: Request,
  env: GrokEnv,
  ctx: ExecutionContext,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405, corsHeaders);
  }

  if (!env.XAI_API_KEY) {
    return jsonError(
      "Supreme is not configured. Set XAI_API_KEY via `wrangler secret put`.",
      503,
      corsHeaders,
    );
  }
  if (!env.SUPREME_PIN) {
    return jsonError(
      "Supreme is not configured. Set SUPREME_PIN via `wrangler secret put`.",
      503,
      corsHeaders,
    );
  }

  let body: InboundPayload;
  try {
    body = (await req.json()) as InboundPayload;
  } catch {
    return jsonError("Invalid JSON", 400, corsHeaders);
  }

  if (!constantTimeEqual(body.pin ?? "", env.SUPREME_PIN)) {
    return jsonError("Invalid PIN", 401, corsHeaders);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("messages array required", 422, corsHeaders);
  }
  if (body.messages.length > MAX_TURNS) {
    return jsonError("Conversation too long. Start a fresh session.", 422, corsHeaders);
  }

  const initial = normalizeMessages(body.messages);
  if ("error" in initial) {
    return jsonError(initial.error, 422, corsHeaders);
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.LEADS_KV) {
    const limited = await checkRateLimit(env.LEADS_KV, ip, ctx);
    if (limited) {
      return jsonError("Too many messages. Try again in an hour.", 429, corsHeaders);
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const writer = makeWriter(controller);
      try {
        await runAgent(env, ctx, ip, initial.input, writer);
      } catch (err) {
        console.error("supreme agent failed", err);
        writer.error("Supreme stream failed unexpectedly.");
      } finally {
        writer.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

interface SseWriter {
  send: (obj: Record<string, unknown>) => void;
  text: (delta: string) => void;
  reasoning: (delta: string) => void;
  search: (kind: "web" | "x", query: string) => void;
  toolCall: (name: string, args: unknown) => void;
  toolResult: (name: string, summary: string) => void;
  citation: (url: string, title?: string, snippet?: string) => void;
  meta: (model: string) => void;
  done: () => void;
  error: (msg: string) => void;
  close: () => void;
}

function makeWriter(controller: ReadableStreamDefaultController<Uint8Array>): SseWriter {
  const enc = new TextEncoder();
  let closed = false;
  const write = (obj: Record<string, unknown>) => {
    if (closed) return;
    try {
      controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
    } catch {
      closed = true;
    }
  };
  return {
    send: write,
    text: (delta) => write({ type: "text", delta }),
    reasoning: (delta) => write({ type: "reasoning", delta }),
    search: (kind, query) => write({ type: "search", kind, query }),
    toolCall: (name, args) => write({ type: "tool_call", name, args }),
    toolResult: (name, summary) => write({ type: "tool_result", name, summary }),
    citation: (url, title, snippet) => write({ type: "citation", url, title, snippet }),
    meta: (model) => write({ type: "meta", model }),
    done: () => write({ type: "done" }),
    error: (msg) => write({ type: "error", error: msg }),
    close: () => {
      if (closed) return;
      closed = true;
      try {
        controller.close();
      } catch {
        // already closed
      }
    },
  };
}

async function runAgent(
  env: GrokEnv,
  ctx: ExecutionContext,
  ip: string,
  initialInput: InputItem[],
  writer: SseWriter,
): Promise<void> {
  const model = env.GROK_MODEL || DEFAULT_MODEL;
  writer.meta(model);

  let input: InputItem[] = initialInput;
  let previousResponseId: string | undefined;

  for (let depth = 0; depth < MAX_TOOL_LOOPS; depth++) {
    const requestBody: Record<string, unknown> = {
      model,
      input,
      instructions: SUPREME_INSTRUCTIONS,
      stream: true,
      tools: [...BUILTIN_TOOLS, ...CUSTOM_TOOLS],
      tool_choice: "auto",
      parallel_tool_calls: true,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      search_parameters: { mode: "auto", return_citations: true, max_search_results: 8 },
    };
    if (previousResponseId) requestBody.previous_response_id = previousResponseId;

    const upstream = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error("xAI upstream error", upstream.status, detail);
      writer.error(`Grok upstream error (${upstream.status}). The console is temporarily unavailable.`);
      writer.done();
      return;
    }

    const result = await consumeResponseStream(upstream.body, writer);

    if (result.responseId) previousResponseId = result.responseId;

    if (result.functionCalls.length === 0) {
      writer.done();
      return;
    }

    // Execute custom tool calls and prepare follow-up input.
    const followUp: InputItem[] = [];
    for (const call of result.functionCalls) {
      let parsedArgs: Record<string, unknown> = {};
      if (call.arguments) {
        try {
          parsedArgs = JSON.parse(call.arguments);
        } catch {
          parsedArgs = { _raw: call.arguments };
        }
      }
      writer.toolCall(call.name, parsedArgs);

      const exec = await executeTool(call.name, parsedArgs, env, ctx, ip);
      writer.toolResult(call.name, exec.summary);

      followUp.push({
        type: "function_call_output",
        call_id: call.callId,
        output: JSON.stringify(exec.data),
      });
    }
    input = followUp;
  }

  writer.error("Supreme hit the tool-call depth limit. Ask a sharper question.");
  writer.done();
}

interface ConsumedResponse {
  responseId?: string;
  functionCalls: Array<{ callId: string; name: string; arguments: string }>;
}

async function consumeResponseStream(
  body: ReadableStream<Uint8Array>,
  writer: SseWriter,
): Promise<ConsumedResponse> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let responseId: string | undefined;
  const calls = new Map<string, { callId: string; name: string; arguments: string }>();
  const seenCitations = new Set<string>();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl = buffer.indexOf("\n\n");
    while (nl !== -1) {
      const block = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 2);
      nl = buffer.indexOf("\n\n");

      const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const payload = dataLine.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;

      let evt: Record<string, unknown>;
      try {
        evt = JSON.parse(payload);
      } catch {
        continue;
      }

      processEvent(evt, writer, calls, seenCitations, (id) => {
        responseId = id;
      });
    }
  }

  return { responseId, functionCalls: Array.from(calls.values()) };
}

function processEvent(
  evt: Record<string, unknown>,
  writer: SseWriter,
  calls: Map<string, { callId: string; name: string; arguments: string }>,
  seenCitations: Set<string>,
  setResponseId: (id: string) => void,
) {
  const type = String(evt.type ?? "");

  if (type === "response.created" || type === "response.in_progress") {
    const resp = evt.response as { id?: string } | undefined;
    if (resp?.id) setResponseId(resp.id);
    return;
  }

  if (type === "response.output_text.delta") {
    const delta = typeof evt.delta === "string" ? evt.delta : "";
    if (delta) writer.text(delta);
    return;
  }

  if (type === "response.reasoning.delta" || type === "response.reasoning_summary.delta") {
    const delta = typeof evt.delta === "string" ? evt.delta : "";
    if (delta) writer.reasoning(delta);
    return;
  }

  if (type === "response.output_item.added" || type === "response.output_item.done") {
    const item = evt.item as Record<string, unknown> | undefined;
    if (!item) return;
    const itemType = String(item.type ?? "");

    if (itemType === "web_search_call") {
      const query = String((item.query as string) ?? (item.input as { query?: string } | undefined)?.query ?? "");
      if (query) writer.search("web", query);
      return;
    }
    if (itemType === "x_search_call") {
      const query = String((item.query as string) ?? (item.input as { query?: string } | undefined)?.query ?? "");
      if (query) writer.search("x", query);
      return;
    }
    if (itemType === "function_call" || itemType === "tool_use") {
      const callId = String(item.call_id ?? item.id ?? "");
      const name = String(item.name ?? "");
      const args =
        typeof item.arguments === "string"
          ? (item.arguments as string)
          : item.arguments != null
            ? JSON.stringify(item.arguments)
            : "";
      if (!callId || !name) return;
      const existing = calls.get(callId);
      if (existing) {
        if (args && !existing.arguments) existing.arguments = args;
      } else if (type === "response.output_item.done") {
        calls.set(callId, { callId, name, arguments: args });
      } else {
        calls.set(callId, { callId, name, arguments: args });
      }
      return;
    }
  }

  if (type === "response.function_call_arguments.delta" || type === "response.function_call.arguments.delta") {
    const callId = String(evt.call_id ?? evt.item_id ?? "");
    const delta = typeof evt.delta === "string" ? evt.delta : "";
    if (!callId || !delta) return;
    const cur = calls.get(callId);
    if (cur) {
      cur.arguments = (cur.arguments || "") + delta;
    } else {
      calls.set(callId, { callId, name: "", arguments: delta });
    }
    return;
  }

  // Citations may arrive on an annotation event or attached to message items.
  if (type === "response.output_text.annotation.added" || type === "response.annotation.added") {
    const ann = (evt.annotation ?? evt.item) as Record<string, unknown> | undefined;
    if (!ann) return;
    const url = typeof ann.url === "string" ? ann.url : "";
    if (!url || seenCitations.has(url)) return;
    seenCitations.add(url);
    writer.citation(
      url,
      typeof ann.title === "string" ? ann.title : undefined,
      typeof ann.snippet === "string" ? ann.snippet : undefined,
    );
  }
}

interface ToolResult {
  data: unknown;
  summary: string;
}

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  env: GrokEnv,
  ctx: ExecutionContext,
  ip: string,
): Promise<ToolResult> {
  switch (name) {
    case "search_thoughts":
      return runSearchThoughts(args);
    case "search_blog":
      return runSearchBlog(args);
    case "book_call":
      return runBookCall(env);
    case "lead_capture":
      return runLeadCapture(args, env, ctx, ip);
    default:
      return {
        data: { error: `Unknown tool: ${name}` },
        summary: `unknown tool ${name}`,
      };
  }
}

interface SupremeIndex {
  thoughts: Array<{ id: string; text: string; anchor: string }>;
  posts: Array<{ slug: string; title: string; description: string; url: string; body: string }>;
}

const SUPREME_INDEX = index as unknown as SupremeIndex;

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function scoreText(query: string, text: string): number {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    let from = 0;
    while (true) {
      const idx = lower.indexOf(t, from);
      if (idx === -1) break;
      score += t.length;
      from = idx + t.length;
    }
  }
  return score;
}

function runSearchThoughts(args: Record<string, unknown>): ToolResult {
  const query = String(args.query ?? "").trim();
  const limit = Math.min(Math.max(Number(args.limit ?? 4), 1), 8);
  if (!query) {
    return { data: { error: "query is required" }, summary: "missing query" };
  }
  const ranked = SUPREME_INDEX.thoughts
    .map((t) => ({ ...t, score: scoreText(query, t.text) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((t) => ({ id: t.id, text: t.text, anchor: t.anchor }));

  return {
    data: { query, results: ranked },
    summary: `${ranked.length} thought${ranked.length === 1 ? "" : "s"} for "${query}"`,
  };
}

function runSearchBlog(args: Record<string, unknown>): ToolResult {
  const query = String(args.query ?? "").trim();
  const limit = Math.min(Math.max(Number(args.limit ?? 3), 1), 6);
  if (!query) {
    return { data: { error: "query is required" }, summary: "missing query" };
  }
  const ranked = SUPREME_INDEX.posts
    .map((p) => ({
      ...p,
      score:
        scoreText(query, p.title) * 3 +
        scoreText(query, p.description) * 2 +
        scoreText(query, p.body),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      url: p.url,
      excerpt: p.body.slice(0, 600),
    }));

  return {
    data: { query, results: ranked },
    summary: `${ranked.length} post${ranked.length === 1 ? "" : "s"} for "${query}"`,
  };
}

function runBookCall(env: GrokEnv): ToolResult {
  const url = env.CALCOM_URL || "https://x9elysium.com/contact";
  return {
    data: {
      url,
      note: "Booking happens off-site. Send the user this link and let them pick a time.",
    },
    summary: `booking link: ${url}`,
  };
}

async function runLeadCapture(
  args: Record<string, unknown>,
  env: GrokEnv,
  ctx: ExecutionContext,
  ip: string,
): Promise<ToolResult> {
  const email = String(args.email ?? "").trim().toLowerCase();
  const message = String(args.message ?? "").trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message.length >= 5;
  if (!ok) {
    return {
      data: { ok: false, error: "email and message are required and must be valid" },
      summary: "lead invalid — missing or malformed fields",
    };
  }

  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL || !env.LEAD_FROM_EMAIL) {
    return {
      data: {
        ok: false,
        error: "Lead pipeline not configured. Resend key/sender/recipient missing in worker env.",
      },
      summary: "lead pipeline not configured",
    };
  }

  const subject = `Supreme lead — ${args.first_name ?? ""} ${args.last_name ?? ""}`.trim() || "Supreme lead";
  const lines = [
    `New lead from /supreme console`,
    ``,
    `Name: ${args.first_name ?? ""} ${args.last_name ?? ""}`.trim(),
    `Email: ${email}`,
    `Company: ${args.company ?? "—"}`,
    `Platform: ${args.platform ?? "—"}`,
    `Message: ${message}`,
    ``,
    `IP: ${ip}`,
    `Captured at: ${new Date().toISOString()}`,
  ];

  const send = fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL,
      to: [env.LEAD_TO_EMAIL],
      reply_to: email,
      subject,
      text: lines.join("\n"),
    }),
  })
    .then(async (r) => {
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("supreme lead resend failed", r.status, t);
      }
    })
    .catch((err) => {
      console.error("supreme lead resend threw", err);
    });

  ctx.waitUntil(send);

  return {
    data: { ok: true, captured: { email, message } },
    summary: `lead captured for ${email}`,
  };
}

function normalizeMessages(
  raw: InboundMessage[],
): { input: InputItem[] } | { error: string } {
  const out: InputItem[] = [];
  let totalChars = 0;
  let lastRole: "user" | "assistant" | null = null;

  for (const m of raw) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const blocks = normalizeContent(m.content);
    if ("error" in blocks) return blocks;
    if (blocks.value.length === 0) continue;

    for (const b of blocks.value) {
      if (b.type === "input_text") totalChars += b.text.length;
    }
    if (totalChars > MAX_TOTAL_CHARS) {
      return { error: "Conversation too large. Start a fresh session." };
    }

    out.push({ role: m.role, content: blocks.value });
    lastRole = m.role;
  }

  if (out.length === 0) {
    return { error: "messages array is empty after validation" };
  }
  if (lastRole !== "user") {
    return { error: "Last message must be from user" };
  }
  return { input: out };
}

function normalizeContent(
  content: unknown,
): { value: InputContentBlock[] } | { error: string } {
  if (typeof content === "string") {
    const text = content.trim();
    if (!text) return { value: [] };
    if (text.length > MAX_TEXT_CHARS) return { error: `Message too long (>${MAX_TEXT_CHARS} chars)` };
    return { value: [{ type: "input_text", text }] };
  }
  if (!Array.isArray(content)) return { error: "content must be a string or array" };

  const value: InputContentBlock[] = [];
  let imageCount = 0;
  for (const part of content) {
    if (!part || typeof part !== "object") continue;
    const p = part as Record<string, unknown>;
    const type = String(p.type ?? "");
    if (type === "input_text" || type === "text") {
      const text = typeof p.text === "string" ? p.text.trim() : "";
      if (!text) continue;
      if (text.length > MAX_TEXT_CHARS) return { error: `Message too long (>${MAX_TEXT_CHARS} chars)` };
      value.push({ type: "input_text", text });
    } else if (type === "input_image" || type === "image") {
      if (imageCount >= MAX_IMAGES_PER_TURN) {
        return { error: `Too many images (max ${MAX_IMAGES_PER_TURN} per turn)` };
      }
      const imageUrl =
        typeof p.image_url === "string"
          ? p.image_url
          : typeof (p.image_url as { url?: string } | undefined)?.url === "string"
            ? (p.image_url as { url: string }).url
            : "";
      if (!imageUrl) continue;
      if (!isAllowedImage(imageUrl)) {
        return { error: "Image must be a https URL or a data:image/(png|jpeg|jpg|webp) data URI" };
      }
      const detail = p.detail === "low" ? ("low" as const) : ("high" as const);
      value.push({ type: "input_image", image_url: imageUrl, detail });
      imageCount += 1;
    }
  }
  return { value };
}

function isAllowedImage(url: string): boolean {
  if (url.startsWith("https://")) return true;
  return /^data:image\/(png|jpe?g|webp)(;[^,]+)?,/.test(url);
}

async function checkRateLimit(kv: KVNamespace, ip: string, ctx: ExecutionContext): Promise<boolean> {
  const key = `gr:${ip}`;
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
