# Applied to X9Elysium — Principle-by-Principle Mapping

The point of the [Naval](naval-ravikant.md) and [Thiel](zero-to-one.md) summaries is not literary appreciation. It is to make sure every load-bearing principle from those two books is **operationalised** somewhere in the live business — and not honoured only in conversation.

This file is the audit trail. Two halves:

1. **Currently-honoured principles** — where each lesson already lives in code, copy, pricing, or process. If any of these stops being honoured, that is a regression.
2. **Principles to apply next** — gaps the audit revealed, queued as concrete tasks.

---

## Part I — Currently honoured

### Naval Ravikant

| Principle | Where it lives | Evidence |
|---|---|---|
| Seek wealth, not money or status | The whole engagement model | Pricing is by scope/upside, not hour. The brand is treated as a wealth asset compounding over a decade. The Instagram plan measures qualified DMs, not likes. |
| Specific knowledge | Founder-led wedge | `app/page.tsx` Hero: *"Founder-led Shopify Plus consulting. No juniors. No handoffs."* `/about` carries real LinkedIn-sourced bios + Person schema. |
| Leverage = code + media (not labour) | Two-partner model + content stack | Two senior partners, no juniors. Code leverage: reusable migration playbooks, audit scripts. Media leverage: cornerstone content cadence, llms.txt, /foundation, sitemap, GEO. |
| Productize yourself | /about + /foundation | Founders are named, photographed (pending real photos), schema-marked, and are the subject of the brand voice. Not a faceless agency. |
| Play long-term games with long-term people | Vasudhaiva Kutumbakam credo + Rule of True Partnership | `/foundation#credo` Sanskrit credo, the Quotation JSON-LD, and Rule 4 ("we say no to projects that don't align — long-term fit is a prerequisite"). |
| Earn with your mind, not your time | Pricing model | `/contact` sidebar: *"value scales with project size."* No published rate card. No hourly billing. |
| Escape competition through authenticity | Platform truth + credo | `/platforms/odoo` and `/platforms/woocommerce` published alongside Shopify Plus core — choosing honesty about platform fit over a single-platform pitch. The Sanskrit credo is not replicable by competitors without parody. |
| Equanimity / happiness as a skill | Rule of Positivity Under Pressure | Rule 7: *"When something breaks, we bring solutions and energy — never blame, never drama."* |
| Compound interest in relationships | Vasudhaiva Kutumbakam + 20-year promise | The Promise section on /foundation: *"clients we'd work with for the next twenty years."* |
| Reading first-principles texts | This very folder | The credo cites the Maha Upanishad. This folder cites Naval and Thiel directly rather than recycled summaries. |

### Peter Thiel

| Principle | Where it lives | Evidence |
|---|---|---|
| The contrarian question | Founder-led wedge | The hero copy is the answer to *"what important truth do very few people agree with you on?"* — most agencies need the opposite to be true. |
| 0 → 1 vs 1 → n | Brand + foundation work | The /foundation page itself is 0 → 1 work. The credo is 0 → 1. The Person schema is 0 → 1. Most "agency websites" are 1 → n copies of the same template. |
| Monopoly via differentiation | Brand moat | Sanskrit credo + 10 published rules + named founders + real bios — no competing agency can replicate the bundle without sounding ridiculous. |
| 10x better, not 10% better | Pillar 01 | *"40%+ revenue lift inside year one."* The bar is set at category-shift outcomes, not incremental. |
| Last-mover advantage | Rule of Big Impact | Rule 10: *"to help ambitious retailers build commerce empires that last decades."* The aim is to be the last partner they ever need. |
| Foundations are unfixable | The /foundation page itself exists | Codified credo + 5 pillars + 10 rules — Thiel's law literally justifies the page. |
| Distribution as engineering | 6-month organic growth plan + GEO stack | `docs/marketing/6-month-organic-growth-plan.md` treats distribution as production infrastructure, not as ad spend. llms.txt, sitemap freshness, IndexNow protocol planned. |
| Power law | Rule of True Partnership + content cadence | Rule 4 (saying no to wrong-fit clients) is power-law applied to client portfolio. Cornerstone-content cadence (1 per month) is power-law applied to content. |
| Definite optimism | The 6-month plan + the rules themselves | Specific monthly milestones, specific kill-criteria, specific cornerstone topics. Not "we'll see how it goes." |
| Secrets exist | The founder-led wedge as a stated thesis | We have written down the secret (most retailers will pay 30% more for senior trust over a decade) instead of letting it stay vibes-only. |

---

## Part II — Principles to apply next

These are gaps the books exposed. Each one is a concrete task, not a vibe.

### From Naval

1. **Decouple "wealth" from "the agency".** Naval's wealth thesis assumes wealth is built outside any single client or income stream. The agency is currently the only wealth engine. *Action:* in 2026 Q3, scope at least one piece of **media leverage that earns independent of clients** — e.g. a paid course on Shopify Plus migration ($499–$1,499), or a sponsored newsletter for retail operators. Not for the revenue — for the leverage diversification.

2. **Audit the desire ledger quarterly.** "Desire is a contract you make to be unhappy until you get it." *Action:* every quarter, write down the active desires (clients to land, content to ship, hires to make). Cull anything that is a status game in disguise. Currently no formal practice.

3. **Compound capital alongside compound brand.** Naval treats financial capital, not just human capital, as a compounding asset. *Action:* once monthly cash > $25k post-tax, route a fixed % into long-duration index investments — not because "diversification" is virtuous but because it disconnects the founder's sense of safety from the agency's quarter.

### From Thiel

4. **Close the Distribution Question.** Thiel question 5 is the only one where X9Elysium currently does not have a strong yes. *Action:* the third-party listings playbook (`docs/marketing/third-party-listings.md`) is already P0. Add: claim Clutch profile, claim Shopify Partner directory profile, apply to Plus Partner track, claim Google Business Profile. Already in CLAUDE.md remaining list. Confirmed here as the highest single ROI move outside content.

5. **Audit "are we doing 0 → 1 or 1 → n right now?" weekly.** *Action:* in the weekly content + ops planning, label every active workstream with `0→1` or `1→n`. If `1→n` exceeds 60% of attention for two consecutive weeks, redirect.

6. **Write down the working secrets and date them.** *Action:* the three working secrets in `zero-to-one.md` ("re-platforming retailers are the highest-value client", "the credo scales trust faster than contracts", "distribution-as-engineering beats hiring") need explicit pass/fail criteria + a check-in cadence. Add a `docs/strategy/secrets-ledger.md` file with quarterly review entries.

7. **Run the seven questions annually.** Thiel's seven questions (engineering / timing / monopoly / people / distribution / durability / secret) are the most useful annual review tool in the book. *Action:* every May (anniversary of foundation page publication, 2026-05-02), re-answer all seven and diff vs. last year. Drift in any answer = leadership conversation.

8. **Power-law the channel mix.** Currently: SEO + GEO (strong), Instagram (planned), LinkedIn (sporadic), referral (organic), cornerstone content (planned). *Action:* by end of 2026 Q3, identify which channel is producing the power-law slice and ruthlessly concentrate. Stop pretending all channels deserve equal attention. The other channels are present, not invested in.

---

## Part III — Where the foundation page should change

The pillars and rules are tight and should not be expanded with book-citations (that would dilute them). But the page itself can carry a tasteful "Texts beneath the foundation" section between the Ten Rules and The Promise — short, specific, naming Naval and Thiel as the two operating-model influences and citing one principle from each as direct evidence that the foundation is studied, not slogan.

This is implemented as a new section in `app/foundation/FoundationClient.tsx` titled **"The texts beneath this foundation"** — two cards, no link out (the docs folder remains private), but the books and their headline lessons are named.

---

## Cadence

This file is reviewed and updated:
- **Quarterly** for the Naval items (private operator practice).
- **Annually in May** for the Thiel seven-questions check (same anniversary as the foundation page).
- **Whenever a major business decision is made** that should be logged against a principle (so the audit trail stays honest).

Last meaningful update: 2026-05-03.
