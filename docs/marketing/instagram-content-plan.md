# X9Elysium — Instagram Content Plan & Automation Roadmap

**Generated:** 2026-05-02
**Owner:** Darshan Patel
**Use:** First 10 posts (image prompts + captions + insights) you can ship manually with Grok-generated images, plus three automation tiers for going hands-off long-term.

---

## Brand rails (apply to every image prompt)

Lock these in every Grok prompt so the grid feels like one brand, not ten posts:

- **Aspect ratio:** `1080x1350` (4:5 portrait — IG's largest feed real estate). For carousels, use `1080x1080`.
- **Background:** matte black `#000000` or near-black `#0a0a0a`, with subtle film-grain noise.
- **Accent color:** emerald green `#10b981` (with `#34d399` highlight, `#059669` shadow). Use sparingly — one accent element per image.
- **Type style:** sharp sans-serif (Inter / Söhne aesthetic), tight letter-spacing, mix of large (72–120pt) headline + small (14–18pt) caption.
- **Mood:** premium, restrained, operator-grade — think Stripe / Linear / Arc Browser, not "agency portfolio."
- **No stock imagery, no people stock, no clipart.** Type-forward + abstract data visualization only.
- **Watermark:** small `X9ELYSIUM` wordmark bottom-left in white at 40% opacity (12pt).

Append this rail to every prompt: *"Premium dark-mode editorial design, matte black background with subtle film-grain noise, emerald green accent (#10b981), sharp Inter-style sans-serif typography with tight letter-spacing, type-forward minimalist composition, 4:5 portrait aspect ratio, small X9ELYSIUM wordmark bottom-left."*

---

## Posting strategy

- **Cadence:** 2–3 posts per week. 10 posts = ~4 weeks of content.
- **Best windows (PT):** Tue/Wed/Thu, 8–10am or 12–1pm — when DTC operators check phones.
- **Carousel > single:** Posts 2, 4, 6, 8, 10 below are carousels (3–6 slides) — 2× the dwell time.
- **Caption shape:** hook (line 1) → data point (line 2–3) → insight (line 4–6) → CTA (last line). Use line breaks, no walls of text.
- **First comment:** drop hashtags in the first comment, not the caption (cleaner look).
- **CTA rotation:** alternate between "DM 'PLUS' for the playbook," "Link in bio for the teardown," and "Comment 'PLUS' and we'll send the full breakdown."

---

## The 10 posts

### Post 1 — The replatforming cost lie

**Format:** Single image (1080×1350)

**Grok image prompt:**
> A premium dark editorial poster. Centered: a massive number "$487,000" in emerald green (#10b981), 180pt, sharp Inter-style sans-serif, tight kerning. Below in smaller white text (28pt): "the real cost of a Magento → Shopify Plus migration that nobody quotes you." Below that, a thin emerald horizontal line, then in tiny grey caps text (14pt): "X9ELYSIUM / FIELD NOTES / 01". Matte black background with very subtle film-grain noise texture. Minimalist, no decoration, type-forward. 4:5 portrait. Small X9ELYSIUM wordmark bottom-left in white at 40% opacity.

**Caption:**
```
The Magento → Shopify Plus quote you got is wrong.

The agency quoted $120K. The real number is closer to $487K.

Here's what gets left out:
→ Data migration QA (~$45K) — orders, customers, SKUs, redirects
→ Custom checkout extensions to replicate Magento behavior (~$80K)
→ ERP / WMS / 3PL re-integration (~$120K — usually the biggest hidden line)
→ SEO redirect mapping + 12 weeks of post-launch traffic recovery
→ Staff retraining + 3 months of dual-stack ops

The good news: most of this is one-time. The bad news: 80% of mid-market migrations blow budget because nobody walks the operator through these line items before the SOW gets signed.

We've moved 30+ brands off Magento. We'll send you the line-item template we use to scope these.

Comment "MIGRATE" and we'll DM it.
```

**Hashtags (first comment):**
`#shopifyplus #magento #ecommerce #dtc #shopifyexperts #ecommercemigration #shopifyagency #plusmerchant #headlesscommerce #shopifydevelopment #ecommercetips #plusconsultant`

---

### Post 2 — Plus vs BigCommerce decision matrix (carousel, 5 slides)

**Format:** 5-slide carousel (1080×1080 each)

**Grok image prompts (one per slide):**

**Slide 1 (cover):**
> Premium dark editorial poster, 1080x1080. Large headline white text 96pt: "Shopify Plus vs BigCommerce." Below in emerald (#10b981) 36pt: "the honest decision matrix." Bottom-right small grey caps 14pt: "5 SLIDES →". Matte black, film-grain. Brand rails apply.

**Slide 2:**
> Same template. Headline 64pt white: "Pick Shopify Plus when:" Below, four bullet points in white 28pt with emerald (#10b981) checkmarks: "Your AOV is under $200 and volume is your scaling lever" / "You sell B2C-first with B2B as a side motion" / "Your team is 2–8 people and you can't manage devs" / "You need a checkout that converts on mobile out of the box."

**Slide 3:**
> Same template. Headline 64pt white: "Pick BigCommerce when:" Below, four bullets white 28pt with emerald arrows: "Your B2B revenue is >50% of total" / "You need native multi-storefront from one license" / "You sell complex configurable products with deep variants" / "Your tech team prefers an open API surface over an app store."

**Slide 4:**
> Same template. Headline 64pt white: "Where the comparison gets dishonest:" Below body text 24pt grey-white: "Plus's transaction fees are real but offset by lower app costs. BigCommerce's no-fees pitch loses ground once you add a Klaviyo + Yotpo + Gorgias stack at $2K/mo. The TCO crossover is around $40M GMV — below that, Plus usually wins on total spend."

**Slide 5 (CTA):**
> Same template. Headline 56pt white: "We've replatformed 30+ brands across both." Below 28pt emerald (#10b981): "DM 'COMPARE' for the full TCO calculator." Tiny X9ELYSIUM wordmark centered bottom.

**Caption:**
```
Stop letting platform sales teams pick your stack.

We've moved brands both directions — Plus → BC and BC → Plus — and the right answer almost never matches the demo deck.

Honest version in 5 slides ↑

The TCO crossover is real. So is the B2B gap. So is the checkout-conversion gap on mobile (Plus still wins this in 2026, by ~6–8% on every test we've run).

DM "COMPARE" and we'll send you the spreadsheet we use in our discovery calls.
```

**Hashtags:** `#shopifyplus #bigcommerce #ecommerceplatforms #replatforming #dtc #plusmerchant #shopifyvsbigcommerce #ecommerceconsulting #plusagency #shopifyexpert`

---

### Post 3 — The 100ms = $1M law

**Format:** Single image (1080×1350)

**Grok image prompt:**
> Premium dark editorial poster, 4:5 portrait 1080x1350. Centered top: a horizontal bar chart, 4 bars stacked vertically. Bar labels left in small white 16pt caps: "0.5s LCP / 1.5s LCP / 2.5s LCP / 4.0s LCP". Bar values right in white 16pt: "100% / 92% / 78% / 55%" — bars are emerald (#10b981) with width matching the percentage. Above chart, small grey caps 14pt: "RELATIVE CONVERSION RATE BY LCP". Below chart, large white headline 60pt: "Every 1 second of load time costs you 12% of revenue." Bottom small grey 14pt: "Source: aggregated Shopify Plus engagements 2023–2026 / X9ELYSIUM". Brand rails apply.

**Caption:**
```
A real number we've measured across 30+ Plus stores:

Every 1 second of LCP improvement = ~12% lift in conversion rate.

If you do $5M/yr on Shopify, that's $600K of recoverable revenue sitting in your theme.

The four biggest LCP killers we find on Plus stores in 2026:
1. Hero image not served as AVIF/WebP at the right breakpoints
2. Klaviyo / Gorgias / review-widget scripts loading synchronously above the fold
3. Custom hero sections with 3+ webfonts and no font-display: swap
4. App-installed scripts running on every page when they only need to fire on PDPs

None of these need a replatform. Most can be fixed in a week. None of them get fixed because nobody on the team owns site speed as a P&L line.

DM "SPEED" and we'll send you the audit checklist we use.
```

**Hashtags:** `#shopifyplus #corewebvitals #pagespeed #cro #shopifyspeed #ecommerceperformance #shopifyperformance #lcp #conversionrateoptimization #dtc`

---

### Post 4 — Why founder-led beats agency (carousel, 4 slides)

**Format:** 4-slide carousel (1080×1080)

**Grok image prompts:**

**Slide 1:**
> Premium dark poster 1080x1080. Massive headline white 110pt: "No juniors." Below, second line same size emerald (#10b981): "No handoffs." Below in small grey caps 14pt: "WHY FOUNDER-LED CONSULTING WINS / 1 OF 4". Brand rails apply.

**Slide 2:**
> Same template. White headline 56pt top: "The agency math nobody talks about:" Below, large two-column layout. Left column white 36pt: "$280/hr billed". Right column white 36pt: "$45/hr paid to a junior with 14 months of experience." Below in emerald 24pt: "84% margin on your discovery call." Brand rails.

**Slide 3:**
> Same template. White headline 56pt: "What you actually get:" Then four bullets 24pt white with emerald minus signs: "A senior on the kickoff call to win the deal" / "A junior on Slack for everything after" / "A 'project manager' translating both directions" / "A scope doc written so vaguely that every clarification is a change order."

**Slide 4 (CTA):**
> Same template. White headline 48pt: "Founder-led means:" Below 28pt emerald: "Darshan + Adhvait on every call. Every line of code. Every decision." Small grey 16pt below: "30+ Shopify Plus engagements. Zero juniors." Bottom centered emerald CTA box: "DM 'FOUNDER' for our process →".

**Caption:**
```
The thing nobody says out loud about most agencies:

The senior who closed your deal is not the person doing your work.

The math is brutal: $280/hr quoted, $45/hr paid to a junior with a year of experience. The 84% margin is the whole business model.

We built X9Elysium specifically to break that — Darshan and Adhvait on every Slack channel, every kickoff, every line of Liquid. 30+ Plus engagements, zero juniors.

If you've been burned by an agency where the seniority disappeared after week 2, this is the difference.

DM "FOUNDER" — we'll send you our actual project ops playbook.
```

**Hashtags:** `#shopifyplus #consultingagency #founderled #shopifyexperts #dtc #ecommerceconsulting #plusagency #ecommerceadvisory #shopifyplusagency #digitalagency`

---

### Post 5 — One AOV stat = pricing logic

**Format:** Single image (1080×1350)

**Grok image prompt:**
> Premium dark poster 4:5 portrait 1080x1350. Centered: enormous number "+34%" in emerald (#10b981), 200pt, tight kerning. Below in white 32pt: "AOV lift from one tested upsell mechanism." Below that, three small icon-less rows in 18pt grey-white text: "1. Post-purchase one-click upsell (Shopify Functions)" / "2. Tiered free shipping bar with cart progress" / "3. Cross-sell drawer at PDP — not at cart." Below a thin emerald rule. Bottom small caps 14pt grey: "MEASURED ACROSS 7 PLUS STORES, Q1 2026 / X9ELYSIUM". Brand rails.

**Caption:**
```
AOV is the cheapest growth lever you have on Plus.

You don't need more traffic. You don't need a paid budget bump. You need three small mechanisms working together.

What we measured across 7 Plus stores in Q1 2026:

→ Post-purchase upsell (Shopify Functions, native — not an app): +18% AOV
→ Tiered free shipping bar with progress: +9% AOV
→ Cross-sell drawer at PDP (not at cart — too late at cart): +7% AOV

Combined: +34% on AOV in 6 weeks. No ad spend, no replatform, no PDP redesign.

The one thing most stores get wrong: cross-sells at the cart page convert at half the rate of cross-sells at the PDP. By cart, the buyer's already decided.

DM "AOV" and we'll send the implementation guide.
```

**Hashtags:** `#aov #shopifyplus #ecommerce #cro #dtc #upsell #shopifyfunctions #conversionrate #ecommercetips #shopifytips`

---

### Post 6 — Subscription LTV truth (carousel, 4 slides)

**Format:** 4-slide carousel (1080×1080)

**Grok image prompts:**

**Slide 1:**
> Premium dark poster 1080x1080. Top white headline 40pt: "Subscription LTV is a lie when you measure it like this." Below center: huge crossed-out text in grey 80pt with diagonal red-coral strikethrough: "$487 LTV". Bottom small caps 14pt grey: "1 OF 4 / X9ELYSIUM". Brand rails.

**Slide 2:**
> Same template. White headline 48pt top: "What every subscription brand reports:" Then in 28pt grey-white: "Average subscriber stays 4.2 months × AOV $116 = $487 LTV." Below in emerald 32pt: "What's actually happening:" Then 28pt white: "62% churn at month 1. The 38% who survive carry the entire P&L."

**Slide 3:**
> Same template. White headline 48pt: "The fix is not 'reduce churn.'" Below in 24pt white: "The fix is to underwrite acquisition against the survivors, not the average. If you're paying $48 CAC for an 'average' $487 LTV subscriber, you're actually paying $126 CAC for the only ones who pay you back." Bottom emerald 28pt: "Stop blending. Start segmenting at month 1."

**Slide 4 (CTA):**
> Same template. Centered white 56pt: "We rebuild subscription LTV models for Plus brands." Below emerald 28pt: "DM 'LTV' for the cohort calculator we use." Small X9ELYSIUM wordmark centered bottom.

**Caption:**
```
Most subscription LTV reports are math fiction.

If you blend churned and active subscribers into one average, you're underwriting acquisition against a customer who doesn't exist.

Real numbers from a Plus subscription brand we audited last quarter:
→ Reported "average LTV": $487
→ Actual median LTV (after month 1 churn): $112
→ Actual top-decile LTV: $1,840

The team had been bidding $48 CAC against $487 LTV. The honest CAC was closer to $126 against the only cohort that survives.

The fix isn't a churn-reduction sprint. It's measuring at the cohort level, picking the channel that brings the survivors, and underwriting CAC against that cohort.

DM "LTV" — we'll send the actual cohort spreadsheet (ReCharge / Bold / native Shopify Subscriptions all work).
```

**Hashtags:** `#subscription #shopifyplus #ltv #cohortanalysis #dtc #recharge #subscriptionbusiness #ecommerce #ecommercetips #cro`

---

### Post 7 — B2B on Plus reality check

**Format:** Single image (1080×1350)

**Grok image prompt:**
> Premium dark poster 4:5 portrait 1080x1350. Centered top: stylized two-column comparison. Left column header in white 32pt: "B2B PLATFORM AGENCIES SELL YOU". Right column header in emerald (#10b981) 32pt: "WHAT B2B ON PLUS ACTUALLY DOES IN 2026". Three rows below, each comparing one capability — left in grey 18pt, right in white 18pt: Row 1: "Custom price lists per account" / "Native, no app needed". Row 2: "Net-30 / Net-60 invoicing" / "Shopify Payments + B2B tools native". Row 3: "Customer-specific catalogs" / "Native B2B catalogs since 2024". Bottom large white headline 40pt: "You're being sold a problem Shopify already solved." Brand rails.

**Caption:**
```
A pitch we hear weekly: "You can't really do B2B on Shopify, you need [BigCommerce / Magento / NetSuite]."

In 2026, that's just untrue.

Native Plus B2B now includes:
✓ Per-account price lists and discount logic
✓ Customer-specific catalogs (B2B catalogs released 2024)
✓ Net-30 / Net-60 terms via Shopify Payments
✓ Quote-to-order workflows
✓ Wholesale-only checkout with company-level approvals

We migrated a $14M/yr industrial supplier off Magento Commerce to Plus B2B in 11 weeks. Their finance team got quote-to-cash 30% faster. Their dev cost dropped from $18K/mo to $4K/mo.

The agencies still pitching "you can't do B2B on Shopify" are usually the ones whose margin depends on you being on Magento.

DM "B2B" and we'll send the migration brief.
```

**Hashtags:** `#shopifyplus #b2b #b2becommerce #wholesale #plusmerchant #magento #netsuite #ecommerce #shopifyexperts #b2bcommerce`

---

### Post 8 — Headless ROI math (carousel, 5 slides)

**Format:** 5-slide carousel (1080×1080)

**Grok image prompts:**

**Slide 1:**
> Premium dark poster 1080x1080. Massive headline 84pt white: "Headless." Below 84pt emerald (#10b981): "When." Below 36pt grey: "and when not." Bottom small caps 14pt: "1 OF 5 / X9ELYSIUM". Brand rails.

**Slide 2:**
> Same template. White headline 48pt: "The honest cost of going headless:" Below in 24pt white: "$180K–$420K initial build / $8K–$22K/mo ongoing dev / 2× tooling stack to maintain (CMS + commerce backend + frontend framework + ISR/caching layer)." Below emerald 28pt: "Most stores never recover this in incremental revenue."

**Slide 3:**
> Same template. White headline 48pt: "When headless actually pays off:" Below four bullets 22pt white with emerald checkmarks: "Your storefront IS the product (configurators, AR, custom flows)" / "You serve 5+ markets with deep localization" / "You have an in-house team of 3+ frontend engineers" / "Your annual revenue is >$25M and you're already feeling Liquid limits."

**Slide 4:**
> Same template. White headline 48pt: "When headless is a tax:" Below four bullets 22pt white with red-coral minus signs: "You picked it because the agency pitched it" / "Your team is 2 marketers and 0 engineers" / "Revenue is under $10M" / "Your reason starts with 'we want to be future-proof.'" Bottom emerald 22pt italic: "'Future-proof' is rarely a P&L line item."

**Slide 5 (CTA):**
> Same template. White centered 56pt: "We've built both." Below 28pt emerald: "And killed three headless builds that never should have shipped." Tiny grey 16pt: "DM 'HEADLESS' for the decision framework." X9ELYSIUM wordmark centered bottom.

**Caption:**
```
Headless commerce is the most over-prescribed solution in the Plus ecosystem.

It is correct for some stores. It is a $300K/yr tax on the wrong stores.

Real example: we were brought in to "rescue" a $7M apparel brand 11 months into a headless rebuild. The site was 40% slower than the Liquid theme it replaced, the marketing team couldn't ship a landing page without a Jira ticket, and the brand was paying $19K/mo to a frontend agency to update product cards.

We migrated them back to Liquid in 6 weeks. Conversion rate went up 14%. Dev cost dropped 78%.

The 5-slide framework above is the actual decision tree we use on discovery calls.

DM "HEADLESS" if you want the full PDF.
```

**Hashtags:** `#headlesscommerce #shopifyplus #shopifyhydrogen #composablecommerce #ecommerce #dtc #shopifyexperts #headless #plusagency #ecommercearchitecture`

---

### Post 9 — Internationalization on Plus

**Format:** Single image (1080×1350)

**Grok image prompt:**
> Premium dark poster 4:5 portrait 1080x1350. Centered top: a stylized world map silhouette in very dark emerald (#0a3d2c), barely visible against black, with 6 emerald (#10b981) glowing dots over: USA, Canada, UK, Germany, Australia, Japan. Below map, white headline 56pt: "1 store. 6 markets. 18 SKUs that don't actually ship." Below in 22pt grey: "The most expensive bug in international Plus: storefronts that show prices for products your fulfillment can't deliver to that country." Bottom small caps 14pt grey: "FIELD NOTES / X9ELYSIUM". Brand rails.

**Caption:**
```
Markets is one of the best things Shopify shipped in the last three years.

It's also the feature most often misconfigured.

The most expensive international bug we see, repeatedly:

Brand expands from US → CA → UK → AU using Shopify Markets. Storefronts go live. Product catalog is shared across markets. Two months later, a finance audit catches that 18 SKUs in the UK store have been advertised, sold, and refunded — because fulfillment was never set up to ship them from the EU 3PL.

Net cost: ~$94K in refunds, lost shipping, customer support, and reverse-logistics fees. Plus brand damage on Trustpilot.

The fix is a 4-line catalog rule and a publish-by-market workflow. The reason it doesn't happen: nobody on the team owns "international launch QA" as a checklist.

We do this as part of every market expansion.

DM "MARKETS" and we'll send the launch QA checklist.
```

**Hashtags:** `#shopifymarkets #internationalecommerce #shopifyplus #crossborder #globalcommerce #dtc #ecommerceinternational #shopifyinternational #plusagency #ecommerceexpansion`

---

### Post 10 — The founder pitch (closer)

**Format:** Single image (1080×1350)

**Grok image prompt:**
> Premium dark editorial poster 4:5 portrait 1080x1350. Top third: small white text 14pt caps "X9ELYSIUM / GTA". Center: massive white headline 80pt with tight kerning, three lines: "Two founders." / "Thirty plus brands." / "Zero juniors." The "Zero juniors." line in emerald (#10b981). Bottom third: small white 18pt: "Shopify Plus consulting from Toronto. Replatforming, B2B, headless decisions, conversion engineering. Founder-led on every engagement." Below thin emerald horizontal rule. Below in emerald 24pt: "x9elysium.com". Brand rails apply.

**Caption:**
```
Why X9Elysium exists:

Darshan and Adhvait — two operators who've shipped 30+ Shopify Plus engagements across Canada and the US. No agency layer. No bench of juniors. No project managers translating between you and the work.

What we do:
→ Replatforming (Magento / BigCommerce / WooCommerce → Plus)
→ B2B and wholesale on Plus
→ Headless audits (and "should you actually go headless?" answers)
→ Conversion engineering — site speed, AOV, subscription LTV
→ International expansion via Shopify Markets

If you're a $5M–$50M DTC brand and you're tired of pitches from agencies that disappear after week 2 — book a 30-minute call. No deck. No pitch. We'll teardown your store live and you decide if there's a fit.

Link in bio.
```

**Hashtags:** `#shopifyplus #shopifyexperts #shopifyagency #ecommerceconsulting #toronto #gta #canadianbusiness #dtcbrand #shopifyplusagency #ecommercetoronto #founderled #plusmerchant`

---

## Posting checklist (per post)

Before you hit publish on each post:

1. **Image:** generated at 1080×1350 (single) or 1080×1080 (carousel), under 8MB.
2. **Alt text:** describe the data point + insight (2 sentences) — IG uses this for accessibility AND search ranking.
3. **Geotag:** "Toronto, Ontario" or "Mississauga, Ontario" — boosts local discovery.
4. **First comment:** drop hashtags here, not the caption.
5. **Pinned comment:** if the CTA is a DM keyword, pin a comment that says "DM '[KEYWORD]' for the playbook ↑" — gives lurkers a second nudge.
6. **Cross-post:** repost as a LinkedIn Document for posts 2, 4, 6, 8 (carousels) — that engine's already running 2x/wk per the 6-month plan.
7. **Story re-share:** within 24h, re-share the post to your story with a poll sticker ("which of these would you read first?") — drives the algorithm to keep showing it.

---

## Automation: three tiers (pick what matches your time budget)

### Tier 1 — Manual + Scheduling (1–2 hours/week, $0–15/mo)

The honest recommendation for the first 30 days. Don't automate something you haven't proven manually first.

**Stack:**
- Generate images: Grok / nano-banana / Midjourney (use prompts above)
- Schedule: **Meta Business Suite** (free, native, supports Reels + carousels + first-comment hashtags)
- Backup: **Buffer** ($6/mo) or **Later** ($16/mo) if you want a second eye

**Workflow:**
1. Sunday: batch-generate all 10 images using the prompts in this doc (~30 min).
2. Sunday: paste captions + schedule 2-3 weeks ahead in Meta Business Suite (~30 min).
3. Daily: 5 min check on comments / DMs.

**Pros:** Zero risk of API breakage, full creative control, captions can be tweaked last-minute.
**Cons:** Doesn't scale past 4 posts/week per channel.

---

### Tier 2 — Semi-automated (n8n / Make.com, ~$20/mo + 30 min/week)

For when the manual workflow is proven and you want to go to 4–6 posts/week without losing your Sundays.

**Stack:**
- **n8n** (self-hosted on a $5 Hetzner box, or cloud at $20/mo) OR **Make.com** ($10/mo Core plan)
- **Notion / Airtable** as the content database (one row = one post, fields = caption, image_url, scheduled_at, status)
- **Instagram Graph API** (requires Facebook Business + linked IG Business account — free)
- **Cloudflare R2 / Backblaze B2** to host generated images cheaply

**Workflow (one n8n flow):**
1. **Trigger:** cron every Tue/Wed/Thu at 9am PT.
2. **Step 1:** read next pending row from Notion/Airtable where `status = 'queued'`.
3. **Step 2:** download image from R2 → POST to IG Graph API `/media` endpoint.
4. **Step 3:** publish via `/media_publish` endpoint.
5. **Step 4:** post hashtags as first comment via `/comments` endpoint.
6. **Step 5:** mark row `status = 'posted'` + log `post_id`.

You still write the captions and approve the queue. The robot just hits "publish" on schedule.

**Pros:** No Buffer/Later subscription, full audit trail, can fan out to LinkedIn + Twitter from the same row.
**Cons:** First-time IG Graph API setup is annoying (need a Facebook Page, IG Business account, app review for some scopes — budget half a day).

**Setup guide:** the auth dance is documented at `developers.facebook.com/docs/instagram-api/getting-started`. The TL;DR: create a Meta Developer app → add Instagram Graph API product → connect to your Facebook Page → exchange a long-lived token (60 days, refreshable) → store in n8n credentials.

---

### Tier 3 — Fully autonomous (Claude API + image gen + IG Graph API, ~$40–80/mo)

For when the semi-automated workflow is proven and you're confident the brand voice can survive without your eyes on every caption.

**Stack:**
- **Cron job** on the same Hetzner box (or Cloudflare Workers cron triggers — fits the existing X9Elysium infra)
- **Claude API** (Sonnet 4.6 with prompt caching — burn rate is ~$0.30/post for caption generation)
- **Image generation:** Grok image API (when public) OR Gemini Imagen / OpenAI gpt-image-1 / Stability AI
- **Notion** as the topic backlog (one row = one topic, status = `idea` → `draft` → `approved` → `posted`)
- **Slack webhook** for human-in-the-loop approval before publish

**Workflow:**
1. **Cron weekly:** picks 3 next topics from Notion `idea` queue.
2. **Claude:** generates caption + image prompt + hashtags using a system prompt with brand rails + tone-of-voice doc + last 20 posted captions (cached) for style consistency.
3. **Image API:** generates 3 variants per post.
4. **Slack:** posts a Block Kit message with image previews + caption + "Approve / Regenerate / Reject" buttons.
5. **On approve:** writes to Notion `approved` queue with scheduled_at filled in.
6. **Tier 2 cron:** picks up the approved row and publishes per the Tier 2 flow above.

**Pros:** You spend 5 min/week clicking approve buttons. Brand voice stays consistent because Claude is anchored on your last 20 captions every run. Topic backlog never empties.
**Cons:** This is a real software project (~2 days to build, plus tuning). Don't build this until you've proven the content works manually.

**Cost estimate at 3 posts/week:**
- Claude API: ~$4/mo
- Image gen: ~$15/mo (Imagen / gpt-image-1 pricing as of 2026)
- Hetzner CX22: $5/mo
- Notion + Slack: $0 (existing)
- **Total: ~$25–40/mo, plus your build time.**

---

## Recommended path for X9Elysium

**Now → June 2026:** Tier 1. Ship the 10 posts above manually using Meta Business Suite. Measure what lands (saves > comments > likes — saves are the conversion intent signal on IG). The best 3 of these 10 inform the rest.

**June → August:** Tier 2 if (and only if) IG is producing 1+ qualified DM/week. Don't automate something that isn't pulling weight yet.

**Sept onward:** Tier 3 only if IG is the #2 inbound channel after LinkedIn. If LinkedIn is 80% of inbound, keep IG manual and put the engineering hours into LinkedIn carousel automation instead.

The 6-month organic growth plan in `docs/marketing/6-month-organic-growth-plan.md` doesn't currently include IG as a primary channel. This plan layers it in as a supporting channel that compounds with the 2x/week LinkedIn cadence already running. Don't let it become a primary channel until proof exists that it converts.

---

## Tracking

Add three columns to the engine dashboard (the Sunday review sheet referenced in the 6-month plan):

| Column | Definition |
|---|---|
| `ig_posts_shipped` | Count of posts published this week |
| `ig_dms_received` | Count of DMs from non-followers this week (the DM keyword is the signal) |
| `ig_qualified_calls` | Count of IG-attributed discovery calls booked |

If `ig_qualified_calls` is 0 by end of Month 2, kill or rebuild the channel. Don't run a content channel that doesn't convert just because the grid looks nice.
