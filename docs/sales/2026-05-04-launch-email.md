---
name: Sales hiring launch — notification email
description: Reference copy of the email sent to darshan@x9elysium.com on 2026-05-04 announcing the three sales roles + playbook + a critical Cloudflare deploy issue.
type: reference
---

# Email — Sales hiring launch

**To:** darshan@x9elysium.com
**From:** auto-agent
**Subject:** Sales function — three roles posted + playbook live + Cloudflare deploy blocker
**Date:** 2026-05-04

---

Darshan,

The first three sales roles, the team playbook, and the hiring plan are committed and pushed to `main`. **Read the deploy blocker note at the bottom before you do anything else** — none of the last four pushes are actually live on x9elysium.com, including this one.

## What shipped (in `main`, commit `83e56de`)

Three role postings under `/careers`, all with `postedAt: 2026-05-04` so they sort to the top:

| Role | Slug | Comp | Reports to |
| --- | --- | --- | --- |
| Head of Sales — SMB Shopify | head-of-sales-smb-shopify | CA$150K – $200K OTE + profit share | Founders |
| Sales Manager — SMB Ecommerce | sales-manager-smb-ecommerce | CA$110K – $140K OTE | Head of Sales |
| Account Executive — SMB Shopify | account-executive-smb-shopify | CA$80K – $110K OTE (CA$50K base + uncapped variable) | Sales Manager |

All three target **SMB Shopify merchants in the CA$500K – $10M GMV band**, remote-first across Canada, application by `mailto:darshan@x9elysium.com` (subject pre-filled with role + location). Per your brief, every role requires **2+ years in a leadership capacity** — for the AE that's framed as book ownership / pod mentorship / pipeline ownership rather than people management, called out explicitly in the requirements list so it doesn't read as inflated.

## Why all three at once, in this order

Senior sales talent reads the **whole org chart** before they apply. Posting an AE alone signals chaos; posting Head of Sales + Sales Manager + AE simultaneously signals an investment thesis — and it costs nothing extra.

Sequence-wise, **Head of Sales hires first**. They build the system → hire the manager → who hires the AEs. Founder-sold businesses that try to skip this step always blow up the AE seat first, because there's no one running the pipeline cadence. The hiring plan in `docs/sales/hiring-plan-2026.md` walks through the cost model, the Year-1 quota model, and the realistic 2026 cash impact (~CA$215K if only Head of Sales lands this year, which is most likely).

## The "rules" you asked for — `docs/sales/sales-team-playbook.md`

v1.0 of the operating manual, 14 sections. The high-leverage rules:

- **ICP:** SMB Shopify merchants $500K – $10M GMV. Anti-ICP list explicitly excludes sub-$500K, pre-revenue, gambling, MLM, regulated cannabis cross-border, weight-loss supplements, dropshipping arbitrage. Walk-away authority is documented.
- **Pipeline mix:** 40% inbound / 40% outbound / 20% referral. If outbound creeps above 60% we're not investing enough in inbound; if it drops below 25% we've stopped prospecting.
- **Outbound rules of engagement:** personalised first touch only, max 5 touches over 21 days per prospect, no auto-DM tools, hard suppression list (a "no" lasts 6 months minimum).
- **Pricing floors:** CA$25K project / CA$8K retainer / CA$2.5K day-rate. Below these we refer out — we will not deliver value at a lower price point without burning the relationship.
- **Discount authority:** AE 0–5% at-will, Manager 5–10% with written sign-off, Head of Sales 10–15%, Founders 15%+ (logged as exception). Never discount **and** expand scope in the same negotiation.
- **Forecast cadence:** Mondays 09:00 PT pipeline review with Sales Manager, 11:00 PT forecast call with Head of Sales. Missed commits two quarters in a row triggers a performance review.
- **Code of conduct:** 8 non-negotiables, including never trash a competitor by name, never share another client's data, never make founder-promises without confirmation, never sell to anti-ICP. Violations are documented and grounds for termination.
- **Sales-to-delivery handoff doc** is required before commission is paid. Sales does not get paid commission on a deal that delivery refuses to start.

The full playbook — including stage exit criteria, the loss-reason picklist, the escalation matrix, comp philosophy with clawback rules, the tooling baseline, and a 30-day onboarding checklist — is in the file.

## Files added/changed in this push

```
app/lib/careers.ts                 +Sales department + 3 role objects
docs/sales/README.md               (NEW) folder index
docs/sales/sales-team-playbook.md  (NEW) v1.0, 14 sections
docs/sales/hiring-plan-2026.md     (NEW) sequencing + cost model + quotas
docs/sales/2026-05-04-launch-email.md  (NEW) — this email, archived as reference
docs/progress/CHANGELOG.md         entry added
CLAUDE.md                          Recently Completed entry
```

## ⚠ Deploy blocker — read this

Cloudflare's auto-deploy from `main` has been **broken since at least 2026-05-02**. None of the following has reached the live site:

| Path | Committed | Live status |
| --- | --- | --- |
| `/platforms/odoo/`, `/platforms/woocommerce/` | 2026-05-02 | 404 |
| Vasudhaiva credo on `/foundation/` | 2026-05-02 | not in live HTML |
| `/images/brand/tree-of-life.png` | 2026-05-02 | 404 |
| `/chat/` | 2026-05-03 | 404 |
| `/locations/vancouver/` | 2026-05-04 (early) | 404 |
| **the three sales roles posted today** | 2026-05-04 (this push) | 404 |

The local `out/` folder builds correctly (47 static pages, all three new role pages confirmed in `out/careers/`). The push went through (`83e56de` is on `origin/main`). GitHub Actions Node CI ran green in 2m 4s. But the live site is still serving the build from somewhere around 2026-05-01.

I can't trigger a manual deploy from here — `npx wrangler deploy` needs `CLOUDFLARE_API_TOKEN`, which isn't set in the environment. To fix:

1. Check the Cloudflare dashboard → Workers → x9elysium → **Deployments** tab. There should have been auto-deployments for the last four pushes; if there are none, the GitHub integration is disconnected.
2. If disconnected, reconnect in **Settings → Build & Deploy → Git integration**, or run a one-shot manual deploy with `CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy` from your machine.
3. If the deployments did fire and **failed**, the Build logs will show why — the most likely culprit is `prebuild → build-chat-context.mjs` (the chat context builder I shipped on 2026-05-03). If it's that, comment out the `prebuild` script in `package.json` until you've set `ANTHROPIC_API_KEY` and `CHAT_PIN` as Worker secrets.

Until this is fixed, the three sales roles aren't actually visible to candidates yet. The mailto links won't bring applications because no one can see the postings. **Don't promote on LinkedIn or X until the deploy ships.**

## What's next once the deploy is unblocked

1. Verify all three role URLs return 200 (post-push checks at `docs/deployments/post-push-checks.md`).
2. Promote in this order: LinkedIn personal feeds (you + Adhvait) → x.com (`@x9elysium`) → Shopify Partner directory once the profile is claimed.
3. Triage incoming applications within 5 business days. The hiring plan documents the loop.

If you want, I can sit on this and re-run the post-push checks once Cloudflare is back online — just say the word.

— sent on behalf of the X9Elysium build agent (Claude Opus 4.7), 2026-05-04
