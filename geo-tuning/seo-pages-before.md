# SEO Page Scores — Before (geo-tuning pass 2026-05-18)

Live fetch of both pages returned HTTP 403 (Cloudflare WAF blocks WebFetch tool UA).
Scores derived from source-code audit of `app/locations/toronto/page.tsx` and `app/locations/calgary/page.tsx`.

---

## /locations/toronto

| Criterion | Max | Score | Notes |
|-----------|-----|-------|-------|
| Title 30-60 chars | 10 | 10 | "Shopify Plus Agency in Toronto \| X9Elysium" = 43 chars ✓ |
| Meta description 140-160 chars | 10 | 10 | "Shopify Plus consulting and unified commerce for Greater Toronto Area retailers — store audits, custom apps, platform migrations, and ongoing optimization." = 154 chars ✓ |
| H1 contains "Shopify" + city | 10 | 10 | "Shopify Plus consulting for Toronto and the GTA" ✓ |
| LocalBusiness/ProfessionalService JSON-LD valid | 15 | 15 | `@type: "ProfessionalService"` with address, areaServed, serviceType ✓ |
| BreadcrumbList present | 5 | 5 | 3-item breadcrumb (Home → Locations → Toronto) ✓ |
| City names in body ≥3 times | 10 | 10 | Toronto, Mississauga, Brampton, Markham, Vaughan, Hamilton = 6 distinct in hero + service cards ✓ |
| Internal links to ≥3 blog posts | 10 | 10 | GTA-category posts render via BlogCard (toronto-agencies, dtc-playbook, migration-gta = 3+) ✓ |
| CTA above fold | 5 | 5 | `<BookingButton variant="accent" />` in hero section ✓ |
| HTTPS + canonical + og:image | 15 | 10 | HTTPS ✓, canonical set ✓; **og:image absent from page-level metadata** (no `images` key in `openGraph` config — root layout may supply a default, unverifiable without live fetch) |
| HTML clean | 10 | 10 | No structural issues visible in source |
| **TOTAL** | **100** | **95** | ✓ (target ≥90) |

**One gap:** og:image not explicitly set on the Toronto location page metadata. If root layout provides a fallback this may already be covered; confirm with live inspection.

---

## /locations/calgary

| Criterion | Max | Score | Notes |
|-----------|-----|-------|-------|
| Title 30-60 chars | 10 | 10 | "Shopify Agency in Calgary \| X9Elysium" = 38 chars ✓ |
| Meta description 140-160 chars | 10 | 0 | "Shopify Plus and unified commerce consulting for Calgary and Alberta retailers — B2B Shopify, energy-sector DTC spinoffs, and migrations." = **~137 chars** — under 140 |
| H1 contains "Shopify" + city | 10 | 10 | "Shopify consulting for Calgary and Western Canada." ✓ |
| LocalBusiness/ProfessionalService JSON-LD valid | 15 | 15 | `@type: "ProfessionalService"` with areaServed (Calgary, Cochrane, Airdrie, Okotoks, Edmonton, Alberta) ✓ |
| BreadcrumbList present | 5 | 5 | 3-item breadcrumb ✓ |
| City names in body ≥3 times | 10 | 10 | Calgary, Cochrane, Okotoks, Edmonton, Alberta = 5 distinct in hero + service cards ✓ |
| Internal links to ≥3 blog posts | 10 | 10 | Calgary-category posts render (calgary-agencies, calgary-dtc-hub, alberta-tax = 3) ✓ |
| CTA above fold | 5 | 5 | `<BookingButton variant="accent" />` in hero ✓ |
| HTTPS + canonical + og:image | 15 | 10 | HTTPS ✓, canonical ✓; **og:image absent** — same issue as Toronto page |
| HTML clean | 10 | 10 | No structural issues in source |
| **TOTAL** | **100** | **85** | ✗ (target ≥90) |

**Gaps:**
1. Meta description 3 chars under minimum (137 vs 140). Fix: extend by 5-8 chars.
2. og:image not set at page level — same caveat as Toronto.

---

## Action items from location page audit

| Priority | File | Fix |
|----------|------|-----|
| High | `app/locations/calgary/page.tsx` | Extend meta description from ~137 to 145-155 chars |
| Low | Both location pages | Confirm root layout supplies og:image fallback; if not, add explicit `images` to page-level `openGraph` config |
