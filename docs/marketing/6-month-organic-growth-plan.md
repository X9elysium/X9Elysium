# X9Elysium — 6-Month Organic Growth Plan

**Generated:** 2026-05-02
**Owner:** Darshan Patel
**Horizon:** 2026-05-05 → 2026-11-02 (Months 1–6)
**North-star metric:** 10–15 qualified Shopify Plus inbound conversations per month by Month 6 (from a current baseline near zero), with a documented mix of Shopify Partner referrals, organic SERP traffic, AI-search citations, and LinkedIn / Reddit attribution.

> Built on top of the four audit reports already in `/docs/audits/` (FULL-AUDIT, GEO-AUDIT, GEO-TECHNICAL, marketing-audit-2026-05-02). This plan assumes the content fixes shipped on 2026-05-02 are live (metadata on /services /work /contact, reconciled 30+/95%/$5M+ stats, founder-led hero, FAQPage + OfferCatalog JSON-LD, llms.txt rewrite, sitemap including /services /work).

---

## Strategic frame

Three audits converged on the same conclusion: **the technical and schema foundation is unusually strong, the content tier and the third-party proof tier are unusually thin.** The growth ceiling isn't traffic — it's *trust at the moment a $5–50M GTA / Western Canadian DTC brand evaluates a shortlist*.

A 2-person founder-led agency cannot win on volume of content or paid spend. It wins on three compounding loops:

1. **Authority loop** — one cornerstone piece per month that nobody else in Canadian Shopify Plus has written, and that AI engines (Perplexity, ChatGPT, Gemini) can cite verbatim.
2. **Distribution loop** — founder LinkedIn cadence + targeted Reddit answers + 1 quarterly podcast/teardown channel collab. Each post points back to one of the cornerstone pieces.
3. **Proof loop** — Shopify Partner directory listing + Clutch profile + 3 named permissioned case studies + Google Business Profile. These are what a buyer Googles before the discovery call.

Every initiative below ties to one of those three loops. **If a tactic doesn't compound into all three, it gets cut.**

---

## Monthly cadence (the engine)

This is the recurring weekly rhythm running in parallel with the month-by-month plan below. Don't skip it — it's the engine, the project plan is what runs on top of the engine.

| Cadence | Channel | Owner | Output |
|---|---|---|---|
| 2× / week | Founder LinkedIn (Darshan) | DP | Operator-grade post: a war story, a teardown excerpt, a lesson from a current engagement, or a thread on one of the cornerstone pieces |
| 1× / week | Reddit (r/shopify, r/ecommerce, r/entrepreneur, r/Toronto, r/Calgary) | DP | Substantive answer to a real merchant question — not promotional, signed with site URL only when relevant |
| 1× / week | Outbound | DP | 25 personalized cold emails to $5–50M DTC brands sourced from BuiltWith (Magento / BigCommerce / older Shopify) + Apollo |
| 1× / month | Cornerstone content | Both | One ~3,000+ word pillar piece (see content calendar below) |
| 1× / month | Newsletter | DP | "Field Notes" digest: 3 lessons from current engagements + 1 highlighted blog piece + 1 GTA / Canadian DTC industry observation |
| 1× / quarter | Tech-partner co-marketing | Both | Co-author one teardown / webinar with a Shopify ecosystem partner (Klaviyo, Gorgias, ReCharge, Yotpo) |
| 1× / quarter | Toronto / GTA in-person | DP | Speak or attend Shopify Toronto Meetup, eTail Canada, DTC GTA, or Retail Council of Canada event |

Dashboard for the engine: track in a simple Google Sheet — `linkedin_posts`, `reddit_answers`, `outbound_sent`, `cornerstone_published`, `inbound_conversations`, `closed_won`. Review weekly with Adhvait, Sunday evenings.

---

## Month 1 — Foundation hardening (May 5 – June 1)

**Theme:** Repair credibility surface. Ship the third-party proof assets that take the longest to mature. Start the content + LinkedIn engine.

### Content & site
- ✅ **(2026-05-02 — shipped)** Reconcile homepage stats to 30+ / 95% / $5M+ across Hero, WhyChooseUs, Work, llms.txt
- ✅ **(2026-05-02 — shipped)** Convert /services /work /contact to server components with per-page metadata + canonical
- ✅ **(2026-05-02 — shipped)** Add `OfferCatalog` + `FAQPage` JSON-LD to /services
- ✅ **(2026-05-02 — shipped)** Delete legacy `post-1`…`post-10` template files; 410 their URLs in `_redirects`
- ✅ **(2026-05-02 — shipped)** llms.txt rewrite (founder-led wedge, reconciled stats, FAQ block, real published posts only)
- ✅ **(2026-05-02 — shipped)** Sitemap: add /services, /work; pin static `lastmod` dates instead of `new Date()`
- [ ] Build the `/locations/vancouver` page — copy + LocalBusiness schema modeled on Toronto and Calgary. Vancouver shows up in llms.txt and copy but has no landing page; this is wasted local intent.
- [ ] Ship one **named, permissioned case study** at `/work/[slug]` — real client logo, real headshot quote, one verified metric. Worth more than all six anonymized testimonials combined. Targeted clients to ask in the next two weeks: top three current accounts.
- [ ] Strip the per-quote `metric` badges from `Testimonials.tsx` (anonymized + specific numbers reads as fabricated to AI evaluators and to sharp buyers).
- [ ] Wire `NEXT_PUBLIC_CALCOM_URL` in Cloudflare project env so the seven `BookingButton` CTAs flip from form-routing to actual calendar.

### Third-party proof (highest leverage)
- [ ] **Shopify Partner directory listing** — claim and complete the public profile; apply to the Plus Partner track (review window is weeks). See `docs/marketing/third-party-listings.md` for the full checklist.
- [ ] **Clutch profile** — claim, complete, request 5 verified reviews from past clients.
- [ ] **Google Business Profile** — claim for 28 Ann St, Mississauga; populate hours, services, photos, posts.
- [ ] **LinkedIn company page** — create the X9Elysium LinkedIn company page (placeholder URL is in `config/social.json`); add it to JSON-LD `sameAs` and to the Footer connect column.
- [ ] **Bing Webmaster + IndexNow** — verify the property in Bing Webmaster Tools, submit sitemap, generate `/.well-known/indexnow-key.txt` and ping on every deploy. ChatGPT search and Bing Copilot index off Bing — this is the single fastest path into AI search.

### Engine
- Start **2x/week** Darshan LinkedIn cadence (Tue + Thu mornings). Topics: founder-led economics, last week's migration learnings, one teardown of a public Shopify store.
- Start **1x/week** Reddit answers (Wednesday).
- Start **25/week** outbound cold emails (Monday batch). Sequence: 1 personalized email → 7-day follow-up → 14-day soft break.

### Month-1 success criteria
- Shopify Partner profile submitted (Plus track approval can take 4–8 weeks — start it now)
- Clutch profile live with 3+ reviews
- 8 LinkedIn posts shipped, 1+ above 5,000 impressions
- 100 outbound emails sent, ≥ 2 replies
- Vancouver location page live, sitemap-indexed
- 1 named case study live OR 1 client signed-off in writing for Month 2 publish

---

## Month 2 — Topical authority kickoff (June 2 – June 30)

**Theme:** Start the cornerstone content factory. First decision-stage piece + first comparison piece.

### Cornerstone content (Month 2 publish target)
1. **"Magento 2 to Shopify Plus Migration: The Canadian Operator's Field Guide"** — 3,500+ words, real CAD cost ranges, real timeline phases, JSON-LD `HowTo` markup, embedded migration cost calculator (client-side React), and a downloadable checklist gated by email. Targets the highest commercial-intent Canadian search ("magento to shopify plus migration cost canada", "magento shopify migration agency", "shopify plus migration timeline").
2. **"Shopify Plus vs BigCommerce Enterprise: A Decision Framework for $5–50M Canadian Retailers"** — 2,500+ words, comparison table marked up as `Table` schema, FAQ block, embedded "which is right for you?" quiz. Decision-stage searches that AI engines disproportionately cite.

### Site
- [ ] Add `Person` schema for Darshan and Adhvait (currently referenced as `sameAs` only). `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout` — strongest first-party E-E-A-T signal that AI engines verify.
- [ ] Add `aggregateRating` + a small number of verified `Review` items to the Organization graph (sourced from Clutch reviews, once 5+ are live).
- [ ] Build a **Shopify Plus Migration Readiness Scorecard** at `/migration-readiness` — 12-question quiz, 5-axis score, email-gated PDF report. Lives entirely client-side; PDF generated by a Cloudflare Worker. Captures the 90% of visitors not yet ready to fill the contact form.

### Third-party proof
- [ ] **Bonsai / Genoa / Ladder.ca** competitor monitoring — set up Ahrefs alerts on their highest-ranking pages so any time they rank for a query you should also rank for, you know.
- [ ] Claim **Goodfirms** + **DesignRush** profiles (lower-leverage than Clutch but cheap to claim, and both feed AI engines).
- [ ] Claim **Built In Toronto** company profile.

### Engine
- LinkedIn keeps 2×/week. Add 1× quarter-end "biggest lesson" long-form post (1,000+ words) on the last Friday of each month.
- Reddit cadence holds at 1×/week.
- Outbound shifts to 30/week and adds a LinkedIn DM warm-touch sequence (connect → value DM after 7 days → soft pitch after 30 days).
- Newsletter "Field Notes" #1 ships in Month 2.

### Month-2 success criteria
- 2 cornerstone pieces live, each with full schema (Article, FAQPage, HowTo or Table where relevant)
- Migration Readiness Scorecard live with ≥ 25 completions
- 5 named Clutch reviews
- 4–8 inbound conversations (form fills + Cal.com bookings + cold-email replies)
- First Shopify Partner referral OR first Clutch-sourced inquiry

---

## Month 3 — Local + AI search wedge (July 1 – July 28)

**Theme:** Own Toronto / Calgary / Vancouver local intent. Make AI engines cite X9Elysium for "best Shopify Plus agency in Canada" / "Toronto Shopify migration agency" type prompts.

### Cornerstone content
3. **"The Real Cost of a Shopify Plus Agency in Canada (2026 Pricing Benchmarks Update)"** — refresh the existing post with named price ranges per service tier in CAD, USD, and Plus retail-price contextualization. Add `Article` + `FAQPage` schema, table marked up as `Table` schema. Highest commercial-intent piece in the Canadian segment — refresh quarterly.
4. **GTA-targeted local piece — "How GTA Retailers Should Think About Shopify Plus in 2026"** — original survey data if possible (10–25 GTA DTC brands answering 5 questions). Even a small first-party dataset gets cited disproportionately by AI engines because the data exists nowhere else.

### Site
- [ ] Add **FAQPage schema** to /locations/toronto, /locations/calgary, /locations/vancouver (4–6 questions each, location-specific: cost, timeline, retainer cadence, on-site vs remote). Perplexity + Google AIO disproportionately surface FAQ-marked passages from local-intent pages.
- [ ] **HSTS + security headers** — add via `next.config.js` `headers()` (or Cloudflare Worker rule). The technical audit flagged this; SSL trust signal does feed AI citation decisions.
- [ ] Convert hero/team images to **WebP/AVIF** via Next `<Image>` once `images.unoptimized: true` can be relaxed (post static-export → Cloudflare assets cutover already done).
- [ ] Drop the duplicate logo files (`logo-1.png`, `logoo.jpg`, `flower.jpg`, `Instagram.html`, `456441839…(1).jpg` in repo root).

### Third-party proof
- [ ] Submit X9Elysium to **G2** (services category) — once Clutch reviews are syndicated, G2 follows them automatically.
- [ ] **Apply to Klaviyo Master / Gorgias Premier / ReCharge Premier partner programs.** Each unlocks a vendor-led referral pipeline + a directory listing on a high-DA partner page that AI engines cite as authority signal.
- [ ] Claim profile on **The Manifest**, **TopDevelopers.co**, and **Pangea**. Diminishing returns past Clutch but together they widen the brand entity surface AI engines see.

### Engine
- Start a **monthly podcast guest tour** — 2 podcast appearances per quarter (Canadian DTC podcasts: 2X eCommerce, Shopify Masters, Direct to Consumer Canadian episodes; Toronto / Calgary local biz podcasts).
- LinkedIn cadence: introduce a **monthly retrospective post** ("April: 4 stores migrated, 3 audits, 1 hard lesson") — operator-grade, builds public credibility through specific numbers.

### Month-3 success criteria
- AI search test: query "best Shopify Plus agency in Toronto" / "Shopify Plus migration agency Canada" in Perplexity, ChatGPT search, Gemini. X9Elysium should appear in at least 1 of the 3 by month-end. (Monthly tracking goal.)
- 3+ cornerstone pieces live with full schema
- Vancouver location page live with FAQPage schema
- 6–10 inbound conversations, 1+ closed-won project signed in the month
- 2 podcast appearances booked or recorded

---

## Month 4 — Comparison cluster + retainer offer (July 29 – August 25)

**Theme:** Build the decision-stage comparison cluster. Productize the retainer offer to break the project-revenue ceiling.

### Cornerstone content
5. **"Shopify Plus vs Salesforce Commerce Cloud (B2C Edition): An Honest Comparison"** — 2,500+ words, comparison table, "when to choose which" decision tree. Decision-stage piece for the $20M+ retailer segment.
6. **"Founder-Led vs Mid-Tier Agency for Shopify Plus: A Buyer's Lens"** — second-person, talks the buyer through the actual tradeoff. Doubles as bottom-of-funnel content + LinkedIn long-form anchor.

### Site
- [ ] Build out the `/compare/[a]-vs-[b]/` programmatic SEO cluster: 6 comparison pages (Shopify Plus vs BigCommerce, Magento, SFCC, WooCommerce; Hydrogen vs Liquid; Shopify POS vs Square / Lightspeed). Each page = 2,000+ words, `Article` + `Table` + `FAQPage` schema. Use the `seo-competitor-pages` skill in this environment as the template engine.
- [ ] **Productize "Performance-as-a-Service" retainer** at $6–12k/mo on /services. New Engagement model card: "Retained Partner — Performance-as-a-Service." Includes Core Web Vitals optimization, A/B testing, monthly conversion review. Decouples revenue from new-business hours.
- [ ] Anchor the Discovery Audit at **CAD $4,500 / 10 business days** as a fixed-price product on /services. (Currently the only engagement with no price anchor.) Cold inbound stalls without one.

### Third-party proof
- [ ] Apply to **Shopify Plus Partner Slack** and the **Shopify Partner Forum** with a non-promotional intro. Be present, answer 2–3 questions per week.
- [ ] Submit a Wikipedia draft for X9Elysium *only after* there is independent press coverage (a real industry article quoting the agency, not a paid placement). Drafted in Month 4, may not publish until Month 6+.

### Engine
- Outbound shifts to a **second sequence** targeting "Magento agency relationship" pain (BuiltWith filter: Magento + recent platform-shopping signals — Shopify trial sub-domain, Klaviyo recently added, etc.).
- LinkedIn: 2 carousel posts per month from this point on (carousel reach is structurally higher than text on LinkedIn 2026).
- "Field Notes" newsletter hits issue 3 — start cross-posting to LinkedIn newsletter for distribution.

### Month-4 success criteria
- 5 cornerstone pieces live, comparison cluster started (3+ comparison pages live)
- Performance-as-a-Service retainer live on /services
- $4.5k Audit price anchor live
- 8–12 inbound conversations, 2+ closed-won
- LinkedIn organic followers crossing 1,500 (from baseline ~300)

---

## Month 5 — Social proof flywheel (August 26 – September 22)

**Theme:** Convert traffic into branded-search demand and visible social proof. Make people Google "X9Elysium" by name.

### Cornerstone content
7. **"State of GTA DTC: A 2026 Survey of 50 Canadian Brands"** — first-party survey of 30–50 GTA / Canadian DTC operators. Fields: revenue band, platform, biggest growth blocker, agency relationships, AI usage. Publish as a 4,000+ word report with anonymized data, multiple charts, and a downloadable PDF. **This is the highest-leverage backlink magnet of the quarter** — first-party data with a survey methodology gets cited everywhere.
8. **"How To Run a Shopify Plus Migration With Zero Downtime"** — operator playbook with `HowTo` schema, real cutover sequence diagrams, and links to 2 prior named case studies once Q3 case studies have been collected.

### Site
- [ ] Add the **State of GTA DTC** report as a permanent `/insights/state-of-gta-dtc-2026` page (not a blog post — a data report). Schema: `Article` + `Dataset` + `WebPage`.
- [ ] Land **second + third named case studies** at `/work/[slug]`.
- [ ] Add `aggregateRating` to the homepage Organization graph using verified Clutch + Google reviews as source.

### Third-party proof
- [ ] **Press push for the State of GTA DTC report** — pitch the data to: Retail Insider Canada, Modern Retail, Retail Dive, BetaKit, Strategy magazine, Toronto Star Business, the Globe and Mail Report on Business. One placement = 1 dofollow + 1 brand entity citation in tier-1 Canadian press.
- [ ] Pitch a **HARO/Connectively** profile and reply 3×/week with operator commentary. Free press surface, AI engines treat publications that quote you as sources.

### Engine
- Run a **3-month look-back analysis** on which LinkedIn topics, Reddit subreddits, and Google queries actually drove inbound. Cut anything that didn't compound.

### Month-5 success criteria
- State of GTA DTC report shipped + at least 1 tier-1 press placement (Strategy, BetaKit, Retail Insider)
- 3 named case studies live total
- Branded search volume on "X9Elysium" reaching 100+ searches/mo (track in GSC)
- 10–14 inbound conversations, 3+ closed-won

---

## Month 6 — Compounding + decision making (September 23 – November 2)

**Theme:** Measure what compounded, kill what didn't, decide on Hire #1.

### Cornerstone content
9. **Refresh the Toronto + Calgary listicles** with 6-month-update notes ("Updated September 2026 — added X, removed Y, changed price ranges"). Refreshed posts get a freshness boost in both Google and AI engines.
10. **"The Founder-Led Shopify Plus Playbook: 30 Engagements In, Here's What We've Learned"** — Darshan & Adhvait co-authored capstone. Anchor piece for Year 1 of the agency in its current form. Full-length (~5,000 words). Doubles as the LinkedIn launch of the next 6-month plan.

### Site
- [ ] Roll up a **Year-in-Review report** at `/2026-review` (or as a private journal entry, your call).
- [ ] Add **video** to /work and /services (founder talking heads, 60–90s each, hosted on YouTube + embedded). Video on landing pages is the single biggest 2026 lift in time-on-page and in AI evaluator confidence.
- [ ] Submit IndexNow pings on a deploy hook for every refreshed post.

### Third-party proof
- [ ] At least 2 **podcast guest appearances** on Canadian DTC / commerce podcasts.
- [ ] **YouTube channel** stood up with a backlog of 4–6 store teardowns of public Shopify stores (educational, not competitive). YouTube is where AI engines pull video citations from for Google AIO and ChatGPT.
- [ ] **Wikipedia draft** submitted (only if independent coverage from Month 5 went well).

### Engine
- Decide on **Hire #1** trigger. The Marketing audit set the trigger at $40k MRR retainer book. If Performance-as-a-Service has hit 5+ active retainers (~$30–60k MRR), pull the trigger on a near-shore senior dev or junior. If not, postpone to Q2 2027 and stay a 2-person shop.
- Restart planning for **Months 7–12** (Q4 2026 + Q1 2027): the next 6-month plan starts 2026-11-03.

### Month-6 success criteria
- 10+ cornerstone pieces published over 6 months (1 per month + 4 from Months 2 + 4)
- Comparison cluster of 6+ pages live
- 3+ named permissioned case studies live
- Shopify Partner Plus track approved
- Branded search "X9Elysium" cumulatively 600+ in GSC over 6 months
- 12–18 qualified inbound conversations in Month 6 (from a Month 0 baseline near zero)
- Closed-won total over 6 months: 8+ projects in the $40k–$120k range, plus 2–4 retainers

---

## What gets measured (the dashboard)

Single Google Sheet tab "X9 Growth Dashboard" — owned by Darshan, updated weekly Sunday evenings. Columns:

| Metric | Source | Cadence |
|---|---|---|
| LinkedIn posts shipped | Manual count | Weekly |
| LinkedIn followers (DP + agency page) | LinkedIn analytics | Weekly |
| Reddit answers shipped | Manual count | Weekly |
| Outbound emails sent | Apollo / hubspot / google sheet | Weekly |
| Outbound replies / meetings booked | Same | Weekly |
| Cornerstone pieces shipped (rolling) | Repo `/content/posts/` count | Monthly |
| GSC impressions on Shopify-Plus + GTA queries | Search Console | Monthly |
| Branded "x9elysium" search volume | Search Console | Monthly |
| Clutch reviews (count + score) | Clutch | Monthly |
| Inbound conversations (form + Cal.com + email) | Web3Forms + email + Cal.com export | Weekly |
| Inbound → discovery call conversion | Manual | Monthly |
| Discovery call → closed-won conversion | Manual | Monthly |
| AI search citation count (Perplexity / ChatGPT / Gemini for tracked queries) | Manual every Friday | Weekly |

The 3 numbers that matter most: **inbound conversations**, **closed-won projects**, **Shopify Partner referrals**. Everything else is leading-indicator support.

---

## Realistic 6-month revenue model

Based on the marketing-audit-2026-05-02 figures (which are themselves inside Canadian DTC industry benchmarks):

| Channel | Month 6 monthly run-rate (low) | Month 6 monthly run-rate (high) |
|---|---|---|
| Shopify Partner Plus referrals | 1 lead → $40k project / 3 mo | 2 leads → $80k project / mo |
| Clutch + directory inbound | 1 lead / 3 mo at $40k | 2 leads / mo at $50k each |
| Outbound (25–30/wk steady-state) | 1 closed / 2 mo at $50k | 2 closed / mo at $60k each |
| Cornerstone content + LinkedIn organic | 1 lead / mo at $40k | 3 leads / mo at $50k each |
| Productized Audit ($4.5k) feeding into projects | 2 audits / mo | 4 audits / mo (50% project-convert) |
| Performance-as-a-Service retainers | 2 active at $7k MRR | 5 active at $9k MRR |

**Conservative six-month total new revenue (project + retainer):** ~CAD $250k–$400k
**Aggressive six-month total new revenue:** ~CAD $700k–$1.1M (matches the marketing-audit upper bound)

The variance is execution quality on the engine, not strategy. The strategy is straightforwardly correct; what makes or breaks it is whether the 2x/week LinkedIn + 25/week outbound + 1/month cornerstone *actually ship every week for 26 weeks straight*.

---

## What this plan deliberately does NOT do

- **No paid ads.** Founder-led 2-person agency at this stage; budget goes into directory listings, podcast travel, and freelance editor for cornerstone pieces. Paid ads start in Year 2, not Year 1.
- **No agency rebrand or visual redesign.** The site is already premium. The bottleneck is content + proof, not design.
- **No expansion outside Canada/US in the next 6 months.** UK / EU is a separate motion that needs different content + different listings + different time zones. Park it.
- **No new service lines.** The 6 disciplines on /services are right. Adding a 7th dilutes the founder-led wedge.
- **No agency-of-record partnerships with bigger shops.** White-labeling kills the founder-led wedge — the explicit promise is "every brief delivered by the people you hire."

---

## Cross-references

- Audits: `docs/audits/FULL-AUDIT-REPORT.md`, `docs/audits/GEO-AUDIT-REPORT.md`, `docs/audits/GEO-TECHNICAL-AUDIT.md`, `docs/audits/marketing-audit-2026-05-02.md`
- Third-party listings checklist: `docs/marketing/third-party-listings.md`
- Site content workflow: `CLAUDE.md` ("Documentation Workflow")
- Per-commit logging: `docs/progress/CHANGELOG.md`
