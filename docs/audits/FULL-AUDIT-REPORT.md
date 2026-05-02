# X9Elysium SEO Audit — Full Report

**Site:** https://x9elysium.com
**Audit date:** 2026-05-02
**Business type:** Agency (Shopify consulting) with strong local-service signals (Toronto, Calgary, Mississauga)
**Hosting platform observed:** Hostinger (response header `platform: hostinger`, `x-powered-by: Next.js`) — note: `CLAUDE.md` and `netlify.toml` describe a static export to Netlify; current deploy does not match.

---

## Executive Summary

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 45 | 9.9 |
| Content Quality | 23% | 55 | 12.7 |
| On-Page SEO | 20% | 40 | 8.0 |
| Schema / Structured Data | 10% | 85 | 8.5 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 60 | 6.0 |
| Images | 5% | 65 | 3.3 |
| **SEO Health Score** | | | **53.8 / 100** |

**Headline finding:** Foundations are well thought-out (rich JSON-LD graph, AI-crawler allowlist, llms.txt, per-blog metadata), but two production-grade defects are dragging the site down hard:

1. **Every blog post detail page returns HTTP 500.** All 18 URLs in the sitemap under `/blog/<slug>` 5xx. Confirmed on `post-1`, `post-6`, `best-shopify-plus-agencies-toronto-2026`, `launching-dtc-brand-toronto-90-day-playbook`. RSS feed and `/blog` index work, but the actual articles do not. This is the #1 ranking-blocker on the site.
2. **Five primary pages share the exact same `<title>` and meta description:** `/`, `/about`, `/services`, `/work`, `/contact`. They all return `X9Elysium — Shopify Commerce Consulting` and the same description, because each subpage is a `"use client"` component and Next 14 App Router silently disallows `metadata` exports from client components — so they fall through to the root-layout defaults.

Fix those two and the score jumps roughly 20 points before any other work.

### Top 5 critical issues (do this week)

1. **`/blog/<slug>` returns 500** — HTTP 500 on every post. Internal links from `/blog`, `/locations/*`, footer, and llms.txt all lead to error pages. Search engines will deindex.
2. **Duplicate title/meta on 5 main pages** — homepage, about, services, work, contact all share the same title tag. Google treats this as a single canonical entity and will demote the duplicates.
3. **No canonical on the 5 main pages** — only `/blog`, `/locations/*`, `/careers`, blog-post pages have `<link rel="canonical">`. Homepage and money pages have none.
4. **404 page returns 500** — `/this-page-does-not-exist-12345` returns HTTP 500 instead of 404. Google's crawler treats 5xx as a temporary issue and will retry indefinitely; Search Console will fill with soft errors.
5. **`output: "export"` removed from `next.config.js`** — `CLAUDE.md` describes a static export to Netlify; the current `next.config.js` has no `output` field and `netlify.toml` still says `publish = "out"`. The build is in an inconsistent state and the live site is being served from Hostinger.

### Top 5 quick wins

1. Convert `app/about/page.tsx`, `app/services/page.tsx`, `app/work/page.tsx`, `app/contact/page.tsx` to server components with `metadata` exports (split client-only sections into child components). One commit fixes finding #2.
2. Add `alternates: { canonical: "https://x9elysium.com" }` to root layout and per-page exports.
3. Delete `content/posts/post-1.md` … `post-10.md`. They are leftover Hugo template fluff (generic ROI / strategic-planning essays) that hurt E-E-A-T. Remove from sitemap, add 410 (or 301 to a relevant real post).
4. Create `/public/images/og-image.png` (1200×630). Today the blog metadata fallback points to a 404.
5. Generate a real `/404` page (Next App Router's `app/not-found.tsx`) so soft-404s become hard 404s.

---

## Technical SEO

### Crawlability
- ✅ `robots.txt` is well-built: `User-agent: *` allows site, blocks `/api/`, lists sitemap. Explicit allow-list for 12 AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, CCBot, anthropic-ai, Amazonbot, Applebot-Extended).
- ✅ `sitemap.xml` resolves at root, lists 33 URLs with priority, lastmod 2026-05-02 on most entries.
- 🛑 **Sitemap lists URLs that 500.** All 18 blog posts and the `/terms-policy` page are in the sitemap; blog posts are broken. Either fix the routes or remove from sitemap until they're back.
- ⚠️ Trailing-slash behaviour returns 308. Internal links use the non-trailing form, which is fine, but do not let any external system link with a trailing slash — every redirect costs link equity.

### Indexability
- ✅ `<meta name="robots" content="index, follow">` on all main pages.
- ⚠️ Five main pages have **no canonical**: `/`, `/about`, `/services`, `/work`, `/contact`. Without an explicit canonical, Google may pick the wrong URL when query strings or UTM params are appended (e.g., from Tawk.to or Clarity).
- 🛑 **Blog post 500s** — confirmed on:
  - `https://x9elysium.com/blog/post-1` → 500
  - `https://x9elysium.com/blog/post-6` → 500
  - `https://x9elysium.com/blog/best-shopify-plus-agencies-toronto-2026` → 500
  - `https://x9elysium.com/blog/launching-dtc-brand-toronto-90-day-playbook` → 500
  - Trailing-slash variants 308 → 500.
- 🛑 **Hard 404 missing** — random URL returns 500, not 404. `app/not-found.tsx` does not exist.

### Build / hosting consistency
- 🛑 `next.config.js` no longer sets `output: "export"`. Per `CLAUDE.md`, this site is intended to deploy as a static export to Netlify (`netlify.toml` still declares `publish = "out"`). The live response headers show the site running on Hostinger with `x-powered-by: Next.js`. Either:
  - re-enable static export and deploy `out/` to Netlify; or
  - commit to a Node host, update `CLAUDE.md` and `netlify.toml`, and figure out why blog/[slug] specifically 500s on Hostinger.
- ⚠️ `next.config.js` line 6: `images: { unoptimized: true }`. This is required for static export but means every `<Image>` ships the original file at every viewport — no WebP, no responsive srcset.

### Security / headers
- ✅ HTTPS enforced. `content-security-policy: upgrade-insecure-requests` is present.
- ⚠️ No `Strict-Transport-Security`, no `X-Content-Type-Options`, no `Referrer-Policy`. Add these via `netlify.toml` (or whichever host's headers config is live).
- ⚠️ Tawk.to and Microsoft Clarity load via `Script strategy="afterInteractive"`. Both ship third-party JS that can degrade INP. Prefer `lazyOnload` for Tawk.

### Core Web Vitals
- Could not pull live CrUX data without auth. Static analysis flags:
  - **LCP risk**: 4.4 MB `hero-video.mp4` + an animated emerald-glow gradient hero. Heavy first paint, especially on mobile.
  - **INP risk**: Tawk.to widget mounts a chat iframe + listeners; Clarity mounts a session-recorder. Both run on `afterInteractive`. Combined, this often pushes mobile INP over 200 ms.
  - **CLS**: Likely fine — Inter via `next/font/google` reserves font space, all `<Image>` components have explicit `width`/`height`.
- **Action:** run a real Lighthouse on `/` and `/locations/toronto`; a 4.4 MB hero video should be `preload="none"`, `playsinline`, and ideally below-the-fold or replaced with a poster image.

---

## On-Page SEO

### Title tags & meta descriptions

| URL | Title | Description | Canonical |
|---|---|---|---|
| `/` | "X9Elysium — Shopify Commerce Consulting" | shared default | ❌ none |
| `/about` | "X9Elysium — Shopify Commerce Consulting" | shared default | ❌ none |
| `/services` | "X9Elysium — Shopify Commerce Consulting" | shared default | ❌ none |
| `/work` | "X9Elysium — Shopify Commerce Consulting" | shared default | ❌ none |
| `/contact` | "X9Elysium — Shopify Commerce Consulting" | shared default | ❌ none |
| `/blog` | "Insights \| X9Elysium — Shopify Strategy for Toronto, Calgary & Vancouver" | unique | ✅ |
| `/locations/toronto` | "Shopify Plus Agency in Toronto \| X9Elysium" | unique | ✅ |
| `/locations/calgary` | "Shopify Agency in Calgary \| X9Elysium" | unique | ✅ |
| `/careers` | "Careers \| X9Elysium — Build the Future of Canadian Commerce With Us" | unique | ✅ |

**Root cause:** [app/about/page.tsx:1](app/about/page.tsx#L1), [app/services/page.tsx:1](app/services/page.tsx#L1), [app/work/page.tsx:1](app/work/page.tsx#L1), [app/contact/page.tsx:1](app/contact/page.tsx#L1) all start with `"use client"`. Client components in the App Router cannot export `metadata` — Next silently ignores it and falls back to the root layout. The `careers/page.tsx` works because it is a server component.

**Fix pattern:** keep the page as a server component, export `metadata`, and move client-side state/animations into a child component:

```tsx
// app/services/page.tsx (server component)
import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Shopify Plus Services | X9Elysium",
  description: "Shopify store audits, custom apps, platform migrations, and unified commerce strategy for Canadian retailers.",
  alternates: { canonical: "https://x9elysium.com/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
```

### Heading structure
- ✅ Single `<h1>` on every page audited.
- ⚠️ Earlier WebFetch read of `/work` summarized three H1-style strings ("Our Work", "Client Stories", "Let's build something that lasts."). Raw HTML shows only one `<h1>` tag, but verify the visual hierarchy matches semantic levels — sometimes Tailwind classes paint H2/H3 to look like display text and confuse the reader.

### Internal linking
- ✅ Solid: nav links, footer, breadcrumb JSON-LD on inner pages, llms.txt cross-references.
- 🛑 Internal links to `/blog/<slug>` from `/blog` index, location pages, and llms.txt all currently lead to 500-ing pages. Until #1 is fixed, every internal blog link is hostile to crawlers.

---

## Schema / Structured Data

This is the strongest area of the site.

- ✅ Root layout ships an `@graph` with three nodes: `Organization`, `WebSite`, `ProfessionalService` ([app/layout.tsx:58-115](app/layout.tsx#L58-L115)). Includes ContactPoint, PostalAddress, sameAs (Instagram, Facebook, LinkedIn).
- ✅ Blog index emits `Blog` + `BreadcrumbList` ([app/blog/page.tsx:34-70](app/blog/page.tsx#L34-L70)).
- ✅ Blog post detail emits `BlogPosting` (with `inLanguage: "en-CA"`, `wordCount`, author with `sameAs`), `BreadcrumbList`, and `FAQPage` only when the post defines FAQs ([app/blog/[slug]/page.tsx:77-138](app/blog/[slug]/page.tsx#L77-L138)). Conditional FAQ emission is correct — meets the Aug 2023 Google guideline.
- ✅ Locations page ships `ProfessionalService` (LocalBusiness shape) + `BreadcrumbList` with `areaServed` listing Toronto, Mississauga, Brampton, Markham, Vaughan, Hamilton, GTA admin area ([app/locations/toronto/page.tsx:32-77](app/locations/toronto/page.tsx#L32-L77)).
- ✅ Career detail emits `JobPosting` with `hiringOrganization`, `jobLocationType: TELECOMMUTE`, `applicantLocationRequirements: Country/Canada` ([app/careers/[slug]/page.tsx:58-83](app/careers/[slug]/page.tsx#L58-L83)).

### Improvements
- ⚠️ `JobPosting` is missing `validThrough`, `baseSalary`, and `directApply: false`. Google now requires `validThrough` to keep job listings eligible for the rich result.
- ⚠️ Add `WebPage` nodes to inner pages (services, work, contact) once they have unique metadata.
- ⚠️ Consider `Service` schema for the six service offerings on `/services` (one per service).
- ⚠️ `Organization.address` is set to Mississauga only; `llms.txt` and copy claim a presence in Vancouver and Calgary. If Vancouver is a real office (not just a service area), add `OfficeLocation` or a second `LocalBusiness` node.
- ⚠️ No `aggregateRating` / `Review` schema on the agency. If client testimonials are real and verifiable, this is a high-leverage add for AI citations.

---

## Content Quality (E-E-A-T)

### What's working
- Real authored content on the 8 location-aware MDX posts (Toronto, Calgary, Canada-wide). 1.4k–2k words each. First-person, opinionated, dated.
- Strong author signal: `Darshan Patel` with avatar, LinkedIn `sameAs`, bio attached to every post via `DEFAULT_AUTHOR` ([app/lib/blog.ts:23-29](app/lib/blog.ts#L23-L29)).
- Locations pages have unique metadata, schema, and pull only category-tagged posts.

### What's hurting E-E-A-T
- 🛑 **`content/posts/post-1.md` … `post-10.md` are leftover Hugo template fluff.** Topics: "Maximizing ROI with E-commerce Consulting", "Maximizing ROI with Strategic Planning", etc. — generic, AI-flavoured prose that doesn't cite client work, doesn't mention Shopify specifically, doesn't reflect the agency's real expertise. They dilute the topical authority the 8 real posts are building.
  - `post-6.md` is only 350 words — thin content.
  - `post-2.md` even contains a placeholder broken image: `![ROI](https://your-image-url/roi.png)`.
  - These 10 URLs are in the sitemap, indexed (when they don't 500), and pull the site's authorship signal toward generic blog spam.
- ⚠️ Real posts have ISO dates of `2023-04-04` (post-1) up through 2026 (real ones). When the post-N files get fixed and indexed, mixed-era content with no `dateModified` updates looks stale.
- ⚠️ No author page (`/authors/darshan-patel`). The author is referenced as `https://x9elysium.com/about` instead — fine, but a dedicated author entity strengthens E-E-A-T more.

### Recommendation
Treat post-1 … post-10 as a deletion candidate set. For each:
- If the topic is genuinely on-brand: rewrite from scratch with X9Elysium specifics, add a real `dateModified`, link to a real case study, and rename the slug to something descriptive.
- Otherwise: 410 (gone) via Netlify `_redirects` or 301 to the closest topical real post.

---

## Performance

- ⚠️ **Hero video 4.4 MB** at `public/hero-video.mp4`. Even with `playsInline` and lazy-loading semantics, a 4 MB asset on a hero section is an LCP and data-cap risk on mobile. Either:
  - serve a poster JPG (~80 KB) as the LCP element and load the video on `requestIdleCallback`; or
  - re-encode at 1080p H.265 + WebM at ~1.5 MB; or
  - drop the video on viewports < 768 px.
- ⚠️ **Tawk.to + Clarity** both load on `afterInteractive` ([app/layout.tsx:129-152](app/layout.tsx#L129-L152)). Combined that's ~150–200 KB of third-party JS plus runtime cost. Move Tawk to `lazyOnload` (or to `delayed` based on user interaction). Consider gating Clarity to non-iframe sessions only.
- ⚠️ **`images: { unoptimized: true }`** ([next.config.js:6](next.config.js#L6)) — required for static export, but means no automatic WebP/AVIF, no responsive srcset. If you stay on Hostinger Node, drop this flag and let Next optimise.
- ✅ Inter via `next/font/google` with `display: swap` and explicit weights — eliminates CLS from font loading.

---

## Images

- ✅ All 5 homepage `<img>` elements have non-empty `alt` text.
- ✅ Explicit `width`/`height` on every `<Image>` keeps CLS contained.
- ⚠️ **No `og-image.png`** in `public/images/`. Blog metadata fallback ([app/blog/[slug]/page.tsx:32](app/blog/[slug]/page.tsx#L32)) points to `https://x9elysium.com/images/og-image.png` which 404s. Twitter / LinkedIn previews for posts without a `heroImage` will be image-less.
- ⚠️ Logo files duplicated: `logo-1.png` (86k), `logo-x9e.png` (86k), `logo.png` (12k), `logo-dark.svg` (11k), `logo.svg` (11k), `logoo.jpg` (63k), `x9-logo.png` (200k). Pick one canonical logo per format and delete the rest — keeps the bundle small and avoids cache thrash.
- ⚠️ `flower.jpg` (313k) and `Instagram.html` in repo root look like leftovers — confirm they aren't shipping.

---

## AI Search Readiness (GEO)

- ✅ **Excellent `llms.txt`** ([public/llms.txt](public/llms.txt)) — TL;DR, ARR range, services list, locations served, recent insights with one-sentence summaries, RSS + sitemap pointers.
- ✅ **All major AI crawlers explicitly allowed** in `robots.txt`.
- ✅ **`inLanguage: "en-CA"`** set on `BlogPosting` schema — reinforces Canadian relevance for AI grounding.
- 🛑 **Citability collapses on blog 500s.** Perplexity, ChatGPT, and Gemini crawl `/blog/<slug>` to verify the claims in `llms.txt`. When those URLs 500, the model's confidence in citing X9Elysium drops — and the AI allowlist becomes meaningless.
- ⚠️ `llms.txt` mentions Vancouver as a served location, but there is no `/locations/vancouver` page. Either build one (high-leverage local SEO for an under-served BC market) or remove the Vancouver line from llms.txt and copy.
- ⚠️ No "Frequently Asked Questions" block on `/services`, `/contact`, or `/about`. AI grounding picks up self-contained Q/A passages well; the homepage FAQ is a good model — repeat it on `/services`.

---

## Sitemap audit

- ✅ Sitemap is valid XML, generated dynamically from `app/sitemap.ts`, includes 33 URLs.
- ✅ Sensible priorities: `/` 1.0, `/contact` 0.9, `/locations/*` 0.85, `/blog` 0.8, `/careers` 0.75.
- 🛑 Sitemap lists 18 blog post URLs that 500.
- ⚠️ All `lastModified` values default to `new Date()` for static routes ([app/sitemap.ts:11-57](app/sitemap.ts#L11-L57)) — every build "updates" every page. Better to read git mtime or hard-code per-page lastmod.
- ⚠️ Sitemap doesn't include `/blog/post-1` … `/blog/post-10` URLs explicitly because `getAllPosts` reads them — once those template files are deleted, they automatically drop from the sitemap. Good.

---

## Hreflang / international
- ✅ `<html lang="en">` set ([app/layout.tsx:118](app/layout.tsx#L118)).
- ✅ `inLanguage: "en-CA"` on `BlogPosting`.
- ⚠️ Mixed signals: HTML lang is `en` (generic), schema is `en-CA`. Pick one. Recommend `lang="en-CA"` since target audience is Canadian.
- N/A: no other languages — no hreflang work needed.
