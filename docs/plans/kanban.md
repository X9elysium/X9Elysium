---
title: Kanban Board — Living Task State
slug: kanban
description: Living kanban of every task touching x9elysium.com — done, in repo awaiting deploy, in progress, blocked on Darsh, and backlog. Cross-checked against CLAUDE.md §10, the 6-month plan, and the top of the CHANGELOG. Updated on every push that moves a card.
last_updated: 2026-05-09
status: living document
revision: 2
---

# Kanban Board — x9elysium.com

> **Source of truth reconciliation.** [CLAUDE.md §10](../../CLAUDE.md) is the *posture* doc — short list, hand-tuned, deliberately spare. The [CHANGELOG](../progress/CHANGELOG.md) is the historical record — everything that shipped, newest first. The [next-steps brief](next-steps-2026-05-09.md) was a one-time audit. **This file is the live operational board** — what's done, what's stuck, what's next, what we're waiting on, and what's parked. When a card moves, this file moves with it.

---

## Priority legend

- **P0** — single biggest unlock. Nothing else in its column ships until this clears. (Almost always: production deploy block.)
- **P1** — high-leverage activation. Code or infra is ready; flipping the secret turns on a real surface.
- **P2** — parallel code-side work I can ship without Darsh, while P0/P1 are pending.
- **P3** — engine work / longer-running. Compounding asset, multi-week, often calendar-paced rather than blocker-paced.

---

## ⏸ BLOCKED — needs Darsh outside the repo

> External accounts, DNS, paid plans, secret provisioning, or named claims. **None of these can be unblocked by code** — they need a human with a password manager and 5–60 minutes per row.

| # | Pri | Card | Unlock | Recipe |
|---|---|---|---|---|
| B-01 | **P0** | **Provision `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` GH repo secrets** | Unblocks **9 queued commits** waiting since `bba9f9c` (2026-05-06). Single biggest lever on the board. | [`docs/deployments/cloudflare-deploy.md`](../deployments/cloudflare-deploy.md) §1–3 |
| B-02 | P1 | Activate `/api/lead` — Resend signup + DNS + `wrangler secret put RESEND_API_KEY` | Flips the contact form from `mailto:` fallback to silent POST | [`docs/leads/setup.md`](../leads/setup.md) |
| B-03 | P1 | Apply comments D1 schema: `npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql` | Flips `/api/comments` from 503 → 200 across blog/thoughts/journal | `worker/schema.sql` |
| B-04 | P1 | Activate `/chat` — `wrangler secret put ANTHROPIC_API_KEY` + `CHAT_PIN` | Turns on the PIN-gated agent. Natural upgrade path for `/supreme` Voice surface. | [`docs/chat/README.md`](../chat/README.md) |
| B-05 | P2 | Provision R2 bucket: `npx wrangler r2 bucket create x9elysium-sanctuary` + upload 3–5 calm tracks | Lights up the cloud library on `/sanctuary`. Page is fully self-sufficient via Web Audio synthesis until then. | `wrangler.toml` (commented `[[r2_buckets]]` block) |
| B-06 | P2 | Provision `LEADS_KV` for per-IP rate limiting on `/api/lead` + `/api/comments` | Optional. Failure mode is "rate limiter silently no-ops." | — |
| B-07 | P2 | Set `NEXT_PUBLIC_CALCOM_URL` as a GH repo secret | Makes `BookingButton` route to a real Cal.com page instead of a placeholder | — |
| B-08 | P3 | Apply for **Shopify Partner directory** + **Clutch profile** + **Google Business Profile** + real **LinkedIn company page** | Closes the third-party trust gap. Reviews take 4–8 weeks — start now. | [`docs/marketing/third-party-listings.md`](../marketing/third-party-listings.md) |
| B-09 | P3 | Create `u/x9elysium` (or `u/darshanpatel-x9`) on Reddit | Unblocks the Reddit GEO/SEO play | [`docs/marketing/reddit-geo-seo-plan.md`](../marketing/reddit-geo-seo-plan.md) |
| B-10 | P3 | Decide on real testimonials, named case studies, founder photos at `public/images/about/team/{darshan,adhvait}.jpg` | Closes the "Named references on request" promise with a public surface | — |

---

## 🚀 DONE — in repo, awaiting deploy

> Code is on `main`. Live site is stale until **B-01** clears. **14 commits queued** since `bba9f9c` (2026-05-06). Listed newest first.

| # | Pri | Card | Commit | Live? |
|---|---|---|---|---|
| Q-14 | P2 | Truth gate + degraded-state UX + speakable schema + MDX bio cleanup + README rewrite | `(this push)` | ⏳ awaiting deploy |
| Q-13 | P3 | `/plans/5k-budget` — every-penny doctrine, 8 buckets totalling $5,000, kill rule per row, reallocation matrix, month-6 exit criterion | `53f7115` | ⏳ awaiting deploy |
| Q-12 | P2 | Supreme: Grok-powered console at `/supreme` — `/api/grok` server agent loop, vision input, built-in `web_search` + `x_search` (Grok Live Search), 4 custom tools, SSE envelope, PIN gate | `2e7f066` | ⏳ awaiting deploy |
| Q-11 | P2 | AI surface: `public/x9elysium.json` machine-readable manifest + `llms.txt` extension + `docs/ai-access/README.md` + chat×thoughts deep-integration plan + CLAUDE.md memory core | `3557b12` | docs+code |
| Q-10 | P2 | Plans: PIN-gated editable md viewer at `/plans/<slug>` with D1 persistence + repo seed | `56f9d2e` | ⏳ awaiting deploy |
| Q-01 | P2 | Branding bible — novel-style brand distillation in [`docs/branding/branding.md`](../branding/branding.md) | `0a8c0ae` | docs-only (won't deploy by design) |
| Q-02 | P2 | Feature audit + next-steps brief, tick shipped checklists, bump sitemap dates | `2fe1b80` | ⏳ awaiting deploy |
| Q-03 | P2 | Site sweep: HSTS + security headers (`public/_headers`), audit player on shared component, drop orphan jpg | `c06c237` | ⏳ awaiting deploy |
| Q-04 | P2 | Journal: rewrite cross-entry `.md` links to viewer's hash routes (fixes 404 on inter-entry links) | `4789fe0` | ⏳ awaiting deploy |
| Q-05 | P2 | Docs/analytics: Clarity Copilot quick reference + prompt library tied to event taxonomy | `969a108` | docs-only |
| Q-06 | P1 | Contact: `mailto:` fallback so leads land even with `/api/lead` offline (AbortController + 6s timeout + new fallback UI state) | `df52711` | ⏳ awaiting deploy |
| Q-07 | P2 | Homepage cleaner pass — kill Partners marquee, slim Hero glows, drop redundant Reasons grid | (in `bba9f9c..main` range) | ⏳ awaiting deploy |
| Q-08 | P2 | Supreme: ship `/supreme` lab — WebGL prismatic field + manifesto pillars + interactive Loom + Voice echo | (in range) | ⏳ awaiting deploy |
| Q-09 | P2 | Truth pass across all pages: strip every fabricated metric, quote, credential. `/sanctuary` ships (Web Audio + R2 cloud). Founding date 2021→2022 reconciled. | (in range) | ⏳ awaiting deploy |

> *None of these reach x9elysium.com until B-01 clears. Every additional commit grows the queue.*

---

## 🔁 DOING / NEXT — code-side work I can ship while B-01 is pending

> No external dep. No Darsh-confirmation needed (per [CLAUDE.md §2](../../CLAUDE.md) decision rights). Ranked by leverage.

| # | Pri | Card | Why | Definition of done |
|---|---|---|---|---|
| N-02 | P2 | **`Article` + `BreadcrumbList` graph audit** across all 26 blog posts | Spot-check every post for `image`, `datePublished`, `dateModified`, named `author` `Person`, `publisher` `Organization` with logo. Anything missing is a citation-readiness gap. | All 26 posts pass `npm run schema:validate` (or equivalent script); `docs/audits/article-graph-2026-05-XX.md` documents fixes. |
| N-04 | **P1** | **May cornerstone:** *"When To Hire a Shopify Plus Agency vs Build In-House: A Founder's Decision Tree"* | One canonical piece per month, May–Nov 2026 ([CLAUDE.md §10](../../CLAUDE.md), [6-month plan](../marketing/6-month-organic-growth-plan.md)). May should harden the **decision-stage** surface before June drops migration + comparison cornerstones. **Land by 2026-05-23 so June can absorb both planned cornerstones without sliding.** | Drafted at `/blog/when-hire-shopify-plus-agency-vs-build-in-house`. 2,800–3,200 words. `Article` + `FAQPage` + `BreadcrumbList` schema. 5-axis decision matrix marked up as `Table` schema. Internal links to `/services`, `/work`, the cost-in-Canada post, Toronto/Calgary location pages. Voice §6. |
| N-05 | P2 | **`/supreme/Voice.tsx` → wire to `/api/chat`** when B-04 clears | Currently uses 8 deterministic stand-in reflections. Once Anthropic key lands, this is the natural upgrade path. | Superseded by Q-13 — Voice was deleted on 2026-05-09 when the Grok-powered Console replaced it. Card retired. |

---

## 🗄 BACKLOG — engine work, calendar-paced

> Multi-week or recurring. Pulls toward one of the [CLAUDE.md §9](../../CLAUDE.md) gravities.

| # | Pri | Card | Notes |
|---|---|---|---|
| K-01 | P3 | **June cornerstone:** Magento → Plus migration playbook | Pain-stage. Pairs naturally with `Best Shopify Plus Agencies Toronto 2026`. Schedule 2026-06-15. |
| K-02 | P3 | **June cornerstone:** Plus vs BigCommerce decision matrix | Comparison-stage. Schedule 2026-06-29. |
| K-03 | P3 | **July–Nov cornerstones** | One per month, decision-stage to migration-stage to retention-stage. Outlined in [`docs/marketing/6-month-organic-growth-plan.md`](../marketing/6-month-organic-growth-plan.md). |
| K-04 | P3 | LinkedIn 2× / week, Reddit 1× / week, outbound 25 emails / week | Distribution loop. Recurring. Started Month 1 of the 6-month plan. |
| K-05 | P3 | Sales function hire path: **Head of Sales → Manager → AE** | Roles live on [`/careers`](../../app/careers/). Don't post AE-only. Playbook: [`docs/sales/sales-team-playbook.md`](../sales/sales-team-playbook.md). |
| K-06 | P3 | Tableau dashboard tab 6 — X.com signal | Schema sample data already at [`docs/admin-dashboard/sample-data/x-posts.csv`](../admin-dashboard/sample-data/x-posts.csv). |
| K-07 | P3 | Owned chat as a moat — extend `/chat` with tool-calling for booking, lead capture mid-conversation, RAG over CHANGELOG | [CLAUDE.md §9](../../CLAUDE.md) gravity. Triggered after B-04 clears. |
| K-08 | P3 | Supreme subdomain provisioning — migrate `/supreme` to `supreme.x9elysium.com` once worth showing | [CLAUDE.md §9](../../CLAUDE.md). Currently lives at `app/supreme/` per the interim posture. |

---

## ✅ DONE — live on production (pre-2026-05-06)

> Stable, indexed, cited. Listed for context — don't re-do.

| # | Card | Live since |
|---|---|---|
| D-01 | Cloudflare GH Actions deploy pipeline (`deploy.yml`) — single source of truth for the live site | 2026-05-06 |
| D-02 | IndexNow auto-ping wired into deploy workflow (`scripts/indexnow-submit.mjs`) | 2026-05-06 |
| D-03 | `/foundation` page — credo (Vasudhaiva Kutumbakam), 5 pillars, 10 rules, the Why manifesto | 2026-04-28 |
| D-04 | `/locations/{toronto,calgary,vancouver}` pages with FAQPage schema (5 questions each) | toronto/calgary 2026-04, vancouver 2026-05-04 |
| D-05 | `/platforms/{odoo,woocommerce}` comparison pages | 2026-04 |
| D-06 | `/blog` with 26 posts including the AI-in-eCommerce category cluster | rolling |
| D-07 | `/careers` with 3 sales roles (Head of Sales, Sales Manager, AE) — narrative reconciled | 2026-05 |
| D-08 | `/changelog` (App Router) | 2026-04 |
| D-09 | Encrypted journal at `/docs/journal/` — AES at build, PIN-gated browser decrypt, hash-routed SPA viewer | 2026-04 |
| D-10 | Microsoft Clarity full-stack telemetry via `app/components/ClarityTracker.tsx` (project `nhmfksrzgs`) | 2026-04 |
| D-11 | X.com automation: `x-post.yml` + `x-sync.yml` + `data/tweets.json` | 2026-04 |
| D-12 | Local docs viewer (`npm run docs`) at `localhost:4000/docs` — never deploys | 2026-04 |
| D-13 | `not-found.tsx` real 404 page (with `wrangler.toml` `not_found_handling = "404-page"`) | 2026-04 |
| D-14 | Static export (Next.js 14 App Router → `output: "export"` → `out/`) on Cloudflare Workers Static Assets | 2026-03 |
| D-15 | Hand-tuned [`CLAUDE.md`](../../CLAUDE.md) as the operating contract — never `/init`'d, never auto-generated | rolling |

---

## How to update this board

1. **A card moves columns** → update the row, leave it linked from CHANGELOG.
2. **A card finishes** → strike it from BLOCKED/DOING/QUEUED, add the equivalent row to DONE — live with a date.
3. **A new task is born** → add it to the column it starts in, with a priority tag and a one-sentence "why."
4. **A priority changes** → re-sort within the column. P0/P1 always at top of their column.
5. **Push the change.** This file is `docs/`-only — it lands on `main` without triggering a deploy ([CLAUDE.md §8](../../CLAUDE.md) `paths-ignore`).

> *The kanban is downstream of CLAUDE.md and the CHANGELOG. If those two diverge from this file, this file is wrong — fix it, don't override them.*

---

## Today, in one sentence

**Production is 14 commits stale. The single biggest unlock for the next 14 days is B-01 — provisioning two GitHub repo secrets. Everything else (B-02 through B-04, the May cornerstone N-04, the schema audit N-02) compounds 10× the moment that one row clears.**

Until then: shadow inventory grows, code-side work continues in parallel ([N-01](#n-01) → [N-04](#n-04) ranked by leverage), and the live site keeps rendering the 2026-05-06 build. The novel keeps writing itself; the printer is just unplugged.

---

*Cross-references: [CLAUDE.md §1, §7, §9, §10](../../CLAUDE.md); [`docs/progress/CHANGELOG.md`](../progress/CHANGELOG.md); [`docs/plans/next-steps-2026-05-09.md`](next-steps-2026-05-09.md); [`docs/marketing/6-month-organic-growth-plan.md`](../marketing/6-month-organic-growth-plan.md); [`docs/deployments/cloudflare-deploy.md`](../deployments/cloudflare-deploy.md); [`docs/branding/branding.md`](../branding/branding.md).*
