# Next Steps — 2026-05-09

> Feature audit + prioritized next moves. Cross-checked against [`CLAUDE.md`](../../CLAUDE.md) §1, §7, §9, §10 and the [`6-month organic growth plan`](../marketing/6-month-organic-growth-plan.md).

---

## TL;DR

**The site is correct in the repo. The site is stale on production.**

Eight commits since `bba9f9c` (2026-05-06) — sanctuary, supreme, truth pass, mailto fallback, security headers, journal viewer fix, Clarity Copilot doc, audit-player consolidation — are sitting in `main` but **none have reached x9elysium.com**. The GitHub Actions workflow has been failing at `Deploy to Cloudflare` because the repo secrets are missing.

Single biggest unlock for the next 14 days isn't more code. It's **one DNS-tab-worth of provisioning by Darsh**. Until then, every code-side ship is shadow inventory.

---

## 1. Feature audit (live vs repo)

Cross-checked 2026-05-09 against [`CLAUDE.md`](../../CLAUDE.md).

### Static surface (`out/` content)

| Feature | Repo | Live | Notes |
|---|---|---|---|
| Homepage (slimmer hero, no marquee) | ✅ | ❌ stale | Latest pass on `b4afbf6` not deployed |
| `/services`, `/work`, `/contact` (truth-passed) | ✅ | ❌ stale | "certified Shopify Partner" softened in repo, still hard-claim live |
| `/about` (founded 2022, Person + FAQ schema) | ✅ | ⚠️ partial | Schema is live; copy reconcile (2022, knowsAbout) is stale |
| `/foundation` | ✅ | ✅ | Stable since 2026-04-28 |
| `/locations/{toronto,calgary,vancouver}` + FAQPage schema | ✅ all 3 | ✅ all 3 | 5 questions each — Month-3 task is **already done**, just untracked in plan |
| `/platforms/{odoo,woocommerce}` | ✅ | ✅ | |
| `/careers` (3 sales roles, narrative reconciled) | ✅ | ✅ | |
| `/blog` (26 posts, AI-in-eCommerce category) | ✅ | ✅ | |
| `/thoughts` (X.com feed + comments) | ✅ | ⚠️ partial | Page renders; comments 503 until D1 schema applied |
| `/sanctuary` (Web Audio synthesis + R2 cloud) | ✅ | ❌ 404 | Built locally; not deployed |
| `/supreme` (WebGL prismatic field, hidden) | ✅ | ❌ 404 | Built locally; not deployed |
| `/changelog` | ✅ | ✅ | |
| `/docs/journal` (encrypted, hash-routed) | ✅ | ⚠️ stale | Cross-entry link fix on `4789fe0` not live; live still 404s on `.md` clicks |
| `/docs/audits/full-audit-report` (shared AudioPlayer) | ✅ | ⚠️ stale | Bespoke `Player.tsx` is gone in repo, still rendering live |
| `not-found.tsx` 404 page | ✅ | ✅ | |

### Worker / dynamic surface

| Endpoint | Repo | Live | Blocker |
|---|---|---|---|
| `/api/health` | ✅ | ❌ 404 | Worker hasn't redeployed since 2026-05-06 |
| `/api/lead` | ✅ wired | ❌ 405 | Worker stale + missing `RESEND_API_KEY` secret |
| `/api/chat` | ✅ wired | ❌ unknown | Missing `ANTHROPIC_API_KEY` + `CHAT_PIN` |
| `/api/comments` | ✅ wired | ❌ 503 | D1 schema not applied yet |
| `/api/sanctuary/manifest` | ✅ wired | ❌ 404 | Worker stale + no R2 binding |

### Trust / SEO / GEO surface

| Asset | Repo | Live | Notes |
|---|---|---|---|
| `llms.txt` (truth-passed, no "certified", /sanctuary listed) | ✅ | ❌ stale | Live still says "X9Elysium is a certified Shopify Partner" — direct §7 violation persists in production |
| `_headers` (HSTS, CSP-adjacent, immutable cache) | ✅ | ❌ not active | First headers test against live shows zero security headers |
| `sitemap.xml` (51 URLs, /sanctuary included) | ✅ | ⚠️ unknown | Need fresh check after deploy |
| `robots.txt` | ✅ | ✅ | |
| IndexNow ping on deploy | ✅ wired | ⚠️ unfired | Workflow failure means no pings since 2026-05-06 |
| Clarity full-stack tracking | ✅ | ✅ | Project `nhmfksrzgs` collecting |

### Operational

| Surface | Repo | Live |
|---|---|---|
| GH Actions deploy workflow | ✅ exists | ❌ red — missing `CLOUDFLARE_API_TOKEN` |
| X.com automation (`x-post.yml`, `x-sync.yml`) | ✅ | ✅ running |
| Local docs viewer (`npm run docs`) | ✅ | n/a (never deploys) |

---

## 2. Where reality diverged from `CLAUDE.md` §10

These items are listed as open in §10 but the *code-side work* is already done. They're waiting on either deploy or external accounts.

| §10 item | Code-side state | What's actually blocking |
|---|---|---|
| `/api/lead` activation | Worker route exists, mailto fallback shipped | `CLOUDFLARE_API_TOKEN` for deploy, then `RESEND_API_KEY` |
| `/api/chat` activation | Worker + corpus + page exist | `CLOUDFLARE_API_TOKEN`, then `ANTHROPIC_API_KEY` + `CHAT_PIN` |
| Comments schema | Schema written; route returns 503 cleanly | `wrangler d1 execute … --file=worker/schema.sql` |
| LEADS_KV | Code is no-op-safe without it | Optional — provision when convenient |
| Cal.com URL | `BookingButton` reads env | Add `NEXT_PUBLIC_CALCOM_URL` repo secret |
| Cornerstone cadence | Engine running; no May piece yet | Code-side decision (see §4) |

These items are still genuinely open and **need Darsh to act outside the repo**:

- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` GitHub repo secrets — **the unblocker**
- Resend signup + DNS + secret
- Anthropic API key + `CHAT_PIN`
- D1 schema apply (`npx wrangler d1 execute …`)
- Shopify Partner / Clutch / GBP / LinkedIn company page
- Reddit account
- Real testimonials / named case studies / founder photos

---

## 3. Priorities for the next 14 days

Ranked by leverage. Code-side tasks I can ship without asking; external tasks Darsh confirms.

### A. Unblock production (Darsh — 30 minutes)

1. **Provision the two GH repo secrets.** [`docs/deployments/cloudflare-deploy.md`](../deployments/cloudflare-deploy.md) §1–3. The next push (or a manual workflow_dispatch) deploys all 8 queued commits in one shot. Without this nothing else matters.
2. While in the Cloudflare dashboard: confirm the Worker is bound to the same account and that `wrangler deploy` from the workflow has the right scopes.

### B. Activate dynamic surface (Darsh — 60 minutes once §A is done)

3. `wrangler secret put RESEND_API_KEY` — flips contact form from "mailto fallback" to silent POST.
4. `npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql` — flips comments from 503 to 200, comment sections render across blog/thoughts/journal.
5. `wrangler secret put ANTHROPIC_API_KEY` + `wrangler secret put CHAT_PIN` — turns `/chat` on. Voice surface in `/supreme` becomes the natural place to wire it.
6. Optional: `npx wrangler r2 bucket create x9elysium-sanctuary` + upload 3–5 calm tracks. `/sanctuary` Web Audio synthesis is already self-sufficient; this just lights up the cloud library.

### C. Code-side work I can ship while Darsh does §A–§B

7. **May cornerstone content.** [`CLAUDE.md`](../../CLAUDE.md) §10 says one piece per month, May–Nov. Most natural pick given existing content map: a foundation/voice piece, not a comparison (those are queued for June). Candidates ranked:
   - **"When To Hire a Shopify Plus Agency vs Build In-House: A Founder's Decision Tree"** — decision-stage, Canada-specific, no client dependency. Best fit for May.
   - **"The Real Cost of a Bad Shopify Plus Migration"** — pain-stage, original framing. Strong, but easier to write *after* one named case study lands.
   - **"Why $5–50M Shopify Stores Outgrow Their Agencies"** — wedge piece, too sales-y for May; better as a later distribution-loop anchor.
8. **Person schema for Adhvait.** Darshan has Person markup in `/about`; Adhvait is `sameAs`-only. Add a second `Person` graph with `jobTitle`, `worksFor`, `knowsAbout`, `sameAs` (his LinkedIn). Pure E-E-A-T lift, zero external dep.
9. **`Article` + `BreadcrumbList` graph audit** across the 26 blog posts. Spot-check that every post has an `image` URL, `datePublished`, `dateModified`, named `author` `Person`, and a `publisher` `Organization` with logo. Anything missing is a citation-readiness gap.
10. **Per-post `speakable`** specs (CSS selector form) on the top 5 cornerstones (`shopify-plus-migration-guide-gta-retailers`, `shopify-agency-cost-canada-2026`, `best-shopify-plus-agencies-toronto-2026`, `unified-commerce-vs-omnichannel-canadian-retailers`, `claude-daily-workflow-shopify-1m-5m-store-owners`). Speakable is the single most-cited schema by AI Overviews.

### D. Engine work (Darsh — recurring)

11. LinkedIn 2× / week, Reddit 1× / week, outbound 25 emails / week per [`docs/marketing/6-month-organic-growth-plan.md`](../marketing/6-month-organic-growth-plan.md) Month 1.
12. Apply for Shopify Partner directory + Clutch profile (4–8 week review windows — start now).

---

## 4. May cornerstone — recommended pick

**"When To Hire a Shopify Plus Agency vs Build In-House: A Founder's Decision Tree"**

- **Why this one for May:** the foundation ships are done (truth pass, sanctuary, supreme). May should harden the *decision-stage* surface before June drops the migration + comparison cornerstones. This piece is the natural prequel — it's the question a founder asks before they ask "Magento → Plus".
- **Word target:** 2,800–3,200.
- **Schema:** `Article` + `FAQPage` + `BreadcrumbList`, with a 5-axis decision matrix marked up as `Table` schema.
- **Internal links:** to `/services`, `/work`, the cost-in-Canada post, the Toronto/Calgary location pages.
- **Voice:** §6 — terse, lowercase, sentence-level. Naval cadence in long-form. No fabricated metrics.
- **Decision authority:** §2 — ship draft to `/blog/when-hire-shopify-plus-agency-vs-build-in-house`, review with Darsh on the framing of the matrix axes.

If it lands by 2026-05-23, June can absorb both planned cornerstones without sliding.

---

## 5. What I'm publishing in this commit

- This brief, at `docs/plans/next-steps-2026-05-09.md`.
- Tick off Month 1 + Month 3 boxes in `docs/marketing/6-month-organic-growth-plan.md` for items already shipped (Vancouver page, FAQPage schema on all 3 location pages, metric-badge strip on Testimonials).
- Bump `STATIC_LASTMOD` in `app/sitemap.ts` for the routes whose copy/schema actually moved on 2026-05-07–09 (about, work, contact, services, foundation, careers, locations).
- CHANGELOG entry.

The push goes to `main`; deploy is still gated on the missing CF token. The backlog grows by one more queued commit until that secret is provisioned.

---

*Cross-references: [`CLAUDE.md`](../../CLAUDE.md) §1 (jobs), §7 (hard rules), §9 (arcs), §10 (current state); [`docs/progress/CHANGELOG.md`](../progress/CHANGELOG.md); [`docs/marketing/6-month-organic-growth-plan.md`](../marketing/6-month-organic-growth-plan.md); [`docs/deployments/cloudflare-deploy.md`](../deployments/cloudflare-deploy.md).*
