# X9Elysium Admin Dashboard — Tableau Integration Plan

**Goal:** A single private admin dashboard at `x9elysium.com/admin` that shows everything Darsh needs to run the agency in one view — inbound leads, SEO performance, website traffic, Core Web Vitals, marketing campaigns, and internal tasks.

**Audience:** Darsh + Adhvait only. Never indexed. Never linked from public nav, sitemap, or footer.

**Built with:** Tableau (Cloud or Public, see §3) embedded into the X9Elysium static site.

---

## 1. The 4 dashboards (what your friend builds)

One Tableau workbook with **four sheets / tabs**, each answering one question:

### Tab 1 — Leads & Pipeline
*"What's in the funnel and what should I work on today?"*

- **KPI tiles:** Leads MTD · Leads last 30d · Avg first-response time · Open pipeline value · Closed-won MTD · Lead → discovery call conversion %
- **Lead funnel chart:** New → Qualified → Discovery booked → Proposal sent → Won
- **Leads over time:** stacked bar by source (organic, LinkedIn, referral, direct, paid)
- **Lead table:** sortable list of recent leads with status, score, days-since-contact, next action
- **Lost-reason breakdown:** pie chart (budget, timing, competitor, ghosted, not a fit)
- **Source ROI:** which channel produced the highest closed-won value

**Data source:** `leads.csv`

### Tab 2 — SEO Performance
*"Are we ranking for the queries that matter, and is organic traffic growing?"*

- **KPI tiles:** Total ranking keywords · Top-10 keywords · Avg position (top 50) · Organic sessions MTD · Organic conversions MTD · Featured snippets owned
- **Keyword position heatmap:** keywords × time, color = position (green good, red bad)
- **Top-moving keywords:** biggest gainers + biggest losers in last 30 days
- **Top landing pages:** organic sessions per URL, sortable
- **Click-through trend:** impressions vs clicks vs CTR over time
- **Country split:** Canada vs US vs other

**Data sources:** `seo-rankings.csv`, `seo-traffic.csv`

### Tab 3 — Website Health
*"Is the site fast, are people converting, and where are they coming from?"*

- **KPI tiles:** Sessions today · Sessions MTD · Avg LCP · Avg INP · CLS · Conversion rate · Bounce rate
- **Core Web Vitals trend:** LCP / INP / CLS over time, green/yellow/red thresholds
- **Traffic over time:** line chart, sessions + users
- **Top pages by views**
- **Acquisition mix:** donut by channel (organic, direct, social, referral, email)
- **Geo map:** sessions by country

**Data sources:** `website-analytics.csv`, `core-web-vitals.csv`

### Tab 4 — Tasks & Operations
*"What's on my plate this week, how did we do this quarter, and what's slipping?"*

- **KPI tiles (current):** Open tasks · Overdue · Due this week · Hours estimated this week · Hours logged
- **Quarterly performance row** (filterable by quarter, defaults to current):
  - **Tasks completed (Q*N*)** · **Completion rate** (Done / Total created in quarter) · **On-time rate** (Done before due / Done) · **Avg cycle time** · **Estimate accuracy** (actual / estimated, target 1.0)
  - **Q1 quick read example:** if 80 tasks were created Jan 1 – Mar 31 and 62 closed by Apr 1, that's a 78% completion rate. Use a colored badge: ≥85% green, 70–84% amber, <70% red.
- **Task burndown:** tasks created vs closed per week (quarter-bounded line chart with cumulative totals)
- **Quarterly comparison:** small bar chart — completed tasks Q4 2025 vs Q1 2026 vs Q2 2026 (in progress)
- **By project:** stacked bar, open tasks per client/project
- **By assignee:** workload split Darshan vs Adhvait (open + completed in quarter)
- **By category:** how many Build / Design / Sales / Audit tasks completed in quarter
- **Slipping tasks:** list of overdue with days late
- **Throughput:** avg cycle time (created → done) per category

**Data source:** `tasks.csv`

### Tab 5 — Finance & Operations
*"How much did we earn, how much did we spend, who owes us money, and what's our runway?"*

- **KPI tiles:** Revenue MTD · Revenue QTD · Outstanding A/R · Overdue A/R · Expenses MTD · Net cash flow MTD · Monthly recurring SaaS cost · DSO (Days Sales Outstanding)
- **Cash flow line chart:** monthly revenue (paid invoices) vs monthly expenses, last 6 months
- **A/R aging bucket:** stacked bar — 0–30 / 31–60 / 61–90 / 90+ days outstanding
- **Invoice status funnel:** Draft → Sent → Viewed → Paid (drop-off visible)
- **Top clients by paid revenue** (bar chart, USD)
- **Expense breakdown:** treemap or donut by category (Software/SaaS, Hosting, Marketing, Travel, Meals, Office, Contractor, Education)
- **Recurring vs one-off expenses:** stacked bar by month — what's the always-on baseline?
- **Unbilled reimbursables alert:** list of `billable_to_client = Yes` expenses with no matching invoice line item
- **Sample invoice:** see `sample-data/sample-invoice.md` for the standardized X9Elysium invoice template

**Data sources:** `invoices.csv`, `expenses.csv`

> *Optional Tab 6 — Marketing Campaigns* if you want to track LinkedIn / Instagram / paid: use `campaigns.csv`.

---

## 2. Where the real data comes from (production pipeline)

Sample CSVs are for him to design with. In production, a single **Google Sheets workbook** acts as the unified store, with each tab populated automatically:

| Tableau dataset | Real source | Pipeline |
|---|---|---|
| **Leads** | Web3Forms (contact form) | Web3Forms webhook → Cloudflare Worker → Google Sheets API (`Leads` tab). Manual columns (status, score, deal value, lost reason) edited in Sheet directly. |
| **SEO rankings** | Google Search Console + a rank tracker (Ahrefs / SEMrush / SerpRobot) | Daily Google Apps Script pulls GSC API → `SEO_Rankings` tab. Rank tracker has its own GSheet export. |
| **SEO traffic** | Google Search Console (clicks, impressions, CTR, position per page/query) | Daily GSC API pull via Apps Script → `SEO_Traffic` tab. |
| **Website analytics** | GA4 OR Plausible OR Cloudflare Web Analytics | GA4 → BigQuery export OR Plausible API → Apps Script → `Web_Analytics` tab. |
| **Core Web Vitals** | PageSpeed Insights API or CrUX (Chrome UX Report) | Weekly Apps Script that hits PSI for ~10 key URLs → `CWV` tab. |
| **Tasks** | Asana or Jira (see §9) — recommend Asana for this scale | API → Apps Script (or Make.com) → `Tasks` tab nightly. |
| **Invoices** | Tally **Create Invoice** form + **Update Invoice Status** form | Tally → Google Sheets API → `Invoices` tab. PDF generated from the Sheet row via Apps Script + Google Docs template. |
| **Expenses** | Tally **Log Expense** form (mobile-friendly — log on the go) | Tally → Google Sheets API → `Expenses` tab. Receipt photo uploaded to Google Drive, link stored in row. |
| **Campaigns** (optional) | LinkedIn Ads / Meta Ads / Instagram insights | Manual entry weekly, or platform → Sheets via Zapier / Make. |

**Why Google Sheets as the middle layer:**
- Tableau has a first-class Google Sheets connector (5-min setup)
- You can hand-edit qualitative columns (status, lost reason, lead score)
- Every API in the universe writes to Sheets
- Free, versioned, shareable
- No infra to babysit

**Refresh cadence:**
- Tableau Cloud auto-refreshes from Google Sheets daily (or hourly on paid tiers).
- Apps Script time-driven triggers run nightly at 2am local time to repopulate.

---

## 2.5 Forms-driven entry layer (the "everything connected by forms" piece)

For all data that doesn't have an upstream API (invoices, expenses, manual notes), use **Tally forms** as the entry point. Tally writes directly to Google Sheets, which Tableau already reads. No middleware, no copy-paste, no spreadsheets-as-databases-edited-by-hand.

**Why Tally specifically:**
- Free tier covers everything you need (unlimited forms, unlimited submissions).
- Native Google Sheets integration (one click, no Zapier needed).
- Conditional logic, file uploads, calculated fields, hidden fields, password protection.
- Works on phone — log expenses from your wallet at the cafe.
- Embeddable into the admin dashboard page so all 3 forms live alongside the dashboards.

**Alternatives if you don't like Tally:** Fillout (similar feature set, slightly nicer UI, free tier weaker), Google Forms (free, but ugly + no conditional logic + no file uploads to Drive in one step), Typeform (paid, beautiful, overkill).

### The forms inventory

| Form | What it captures | Writes to | Triggered by |
|---|---|---|---|
| **Public Contact Form** (already exists — Web3Forms on `/contact`) | Lead name, email, company, topic, budget | `Leads` Sheet (via Cloudflare Worker webhook) | Public site visitor |
| **Lead Status Update** (admin-only Tally form) | Lead ID, new status, score, deal value, notes | Updates an existing row in `Leads` Sheet | Darsh / Adhvait, after a discovery call |
| **Create Invoice** (Tally) | Client, project, line items (repeatable group), terms, currency | New row in `Invoices` Sheet + triggers PDF generation via Apps Script | After a deal is signed |
| **Update Invoice Status** (Tally) | Invoice ID, new status, paid amount, paid date, payment method | Updates existing row in `Invoices` Sheet | When client pays / partially pays |
| **Log Expense** (Tally — mobile-first) | Vendor, category, amount, currency, payment method, billable, receipt photo upload | New row in `Expenses` Sheet | Anytime you spend money for the business |
| **New Task** (only if NOT using Asana/Jira) | Title, project, assignee, due date, priority, est hours | New row in `Tasks` Sheet | Skip this if you adopt Asana/Jira — use their UI instead |

### Form → Sheet → Tableau wiring

```
Tally Form
   │
   │  (native Tally → Google Sheets integration, 1-click setup)
   ▼
Google Sheet tab (Invoices / Expenses / Leads / etc.)
   │
   │  (optional: Apps Script trigger on edit — auto-set status,
   │   compute derived fields, send notification email)
   ▼
Tableau Cloud (refreshes from Sheet daily)
   │
   ▼
Embedded in app/admin/page.tsx via Tableau Embedding API
```

### Embedding the forms next to the dashboards

The admin page can show the dashboards on top, and below them a small "Quick Actions" row:

```
┌─ X9Elysium Admin ──────────────────────────────────────────┐
│  [Tab 1: Leads]  [Tab 2: SEO]  [Tab 3: Web]  [Tab 4: Tasks]│
│  [Tab 5: Finance]                                          │
│                                                            │
│  ▼ Embedded Tableau workbook                              │
│  ────────────────────────────────────────                 │
│                                                            │
│  Quick Actions:                                            │
│  [+ Log Expense]  [+ New Invoice]  [+ Update Status]      │
│  (each opens a Tally embed in a modal)                     │
└────────────────────────────────────────────────────────────┘
```

Tally provides `<iframe>` and modal-popup embeds out of the box — drop them straight into `app/admin/page.tsx`.

### Optional — Apps Script automation hooks

Worth adding once Tally → Sheets is wired:

- **Auto-set invoice `status = Overdue`** for any row where `due_date < today AND status NOT IN (Paid, Void)`. Runs nightly.
- **Email reminder to AP contact** when an invoice flips to Overdue.
- **Email Darsh + Adhvait** a Monday morning digest: open A/R, expenses last week, upcoming due invoices.
- **Auto-render PDF** from the Invoices Sheet using a Google Docs template on row creation.

All of these are 30–60 lines of Apps Script each. Build them later — get the dashboard live first.

---

## 3. Tableau hosting — pick one

| Option | Cost | Auth | Verdict for X9Elysium |
|---|---|---|---|
| **Tableau Public** | Free | None — dashboards are *publicly viewable* if you have the URL | ❌ Don't use. Lead names + emails would be exposed. |
| **Tableau Cloud (Creator)** | ~US$75 / user / month, billed annually | Tableau-managed SSO, embed tokens (JWT) | ✅ **Recommended.** Cheapest legitimate path for a private admin dashboard. 1 Creator seat covers Darsh, Adhvait gets a Viewer seat at ~$15/mo. |
| **Tableau Server** | Self-hosted, infra cost + license | Yours | ❌ Overkill for 2 users. |
| **Free alternatives** | $0 | Varies | If Tableau cost stings: **Looker Studio** (free, GA4-native, embeddable, weakest for custom data shapes), **Metabase Cloud** (~$85/mo Starter, beautiful, great for SQL teams), **Hex** (free tier, notebook-style). |

**Recommendation:** Start with **Tableau Cloud**. If your friend already has a workbook built, this is the path of least resistance. ~US$90/mo total for both founders, all-in.

---

## 4. Embedding into x9elysium.com

The X9Elysium site is a **static export on Cloudflare Workers** — no Node runtime in production. So:

### Route
- Create `app/admin/page.tsx` (App Router, client component)
- Not linked from anywhere public
- Excluded from `app/sitemap.ts`
- Excluded from `public/llms.txt`
- `noindex, nofollow` meta tag on the page

### Auth (two layers — pick one or both)

**Layer A — Cloudflare Access (recommended, free for ≤50 users):**
- In Cloudflare Zero Trust dashboard, protect `x9elysium.com/admin/*` with an Access Application.
- Email-based auth: only `fd3687@yahoo.ca` and Adhvait's email can pass.
- Cloudflare injects an auth header before the request ever hits the page.
- Zero code on your end.
- *This is the cleanest option.*

**Layer B — Client-side PIN (mirror the journal pattern):**
- Same approach as `/docs/journal` — AES-GCM + PBKDF2-SHA-256, 100k iterations.
- Ciphertext-only ships in the bundle; PIN entry decrypts in browser.
- Less secure (determined attacker with the bundle could brute-force a 4-digit PIN), but zero infra.
- **Not appropriate alone** for a dashboard with real lead emails. Use Cloudflare Access.

### Embedding the Tableau dashboard

Tableau Cloud uses the **Tableau Embedding API v3**. In `app/admin/page.tsx`:

```tsx
"use client";
import Script from "next/script";

export default function AdminPage() {
  return (
    <>
      <Script
        type="module"
        src="https://prod-useast-a.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
      />
      <main className="min-h-screen bg-black p-6">
        <h1 className="text-white text-2xl mb-4">X9Elysium Admin</h1>
        {/* @ts-ignore — custom element from Tableau JS */}
        <tableau-viz
          id="tableauViz"
          src="https://prod-useast-a.online.tableau.com/t/x9elysium/views/X9Elysium-Admin/Leads"
          toolbar="bottom"
          hide-tabs={false}
          width="100%"
          height="900"
          token="<JWT-FROM-CLOUDFLARE-WORKER>"
        />
      </main>
    </>
  );
}
```

**JWT generation:** Tableau Cloud uses Connected Apps. A Cloudflare Worker (one tiny endpoint) signs a JWT with the Connected App secret and returns it to the page on load. The Worker is the only thing that ever holds the secret.

**Alternative if JWT/Connected App is too much:** publish the workbook as "Embed Password Saved", set a Tableau Cloud password on the workbook, and embed via iframe. Less elegant, works fine.

---

## 5. Friend's deliverable checklist

Send your friend this folder:
```
docs/admin-dashboard/
├── tableau-integration-plan.md    ← this file
├── friend-brief.md                ← what to read first
└── sample-data/
    ├── README.md                  ← schema for every CSV
    ├── leads.csv
    ├── seo-rankings.csv
    ├── seo-traffic.csv
    ├── website-analytics.csv
    ├── core-web-vitals.csv
    ├── tasks.csv
    └── campaigns.csv
```

He builds **one Tableau workbook with 4 sheets** matching §1. When ready, he publishes to a Tableau Cloud site (you'll provision one), and we wire the embed.

---

## 6. Phased rollout

**Phase 1 — Design (week 1, friend builds):**
- Friend builds workbook against sample CSVs.
- Iterate on chart choices + layout via screenshots.
- Lock the visual design.

**Phase 2 — Real data wiring (week 2):**
- Stand up the Google Sheets workbook with 7 tabs matching the CSV schemas.
- Write Apps Scripts: GSC daily pull, GA4/Plausible daily pull, PSI weekly pull.
- Web3Forms → Cloudflare Worker → Sheets webhook for new leads.
- Friend repoints workbook from CSV to Google Sheets connectors.

**Phase 3 — Embed (week 3):**
- Provision Tableau Cloud site, publish workbook.
- Build `app/admin/page.tsx` with Tableau Embedding API.
- Cloudflare Access in front of `/admin/*`.
- Cloudflare Worker for JWT signing.

**Phase 4 — Use it (ongoing):**
- Daily morning check.
- Adjust dashboards monthly as questions evolve.

---

## 7. Cost summary

| Line item | Monthly cost |
|---|---|
| Tableau Cloud — 1 Creator + 1 Viewer | ~US$90 |
| Asana Starter — 2 users (recommended for tasks, see §9) | ~US$22 |
| Tally — Free tier (forms) | $0 |
| Cloudflare Access (≤50 users) | $0 |
| Cloudflare Workers (current) | $0 |
| Google Sheets / Apps Script / Drive | $0 |
| Webhooks (Web3Forms → Worker) | $0 |
| **Total** | **~US$112/mo** |

Free alternative if cost is the blocker: Looker Studio + Google Sheets + Asana free tier (≤10 users) + Tally free covers ~80% of this for $0. Less polished, no real "embed with auth" story for Looker Studio (embeds are public-by-link), but functional.

---

## 8. Open decisions for Darsh

- [ ] Tableau Cloud (paid) vs Looker Studio (free) — pick your hosting before friend starts polishing.
- [ ] GA4 vs Plausible vs Cloudflare Web Analytics for the analytics feed — Plausible is cleanest, GA4 has more depth, Cloudflare is free + already on infra.
- [ ] **Asana vs Jira** for tasks — see §9. Recommendation: Asana.
- [ ] Tally vs Fillout for the data-entry forms — both free at the volume you'll hit.
- [ ] Confirm Cloudflare Access is OK with both founders' emails, or want a shared password instead.

---

## 9. Asana vs Jira (which one + Claude integration)

**Short answer: Asana for the agency. Use Jira only if you're going to live inside Claude/MCP and want first-party support.**

### Honest comparison

| Dimension | Asana | Jira | Winner for X9Elysium |
|---|---|---|---|
| **Daily UX for non-engineers** | Clean, list/board/timeline views, low cognitive overhead | Powerful but cluttered, designed for software teams | **Asana** — your clients are e-comm operators, not engineers |
| **Onboarding speed (a new client/contractor)** | ~10 min | ~1 hour | **Asana** |
| **Free tier** | Up to 10 users, unlimited tasks/projects | Up to 10 users, but only Standard plan unlocks reporting | **Tie** (both work for 2-person team) |
| **Paid tier (your scale)** | Starter US$10.99/user/mo | Standard US$7.53/user/mo | **Jira** (cheaper) |
| **API for syncing to Tableau** | Mature REST API, great docs | Mature REST API, even better docs (Atlassian) | **Tie** |
| **Claude / MCP integration** | Community MCP servers exist (e.g. `mcp-server-asana`), no first-party offering as of early 2026 | **Atlassian Remote MCP Server** (official, first-party, polished) — covers Jira + Confluence | **Jira** — by a meaningful margin |
| **Automations / workflow rules** | Asana Rules — visual, easy | Jira Automation — more powerful, steeper curve | **Tie** (depends on appetite) |
| **Built-in AI** | Asana Intelligence (summaries, smart fields) | Atlassian Intelligence (similar) | **Tie** |
| **Fits a consulting agency vs internal product team** | Built for cross-functional / external collaboration | Built for engineering teams shipping software | **Asana** |

### Claude / MCP — the deciding factor only if it's actually deciding

Both work fine *with* Claude — neither is a wall.

- **Asana via Claude:** community MCP servers (`mcp-server-asana` and friends) cover the basics — list tasks, create tasks, move statuses, add comments. They're solid for the things you'd actually ask Claude to do for you. Maintenance is community-driven, so quality varies.
- **Jira via Claude:** Atlassian shipped an official **Remote MCP Server** in 2025 that covers Jira + Confluence with full first-party support. It's the most polished MCP integration of any major PM tool right now. If you imagine yourself saying "Claude, summarize all open Northwind tasks and draft an end-of-week update," Jira's path is genuinely smoother today.

### My recommendation: **Asana**

Three reasons:
1. **You'll bring clients into it.** Asana is a much easier ask for a Director of Ecommerce at a Shopify Plus brand than Jira. The UX delta matters more than the MCP delta.
2. **You're not engineering-heavy.** Jira's strengths (sprints, story points, custom workflows, Bitbucket integration) don't apply. You'd be paying the UX tax for features you won't use.
3. **Claude integration is good enough on Asana.** Community MCP servers do what you need. If you go heavily MCP-dependent later, you can migrate — but that's an unlikely future.

**Pick Jira instead if:** you primarily operate via Claude prompts (not the PM tool's UI), you want first-party MCP guarantees, and clients are unlikely to be added to your project tracker.

### Either way — same Tableau pipeline

Both tools have REST APIs. An Apps Script (run nightly) pulls all tasks → writes to the `Tasks` Sheet → Tableau refreshes. Schema for the Sheet stays exactly as documented in `sample-data/README.md → tasks.csv`, so you can swap the source later without touching the workbook.
