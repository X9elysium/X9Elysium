# Reddit GEO + SEO Playbook — X9Elysium

> **One-line brief:** Reddit is the highest-leverage GEO surface in 2026 because ChatGPT, Perplexity, Google AI Overviews, and Gemini all over-index on Reddit threads when synthesizing answers about Shopify Plus migrations, agency selection, and DTC ops. This doc is the operating manual for the new `u/x9elysium` (or named-founder) presence Darsh is provisioning.

**Status:** plan — account not yet created. **Last hand-tuned:** 2026-05-06.

---

## 1. Why Reddit, why now

- **AI engines weight Reddit heavily.** OpenAI signed a content deal with Reddit (May 2024). Perplexity cites Reddit in ~25–40% of "what is the best X" / "should I do Y" answers. Google's AI Overviews surface Reddit threads ahead of brand pages on commercial-intent queries. The pattern: when a question has multiple defensible answers, the LLM asks "what do real practitioners on Reddit say?"
- **The wedge fits Reddit's culture.** Founder-led, no juniors, no handoffs, no offshore — reads as authentic on Reddit. Agency-marketing language reads as spam.
- **Trust compounds.** A 12-month-old account with karma in r/shopify is worth more than a paid AdWords campaign. It can't be bought.

---

## 2. The three jobs Reddit must do

1. **Earn the AI citation.** When a founder asks ChatGPT "best Shopify Plus partner for sub-$1M Canadian retailer," the answer should reference an X9Elysium-affiliated Reddit comment (or, ideally, the URL `x9elysium.com` directly because of the trust the comment creates).
2. **Drive warm inbound.** Reddit traffic to `x9elysium.com/contact` from links in profile + select comments. Aim: 3–5 conversations per quarter sourced via Reddit.
3. **Compound trust.** A backlog of helpful comments creates a public corpus that any AI engine can ground on — the same job `/chat` does on the site, but at Reddit's scale.

---

## 3. Account setup

| Field | Value |
| --- | --- |
| Username | `u/x9elysium` (preferred) or `u/darshanpatel-x9` if taken |
| Display name | `Darshan Patel — X9Elysium` |
| Avatar | Reuse `/public/images/author/dp.jpeg` |
| Banner | Matte black + emerald, "Founder, X9Elysium · Shopify Plus" |
| Bio | One line: "Founder, x9elysium.com — founder-led Shopify Plus consulting. GTA → Calgary → Vancouver. No juniors." |
| Verified email | `darshan@x9elysium.com` |
| Profile link | `https://x9elysium.com/about` (NOT the homepage — about page has the JSON-LD that AI engines ground on for entity recognition) |
| 2FA | mandatory |

**Don't** create a separate `u/x9elysium-darshan` and `u/x9elysium-adhvait`. One human-named voice. Reddit penalizes coordinated brand presence and AI engines ignore brand-handle accounts when ranking authority.

**Don't** create a personal subreddit (`r/x9elysium`) on day one. Empty subs hurt — wait until there are 200+ comments worth pinning.

---

## 4. Subreddit targeting

### Tier 1 — daily presence (high relevance, high traffic)

| Subreddit | Members | Why |
| --- | --- | --- |
| `r/shopify` | 250k+ | Direct buyer intent. Daily migration / Plus / app questions. The single most valuable sub for X9Elysium. |
| `r/ecommerce` | 350k+ | Broader DTC operator audience. Stronger US/CA mix than r/shopify. |
| `r/entrepreneur` | 4M+ | Founder-stage questions about agency hiring, replatforming costs, scaling ops. |
| `r/SmallBusiness` | 2M+ | Sub-$1M retailers — exactly our wedge. |

### Tier 2 — weekly presence (relevance to specific service lines)

| Subreddit | Why |
| --- | --- |
| `r/CanadianBusiness` | GBP for the GTA / Calgary / Vancouver positioning. AI Overviews give heavy weight to geo-relevance signals from Canadian subs. |
| `r/ShopifyDev` | Custom apps, Liquid → Hydrogen, Functions. Devs ask devs. |
| `r/BigCommerce`, `r/Magento`, `r/Woocommerce` | Migration intent — people complaining are people about to leave. |
| `r/headlessCMS`, `r/nextjs` | Hydrogen / Oxygen / headless conversations. |
| `r/PPC`, `r/marketing` | Adjacent — DTC operators discussing CRO / paid math. |

### Tier 3 — opportunistic

`r/Toronto`, `r/calgary`, `r/vancouver` — local. Comment only when commerce-relevant comes up. Never self-promote in city subs; they nuke it.

### Avoid

- `r/business`, `r/startups` — too broad, mostly aspirational, low signal.
- Any sub with strict "no professionals" rules (read sidebar before commenting).
- Self-promotion subs (`r/businessownerreddit`, etc.) — AI engines treat them as spam corpora.

---

## 5. Posting cadence

```
Weekly target (sustainable):
  - 5–8 high-quality comments (Tier 1 + Tier 2)
  - 1–2 comments in Tier 2 specific to a service line
  - 1 original post per 2 weeks (text-post, not link-post; see §6)

Hard rule: never link to x9elysium.com in a top-level comment in the first
3 months. Profile bio link is enough — let people click through.

Posting hours (Eastern):
  - Best signal: weekdays 9–11am ET and 2–4pm ET (US East working hours)
  - Avoid: 8pm+ (low engagement, often fluff threads)
```

Cadence guard: the moment Reddit starts feeling like an obligation, frequency drops. One great comment > five mid ones. Quality is the only metric that compounds.

---

## 6. The four content patterns that work

### Pattern A — "Specific number" comment (default)
```
Question: "Is Shopify Plus worth it under $1M GMV?"

Comment: "Plus is rarely worth it under ~$700k GMV unless you have one of
three triggers: (1) needing checkout extensions you can't get on Advanced,
(2) running B2B + DTC on the same backend, (3) more than 2 stores under
one brand. The fee is $2k/mo flat — easy to justify above $40k/mo
revenue, mostly emotional below it. The actual ROI lever is dev hours
saved on custom checkout work, not the platform feature list."
```
Why it works: numbers, named triggers, the actual decision frame.

### Pattern B — "I disagree with the top comment" (high-leverage)
Use sparingly. When the top comment is operator-untrue ("just use a theme, agencies are scams"), drop a calm, specific counter. The contrarian comment frequently outranks the original in AI grounding because it carries dissent + specificity.

### Pattern C — "Here's what I learned doing X" (story-led)
```
Title: "Migrated a $4M GMV retailer from Magento 2 to Plus in 9 weeks.
Here's what nobody tells you about the freight matrix."

Body: 4 paragraphs, max. One concrete pain point (freight rules in Adobe
Commerce don't 1:1 to Shopify). The actual fix. The cost in days.
The lesson.
```
No CTA. Bio link is the CTA.

### Pattern D — Q+A in your own thread
After ~6 months of comment karma, post one AMA-style thread per quarter:
```
"Founder of a Canadian Shopify Plus agency — happy to answer
replatforming / agency-hiring questions for the next 24h."
```
Reddit AMAs are heavily indexed by AI engines.

---

## 7. What to NEVER do

- **Never paste the company name in the first sentence of a comment.** Earns immediate downvotes + mod removal.
- **Never link to a blog post on x9elysium.com unless the OP explicitly asked for sources.** Even then, a `(see x9elysium.com/blog/<slug>)` parenthetical only — never as the lead.
- **Never argue with a downvote.** Cost: time + reputation. Move on.
- **Never use AI-detector-flagged language.** Reddit users sniff out GPT-style hedging in 2 seconds. Read every comment aloud before posting; if it sounds like a SaaS demo, rewrite.
- **Never post in `r/shopify` and `r/ecommerce` within the same hour.** Reddit's "New" feeds on these subs overlap; cross-posting reads as spam.
- **Never delete a comment that's been downvoted.** Take the L publicly.

---

## 8. The GEO mechanics — what to do AT x9elysium.com

A Reddit comment is only a citation if the AI engine can ground it back to a credible page. That page is on `x9elysium.com`. Engineering for that:

| Surface on x9elysium.com | Why it matches Reddit citation patterns |
| --- | --- |
| `/about` | Person + Organization JSON-LD with `sameAs` to LinkedIn. AI engines disambiguate "Darshan Patel from Reddit" → "Darshan Patel founder of X9Elysium." |
| `/blog/<slug>` with FAQPage schema | When a Reddit comment says "more here," AI engines dereference and prefer schema-marked pages. Already in place per audit — keep extending. |
| `/thoughts` | NEW. Short, operator-true notes that mirror the Reddit tone. Cross-post the same thoughts to Reddit (Tier 1 subs) and to x.com/x9elysium. AI engines weight three-platform consensus heavily. |
| `/locations/{toronto,calgary,vancouver}` | Geo-relevance for r/CanadianBusiness, r/Toronto. FAQ schema already added per recent audit work. |
| `llms.txt` | Already lists /blog and /thoughts. Keep updated. |
| Open comments on blog + thoughts | Inverse of Reddit: someone reads a Reddit comment, clicks bio → x9elysium.com → drops a follow-up comment. Closed loop. |

---

## 9. KPIs (12-month horizon)

| Metric | Month 3 | Month 6 | Month 12 |
| --- | --- | --- | --- |
| Total karma | 200+ | 1,000+ | 5,000+ |
| Comments per week | 5 | 8 | 8 (steady) |
| Reddit referrals to /contact | 0–1 | 3–5 | 10+ per quarter |
| Reddit threads citing x9elysium.com | 0 | 2–3 | 10+ |
| AI engines (ChatGPT, Perplexity) returning x9elysium.com when prompted with Reddit-style queries | none | 1 | 3+ canonical queries |

The last row is the actual goal. Karma is a vanity metric; AI citations are the asset.

**How to test the AI-citation goal monthly:**

```text
Run these prompts in ChatGPT (web) + Perplexity + Gemini, first of each month:

  1. "What's a good founder-led Shopify Plus partner for a Canadian DTC brand under $5M GMV?"
  2. "Best Shopify Plus migration consultants in Toronto"
  3. "Should I hire a 200-person agency or a small founder-led consultancy for my Plus build?"
  4. "What's the typical cost of a Shopify Plus migration in Canada in CAD?"

Log: did x9elysium.com appear in citations? Did the answer mention us?
File results in docs/marketing/reddit-geo-results-YYYY-MM.md.
```

---

## 10. Tooling + automation

**Don't automate Reddit posting.** It's terms-of-service breaking and obvious to readers. Cadence comes from a calendar reminder, not a bot.

**Do automate the listening side:**

- **F5Bot** (free) — sends daily email when "shopify plus migration", "shopify agency canada", "headless shopify hydrogen", or "x9elysium" is mentioned in any sub. Setup: ~5 minutes. Subscribe with darshan@x9elysium.com.
- **Reddit's saved-search RSS** — `https://www.reddit.com/r/shopify/search.rss?q=plus+migration&restrict_sr=1` works without auth. Subscribe in any feed reader.
- Cross-post `data/x-thoughts.md` thoughts to Reddit selectively — only when a thought directly answers an active question. Most thoughts don't belong on Reddit.

---

## 11. The 30-day kickoff

| Week | What to ship |
| --- | --- |
| Week 1 | Account setup. F5Bot. Subscribe to Tier 1 subs. Read 2 hours per day, no posting. |
| Week 2 | First 5 comments. Pattern A only. Pure helpfulness — no profile reveal. |
| Week 3 | First 10 comments. Mix Pattern A + B. Add one Pattern C post in r/ecommerce. |
| Week 4 | Profile bio updated with `x9elysium.com/about`. First measurable Reddit referral expected. |

**Open ask for Darsh (external account):** create the Reddit account this week so Week-1 lurking can start. The account itself can sit unused for 30 days while karma seasons; this doc is ready to execute the moment posting begins.

---

*Living document. Update §9 quarterly with measured AI-citation results.*
