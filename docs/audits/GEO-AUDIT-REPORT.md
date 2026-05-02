# GEO + SEO Audit — x9elysium.com

- **Date:** 2026-05-02
- **Domain:** https://x9elysium.com
- **Business type detected:** Agency (Shopify consulting) with multi-location targeting (Toronto, Calgary, Vancouver/Mississauga)
- **Stack:** Next.js 14 (App Router + Pages Router), static export, served via Hostinger CDN with HTTP/2 + HTTP/3
- **Composite GEO Score:** **48 / 100** — Foundation is strong, content layer is broken

> One issue dominates this audit: every single blog post URL returns **HTTP 500**. The blog index, sitemap, and `llms.txt` all advertise these articles to AI crawlers and to Google, but none of them resolve. Fixing this single deploy bug lifts the composite score by an estimated **16–20 points**.

---

## Composite Score

| Category | Weight | Score | Contribution |
|---|---|---|---|
| AI Citability & Visibility | 25% | 35/100 | 8.75 |
| Brand Authority Signals | 20% | 45/100 | 9.00 |
| Content Quality & E-E-A-T | 20% | 40/100 | 8.00 |
| Technical Foundations | 15% | 70/100 | 10.50 |
| Structured Data | 10% | 65/100 | 6.50 |
| Platform Optimization | 10% | 50/100 | 5.00 |
| **Total** | **100%** | | **47.75 → 48** |

---

## Critical Issues (P0 — fix this week)

### 1. All 18 blog posts return HTTP 500
Every individual article URL — both the named slugs from your last commit and the legacy `post-1` … `post-10` placeholders — responds with `500 Internal Server Error`.

```
500  /blog/shopify-agency-cost-canada-2026
500  /blog/best-shopify-plus-agencies-toronto-2026
500  /blog/launching-dtc-brand-toronto-90-day-playbook
500  /blog/shopify-plus-migration-guide-gta-retailers
500  /blog/best-shopify-agencies-calgary-2026
500  /blog/western-canada-ecommerce-calgary-dtc-hub
500  /blog/shopify-tax-setup-alberta-no-pst
500  /blog/unified-commerce-vs-omnichannel-canadian-retailers
500  /blog/post-1 … /blog/post-10
```

The blog index ([app/blog](app/blog/) — or wherever it lives) lists these slugs, the sitemap lists them, and [llms.txt](public/llms.txt) explicitly promotes the named ones to AI crawlers. From an AI-search perspective, this is the worst-case shape: the agency is *advertising* deep regional Shopify expertise (Toronto, Calgary, Alberta tax, GTA migrations) through canonical entry points, then serving 500s. ChatGPT, Claude, and Perplexity will not cite a 500 page; Google will deindex them after repeated errors.

This was very likely introduced by the latest commit `74c97f4 added blogs and career pages` — careers index + detail pages return 200, blog index returns 200, but blog detail routes are misbuilt or missing from the static export.

**Fix path (in priority order):**
- Confirm whether blog post pages are App Router dynamic routes (e.g. [app/blog/[slug]/page.tsx](app/blog/)) or Pages Router (`pages/blog/[slug].js`). With `output: "export"` you must export `generateStaticParams()` (App Router) or `getStaticPaths` with `fallback: false` (Pages Router) so each slug pre-renders to a static `.html` file.
- Run `npm run build` locally and inspect `out/blog/` — you should see one HTML file per slug. If the directory is empty or only contains the index, the params function isn't enumerating slugs.
- Confirm the Markdown source files for each slug actually exist under [content/](content/) (or wherever blog posts live) and that frontmatter parsing isn't throwing.
- After redeploy, re-test all 18 URLs and re-submit the sitemap to Google Search Console + Bing Webmaster.

### 2. `/terms-policy` returns 500
Same class of issue. This page is reachable from the footer and is a trust signal AI engines look for when deciding whether to cite an entity. It also breaks the sitemap.

### 3. No `<link rel="canonical">` on any page checked
With static export and identical content available at `/path` and (potentially) `/path/`, missing canonicals invites duplicate-content downgrades and split AI signals. Add canonicals via Next.js metadata: `metadata.alternates.canonical = "https://x9elysium.com/<path>"` in each page's `generateMetadata` (or static `metadata` export).

---

## High-Priority Issues (P1)

### 4. Blog `BlogPosting` schema contains placeholder/duplicate content
The Blog JSON-LD on [/blog](https://x9elysium.com/blog) lists posts with the headline:

> "Payments in E-commerce - Navigating the Future of Digital Transactions in 2024"

…repeated across multiple `BlogPosting` entries (visible on `post-8` and `post-9` at minimum). When AI crawlers parse this graph they see a publisher pumping out duplicate, year-stale, generic posts under a 2026 brand. Strip the legacy `post-N` placeholders entirely and only emit `BlogPosting` entries for the real named slugs once they return 200.

### 5. Every `BlogPosting` has the same `datePublished` (today, 2026-05-02)
The build is stamping `datePublished` and `dateModified` from the build timestamp instead of frontmatter. A blog where every post is "published today" is a freshness signal AI models actively distrust. Read `date` from each post's Markdown frontmatter and emit it verbatim.

### 6. Inconsistent Organization description
The homepage Organization schema says:
> "Enterprise Shopify consulting. Store audits, custom integrations, platform migrations, and unified commerce strategy for ambitious retailers."

Every other page (about, services, locations, blog) says:
> "Shopify unified commerce consulting for retailers ready to scale. Store audits, custom apps, platform migrations, and commerce strategy."

LLMs derive entity descriptions by consensus across pages. Pick one canonical sentence and emit it from a single shared schema component.

### 7. Sitemap `lastmod` is the build timestamp on every URL
Every URL shows `lastmod=2026-05-02T16:06:58.843Z`. This tells Google nothing about which pages are actually fresh. Source `lastmod` from the underlying file's mtime (or frontmatter `date`/`updated`).

### 8. Blog index advertises 18 broken posts, hurting crawl budget
Until P0 #1 is resolved, the blog index is leaking equity to dead URLs. Either temporarily hide unreleased post links or short-circuit the build to 200 stub pages so AI crawlers see *something* meaningful.

---

## Medium-Priority Issues (P2)

### 9. No `Article` / `BlogPosting` schema on individual posts (once they return 200)
Each article should ship its own JSON-LD with `Article`, `author` (Person with credentials), `datePublished`, `dateModified`, `mainEntityOfPage`, `image`, `publisher` (referencing `#organization`), and `wordCount`. This is the single highest-leverage schema for AI citability.

### 10. No `FAQPage` schema on location or service pages
Location pages like [/locations/toronto](https://x9elysium.com/locations/toronto) are exactly the shape AI engines reward when wrapped in FAQ schema: "How much does Shopify Plus consulting cost in Toronto?", "Do you work with retailers under $1M ARR?", "What's the typical migration timeline?". Add 4–6 FAQs per location and per service. Perplexity and Google AIO disproportionately surface FAQ-marked passages.

### 11. No `Service` / `OfferCatalog` schema on `/services`
The services page describes six disciplines but doesn't expose them as `Service` entities linked to the Organization. Add an `OfferCatalog` with one `Service` per discipline (Audits, Migrations, Custom Apps, Unified Commerce, CRO, Retainers) — each with `provider`, `serviceType`, `areaServed`.

### 12. No author/Person schema, no E-E-A-T expert byline
The blog references "Darshan Patel" as author in the (broken) Blog schema, but there's no `Person` entity with credentials, `sameAs` to LinkedIn, `jobTitle`, `affiliation`. This is the strongest first-party E-E-A-T signal AI models can verify.

### 13. Brand mention surface is thin
Organization `sameAs` covers Instagram, Facebook, LinkedIn — useful but weak. AI engines weight Reddit, YouTube, Wikipedia, and high-DA listicles 3× more than backlinks (per Ahrefs Dec 2025). Plan for: Reddit AMA in r/shopify or r/ecommerce, YouTube tear-downs of public Shopify stores, Wikipedia draft for the agency once independent coverage exists, and submission to Shopify Partner directories.

### 14. No images optimized for AI consumption
No image entries in the sitemap, and the Organization logo points at `/images/x9-logo.png` (raster) — not the SVG you almost certainly have. AI engines (notably Bing Copilot and Google AIO) attach images to citations; missing or low-quality logos suppress this.

---

## Low-Priority / Nice-to-Have (P3)

- Add `theme-color` to dark scheme only (already done) — fine.
- Add `application/manifest+json` (PWA manifest) for richer entity signals.
- Add a real OG image (per CLAUDE.md "Remaining" list — still outstanding).
- Add `speakable` properties on top FAQs for voice/AI assistant consumption.

---

## What's Working (keep doing)

- **`robots.txt` is best-in-class for AI access** — explicitly allow-listed GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Google-Extended, CCBot, anthropic-ai, Amazonbot, and Applebot-Extended. Most agency sites get this wrong.
- **`llms.txt` is well-structured** — proper sections, prioritized links, hub/spoke layout, RSS feed reference. The only fault is that it advertises URLs that 500.
- **Schema baseline is solid** — Organization with `ContactPoint`, `PostalAddress`, `sameAs`; `WebSite` with `SearchAction`; `ProfessionalService` with city-level `areaServed` on Toronto/Calgary; `BreadcrumbList` on all secondary pages.
- **Heading hierarchy is clean** — one H1 per page, sensible H2s, no H3 inflation.
- **Performance baseline is strong** — HTTP/2 + HTTP/3 (`alt-svc: h3`), edge-cached (`x-nextjs-cache: HIT`, `s-maxage=31536000`), HTTPS with `upgrade-insecure-requests` CSP, Inter font via `next/font`.
- **Sitemap exists, is referenced from `robots.txt`, and includes location and career pages.**
- **OG + Twitter card metadata are present and consistent** with `og:type`, `og:site_name`, `summary_large_image`.

---

## Prioritized Action Plan

### This week (target +18 score points)
1. **Fix blog post 500s.** Verify `generateStaticParams()` / `getStaticPaths` enumerates every slug. Confirm `out/blog/<slug>.html` files exist after `npm run build`. Redeploy. (P0)
2. **Fix `/terms-policy` 500.** Same diagnosis path. (P0)
3. **Strip legacy `post-1` … `post-10` placeholders** from blog index, sitemap, and Blog schema. (P1)
4. **Add `<link rel="canonical">` to every page** via `generateMetadata`. (P0)
5. **Read `datePublished` from frontmatter, not build time.** (P1)
6. **Unify Organization description** across all pages (one shared component). (P1)
7. **Source sitemap `lastmod` from file mtime / frontmatter.** (P1)

### Next 2 weeks (target +8 score points)
8. Add `Article` schema to each blog post (author Person, dates, image, wordCount).
9. Add `FAQPage` schema to `/locations/toronto`, `/locations/calgary`, `/services` (4–6 questions each).
10. Add `Service` / `OfferCatalog` schema to `/services` (one Service per discipline).
11. Add Person schema for Darshan Patel with `jobTitle`, `sameAs` LinkedIn, `worksFor` referencing Organization.
12. Add a real OG image and the `<meta name="application-name">`.

### Next 6 weeks (target +6 score points)
13. Brand authority push: 2–3 Reddit answers per week in r/shopify, r/ecommerce, r/entrepreneur (no spam — actual operator answers); YouTube channel with 3 store tear-downs; submit to Shopify Partner Directory and Clutch.
14. Add 2–3 net-new long-form posts targeting Vancouver, Edmonton, Ottawa to round out Canadian regional coverage (matches your llms.txt narrative).
15. Add `speakable` to FAQs and primary value props.
16. Add `HowTo` schema to a migration playbook post (Magento → Shopify Plus is highest intent).

---

## Per-Category Breakdown

### AI Citability & Visibility — 35/100 (weight 25%)
- ✅ AI crawlers (GPT, Claude, Perplexity, Google-Extended, CCBot, Amazonbot, Applebot) explicitly allowed
- ✅ `llms.txt` exists, follows the spec, includes hub/spoke organization
- ❌ Every article URL referenced from `llms.txt` returns 500 — there's nothing for AI to actually cite
- ❌ No passage-optimized chunks (no `<aside>`/callouts with self-contained answers)
- ❌ No FAQ schema
- ❌ No author Person schema

### Brand Authority Signals — 45/100 (weight 20%)
- ✅ `sameAs` covers Instagram, Facebook, LinkedIn
- ❌ No Reddit, YouTube, Wikipedia presence (the platforms AI models cite most)
- ❌ No third-party listicle/award mentions surfaced
- ⚠️ Brand is genuinely young; this score is honest, not a defect

### Content Quality & E-E-A-T — 40/100 (weight 20%)
- ✅ Home/about/services/location pages have substantive copy (400–1,000 words each), specific operator language ("revenue compounds", "first ceiling", "Albertan operators")
- ✅ One H1, clean H2 structure, no keyword stuffing
- ❌ Author entity has no credentials, no LinkedIn `sameAs`, no `jobTitle`
- ❌ All blog content is unreachable
- ❌ No original data, case studies, or numbers (CLAUDE.md confirms "Real testimonials and case study content" still pending)

### Technical Foundations — 70/100 (weight 15%)
- ✅ HTTPS, HTTP/2, HTTP/3, edge cache, `s-maxage` set
- ✅ `output: "export"` static export — fully SSR'd HTML for AI parsers
- ✅ Sitemap, robots.txt, no JS-only content
- ❌ Missing canonicals
- ❌ Sitemap `lastmod` is build time, not real freshness
- ⚠️ Core Web Vitals not measured in this audit (run [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fx9elysium.com%2F) for real INP/LCP/CLS numbers)

### Structured Data — 65/100 (weight 10%)
- ✅ `Organization` with full `ContactPoint`, `PostalAddress`, `sameAs`
- ✅ `WebSite` with `SearchAction`
- ✅ `ProfessionalService` on locations with city-level `areaServed`
- ✅ `BreadcrumbList` on secondary pages
- ✅ `Blog` on `/blog`
- ❌ Duplicate placeholder titles in `BlogPosting` entries
- ❌ No `Article` / `BlogPosting` per individual post (would be moot until 500s fixed)
- ❌ No `FAQPage`, `Service`, `OfferCatalog`, `Person`, `HowTo`

### Platform Optimization — 50/100 (weight 10%)
- ✅ Consistent OG + Twitter card metadata
- ✅ Schema baseline supports Bing Copilot and Google AIO entity recognition
- ❌ No working long-form content for Perplexity / ChatGPT search to chunk
- ❌ No FAQ structure for AIO pull-quotes
- ❌ No OG image (CLAUDE.md confirms outstanding)

---

## Files & references

- Site map: https://x9elysium.com/sitemap.xml (32 URLs, ~18 of them currently 500ing)
- llms.txt: https://x9elysium.com/llms.txt (well-formed; links to broken posts)
- Robots: https://x9elysium.com/robots.txt (best-in-class)
- Project context: [CLAUDE.md](CLAUDE.md)
- Recent commit triggering blog 500s: `74c97f4 added blogs and career pages`

---

## TL;DR

You have an unusually clean GEO foundation — robots.txt, llms.txt, and entity schema are better than most agency sites I see. But the entire content tier is currently a 500. Until that's fixed, AI engines will see X9Elysium as an entity with locations, contact info, and a promise of deep Canadian Shopify content — that they cannot actually read. Fix the blog static export, then layer FAQ + Article + Person schema and you're at a 65–70 GEO score in 2 weeks.
