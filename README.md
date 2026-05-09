# X9Elysium

> Founder-led Shopify Plus consulting. Two senior founders. No juniors. No handoffs. The world is one family.

**Live:** [x9elysium.com](https://x9elysium.com) · **Repo:** this directory · **Authoring contract:** [CLAUDE.md](./CLAUDE.md) · **What shipped:** [`docs/progress/CHANGELOG.md`](./docs/progress/CHANGELOG.md)

---

## Why this site exists

Three jobs, in this priority order:

1. **Convert warm inbound** — founders who want a Shopify Plus partner that isn't a 200-person agency.
2. **Compound trust** — through writing, schema, and AI citations so the next founder finds us via ChatGPT, Perplexity, and Google AI Overviews instead of cold outbound.
3. **Be the canvas** — for everything Darsh wants to build next. Living thesis, not a brochure.

If a change does not serve at least one of those, push back before doing it.

**Credo (load-bearing, not a tagline):** वसुधैव कुटुम्बकम् — *Vasudhaiva Kutumbakam* — "the world is one family." Maha Upanishad 6.71. Every pillar, refusal, and product decision answers to it. See [`/foundation`](https://x9elysium.com/foundation).

---

## Status

| Surface | State |
| --- | --- |
| Static site | Live on Cloudflare Workers Static Assets |
| `/api/lead` (Resend) | Built. Awaiting `RESEND_API_KEY` + DNS. |
| `/api/chat` (Claude Sonnet 4.6) | Built. Awaiting `ANTHROPIC_API_KEY` + `CHAT_PIN`. |
| `/api/comments` (D1) | Built. Awaiting `wrangler d1 execute … schema.sql`. |
| `/api/plans` (D1, PIN-gated) | Built. Awaiting `PLANS_PIN` + D1 binding. |
| `/api/sanctuary` (R2) | Built. Falls back to in-browser synthesis until R2 binding lands. |
| **GitHub Actions deploy** | **🔴 Failing — see "Known issue" below.** |

### Known issue — Cloudflare deploys are failing

Every push to `main` since the workflow rolled out fails at the `Deploy to Cloudflare` step with:

```text
✘ In a non-interactive environment, it's necessary to set a
  CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

Root cause: the GitHub repo has no `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` secrets. The workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) reads them from `secrets.*`, so an empty value reaches `wrangler-action`.

**Fix (Darsh-only — external account work):**

1. Create a Cloudflare API token with `Workers Scripts:Edit` + `Account:Read` per [`docs/deployments/cloudflare-deploy.md`](./docs/deployments/cloudflare-deploy.md) §1–3.
2. `gh secret set CLOUDFLARE_API_TOKEN` and `gh secret set CLOUDFLARE_ACCOUNT_ID` on this repo.
3. Re-run the latest failed workflow, or push an empty commit.

Until then the **manual fallback works**: `npm ci && npm run build && npx wrangler deploy` from the workstation with the same two env vars exported locally.

---

## Architecture

### Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 — App Router (primary) + Pages Router (legacy blog, terms) |
| Output | `output: "export"` → static `out/` directory |
| Language | TypeScript for new code, JS for legacy |
| Styling | Tailwind 3 + custom utilities in [`app/globals.css`](./app/globals.css) |
| Motion | Framer Motion — variants in [`app/lib/animations.ts`](./app/lib/animations.ts) |
| Icons | `lucide-react` |
| Fonts | Inter (UI) + Noto Sans Devanagari (credo) via `next/font/google` |
| Static host | Cloudflare Workers Static Assets ([`wrangler.toml`](./wrangler.toml)) |
| Dynamic backend | Single Cloudflare Worker — [`worker/index.ts`](./worker/index.ts) |
| Domain | Registered at Hostinger, DNS at Cloudflare |
| Email | Resend (transactional lead notifications) |
| Chat model | Claude Sonnet 4.6 via Anthropic API |
| Comments + Plans | D1 (`x9elysium-leads`) — schema in [`worker/schema.sql`](./worker/schema.sql) |
| Rate limit | Cloudflare KV (`LEADS_KV`) — optional, no-ops when unbound |
| Audio sanctuary | Cloudflare R2 (`x9elysium-sanctuary`) — falls back to Web Audio synthesis |
| Tracking | Microsoft Clarity ([`app/components/ClarityTracker.tsx`](./app/components/ClarityTracker.tsx)) |
| MCP | github + cloudflare + filesystem (path-locked) + fetch via [`.mcp.json`](./.mcp.json) |

### Repo map

```text
app/                  App Router — sections, routes, JSON-LD shells
  components/         Hero, Services, Work, Tweets, Navigation, Footer, ClarityTracker
  lib/                animations.ts, booking.ts, careers.ts
  <route>/page.tsx    Server-component shell with Metadata + JSON-LD
  <route>/Client.tsx  Client interactivity
  foundation/         Five pillars + ten rules — rendering of the credo
  chat/               PIN-gated AI chat (Sonnet 4.6, corpus-grounded)
  plans/              PIN-gated editable md viewer
  thoughts/           Public, indexed, per-thought stable anchors
  sanctuary/          Public, no chrome, no tracking
  supreme/            R&D vehicle — migrates to supreme.x9elysium.com when provisioned
pages/                Legacy router (blog, terms) — leave alone unless asked
worker/               Cloudflare Worker
  index.ts            /api/* router → email.ts, chat.ts, comments.ts, plans.ts, sanctuary.ts
  schema.sql          D1 schema for comments + plans
  chat-context.json   Built at prebuild from docs/ (journal excluded)
  plans-seed.json     Built at prebuild from docs/plans-allowlist.json
config/               Site configuration JSON
content/              Markdown for blog
public/               Static assets, llms.txt, robots.txt, sitemap.xml, x9elysium.json
data/                 tweets.json, x-thoughts.md, x-posted.json
scripts/
  build-chat-context.mjs   Bake docs/ into worker/chat-context.json (journal excluded)
  build-plans-seed.mjs     Bake plans-allowlist.json into worker/plans-seed.json
  indexnow-submit.mjs      Post-deploy IndexNow ping
  docs-viewer/             Local Drive-style md viewer (npm run docs)
  x/                       X.com automation (cron-driven)
docs/                 Outside the static export — every internal md lives here
```

### Surfaces

| Surface | Path | Posture |
| --- | --- | --- |
| Marketing site | `app/**` + `pages/**` | Public, indexed |
| Blog | `pages/blog/**` + `content/posts/*.md` | Public, indexed, RSS |
| Thoughts | `app/thoughts/` + `data/x-thoughts.md` | Public, indexed, stable per-thought anchors |
| Sanctuary | `app/sanctuary/` + R2 bucket | Public, no chrome, no tracking |
| Supreme | `app/supreme/` (→ subdomain later) | Public, hidden — not in nav |
| Chat | `app/chat/` + `worker/chat.ts` | **PIN-gated**, `noindex,nofollow` |
| Plans | `app/plans/` + `worker/plans.ts` | **PIN-gated**, D1-backed, seed in repo |
| Journal | `docs/journal/**` | **PIN-gated**, AES-encrypted, excluded from chat corpus |
| Lead capture | `worker/index.ts → /api/lead` | Public write, rate-limited |
| Comments | `worker/index.ts → /api/comments` | Public write, multi-gate spam shield |
| AI manifest | `public/x9elysium.json` + `public/llms.txt` + `public/robots.txt` | Public, machine-readable |

### Deploy pipeline

```text
git push origin main
  → .github/workflows/deploy.yml (skipped on docs-only commits via paths-ignore)
    → npm ci
    → npm run build  (prebuild bakes chat-context + plans-seed)
    → cloudflare/wrangler-action@v3 → wrangler deploy
    → node scripts/indexnow-submit.mjs
    → smoke test critical routes
```

- **Skipped paths:** `docs/**`, `**/*.md`, `data/x-thoughts.md`, `data/x-posted.json`, `data/tweets.json`, `scripts/x/**`, `.github/workflows/x-*.yml`. Force a deploy with `git commit --allow-empty -m "deploy: <reason>"` or the workflow's **Run workflow** button.
- **CDN cache is aggressive.** Don't claim "live" until [`docs/deployments/post-push-checks.md`](./docs/deployments/post-push-checks.md) passes.
- **Manual fallback:** `npm ci && npm run build && npx wrangler deploy` with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` exported.
- **Last-resort fallback:** `npm run deploy:zip` + Hostinger File Manager — archived, only if Cloudflare is unreachable.

### Secrets (where they live, who needs them)

| Secret | Stored | Used by |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | GH repo secrets + local shell | Deploy workflow + `.mcp.json` cloudflare server |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | local shell | `.mcp.json` github server |
| `RESEND_API_KEY` | `wrangler secret put` | `/api/lead` |
| `ANTHROPIC_API_KEY` | `wrangler secret put` | `/api/chat` |
| `CHAT_PIN` | `wrangler secret put` | `/api/chat` PIN gate |
| `PLANS_PIN` | `wrangler secret put` | `/api/plans` PIN gate |
| `JOURNAL_PIN` | build-time embed in `app/docs-journal/` | Browser-side AES decrypt |
| `NEXT_PUBLIC_CALCOM_URL` | GH repo secret, forwarded at build | Booking link, future `book_call` chat tool |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | optional GH repo secret | Clarity tracker (default `nhmfksrzgs`) |

Never commit secrets. Never log secrets in CHANGELOG. If one leaks, treat as P0: rotate, document in `docs/journal/`, and check with Darsh before any history rewrite.

---

## Commands

```bash
npm run dev            # local dev (localhost:3000)
npm run build          # static export → out/  (prebuild bakes chat + plans seeds)
npm run lint           # eslint
npm run docs           # localhost:4000/docs viewer — never deploy
npm run worker:dev     # local Worker
npm run worker:deploy  # manual worker deploy
npm run preview        # full local round-trip (next build && wrangler dev)
npm run deploy:zip     # archived Hostinger fallback
```

`npm start` does not exist — the site is a static export.

---

## Working in this repo

The full operating contract is in [CLAUDE.md](./CLAUDE.md). Read it end-to-end before any non-trivial change. The condensed version is below.

### First 90 seconds in any session

1. Read [`CLAUDE.md`](./CLAUDE.md). It is the contract.
2. Skim the top 10–15 entries of [`docs/progress/CHANGELOG.md`](./docs/progress/CHANGELOG.md). It is the source of truth for "what shipped." This README does not duplicate it.
3. Read the file(s) you're about to edit in full before editing.
4. If the task touches the AI surface, read [`docs/chat/thoughts-deep-integration.md`](./docs/chat/thoughts-deep-integration.md) and [`docs/ai-access/README.md`](./docs/ai-access/README.md).
5. If the task touches deploy, read [`docs/deployments/post-push-checks.md`](./docs/deployments/post-push-checks.md) and [`docs/deployments/cloudflare-deploy.md`](./docs/deployments/cloudflare-deploy.md).
6. Plan if non-trivial. Execute. Append to CHANGELOG. Push. Verify.

### Per-commit protocol

1. Append entry to [`docs/progress/CHANGELOG.md`](./docs/progress/CHANGELOG.md) (newest first, lowercase).
2. If posture or architecture shifted, update [`CLAUDE.md`](./CLAUDE.md).
3. Run [`docs/deployments/post-push-checks.md`](./docs/deployments/post-push-checks.md). Don't say "live" until it passes.

---

## AI rules — the contract every agent inherits

> These rules apply to **every agent that ever touches this repo** — Claude Code, Grok-via-Claude, future humans, the in-product `/chat` agent, and any MCP client. They override defaults. Break them and the site loses its wedge.

### 1. The catastrophe list (never break)

- **Never fabricate** metrics, names, testimonials, case studies, or numbers we can't substantiate. The site under-claims by design.
- **Never link** `/docs/journal`, `/plans`, or `/chat` from nav, footer, sitemap, or `llms.txt`. PIN-gated and URL-share-discovery only.
- **Never feed** `docs/journal/**` into the `/chat` corpus or any external AI service. The exclude list in [`scripts/build-chat-context.mjs`](./scripts/build-chat-context.mjs) enforces this — don't break it.
- **Never expose** API keys in client bundles. (Web3Forms was killed for this reason. Don't repeat.)
- **Never use** Instagram for X9Elysium content. X.com only.
- **Never push** to `main` without running the post-push checklist.
- **Never auto-generate** or `/init` `CLAUDE.md`. Hand-tuned.
- **Never duplicate** CHANGELOG content in `CLAUDE.md` or this README.
- **Never add** a chatbot popup, lead modal, or upsell overlay. (Tawk.to was killed for this reason.) Async, intentional inbound only.
- **Never paraphrase** the credo in copy. It appears verbatim in Devanagari + transliteration + translation, or not at all.

### 2. Decision rights — green list (ship without asking)

- Code structure, file placement, component splits, refactor scope within the task.
- Copy edits — tightening, killing fluff, removing fabricated numbers, flipping CTA hierarchy.
- Doc placement — anything markdown into `docs/<subfolder>/`. Pick the subfolder, create it if needed. Never drop `.md` at repo root except `CLAUDE.md` and `README.md`.
- Schema / JSON-LD additions — Person, Organization, FAQ, Breadcrumb, OfferCatalog where the page warrants. E-E-A-T is a permanent priority.
- Visual polish within the design system. Don't introduce new accent colors. Don't break the dark/emerald posture. (Supreme is the exception.)
- Killing dead code — unused components, routes, imports, packages. Don't ask permission to clean.
- CHANGELOG and CLAUDE.md updates when posture or architecture shifts.
- Supreme aesthetic + interaction patterns. Propose boldly. Iterate fast.

### 3. Decision rights — red list (confirm with Darsh first)

- Destructive ops — `rm -rf`, force push, branch delete, `out/` delete, secret rotation on a live system.
- External account work — Resend, Anthropic, Cal.com, Shopify Partner, Clutch, GBP, LinkedIn, DNS, paid plan upgrades.
- Public claims — named testimonial, named case study, metric, press quote. If it can be challenged in public, Darsh confirms first.
- New domain or subdomain provisioning.
- Anything touching `docs/journal/`.

When in doubt: **ship the code**, leave the public claim as a placeholder, call it out in the commit + CHANGELOG entry as an "Ask for Darsh."

### 4. Voice fingerprint (match exactly)

- **Lowercase commits.** Short. Periods over semicolons. Sentence-level punch.
- **Concrete > abstract.** "Founder-led Shopify Plus consulting. No juniors. No handoffs." beats "boutique digital partner."
- **Under-claim.** If we can't prove it, soften it. We literally stripped quantitative claims because we couldn't substantiate them. Stay there.
- **Naval cadence in long-form.** Short clauses. Pause. Then the punch.
- **Devanagari** only when the credo is the subject. Use the `font-devanagari` Tailwind class.
- **Code comments:** default to none. Only when the *why* is non-obvious. Never narrate the *what*.
- **Adjective ban:** `seamless`, `cutting-edge`, `world-class`, `best-in-class`, `next-generation`, `revolutionary`, `synergy`, `holistic`, `enterprise-grade`. Kill on sight.

If a draft sounds like an agency brochure, it is wrong. If it sounds like a founder texting another founder at 11pm, it's close.

### 5. AI crawler posture

- **Allowed via [`public/robots.txt`](./public/robots.txt) explicit allowlist:** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, claude-searchbot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Applebot-Extended, Amazonbot, CCBot, Bytespider, Meta-ExternalAgent, Mistral-AI-User, cohere-ai, YouBot, Diffbot.
- **Denied for everyone:** the `/api/` namespace.
- **Denied via catch-all `User-agent: *`:** every SEO scraper and unknown crawler. Add a named block to grant access.
- **Machine-readable manifest:** [`public/x9elysium.json`](./public/x9elysium.json) — version 1.0, structured site identity, founders, engagement model, surface map. Designed for AI clients.
- **Plain-text manifest:** [`public/llms.txt`](./public/llms.txt) — the canonical operator-true description.
- **Schema:** Person + Organization + FAQ + Breadcrumb wherever the page warrants. E-E-A-T is permanent priority — every page should answer who, what, why now, and what evidence.

### 6. The `/chat` agent — what it can and cannot do

- Model: **Claude Sonnet 4.6** via Anthropic API.
- Corpus: built at prebuild from `docs/**` minus the journal exclude list. See [`scripts/build-chat-context.mjs`](./scripts/build-chat-context.mjs).
- Gate: `CHAT_PIN` (Worker secret). Never link from nav. Always `noindex,nofollow`.
- Future tools (Phase 2 in [`docs/chat/thoughts-deep-integration.md`](./docs/chat/thoughts-deep-integration.md)): `search_thoughts`, `search_blog`, `book_call`, `lead_capture`. Tool calls land before personalization.
- Hard rule: **the journal never enters the corpus.** Verify after any change to the build script.

### 7. Grok-generated brief contract (recognize and execute)

Darsh routes prompts via Grok 4.20. When a Grok prompt arrives in this exact shape, execute without pinging back:

```text
GOAL: <user-visible outcome>
WHY: <which job from §1 or arc from §9 of CLAUDE.md it serves>
SCOPE: <files/folders Claude may touch>
OUT OF SCOPE: <files/areas to leave alone>
CONSTRAINTS: voice §6, aesthetic §4, hard rules §7, decision rights §2 of CLAUDE.md
ACCEPTANCE: <observable checks>
DELIVERABLE: <push-to-main / draft PR / draft-only>
```

Missing sections? Infer from CLAUDE.md and ship. Do not ping back asking.

---

## Forward arcs (priority order)

1. **Cornerstone content cadence** — one canonical piece per month, May–Nov 2026. Plan in [`docs/marketing/6-month-organic-growth-plan.md`](./docs/marketing/6-month-organic-growth-plan.md).
2. **Thoughts × Chat deep integration** — Phase 1–4 in [`docs/chat/thoughts-deep-integration.md`](./docs/chat/thoughts-deep-integration.md). Chat becomes the SDR. Sharable transcripts become social proof.
3. **Third-party trust signals** — Shopify Partner directory, Clutch, GBP, real LinkedIn page. Playbook in [`docs/marketing/third-party-listings.md`](./docs/marketing/third-party-listings.md).
4. **Supreme** — `app/supreme/` today, `supreme.x9elysium.com` once provisioned. The 2027+ R&D vehicle. Aesthetic + interaction authority sits with Claude.
5. **Sales function** — Head of Sales → Manager → AEs. Roles on [`/careers`](https://x9elysium.com/careers). Playbook in `docs/sales/`.
6. **Tableau dashboard** — six tabs, including the X.com signal tab. Spec in `docs/admin-dashboard/`.

If a feature does not fit one of these, it probably does not belong on the site.

---

## The one sentence that should outlive this repo

> X9Elysium is two senior founders shipping Shopify Plus consulting in the open, under the credo Vasudhaiva Kutumbakam, with a site that doubles as the canvas for everything we build next — including an AI chat that quotes our own thinking back to a 3am prospect with citations and a one-click share.

---

## Index of internal docs

- [`CLAUDE.md`](./CLAUDE.md) — full operating contract
- [`docs/progress/CHANGELOG.md`](./docs/progress/CHANGELOG.md) — every commit, newest first
- [`docs/deployments/`](./docs/deployments/) — Cloudflare deploy + post-push protocol
- [`docs/leads/setup.md`](./docs/leads/setup.md) — Resend activation
- [`docs/chat/`](./docs/chat/) — AI chat setup + Phase 1–4 plan
- [`docs/ai-access/README.md`](./docs/ai-access/) — AI manifest + crawler policy
- [`docs/marketing/`](./docs/marketing/) — six-month organic growth plan, third-party listings, Reddit GEO
- [`docs/sales/`](./docs/sales/) — playbook, hiring plan, role briefs
- [`docs/books-learning/`](./docs/books-learning/) — Naval + Thiel + applied notes (voice source)
- [`docs/branding/`](./docs/branding/) — brand bible
- [`docs/audits/`](./docs/audits/) — SEO/GEO/perf audits, dated
- [`docs/journal/`](./docs/journal/) — **PRIVATE.** AES-encrypted. Never link.
- [`docs/mcp/setup.md`](./docs/mcp/setup.md) — MCP server recipe

---

*This README is the public-facing index. The contract is [`CLAUDE.md`](./CLAUDE.md). The history is [`docs/progress/CHANGELOG.md`](./docs/progress/CHANGELOG.md). Read both before changing anything load-bearing.*
