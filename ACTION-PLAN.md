# X9Elysium SEO Action Plan

**SEO Health Score:** 53.8 / 100 — "Needs Work"
**Audit date:** 2026-05-02

Two fixes (blog 500s + duplicate titles on 5 main pages) move the score to ~75. Everything below is sequenced to deliver the biggest score lift per hour of work.

---

## Critical (fix this week)

### C1. Blog post detail pages return HTTP 500
**Score impact:** ~10 points. Affects content quality, on-page SEO, AI search readiness.

Every URL under `/blog/<slug>` returns 500. Confirmed on `post-1`, `post-6`, `best-shopify-plus-agencies-toronto-2026`, `launching-dtc-brand-toronto-90-day-playbook`. The sitemap, blog index, footer, and llms.txt all link to these dead URLs.

**Likely root cause:** [next.config.js:5-9](next.config.js#L5-L9) no longer sets `output: "export"`, but `netlify.toml` and the project setup still expect a static export. The site is currently being served from Hostinger (`platform: hostinger`, `x-powered-by: Next.js` in response headers), and the Hostinger Next.js build is failing on the dynamic `[slug]` route — likely an MDX rendering error in `BlogContent` or `extractToc` on first request.

**Fix path A (recommended) — restore static export to Netlify:**
1. Re-add `output: "export"` to [next.config.js](next.config.js).
2. Verify `getAllPosts()` and `getAllJobs()` return at build time (no runtime fs reads — they already use `import "server-only"` correctly).
3. Run `npm run build` locally and confirm `out/blog/<slug>/index.html` exists for every post.
4. Push to Netlify; point DNS back to Netlify.

**Fix path B — keep on Hostinger as Node app:**
1. SSH into Hostinger, run `npm run build && npm start`, capture the actual 500 stack from the Node logs for `/blog/[slug]`.
2. Most likely culprit: `BlogContent` (next-mdx-remote or similar) failing on one of the `post-*.md` files, which then poisons the entire route's static generation.
3. Quick triage: temporarily filter `getAllPosts()` to only return the 8 real `.mdx` files; redeploy; if blog detail then works, the 10 template `.md` files are the cause and should be deleted (see C3).

**Validation:** `curl -sI https://x9elysium.com/blog/launching-dtc-brand-toronto-90-day-playbook` returns `200`, not `500`.

---

### C2. Duplicate title + meta description on 5 main pages
**Score impact:** ~6 points. On-page SEO crater.

`/`, `/about`, `/services`, `/work`, `/contact` all return identical `<title>X9Elysium — Shopify Commerce Consulting</title>` and identical meta description. Root cause: each subpage starts with `"use client"`, and Next.js App Router silently disallows `metadata` exports from client components.

**Fix:** convert each page to a server component, push the existing client logic into a `*Client.tsx` child.

Files to refactor:
- [app/about/page.tsx](app/about/page.tsx) → server component + `app/about/AboutClient.tsx`
- [app/services/page.tsx](app/services/page.tsx) → server component + `app/services/ServicesClient.tsx`
- [app/work/page.tsx](app/work/page.tsx) → server component + `app/work/WorkClient.tsx`
- [app/contact/page.tsx](app/contact/page.tsx) → server component + `app/contact/ContactClient.tsx`

Per-page metadata (suggested):

| Page | Title | Description |
|---|---|---|
| `/` | "Shopify Plus Consulting Agency \| X9Elysium" | "Shopify Plus consulting for Canadian retailers. Store audits, custom apps, platform migrations, and unified commerce strategy from Toronto, Calgary, and Mississauga." |
| `/about` | "About X9Elysium \| Shopify Plus Consultancy" | "Founded 2022 in Vancouver. 50+ Shopify projects, 98% client retention, $12M+ GMV managed across DTC, B2B, and unified commerce." |
| `/services` | "Shopify Plus Services \| X9Elysium" | "Store audits, custom Shopify apps, ERP integrations, platform migrations from Magento and WooCommerce, and CRO retainers for Canadian retailers." |
| `/work` | "Case Studies & Client Stories \| X9Elysium" | "Real Shopify migrations, headless storefront builds, and CRO outcomes — including +40% Q1 revenue and sub-1s load times." |
| `/contact` | "Book a Strategy Call \| X9Elysium" | "Free 30-minute consultation. We respond within one business day. Toronto, Calgary, Mississauga, and remote across Canada." |

**Validation:** `curl -s https://x9elysium.com/<page> \| grep -oE '<title>[^<]+</title>'` returns a unique title per page.

---

### C3. 404 page returns 500
**Score impact:** ~3 points. Crawl-budget and Search Console hygiene.

`https://x9elysium.com/this-page-does-not-exist-12345` returns HTTP 500 instead of 404. Google retries 5xx URLs and floods Search Console with soft errors.

**Fix:** create `app/not-found.tsx` that returns valid 404 HTML with `<meta name="robots" content="noindex">`. With `output: "export"` re-enabled, this generates a static `out/404.html` that Netlify will serve for missing routes.

**Validation:** `curl -sI https://x9elysium.com/this-page-does-not-exist-12345` returns `404`.

---

### C4. Add canonicals to the 5 main pages
**Score impact:** ~2 points.

Once C2 is done, add `alternates: { canonical: "..." }` to each new server-component metadata export. Also add `alternates.canonical` to the root layout's `metadata` so the homepage gets a canonical even when no per-page one is set.

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://x9elysium.com"),
  alternates: { canonical: "/" },   // ← add
  // ...
};
```

---

## High (fix within 2 weeks)

### H1. Delete or rewrite `post-1.md` … `post-10.md`
**Score impact:** ~5 points. Content quality / E-E-A-T.

Generic Hugo template essays on "Maximizing ROI", "Strategic Planning", etc. They dilute the topical authority the 8 real Canadian-Shopify posts build. `post-2.md` even ships a placeholder broken image (`https://your-image-url/roi.png`). `post-6.md` is 350 words — thin content.

**Action:**
1. Delete all 10 `.md` files from `content/posts/`.
2. Add 410 (Gone) entries to `public/_redirects`:
   ```
   /blog/post-1   /blog                                                                              410
   /blog/post-2   /blog                                                                              410
   ...
   ```
   Or 301 each to the closest topically-relevant real post.
3. Remove the corresponding lines from `public/_redirects` legacy `/posts/post-N → /blog/post-N` block (lines 5–14) since the targets no longer exist.
4. Confirm sitemap regenerates with only the 8 real posts (sitemap is dynamic, so this happens automatically on next build).

---

### H2. Build the missing `/locations/vancouver` page
**Score impact:** ~2 points. Local SEO + AI grounding consistency.

`llms.txt` and homepage copy both market Vancouver as a served location, but `/locations/vancouver` does not exist. AI models cross-check `llms.txt` claims against actual pages.

**Action:** clone `app/locations/calgary/page.tsx`, swap content to BC-specific (HST/PST in BC, Vancouver fashion/cannabis verticals, ferry/last-mile considerations). Add a `vancouver` category to `app/lib/blog-types.ts` and tag a few posts.

---

### H3. Replace 4.4 MB hero video with a poster image + lazy-loaded video
**Score impact:** ~2 points. Core Web Vitals (LCP).

[public/hero-video.mp4](public/hero-video.mp4) at 4.4 MB is the heaviest asset on first paint. Likely tanking LCP on mobile.

**Action:**
- Encode an MP4 (H.265) and WebM at 1080p, 1500 kbps target → ~1.2 MB each.
- Use `<video poster="/images/hero-poster.jpg" preload="none" playsInline muted loop>` and start playback on `requestIdleCallback`.
- For viewports < 640 px, skip the video entirely and show only the poster.

**Validation:** Lighthouse mobile LCP < 2.5 s, CLS < 0.1.

---

### H4. Move Tawk.to to `lazyOnload`, audit Clarity necessity
**Score impact:** ~1 point. INP.

[app/layout.tsx:129-152](app/layout.tsx#L129-L152) loads both Tawk.to and Microsoft Clarity on `afterInteractive`. That's ~200 KB of third-party JS during the post-load critical path.

**Action:**
- Tawk: `<Script id="tawk-to" strategy="lazyOnload">` — chat widget doesn't need to be ready in the first 3 s.
- Clarity: it must be loaded early to capture the full session, but consider sampling (`window.clarity('set', 'sample', 0.5)`) to halve the runtime cost.

---

### H5. Create a real Open Graph image
**Score impact:** ~1 point. Social CTR + brand consistency.

`public/images/og-image.png` does not exist. Blog metadata fallback at [app/blog/[slug]/page.tsx:32](app/blog/[slug]/page.tsx#L32) currently 404s for any post without a `heroImage` frontmatter field.

**Action:** generate a 1200×630 PNG with the X9Elysium wordmark, emerald accent, and tagline. Save as `public/images/og-image.png`. Also add this as the default OG image in `app/layout.tsx` so the homepage and Twitter cards have a real image.

---

## Medium (fix within 1 month)

### M1. Add `Service` schema to `/services`
Six service offerings × one `Service` node each. Each links to `provider: { "@id": "https://x9elysium.com/#organization" }` and `serviceType` matches the existing `ProfessionalService.serviceType` array.

### M2. Add `validThrough`, `baseSalary` to `JobPosting`
Google now treats `JobPosting` rich results as ineligible without `validThrough`. Add a 60-day default in [app/careers/[slug]/page.tsx:58](app/careers/[slug]/page.tsx#L58).

### M3. FAQ block on `/services` and `/contact`
The homepage has an FAQ component already. Reuse it on `/services` (pricing, timeline, deliverables) and `/contact` (response SLA, what to bring to the call). Emit `FAQPage` JSON-LD only on these specific pages — note that for commercial sites, FAQ rich results are no longer shown by Google but the markup still helps Perplexity / ChatGPT / Bing Copilot citations.

### M4. Security headers
Add to `netlify.toml` (or current host's headers config):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### M5. Stable `lastModified` per route
[app/sitemap.ts:11-57](app/sitemap.ts#L11-L57) sets every static page's `lastModified` to `new Date()`, so every build "updates" every URL. Replace with hard-coded ISO dates per route, updated only when the page actually changes.

### M6. `lang="en-CA"` instead of `lang="en"`
[app/layout.tsx:118](app/layout.tsx#L118) currently sets `lang="en"`. Schema uses `en-CA`. Pick one and align — recommend `en-CA`.

### M7. Tighten image inventory
Delete duplicate logo files in `public/images/` (`logo-1.png`, `logo-x9e.png`, `logoo.jpg`). Keep `x9-logo.png` and the SVG. Confirm `Instagram.html` in repo root and `flower.jpg` aren't shipping.

---

## Low (backlog)

- **L1.** Author entity page at `/authors/darshan-patel` with `Person` schema; reference it from `BlogPosting.author.url`.
- **L2.** `aggregateRating` schema on the Organization once you have verifiable reviews (Google Business, Clutch, Shopify Partner Directory).
- **L3.** Add `OfferCatalog` to `ProfessionalService` listing the six service offerings with price ranges.
- **L4.** RSS feed includes only blog posts — add categories per post for AI feed parsers.
- **L5.** Consider an `image-optimizer` pass on remaining `public/images/**` to convert JPGs to WebP/AVIF (manual, since `images.unoptimized: true` is required for export).
- **L6.** Sitemap-ping IndexNow to Bing/Yandex on each deploy — useful once blog 500s are fixed.

---

## Validation checklist

After each Critical/High fix, run:

```bash
# 1. blog post resolves
curl -sI https://x9elysium.com/blog/launching-dtc-brand-toronto-90-day-playbook | head -1   # expect HTTP/2 200

# 2. unique titles
for p in / /about /services /work /contact; do
  echo "$p $(curl -s https://x9elysium.com$p | grep -oE '<title>[^<]+</title>' | head -1)"
done   # expect 5 different titles

# 3. canonicals present
for p in / /about /services /work /contact; do
  echo "$p $(curl -s https://x9elysium.com$p | grep -oE '<link rel="canonical"[^>]*>' | head -1)"
done   # expect a canonical on every line

# 4. real 404
curl -sI https://x9elysium.com/this-page-does-not-exist-12345 | head -1   # expect HTTP/2 404

# 5. sitemap clean
curl -s https://x9elysium.com/sitemap.xml | grep -oE 'https://x9elysium.com/blog/[^<]+' | xargs -I{} sh -c 'echo "$(curl -sI {} | head -1) {}"'
# every line should start with HTTP/2 200
```

---

## Expected score after each phase

| Phase | Score | Delta |
|---|---|---|
| Today | 54 | — |
| After Critical (C1–C4) | 75 | +21 |
| After High (H1–H5) | 84 | +9 |
| After Medium (M1–M7) | 90 | +6 |
| After Low (L1–L6) | 93 | +3 |
