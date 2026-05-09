# /supreme — Grok integration

> Activation recipe + posture for the PIN-gated Grok console at [`/supreme`](https://x9elysium.com/supreme).

The supreme console is a server-side agent loop on top of [xAI's Responses API](https://docs.x.ai/docs/overview), wired into the existing Cloudflare Worker. Built-in `web_search` + `x_search` (Grok's Live Search), vision input (`image_url` blocks), four custom tools (`search_thoughts`, `search_blog`, `book_call`, `lead_capture`), and a normalized SSE envelope back to the client.

No new infra. No Railway. Same Worker, same deploy pipeline, same domain.

---

## 1. What you need

- xAI API key from [console.x.ai](https://console.x.ai). Premium account is fine. Free tier works for low traffic but Live Search is metered separately.
- A PIN string. Same posture as `CHAT_PIN` — discoverable by URL only, no nav link.
- (Optional) Cal.com URL for the `book_call` tool. Defaults to `/contact` if unset.
- Resend already configured for `/api/lead`. The `lead_capture` tool reuses `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`.

---

## 2. Activate

```bash
npx wrangler secret put XAI_API_KEY
# paste your xai_... key

npx wrangler secret put SUPREME_PIN
# paste a strong PIN (e.g. 12+ chars, mixed case)

# Optional — pin a specific Grok build instead of grok-4-latest
# (e.g. "grok-4-fast-reasoning" for cheaper streaming responses)
# npx wrangler secret put GROK_MODEL    # OR set in wrangler.toml [vars]

# Optional — booking link for the book_call tool
# Set as a wrangler var (commit-safe) or repo secret if you want it forwarded
# at build time. Defaults to /contact.
```

Deploy:

```bash
npx wrangler deploy
```

Until both secrets are set, `POST /api/grok` returns 503 with a clear message and the Console UI surfaces it on the unlock screen.

---

## 3. Verify

```bash
# 503 until you set the secrets
curl -s -X POST https://x9elysium.com/api/grok \
  -H 'content-type: application/json' \
  -d '{"pin":"<your pin>","messages":[{"role":"user","content":"ping"}]}' \
  | head -c 400
```

A working call streams `data: {"type":"meta","model":"grok-4-latest"}` first, then text deltas, search ribbons, tool calls, and a final `data: {"type":"done"}`.

---

## 4. Architecture

```
client (app/supreme/Console.tsx)
  ↕ SSE (normalized envelope)
Worker (worker/grok.ts)
  ↕ xAI Responses API (POST /v1/responses, stream:true)
  ↕ executes custom tools server-side
  ↕ recurses with previous_response_id + function_call_output
```

**Why server-side tool loop**: the client gets one clean stream of text + breadcrumbs. No round-trips through the browser, no leaked tool plumbing, no need for the client to know about `previous_response_id`. The Worker is the agent harness.

**Tools shipped** (`worker/grok.ts` → `CUSTOM_TOOLS`):

| Tool | Source | When the model calls it |
| --- | --- | --- |
| `search_thoughts` | `data/x-thoughts.md` (built into `worker/supreme-index.json`) | Questions about Darshan's opinions / methodology / "what does x9 think about X" |
| `search_blog` | `content/posts/*.mdx` (built into `worker/supreme-index.json`) | Cornerstone-content questions: migrations, Hydrogen, BFCM, page-speed |
| `book_call` | `CALCOM_URL` env var, fallback `/contact` | Real scheduling intent only |
| `lead_capture` | `RESEND_API_KEY` (reused from `/api/lead`) | User volunteers contact info + asks for follow-up |

**Built-in tools** (xAI server-side):

- `web_search` — open web with citations
- `x_search` — X.com (Grok's live X integration)

Both are enabled via `tools: [{type:"web_search"}, {type:"x_search"}]` and `search_parameters: { mode: "auto", return_citations: true }`. The Worker watches for `web_search_call` / `x_search_call` items in the stream and emits a search ribbon to the client. Citations annotate the assistant's text inline.

---

## 5. Index lifecycle

`worker/supreme-index.json` is generated at prebuild from:

- `data/x-thoughts.md` — split on `---`, drop `DRAFT:` blocks
- `content/posts/*.mdx` — frontmatter title/description + plain-text excerpt (~2 KB)

Run manually with:

```bash
npm run supreme:build-index
```

Wired into `prebuild` next to `chat-context` and `plans-seed` so every deploy ships fresh data. The index is stored as a JSON import in the Worker — no D1, no KV, no external store. ~60 KB at current corpus size; comfortable inside the Worker bundle for the foreseeable future.

When the corpus outgrows ~500 KB, switch `search_thoughts` / `search_blog` to D1 FTS5 or an embeddings index. Don't optimize for that until the cap actually bites.

---

## 6. Privacy + rate limit

- **PIN constant-time compare**, same as `/chat`. Wrong PIN → 401, no leak of whether the secret is set vs wrong.
- **Per-IP rate limit** of 30 messages / hour via `LEADS_KV` (shared with `/chat` + `/lead`). When the KV namespace isn't bound, the limiter silently no-ops — same fallback posture as the rest of the Worker.
- **No conversation logging** beyond the rate-limit counter. Session history lives in `sessionStorage` only (client-side), wiped on lock or browser close.
- **Vision images** — accepted as `data:` URIs or `https://` URLs. The Worker forwards them to xAI in-stream and never persists them. 4 images max per turn, 6 MB max each.
- **Journal exclusion** — `docs/journal/**` is **not** in `supreme-index.json`. The build script doesn't walk that directory. The `SUPREME_INSTRUCTIONS` system prompt also tells Grok plainly: "you have no access to it."
- **Discoverability posture** — same as `/chat` and `/plans`. URL-share-only. Not in nav, footer, sitemap, or `llms.txt`. The page itself sets `noindex,nofollow` via Next.js Metadata.

---

## 7. Cost mental model

xAI bills per token (input + output) plus per Live-Search call. Rough envelope at the time of writing (verify against [console.x.ai/pricing](https://console.x.ai)):

- Each turn: ~3K input tokens (instructions + history + tool output) + ~1K output. With Grok 4, that's pennies per turn.
- Live Search adds a small per-call fee, billed when `web_search` / `x_search` actually fires (which `mode: "auto"` only does when the question warrants it).
- Cap at 30 messages/IP/hour means a single hammer can spend at most a few dollars before the rate limit kicks in.

Premium gives generous monthly credits. For a sub-100-conversation/day surface this is well inside noise.

If costs ever bite, override `GROK_MODEL` to `grok-4-fast-non-reasoning` (faster + cheaper, no reasoning chain). Same API surface, no code change.

---

## 8. Editing the voice

The system prompt — `SUPREME_INSTRUCTIONS` in [`worker/grok.ts`](../../worker/grok.ts) — is the single place to tune Supreme's voice and tool-use guardrails. Change it boldly per [§9 of CLAUDE.md](../../CLAUDE.md#9-the-future--what-were-building-toward); Supreme aesthetic + interaction patterns are Claude's call.

---

## 9. Known limits

- **Tool-loop depth capped at 6.** If Grok keeps wanting to call tools, the Worker emits an `error` event and stops. Sharp questions don't hit this; agentic deep-dives might.
- **Streaming function-call args** — xAI streams function-call arguments either as a complete chunk or as deltas; the Worker handles both. If the deltas arrive out of order, the parsed args may be malformed. Defensive: the tool execution still runs against `_raw` payload in that case.
- **Live Search is built-in only.** The deprecated `search_parameters` on Chat Completions is not used; we go through the Responses API exclusively.
- **No persistence.** Conversations evaporate on lock. By design — supreme is a console, not a CRM. The `lead_capture` tool is the only persistence path, and it routes through Resend.

When any of those bite, update this doc + the Worker; don't paper over.
