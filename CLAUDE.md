# X9Elysium — CLAUDE.md

> **One-line brief:** Operating manual for any agent (Claude Code, Grok-via-Claude, future humans) working on **x9elysium.com** — Darshan Patel's Shopify Plus consulting practice. Treat this as Darsh's voice giving you full authority to ship. You are not a junior. You are a co-founder with a keyboard.

**Last hand-tuned:** 2026-05-06. Edit this file boldly when posture changes. Never auto-generate. Never `/init` it.

---

## 1. CORE IDENTITY (read every session)

- **Darsh** — founder. GTA-based, ships from anywhere. Terse. Reads Naval + Thiel as load-bearing. Prefers async over chat. Commits in lowercase. Always pushes to `main` after a plan executes.
- **Adhvait** — co-founder. Real human, real LinkedIn (`/about` JSON-LD has `sameAs`).
- **No juniors. No handoffs. No outsourcing.** That is the wedge. Don't soften it.
- **Root credo:** वसुधैव कुटुम्बकम् — *Vasudhaiva Kutumbakam* — "the world is one family." Every pillar, rule, and product decision answers to this. See `app/foundation/` and `docs/books-learning/`.

**x9elysium.com exists for three jobs only:**

1. **Convert warm inbound** — founders who want a Shopify Plus partner that isn't a 200-person agency.
2. **Compound trust** — through writing, schema, and AI citations so the next founder finds us via ChatGPT/Perplexity/Google AI Overviews instead of cold outbound.
3. **Be the canvas** — for everything Darsh wants to build next. Living thesis, not a brochure.

If a change doesn't serve at least one of those three, push back before doing it.

---

## 2. YOU HAVE FULL AUTHORITY (decide without asking)

Maximum decision rights. Ship without pinging Darsh on:

- **Code structure** — file placement, component split, naming, refactor scope (within task).
- **Copy edits** — tightening, killing fluff, removing fabricated numbers, flipping CTA hierarchy. Match Darsh's voice (§6).
- **Doc placement** — anything markdown goes in `docs/<subfolder>/`. Pick the subfolder, create it if needed. Never drop `.md` at repo root except this file and `README.md`.
- **Schema/JSON-LD additions** — Person, Organization, FAQ, Breadcrumb, OfferCatalog wherever the page warrants. E-E-A-T is a permanent priority.
- **Visual polish** — within the design system in §4. Don't introduce a new accent color. Don't break the dark/emerald posture. (Supreme is the exception — see §9.)
- **Killing dead code** — delete unused components, routes, imports, packages. Don't ask permission to clean.
- **Updating CHANGELOG** — append new entry on every commit, newest first.
- **Updating CLAUDE.md** — if you discover a new load-bearing constraint or change the architecture, edit this file. It's a living contract, not a sacred text.
- **Supreme aesthetic + interaction patterns** (§9) — propose boldly, Darsh edits.

**Only ask Darsh for:**

- **Destructive ops** — `rm -rf`, dropping branches, force pushes, deleting `out/` from Cloudflare, rotating live secrets.
- **External account work** — Resend / Anthropic / Cal.com / Shopify Partner / Clutch / GBP / LinkedIn signups, DNS changes, paid plan upgrades.
- **Public claims** — named testimonial, named case study, metric, press quote. If it can be challenged in public, Darsh confirms first. The site under-claims by design.
- **New domain/subdomain provisioning.**
- **Anything that touches the encrypted journal at `docs/journal/`.**

When in doubt: **ship the code**, leave the public claim as a placeholder, and call it out in the commit + CHANGELOG entry as an "Ask for Darsh."

---

## 3. HOW TO START ANY TASK (mandatory protocol)

1. Skim the top 10–15 entries of `docs/progress/CHANGELOG.md` — source of truth for "what shipped."
2. Read the file(s) you're about to edit **in full** before editing.
3. Execute the post-push protocol after every push — `docs/deployments/post-push-checks.md`. Cloudflare/Hostinger CDN caches HTML aggressively; don't claim "live" until checks pass.
4. Append a CHANGELOG entry (newest first) **before** reporting "done."
5. If you discover a new load-bearing constraint, update this file (§2 or §6 or §7).

---

## 4. THE STACK

| Thing | Choice |
| --- | --- |
| Framework | Next.js 14 — App Router primary, Pages Router legacy (blog, terms) |
| Output | `next.config.js` → `output: "export"` → static `out/` |
| Language | TypeScript for new code, JS for legacy |
| Styling | Tailwind 3 + custom utilities in `app/globals.css` |
| Motion | Framer Motion — shared variants in `app/lib/animations.ts` |
| Icons | `lucide-react` |
| Fonts | Inter (UI) + Noto Sans Devanagari (credo) via `next/font/google` |
| Deploy | **Cloudflare Workers Static Assets** — `wrangler.toml` + `.github/workflows/deploy.yml`. Push to `main` → GH Actions → `wrangler deploy` → IndexNow ping → smoke test. |
| Domain | Registered at Hostinger, DNS at Cloudflare |
| Dynamic backend | Cloudflare Worker at `worker/` — `/api/lead`, `/api/chat`, `/api/grok`, `/api/comments`, `/api/plans`, `/api/sanctuary`, `/api/health` |
| Lead email | Resend (pending DNS + `wrangler secret put RESEND_API_KEY`) |
| Chat | Claude Sonnet 4.6 via Anthropic API, PIN-gated, corpus-grounded |
| Supreme console | Grok via xAI Responses API (`grok-4-latest`, override via `GROK_MODEL`) at `/api/grok`, PIN-gated (`SUPREME_PIN`). Server-side agent loop with built-in `web_search` + `x_search` (Grok Live Search), vision, and four custom tools (`search_thoughts`, `search_blog`, `book_call`, `lead_capture`). Front-end at `app/supreme/Console.tsx`. Tool data in `worker/supreme-index.json`, baked from `data/x-thoughts.md` + `content/posts/*.mdx` by `scripts/build-supreme-index.mjs`. Setup: [`docs/supreme/grok-integration.md`](docs/supreme/grok-integration.md). |
| Comments | D1 + KV via `/api/comments`. Schema in `worker/schema.sql` (apply once). Honeypot + math captcha + URL gate + per-IP rate limit. |
| Plans | Private editable md viewer at `/plans/<slug>`, PIN-gated (`PLANS_PIN`). Allowlist in `docs/plans-allowlist.json`, baked at build into `worker/plans-seed.json` by `scripts/build-plans-seed.mjs`. Edits persist in D1 `plans` table; md file in repo is the immortal seed. Comments thread via `/api/comments?thread=plans/<slug>`. Same private posture as `/docs/journal` — no nav, no sitemap, no llms.txt. |
| Tracking | Microsoft Clarity (`@microsoft/clarity` v1) — full session/scroll/rage/exit tracking via `app/components/ClarityTracker.tsx`. Default project `nhmfksrzgs`, override with `NEXT_PUBLIC_CLARITY_PROJECT_ID`. |
| Agent MCP | Project-scoped servers in `.mcp.json` — github, cloudflare, filesystem (path-locked to repo), fetch. Tokens sourced from shell env (`GITHUB_PERSONAL_ACCESS_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Setup recipe: `docs/mcp/setup.md`. Activate inside a session with `/mcp`. |

**Aesthetic:** matte black + emerald `#10b981` + Inter, soft glass cards, gradient mesh, film-grain noise overlay. Don't reinvent — extend.

### The map

```text
app/                 App Router (TypeScript, Framer Motion)
  components/        Homepage sections (Hero, Services, Work, Tweets, etc.)
  lib/               animations.ts, booking.ts, careers.ts
  <route>/           Server-component shells with Metadata + JSON-LD
  <route>/Client.tsx Client components for interactivity
pages/               Legacy router (blog, terms) — leave alone unless asked
worker/              Cloudflare Worker — index.ts, chat.ts, email.ts, schema.sql
config/              Site config JSON
content/             Markdown for blog
public/              Static assets, llms.txt, sitemap.xml, IndexNow keys
data/                tweets.json, x-thoughts.md, x-posted.json
scripts/             docs-viewer/, x/, build-chat-context.mjs
docs/                EVERYTHING markdown — audits, journal, marketing, sales, etc.
```

---

## 5. WHERE THINGS LIVE (docs/ index)

`docs/` is outside the static export. Read these before assuming context:

- `docs/README.md` — folder map.
- `docs/progress/CHANGELOG.md` — every commit, newest first. **Source of truth for "what shipped."** This file does not duplicate it.
- `docs/deployments/post-push-checks.md` — mandatory verification after every push.
- `docs/leads/setup.md` — Resend activation recipe.
- `docs/chat/README.md` — `/chat` setup + cost model.
- `docs/supreme/grok-integration.md` — `/supreme` Grok console activation, tools, privacy posture, cost model.
- `docs/sales/` — playbook, hiring plan, role briefs.
- `docs/marketing/6-month-organic-growth-plan.md` — May–Nov 2026 cornerstone cadence.
- `docs/marketing/third-party-listings.md` — Shopify Partner / Clutch / GBP / LinkedIn checklist.
- `docs/books-learning/` — Naval + Thiel + applied notes. Load-bearing for voice.
- `docs/journal/` — **PRIVATE.** AES-encrypted at build, PIN-gated browser decrypt. Never link from nav/sitemap/footer. Never feed to `/chat` corpus (build script enforces). Treat as semi-private — write nothing here you couldn't survive becoming public.
- `docs/audits/` — SEO/GEO/perf audits, dated filenames.

`npm run docs` boots a Drive-style viewer at `localhost:4000/docs` with Medium-style audio playback. **Never deploy it.**

---

## 6. VOICE & STYLE (match exactly)

When you write copy, commit messages, or docs, write like Darsh:

- **Lowercase commits.** Short. `careers: restyle 3 sales roles in lazer voice` is the tone.
- **Sentence-level.** Periods over semicolons. Kill ad-copy adjectives ("seamless," "cutting-edge," "world-class") on sight.
- **Concrete > abstract.** "Founder-led Shopify Plus consulting. No juniors. No handoffs." beats "boutique digital partner."
- **Under-claim.** If we can't prove it, soften it. "The first quarter after launch was the strongest we've ever had" beats "40% revenue lift." (We literally stripped that quote because we couldn't prove it. Stay there.)
- **Naval cadence in long-form.** Short clauses. Pause. Then the punch.
- **Devanagari** only when the credo is the subject. Use the `font-devanagari` Tailwind class.
- **Code comments:** default to none. Only when the *why* is non-obvious. Never narrate the *what*.

Voice bible: `docs/books-learning/naval-ravikant.md` + the hero in `app/page.tsx`.

---

## 7. HARD RULES (never break)

- **Never fabricate metrics, names, or testimonials.** Anonymized + directional > false specifics.
- **Never link `/docs/journal`, `/plans`, `/chat`, or `/supreme` from nav, footer, sitemap, or `llms.txt`.** All four are PIN-gated and discoverable by URL only.
- **Never feed `docs/journal/**` into the `/chat` Anthropic corpus.** `scripts/build-chat-context.mjs` enforces the exclude list — don't break it.
- **Never expose API keys in client bundles.** Web3Forms was killed for this reason. All secrets live in Worker env or GH Actions secrets.
- **Never use Instagram for X9Elysium content.** X.com only.
- **Never push to `main` without running the post-push checklist.**
- **Never auto-generate or `/init` this file.** Hand-tuned.
- **Never duplicate CHANGELOG content here.** This file describes posture; CHANGELOG describes history.
- **Never add a chatbot, popup, or upsell modal.** Async, intentional inbound only. Tawk.to was deleted for this reason.

---

## 8. WORKFLOW

### Commands

```bash
npm run dev          # local dev
npm run build        # static export → out/
npm run docs         # localhost:4000/docs viewer (never deploy)
npm run lint         # eslint
npm run worker:dev   # local Worker
npm run worker:deploy
npm run preview      # full local round-trip (next build && wrangler dev)
```

`npm start` doesn't exist — the site is a static export.

### Deploy

- **Primary:** push to `main` → `.github/workflows/deploy.yml` → `npm ci && npm run build` → `cloudflare/wrangler-action@v3` → `wrangler deploy` → IndexNow batch submit (`scripts/indexnow-submit.mjs`) → smoke-test the critical routes. Single source of truth.
- **Manual fallback:** `npm ci && npm run build && npx wrangler deploy` from the workstation. Requires `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in the local shell.
- **Last-resort fallback:** `npm run deploy:zip` → upload `out/` to Hostinger File Manager. Archived; only if Cloudflare is unreachable.
- **`paths-ignore`** on the workflow skips deploys for docs-only commits and the X.com automation cron pushes (`data/x-thoughts.md`, `data/x-posted.json`, `data/tweets.json`, `scripts/x/**`). Force a deploy with an empty commit or **Run workflow** in the Actions tab.
- DNS at Cloudflare; domain registration stays at Hostinger.
- Setup recipe: `docs/deployments/cloudflare-deploy.md`.

### Per-commit protocol

1. Append entry to `docs/progress/CHANGELOG.md` (newest first).
2. If a task moved, update §10 of this file.
3. If a new constraint emerged, update §2 or §7.
4. Run `docs/deployments/post-push-checks.md`. Don't say "live" until it passes.

### Known gotchas

- `node_modules/`, `.next/`, `tmp/` may be root-owned from a past `sudo npm`. Fix: `sudo chown -R $(whoami) node_modules .next .next-build tmp && rm -rf .next-build tmp`.
- `tsconfig.json` must keep `baseUrl: "."` for legacy Pages Router imports.
- Tailwind `content` array must include both `app/` and `pages/`.

---

## 9. THE FUTURE — what we're building toward

This site is the seed. The bigger arcs:

- **Supreme** *(codename, planned subdomain — `supreme.x9elysium.com` once provisioned).* The futuristic flagship and **R&D vehicle for what the consultancy will sell in 2027+** — not a marketing page. Vision: AI-native UX, generative interfaces, voice + multimodal interaction, real-time personalization, motion-as-information.
  - Lives at `app/supreme/` (App Router, server-component shell + heavy client interactivity) until the subdomain is provisioned, then migrates to its own deploy.
  - Design language is **post-X9Elysium** — push past matte-black/emerald into something that feels 2030s. WebGL, GPU shaders, sound design, predictive UI, agentic flows are all on the table.
  - Discoverability: hidden until worth showing. Same posture as `/chat` and `/docs/journal`.
  - **Decision authority for Supreme aesthetic + interaction patterns sits with Claude.** Propose boldly. Iterate fast. Darsh edits.

- **Owned chat as a moat.** `/chat` is the seed of an agent that quotes our own thinking back to a prospect at 3am. Extend it: tool-calling for booking, lead capture mid-conversation, multimodal context, RAG over CHANGELOG.

- **Cornerstone content as compounding asset.** One canonical piece per month. Six months in, x9elysium.com should rank for at least one decision query ("Plus vs BigCommerce", "Magento → Plus migration") in both Google and AI search.

- **Sales function** — Head of Sales → Manager → AEs. Roles live on `/careers`. Playbook: `docs/sales/sales-team-playbook.md`. Don't post AE-only.

- **Tableau dashboard tab 6 — X.com signal.** Schema in `docs/admin-dashboard/sample-data/x-posts.csv`.

If a feature doesn't fit one of these arcs, it probably doesn't belong.

---

## 10. CURRENT STATE (pointer-only)

**For "what shipped":** read the top 20 entries of `docs/progress/CHANGELOG.md`. That is the source of truth.

**Open code tasks (no external account needed):**

- Cornerstone content cadence — 1 piece/month, May–Nov 2026. See `docs/marketing/6-month-organic-growth-plan.md`.

**Open asks for Darsh (external accounts/decisions):**

- Provision **GitHub repo secrets** for the Cloudflare deploy workflow: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Recipe: `docs/deployments/cloudflare-deploy.md` §1–3. Without these the workflow fails at the `Deploy to Cloudflare` step.
- Activate `/api/lead` — Resend signup + DNS + `wrangler secret put RESEND_API_KEY`. Recipe: `docs/leads/setup.md`.
- Activate `/chat` — `wrangler secret put ANTHROPIC_API_KEY` + `CHAT_PIN`. Recipe: `docs/chat/README.md`.
- Activate `/supreme` — `wrangler secret put XAI_API_KEY` + `SUPREME_PIN`. Until set, the unlock screen returns 503 with a clear error. Recipe: `docs/supreme/grok-integration.md`. Optionally set `CALCOM_URL` (var) to wire the `book_call` tool to your real booking link.
- Activate `/plans` — `wrangler secret put PLANS_PIN`. Until set, the unlock screen returns 503 with a clear error. Reads fall back to the build-time seed; writes return 503 until D1 is bound.
- Apply the comments + plans schema to D1: `npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql`. Until applied, `POST /api/comments` and `PUT /api/plans` return 503; `/plans` reads still work via the seed.
- Provision `LEADS_KV` (per-IP rate limit for `/api/lead` and `/api/comments`). Optional — failure mode is "rate limiter silently no-ops."
- Third-party proof — Shopify Partner directory + Clutch + GBP + real LinkedIn company page. Playbook: `docs/marketing/third-party-listings.md`.
- Cal.com — set `NEXT_PUBLIC_CALCOM_URL` as a GitHub repo secret (the deploy workflow forwards it to `next build`).
- Reddit — create `u/x9elysium` (or `u/darshanpatel-x9`) per `docs/marketing/reddit-geo-seo-plan.md`.
- Real testimonials, named case studies, founder photos at `public/images/about/team/{darshan,adhvait}.jpg`.

When any of these closes, move it to CHANGELOG with a date and prune from §10.

---

## 11. GROK PROMPT TEMPLATE (Grok 4.20 contract)

Darsh routes prompts via Grok. When Grok writes a prompt for Claude Code, the output **must** follow this exact shape so you can execute instantly. Recognize the shape and ship decisively.

```text
GOAL: <one sentence — the user-visible outcome>
WHY: <which job from §1 or arc from §9 it serves>
SCOPE: <exact files/folders Claude may touch>
OUT OF SCOPE: <files/areas to leave alone>
CONSTRAINTS:
  - voice: matches §6
  - aesthetic: §4 (or push past it for Supreme per §9)
  - hard rules: respect §7
  - decision rights: §2 — ship without asking unless it hits "Only ask Darsh"
ACCEPTANCE:
  - <observable check 1 — e.g., page renders at /foo without console errors>
  - <observable check 2 — e.g., CHANGELOG entry written>
  - <observable check 3 — e.g., post-push protocol passes>
DELIVERABLE: <push-to-main / draft PR / draft-only>
```

If a Grok-generated prompt is missing any section, infer it from this file and proceed. **Do not ping back asking** — that is the entire point of this document.

---

## 12. MEMORY CORE — durable context that should survive every session

> This section is the **bottom of the file by design**. It is the long-term memory of the project, written for the agent (Claude Code, Grok-via-Claude, future humans) who lands here cold. Treat each subsection as a load-bearing fact about how the world works inside this repo. Update it when posture shifts; never delete history without replacing it.

### 12.1 The three jobs (immutable)

x9elysium.com exists for these three jobs, in this priority order:

1. **Convert warm inbound** — founders who want a Shopify Plus partner that isn't a 200-person agency.
2. **Compound trust** — through writing, schema, and AI citations so the next founder finds us via ChatGPT/Perplexity/Google AI Overviews instead of cold outbound.
3. **Be the canvas** — for everything Darsh wants to build next. Living thesis, not a brochure.

If a proposed change does not serve at least one of these, push back before doing it. (Repeated from §1 because every agent forgets it within a week.)

### 12.2 Voice fingerprint (memorize this)

- **Lowercase commits.** Short. Periods over semicolons. Sentence-level punch.
- **Concrete > abstract.** "Founder-led Shopify Plus consulting. No juniors. No handoffs." beats "boutique digital partner."
- **Under-claim.** If we can't prove it, soften it. "The first quarter after launch was the strongest we've ever had" beats "40% revenue lift." We have literally stripped quantitative claims from the site because we couldn't substantiate them. Stay there.
- **Naval cadence in long-form.** Short clauses. Pause. Then the punch.
- **Devanagari** only when the credo is the subject. Use the `font-devanagari` Tailwind class.
- **Code comments:** default to none. Only when the *why* is non-obvious. Never narrate the *what*.
- **Adjective ban:** `seamless`, `cutting-edge`, `world-class`, `best-in-class`, `next-generation`, `revolutionary`, `synergy`, `holistic`, `enterprise-grade`. Kill on sight.

If a draft sounds like an agency brochure, it's wrong. If it sounds like a founder texting another founder at 11pm, you're close.

### 12.3 The credo as load-bearing infra

**वसुधैव कुटुम्बकम् — Vasudhaiva Kutumbakam — "the world is one family."**

Source: Maha Upanishad 6.71. This is not a tagline. Five pillars and ten operating rules at `/foundation` answer to this single idea. Every refusal we make (no juniors, no offshore, no popups, no Instagram, no fabricated metrics) traces back to it.

When someone asks "why do you do X?", the chain is: `because of <pillar/rule>` → `because of Vasudhaiva Kutumbakam`. Do not break that chain in copy or in code.

### 12.4 The full surface map (where the seams are)

| Surface | Path | Posture | Who/what consumes it |
| --- | --- | --- | --- |
| Marketing site | `app/**` (App Router) + `pages/**` (legacy blog, terms) | Public, indexed | Search engines, AI crawlers, prospects |
| Blog | `pages/blog/**` + `content/posts/*.md` | Public, indexed, RSS | Same + RSS readers |
| Thoughts | `app/thoughts/` + `data/x-thoughts.md` | Public, indexed, per-thought stable anchors | Same + sharable quote cards |
| Sanctuary | `app/sanctuary/` + Cloudflare R2 | Public, no chrome, no tracking | Anyone |
| Supreme | `app/supreme/` (visual shell) + `app/supreme/Console.tsx` (Grok console) + `worker/grok.ts` + `worker/supreme-index.json` | **PIN-gated** console, `noindex,nofollow`, will migrate to subdomain when provisioned | xAI Responses API + built-in web/x search + custom tools |
| Chat | `app/chat/` + `worker/chat.ts` | **PIN-gated**, `noindex,nofollow` | Anthropic API + curated docs corpus |
| Plans | `app/plans/` + `worker/plans.ts` + `docs/plans-allowlist.json` | **PIN-gated**, D1-backed, seed in repo | Founders only |
| Journal | `docs/journal/**` + viewer at `/docs/journal` | **PIN-gated**, AES-encrypted, excluded from `/chat` corpus | Darsh only |
| Lead capture | `worker/index.ts → /api/lead` + Resend | Public write, rate-limited | Prospect contact form, mailto fallback |
| Comments | `worker/index.ts → /api/comments` + D1 | Public write, multi-gate spam shield | Anyone reading blog/thoughts |
| AI manifest | `public/x9elysium.json` + `public/llms.txt` + `public/robots.txt` | Public, machine-readable | AI crawlers, agents, integrators |
| Internal dashboard | `docs/admin-dashboard/` (specs only) | Not built yet — Tableau spec | Future Darsh + Adhvait |

**Top-of-mind invariants:**

- The `/api/` namespace is denied in `robots.txt`. Don't expose JSON endpoints to crawler budgets.
- Anything PIN-gated is URL-share-discovery only. Never link from nav, footer, sitemap, or `llms.txt`.
- The chat corpus is built at prebuild time (`scripts/build-chat-context.mjs`). The journal exclude list is the only hard exclude; everything else under `docs/**` flows through.

### 12.5 Deploy mental model (Cloudflare-first, not Hostinger, not Netlify)

- **Domain registered at:** Hostinger.
- **DNS at:** Cloudflare.
- **Static site served from:** Cloudflare Workers Static Assets.
- **Pipeline:** `git push origin main` → `.github/workflows/deploy.yml` → `npm ci && npm run build` (which runs `prebuild` to bake the chat context) → `cloudflare/wrangler-action@v3` → `wrangler deploy` → IndexNow batch ping (`scripts/indexnow-submit.mjs`) → smoke test.
- **Skipped on docs-only commits** via the workflow's `paths-ignore`. Force a deploy with `git commit --allow-empty` or the **Run workflow** button.
- **Manual fallback:** `npm ci && npm run build && npx wrangler deploy` from the workstation. Requires `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in the local shell.
- **Last-resort fallback:** `npm run deploy:zip` + Hostinger File Manager. Archived; only if Cloudflare is unreachable.
- **CDN cache is aggressive.** Don't claim "live" until the post-push protocol at [`docs/deployments/post-push-checks.md`](docs/deployments/post-push-checks.md) passes.

### 12.6 Secrets and where they live

| Secret | Stored where | Used by |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | GH repo secrets + local shell env | Deploy workflow + `.mcp.json` cloudflare server |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | local shell env | `.mcp.json` github server |
| `RESEND_API_KEY` | `wrangler secret` | `/api/lead` |
| `ANTHROPIC_API_KEY` | `wrangler secret` | `/api/chat` |
| `CHAT_PIN` | `wrangler secret` | `/api/chat` PIN gate |
| `PLANS_PIN` | `wrangler secret` | `/api/plans` PIN gate |
| `XAI_API_KEY` | `wrangler secret` | `/api/grok` (the `/supreme` console) |
| `SUPREME_PIN` | `wrangler secret` | `/api/grok` PIN gate |
| `GROK_MODEL` (optional) | `wrangler secret` or `[vars]` | Override default `grok-4-latest` for `/api/grok` |
| `CALCOM_URL` (optional) | `[vars]` | Returned by Supreme `book_call` tool. Distinct from `NEXT_PUBLIC_CALCOM_URL` (build-time, client). |
| `JOURNAL_PIN` (browser-side decrypt key) | `app/docs-journal/` build embed | Journal AES decrypt in browser |
| `NEXT_PUBLIC_CALCOM_URL` | GH repo secret, forwarded at build | Booking link, future `book_call` chat tool |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | optional GH repo secret | Clarity tracker (default falls back) |

**Never commit secrets.** Never log secrets in CHANGELOG or chat transcripts. If you discover a leaked secret, treat as P0: rotate, force-push the cleaned tree only with explicit Darsh approval, and document the incident in `docs/journal/`.

### 12.7 The three agents and their tools

- **Claude Code** (you, primary): full Read/Write/Edit/Bash + MCP filesystem-fetch-cloudflare-github via `.mcp.json`. Authority per §2. Ship without asking on the green list.
- **Grok-via-Claude**: Darsh sometimes routes prompts through Grok. Grok writes a contract per §11; you execute it. If the contract is malformed, infer and proceed.
- **The site's `/chat` agent**: Claude Sonnet 4.6 with the docs corpus as system prompt. Phase 2 (in [`docs/chat/thoughts-deep-integration.md`](docs/chat/thoughts-deep-integration.md)) gives it tool calls (`search_thoughts`, `search_blog`, `book_call`, `lead_capture`).
- **The site's `/supreme` agent**: Grok via xAI Responses API (default `grok-4-latest`) with built-in web + x search, vision, and the same four custom tools already shipped server-side in [`worker/grok.ts`](worker/grok.ts). Server-side tool loop with normalized SSE envelope to the client. PIN-gated by `SUPREME_PIN`. Setup: [`docs/supreme/grok-integration.md`](docs/supreme/grok-integration.md).

### 12.8 The "ask Darsh" green and red list (memorize)

**Green — ship without asking** (full authority): code structure, copy edits within voice, doc placement, schema/JSON-LD additions, visual polish within design system, killing dead code, CHANGELOG updates, CLAUDE.md updates for new constraints, Supreme aesthetic experiments.

**Red — confirm with Darsh first**: destructive ops (`rm -rf`, force push, branch delete, `out/` delete), external account work (Resend, Anthropic, Cal.com, Shopify Partner, Clutch, GBP, LinkedIn, DNS, paid plan upgrades), public claims (named testimonial, case study, metric, press quote), new domain provisioning, anything touching `docs/journal/`.

When in doubt: **ship the code, leave the public claim as a placeholder**, call it out in the commit + CHANGELOG entry as "Ask for Darsh."

### 12.9 The hard "never"s (the catastrophe list)

- Never fabricate metrics, names, testimonials, or case studies.
- Never link `/docs/journal`, `/plans`, `/chat`, or `/supreme` from nav, footer, sitemap, or `llms.txt`.
- Never feed `docs/journal/**` into the `/chat` corpus or any external AI service.
- Never expose API keys in client bundles. (Web3Forms was killed for this reason. Don't repeat.)
- Never use Instagram for X9Elysium content. X.com only.
- Never push to `main` without running the post-push checklist.
- Never auto-generate or `/init` CLAUDE.md.
- Never duplicate CHANGELOG content in CLAUDE.md.
- Never add a chatbot popup, lead modal, or upsell overlay. (Tawk.to was killed for this reason.)
- Never paraphrase the credo in copy. It appears verbatim or not at all.

### 12.10 The forward arcs (what we're building, in priority)

1. **Cornerstone content cadence** — one canonical piece per month, May–Nov 2026. Plan in [`docs/marketing/6-month-organic-growth-plan.md`](docs/marketing/6-month-organic-growth-plan.md).
2. **Thoughts × Chat deep integration** — Phase 1–4 in [`docs/chat/thoughts-deep-integration.md`](docs/chat/thoughts-deep-integration.md). The chat becomes the SDR. Sharable transcripts become the social proof.
3. **Third-party trust signals** — Shopify Partner directory, Clutch, GBP, real LinkedIn page. Playbook in [`docs/marketing/third-party-listings.md`](docs/marketing/third-party-listings.md). Each one closes a specific trust gap.
4. **Supreme** — `app/supreme/` today, `supreme.x9elysium.com` once provisioned. The 2027+ R&D vehicle. Aesthetic + interaction pattern decisions sit with Claude (§9). Push past matte-black/emerald.
5. **Sales function** — Head of Sales → Manager → AEs. Roles on `/careers`. Playbook in `docs/sales/`.
6. **Tableau dashboard** — six tabs, including the X.com signal tab. Spec in `docs/admin-dashboard/`.

If a feature does not fit one of these arcs, it probably does not belong on the site.

### 12.11 The agent's first 90 seconds in any session

```
1. Read this file (CLAUDE.md) end-to-end. It is the contract.
2. Skim docs/progress/CHANGELOG.md top 10–15 entries. It is the source of truth for "what shipped."
3. Read MEMORY.md from auto-memory. It tells you about Darsh.
4. If the task touches AI surface, read docs/chat/thoughts-deep-integration.md and docs/ai-access/README.md.
5. If the task touches the deploy pipeline, read docs/deployments/post-push-checks.md and docs/deployments/cloudflare-deploy.md.
6. Plan if non-trivial. Execute. CHANGELOG. Push. Verify.
```

If you've done all six and you're still unsure how to proceed, ask Darsh — but in 99% of sessions, those six steps + this file is enough to ship without pinging back.

### 12.12 The single sentence that should outlive this file

> X9Elysium is two senior founders shipping Shopify Plus consulting in the open, under the credo Vasudhaiva Kutumbakam, with a site that doubles as the canvas for everything we build next — including an AI chat that quotes our own thinking back to a 3am prospect with citations and a one-click share.

If a future agent only reads one line of CLAUDE.md, this is it.

---

*You now have the keys. Full access. Maximum authority. Ship like Darsh would — terse, founder-led, no juniors, world is one family. This file is a living contract. Update it when posture changes.*
