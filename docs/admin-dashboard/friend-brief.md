# Tableau Build Brief — X9Elysium Admin Dashboard

Hey — thanks for taking this on. Quick brief so you have everything you need.

## What we're building

One Tableau workbook with **5 dashboards (sheets / tabs)** that I'll embed into x9elysium.com behind auth as my agency's private command center.

The five tabs answer five questions:
1. **Leads & Pipeline** — what's in the funnel, what's converting?
2. **SEO Performance** — are we ranking, is organic growing?
3. **Website Health** — is the site fast, who's visiting, are they converting?
4. **Tasks & Operations** — what's open this week, **what did we ship this quarter (Q1, Q2, …)**, what's slipping?
5. **Finance & Operations** — revenue, expenses, A/R aging, cash flow, sample invoice template

Full spec for each tab (KPI tiles, chart types, fields, **including the quarterly performance row on Tab 4**) is in **`tableau-integration-plan.md` § 1**. Read that first — it tells you exactly what to put on each tab.

## Sample data

In `sample-data/`. Ten CSVs + one sample invoice template:

- `leads.csv` — feeds Tab 1
- `seo-rankings.csv` + `seo-traffic.csv` — feed Tab 2
- `website-analytics.csv` + `core-web-vitals.csv` — feed Tab 3
- `tasks.csv` — feeds Tab 4 (includes `created_at`, `completed_at`, `due_date` so quarterly rollups + on-time-completion metrics work out of the box)
- `invoices.csv` + `expenses.csv` — feed Tab 5
- `sample-invoice.md` — the standardized X9Elysium invoice template (renders one row of `invoices.csv` as a real invoice)
- `x-posts.csv` — feeds Tab 6 (Social — X). **Ships header-only**; rows are appended automatically by the GitHub Actions cron in `scripts/x/`. Design Tab 6 to render a friendly empty state until rows arrive (first cron post at 17:13 UTC).
- `campaigns.csv` — optional Tab 7 if you want to add a marketing/campaigns view (Instagram is intentionally excluded — brand strategy is X-only)

`sample-data/README.md` documents every column (type + meaning + example values + suggested calc fields like DSO, A/R aging, completion rate). Date columns are ISO 8601.

## Important note on Tab 4 (Tasks)

I want a clear quarterly read in addition to the day-to-day. Please add a **filterable quarter selector** (defaults to the current quarter) and a row of KPI tiles showing:

- **Tasks completed in quarter** (count of `status=Done` AND `completed_at` falls in selected quarter)
- **Completion rate** (Done / Total created in quarter), with green/amber/red badge: ≥85% / 70–84% / <70%
- **On-time rate** (Done before due_date / Done)
- **Avg cycle time** (`completed_at` − `created_at`, days)
- **Q-over-Q delta** for completed tasks (this Q vs prior Q)

Sample data spans Nov 2025 → May 2026 so you'll have full Q4 2025, Q1 2026, and partial Q2 2026 to demo against.

## Important note on Tab 5 (Finance)

This is the new tab. I want it to answer "did we make money this month and who owes us?" at a glance. KPI row at top, A/R aging bucket chart, cash-flow line chart, expense breakdown by category. See `tableau-integration-plan.md` § 1 → Tab 5 for the full list. Treat `invoices.csv` and `expenses.csv` as separate sources — no joins needed for v1.

The data spans roughly **Nov 2025 → May 2026** so trend charts have something to show. It's synthetic but shaped to match what real X9Elysium data will look like in production (Shopify Plus consulting, GTA-based, Canada + US clients, ~2 inbound leads/week).

## Brand / visual

If you can match the X9Elysium aesthetic in the workbook it'll embed seamlessly:

- **Primary background:** matte black `#000000` / near-black `#0a0a0a`
- **Accent / brand color:** emerald green `#10b981` (use this for the primary KPI color, "good" state, top series in line charts)
- **Emerald light:** `#34d399` — for hover / secondary
- **Emerald dark:** `#059669` — for negative-space accents
- **Warning / mid:** amber `#f59e0b`
- **Bad / red:** `#ef4444`
- **Text on dark:** white `#ffffff` for primary, `#a3a3a3` for secondary
- **Borders / dividers:** very low-opacity white `rgba(255,255,255,0.06)`
- **Font:** Inter (close substitute fine if Tableau doesn't have it — Tableau Book or Tableau Semibold work)

Premium / minimal vibe — lots of whitespace, no gradients on charts, thin lines, subtle grid lines.

## Output

When you're done, share:
1. A `.twbx` file (packaged workbook) so I have it locally.
2. Screenshots of all 4 tabs at a typical 1440×900 viewport.
3. The published view URL on your Tableau account so I can preview before we move it to my Tableau Cloud site.

## Don'ts

- Don't add data sources I haven't given you — keep the schema fixed so swapping CSV → Google Sheets later is mechanical.
- Don't put any real-looking PII in calculated fields or in dashboard titles. The sample lead names + emails are fake but treat them as if they were real.
- Don't publish to Tableau Public — these dashboards will have lead emails when wired to real data, so they need to live somewhere private.

Ping me with questions any time. Happy to jump on a call to walk through the spec.
