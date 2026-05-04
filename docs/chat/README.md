# X9 Chat

A PIN-gated, founder-voiced AI assistant grounded on the full X9Elysium documentation corpus. Powered by **Claude Sonnet 4.6** via the Anthropic API, served through the existing Cloudflare Worker that already handles `/api/lead`. Lives at **`/chat`**.

## Why this exists

Anyone with the PIN can ask the docs questions in natural language: services, philosophy (Vasudhaiva Kutumbakam), migration playbooks, the 6-month organic growth plan, the books-learning notes, the X.com automation runbook, the lead-capture architecture, etc. The encrypted journal at `/docs/journal` is **deliberately excluded** — it stays journal-PIN-protected and is never sent to Claude.

The page is **not in the sitemap, footer, or nav**, and is `noindex,nofollow`. Discovery is by URL share only.

## Architecture in one diagram

```
Browser → /chat (Next.js static page)
        → user enters PIN, stored in sessionStorage
        → POST /api/chat { pin, messages } (same-origin)

Cloudflare Worker (worker/index.ts → worker/chat.ts)
        → CORS allowlist (x9elysium.com / www / localhost)
        → constant-time PIN compare against env.CHAT_PIN
        → message validation (≤40 messages, ≤8 KB each, ≤60 KB total)
        → optional KV rate limit (40 msg/hour/IP, key prefix `cl:`)
        → POST api.anthropic.com/v1/messages (stream: true)
              system[0] = persona (uncached)
              system[1] = full docs corpus (cache_control: ephemeral)
              messages  = full conversation history
        → pipe SSE response straight back to the browser
```

## Files

| Path | Purpose |
| --- | --- |
| `app/chat/page.tsx` | Server shell, sets `noindex` metadata. |
| `app/chat/ChatClient.tsx` | PIN gate, message list, streaming SSE consumer, composer. |
| `worker/chat.ts` | Anthropic proxy with PIN auth, rate limit, prompt caching. |
| `worker/chat-context.json` | Generated. Full doc corpus baked into the worker bundle. |
| `worker/index.ts` | Routes `/api/chat` → `handleChat`. |
| `scripts/build-chat-context.mjs` | Walks `docs/` (excl. journal) + `public/llms.txt` + `content/posts/`, writes `worker/chat-context.json`. |
| `package.json` | `prebuild` hook runs the context builder before `next build`. |

## Setup (one-time)

You need two secrets on the Cloudflare Worker:

```bash
# 1. Anthropic API key (https://console.anthropic.com → API Keys)
npx wrangler secret put ANTHROPIC_API_KEY
# paste your key (starts with sk-ant-...)

# 2. Chat PIN — pick whatever you want users to enter
npx wrangler secret put CHAT_PIN
# paste the PIN (e.g. 8344, or something different from the journal PIN)

# 3. Deploy
npm run worker:deploy
```

Until both are set, `/api/chat` returns **503 "Chat is not configured"** and the unlock screen surfaces that error verbatim. Safe to ship the front-end first.

Optional: if you bind `LEADS_KV` (already a stub in `wrangler.toml`), the chat shares the same KV namespace for IP rate limiting (40 messages per hour per IP, key prefix `cl:`). Without KV, no rate limit is applied.

## What's in the system prompt

Two blocks (the second one is cached at the Anthropic edge so multi-turn chats are cheap):

1. **Persona** — voice rules, sourcing rules, scope. Don't fabricate, name source files when citing, the journal is off-limits.
2. **Documentation corpus** — every `.md` under `docs/` (except `docs/journal/**`), `public/llms.txt`, and any `content/posts/*.md`. Files are concatenated with `===== path =====` separators. Frontmatter is stripped to save tokens.

Build-time output of the context builder:

```
[build-chat-context] N files, M.X KB → worker/chat-context.json
```

Refresh by running `npm run chat:build-context` (or just `npm run build` — it runs as `prebuild`).

## Cost model

Claude Sonnet 4.6 on the Anthropic API:

| Component | Rate | Notes |
| --- | --- | --- |
| Input (uncached) | $3 / M tokens | First turn pays the full corpus cost (~80–100k tokens). |
| Input (cached read) | $0.30 / M tokens | Every subsequent turn within 5 min hits the cache → 90% discount. |
| Output | $15 / M tokens | Response generation. |

Rough back-of-envelope at ~80k token corpus + ~500 token replies:
- First message in a fresh chat: ~$0.25
- Each follow-up within 5 min: ~$0.03
- A 10-turn conversation: ~$0.50

If 5 people ask 10 questions each per day, that's ~$75/month. If chat usage explodes, lower `MAX_TOKENS` in `worker/chat.ts` from 2048 → 1024 first.

## Operational recipes

```bash
# Tail the worker live (chat events show up here)
npm run worker:tail

# Test locally end-to-end (Next.js + worker on the same port)
npm run preview
# then open http://localhost:8787/chat

# Force a fresh context bundle
npm run chat:build-context

# Rotate the PIN
npx wrangler secret put CHAT_PIN

# Pull the API key (revoke + replace)
# 1. Revoke at https://console.anthropic.com → API Keys
# 2. npx wrangler secret put ANTHROPIC_API_KEY
```

## Privacy

- The encrypted journal under `docs/journal/` is **never** loaded into the corpus. The build script's exclude list enforces this (`scripts/build-chat-context.mjs` line ~21).
- Conversations are stored in the user's `sessionStorage` only. They vanish when the tab closes. No D1 persistence, no logging beyond `console.error` for upstream failures.
- The PIN is held in `sessionStorage` and posted with each request. It is **not** a substitute for real auth — anyone with the PIN can ask the bot anything, and the bot can quote internal strategy docs verbatim. Treat it as semi-private, like the journal.

## Failure modes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Lock screen says "Chat is not configured" | `ANTHROPIC_API_KEY` or `CHAT_PIN` secret not set | Run `wrangler secret put` for the missing one. |
| "Invalid PIN" on a known-good PIN | Worker hasn't redeployed since `wrangler secret put` | `npm run worker:deploy`. |
| 502 "Upstream error" mid-stream | Anthropic outage or quota hit | Check console.anthropic.com → Usage. |
| Answers are stale (don't reflect a recent docs change) | Forgot to rebuild | `npm run chat:build-context && npm run worker:deploy`. |
| 429 "Too many messages" | Rate limit (40/hr/IP) | Wait or raise `RATE_LIMIT_MAX` in `worker/chat.ts`. |

## Not yet built (parked)

- D1 logging of conversations for review (mirrors the `leads` table pattern).
- Per-user PINs via KV (`pins:<pin> → { name, createdAt }`) instead of a single shared PIN.
- "Cite a doc" first-class UI — Claude already names files in parens, but a sidebar with quick-jump links would be nicer.
- Tool use: let Claude call back into the lead-capture form to draft a discovery-call invite when a lead-shaped conversation emerges.
