# GEO Technical SEO Audit — x9elysium.com
Date: 2026-05-02

## Technical Score: 82/100 — Good

The foundation is strong: server-side rendering is healthy, AI crawler access is best-in-class, and TTFB is excellent. But three critical issues are dragging the score down: **500 errors on every blog post in the sitemap**, **no canonical tags on the homepage and key pages**, and **a www subdomain that resolves without redirecting**. Security headers are also barebones (only `upgrade-insecure-requests`).

## Score Breakdown
| Category | Score | Status |
|---|---|---|
| Crawlability | 13/15 | Pass |
| Indexability | 8/12 | Warn |
| Security | 5/10 | Warn |
| URL Structure | 8/8 | Pass |
| Mobile Optimization | 10/10 | Pass |
| Core Web Vitals (estimated) | 13/15 | Pass |
| Server-Side Rendering | 15/15 | Pass |
| Page Speed & Server | 10/15 | Warn |

Status: Pass = 80%+ of category points, Warn = 50–79%, Fail = <50%

---

## AI Crawler Access — Excellent

The robots.txt is one of the best-configured I've seen for GEO. Every major AI crawler is explicitly allowed.

| Crawler | User-Agent | Status | Recommendation |
|---|---|---|---|
| GPTBot | GPTBot | ✅ Allowed | None — keep allowed |
| OAI-SearchBot | OAI-SearchBot | ✅ Allowed | None — ChatGPT search bot |
| ChatGPT-User | ChatGPT-User | ✅ Allowed | None — user-triggered ChatGPT fetches |
| Google-Extended | Google-Extended | ✅ Allowed | None — Gemini training |
| Googlebot | * (default Allow) | ✅ Allowed | None |
| PerplexityBot | PerplexityBot | ✅ Allowed | None |
| Perplexity-User | Perplexity-User | ✅ Allowed | None |
| ClaudeBot | ClaudeBot | ✅ Allowed | None |
| Claude-Web | Claude-Web | ✅ Allowed | None |
| anthropic-ai | anthropic-ai | ✅ Allowed | None |
| Amazonbot | Amazonbot | ✅ Allowed | None |
| Applebot-Extended | Applebot-Extended | ✅ Allowed | None |
| CCBot | CCBot | ✅ Allowed | None |
| Bingbot | * (default Allow) | ✅ Allowed | None |
| Bytespider | * (default Allow) | ✅ Allowed | TikTok/ByteDance — implicit allow is fine |
| FacebookBot | * (default Allow) | ✅ Allowed | Meta AI — implicit allow is fine |

`Sitemap: https://x9elysium.com/sitemap.xml` is referenced. `Disallow: /api/` is appropriate.

---

## Critical Issues (fix immediately)

### 1. All blog post URLs in the sitemap return HTTP 500

This is the single most damaging issue on the site. Every individual blog post listed in `sitemap.xml` returns a `500 Internal Server Error`:

| URL | Status |
|---|---|
| `/blog/best-shopify-plus-agencies-toronto-2026` | 500 |
| `/blog/shopify-agency-cost-canada-2026` | 500 |
| `/blog/launching-dtc-brand-toronto-90-day-playbook` | 500 |
| `/blog/shopify-plus-migration-guide-gta-retailers` | 500 |
| `/blog/best-shopify-agencies-calgary-2026` | 500 |
| `/blog/post-1` … `/blog/post-10` | 500 |

The blog index ([/blog](https://x9elysium.com/blog)) renders fine and links to all 18 posts, but every link is broken. The sitemap is advertising broken pages to Googlebot, GPTBot, PerplexityBot, etc. Search engines deindex sites that repeatedly serve 500s on URLs in their sitemap.

**Note**: Headers say `x-powered-by: Next.js` and `x-nextjs-cache: DYNAMIC` on the failing routes — the site is being served through a Next.js server (likely on Hostinger), not as a pure static export as `next.config.js` suggests. Whatever data fetching the blog post route does at request time is throwing.

**Fix**: SSH into the server and check the Next.js logs for the failing route. Either fix the data source or, if these are static markdown posts under `pages/blog/[slug].js` or `app/blog/[slug]/page.tsx`, ensure the export step is running and the files are deployed.

### 2. www subdomain resolves without redirecting → duplicate content

`https://www.x9elysium.com/` returns `HTTP/2 200` with full page content, instead of 301-redirecting to `https://x9elysium.com/`. Combined with the missing canonical tag on the homepage (issue #3), search engines may index both versions and split link equity.

**Fix**: In Hostinger DNS or the Next.js config, add a 301 redirect from `www.x9elysium.com/*` to `x9elysium.com/$1`.

### 3. Homepage and `/about` are missing canonical tags

| Page | Canonical |
|---|---|
| `/` (homepage) | ❌ Missing |
| `/about` | ❌ Missing |
| `/contact` | Not verified — likely missing |
| `/locations/toronto` | ✅ `https://x9elysium.com/locations/toronto` |

Location pages have canonicals, but the homepage and about page do not. Inconsistent canonical implementation makes the duplicate-content risk in issue #2 worse.

**Fix**: Add `metadataBase` + `alternates.canonical` to the root `app/layout.tsx` or set per-page canonicals via Next.js Metadata API. Every indexable page should self-canonicalize.

### 4. Static asset caching is disabled

Static CSS/JS files under `/_next/static/` return:

```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
```

This forces the browser to re-download CSS, JS chunks, and font files on every page load, even though Next.js content-hashes filenames specifically to enable long-term caching. The correct header for `_next/static/*` is `public, max-age=31536000, immutable`.

**Fix**: This is a Hostinger / hcdn configuration issue. Override cache-control for `/_next/static/` paths to long-cache + immutable. If using Netlify (per CLAUDE.md), the Netlify config may have been overridden by Hostinger's defaults — confirm where the site is actually hosted and fix at that layer.

---

## Warnings (fix this month)

### 5. Security headers are minimal

Only `Content-Security-Policy: upgrade-insecure-requests` is set. Missing:

| Header | Recommended Value | Status |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | ❌ Missing |
| `X-Content-Type-Options` | `nosniff` | ❌ Missing |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | ❌ Missing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ❌ Missing |
| `Permissions-Policy` | Restrict camera, mic, geolocation | ❌ Missing |
| `Content-Security-Policy` | A real CSP, not just upgrade-insecure-requests | ⚠️ Weak |

**Fix**: Add headers in `next.config.js` `headers()` function or in Hostinger's CDN settings. HSTS in particular is important for the SSL trust signal that AI platforms factor into citation decisions.

### 6. `/posts` is linked from the homepage footer but returns 500

The homepage links `href="/posts"` (footer or nav), but `/posts` returns 500. The blog index lives at `/blog`. Either fix the link to point to `/blog` or add a 301 redirect from `/posts` → `/blog`.

### 7. Hero logo image is PNG, not WebP/AVIF

`/images/x9-logo.png` is preloaded with `fetchPriority="high"` (good for LCP), but it's a PNG. Modern formats compress 25–50% better.

**Fix**: Convert key above-fold images (`x9-logo.png`, hero images on `/locations/*`, team photos under `/images/about/team/`) to WebP or AVIF. Next.js Image already handles format negotiation if you use the `<Image>` component with a configured `images.formats`.

### 8. Sitemap URLs use placeholder slugs (`/blog/post-9`, `/blog/post-8`)

The sitemap mixes real, named blog post slugs (`best-shopify-plus-agencies-toronto-2026`) with placeholder slugs (`post-1` through `post-10`). If those `post-N` URLs are leftover scaffolding, remove them from the sitemap; otherwise rename them to descriptive slugs before submission to Google Search Console / Bing Webmaster Tools.

### 9. Cache-Control on HTML pages is `s-maxage=31536000`

HTML pages return `cache-control: s-maxage=31536000, stale-while-revalidate`. A one-year edge cache on HTML is risky — when you publish a content fix or correct a typo, the change won't propagate until cache invalidation. The hcdn cache shows `HIT` even on a homepage that's been served for 1.5M seconds (~18 days).

**Fix**: Reduce `s-maxage` for HTML to something like 3600 (1 hour) with `stale-while-revalidate=86400`, or add cache-purge hooks to the deploy process.

---

## Recommendations (optimize this quarter)

### 10. Implement IndexNow

`/.well-known/indexnow-key.txt` returns 404. IndexNow notifies Bing, Yandex, Seznam, and Naver instantly when content changes. ChatGPT and Bing Copilot both index off Bing's crawl, so faster Bing indexing = faster AI citation eligibility.

For Next.js, add an IndexNow ping to your deploy hook or content-publish flow.

### 11. Add LinkedIn social link to homepage

`sameAs` in the Organization JSON-LD includes `linkedin.com/company/x9elysium`, but the homepage footer links only point to Facebook, Instagram, and email. Inconsistent social presence weakens the brand-entity signal that AI platforms use for citation credibility.

### 12. Re-verify deployment target

CLAUDE.md says the site is deployed on Netlify with `output: "export"`, but response headers report `platform: hostinger`, `panel: hpanel`, `server: hcdn`, and `x-nextjs-cache: HIT/DYNAMIC`. The site is running as a Next.js server on Hostinger, not as a Netlify static export. This mismatch likely explains the broken blog routes (issue #1) and the broken cache headers (issue #4) — the static export config and the Hostinger server runtime aren't talking to each other cleanly. Pick one deployment target and align the config.

---

## Detailed Findings

### Crawlability (13/15)
- robots.txt: valid syntax, sitemap reference present, AI crawlers explicitly allowed (5/5)
- Sitemap: 32 URLs, valid XML, lastmod present (`2026-05-02T16:06:58Z`)
- **Deduction (-2)**: 6+ URLs in sitemap return 500 — see critical issue #1
- Crawl depth: all important pages within 2 clicks of homepage
- No erroneous noindex directives on indexable pages

### Indexability (8/12)
- **Canonical tags**: only present on `/locations/*` (1/3)
- **Duplicate content**: www subdomain not redirected (1/3)
- Pagination: N/A — site is small (2/2)
- Hreflang: N/A — single-language site (2/2)
- Index bloat: 32 URLs in sitemap matches expected page count (2/2)

### Security (5/10)
- HTTPS enforced, HTTP 301-redirects to HTTPS (4/4)
- Valid SSL certificate, no mixed content
- HSTS: missing (0/2)
- X-Content-Type-Options: missing (0/1)
- X-Frame-Options: missing (0/1)
- Referrer-Policy: missing (0/1)
- CSP: weak — only `upgrade-insecure-requests` (1/1, generously)

### URL Structure (8/8)
- Clean, lowercase, hyphenated URLs (2/2)
- Logical hierarchy (`/blog/[slug]`, `/locations/[city]`) (2/2)
- HTTP→HTTPS is a single 301 hop (2/2)
- No parameter-based duplicate pages observed (2/2)

### Mobile Optimization (10/10)
- `<meta name="viewport" content="width=device-width, initial-scale=1">` ✓
- Tailwind-based responsive layout, no horizontal scroll
- Tap targets and typography appear appropriately sized (visual review pending)
- Mobile content parity with desktop (same SSR HTML)

### Core Web Vitals — estimated (13/15)
Without CrUX field data, scoring from page characteristics:

- **LCP (4/5)**: Hero logo preloaded with `fetchPriority="high"`, explicit `width="36" height="36"`, font preloaded with `as="font" crossorigin`. TTFB is 107ms. Hero image is PNG instead of WebP/AVIF — minor. Estimate LCP < 2.5s.
- **INP (4/5)**: Next.js + Framer Motion + Tawk.to chat widget (third-party, async-loaded). 9 JS chunks. Tawk.to is the main risk for input delay if it executes synchronously after load.
- **CLS (5/5)**: All images have explicit `width`/`height`, fonts use `next/font` with subsetting (no FOUT), no obvious dynamically-injected content above the fold.

Run a real CrUX / PageSpeed Insights check at https://pagespeed.web.dev/?url=https://x9elysium.com to confirm.

### Server-Side Rendering (15/15) — Excellent

`curl -s https://x9elysium.com/` (no JS) returns the full rendered DOM:
- 30+ heading tags (`<h1>` through `<h4>`) present in raw HTML
- JSON-LD (`@type: Organization`, `WebSite`, `ProfessionalService`) embedded
- All meta tags (title, description, robots, OG, Twitter) in `<head>`
- 27+ internal/external links in raw HTML
- Main content text rendered server-side

This is exactly what AI crawlers need. SSR is the single most important technical factor for GEO and the site nails it.

### Page Speed & Server Performance (10/15)
- TTFB: 107ms homepage, 111ms about, 125ms contact, 111ms toronto (3/3) — excellent
- Homepage HTML: 112KB; about: 41KB; contact: 42KB; toronto: 91KB (2/2)
- Images: PNG/JPG with lazy loading + explicit dimensions, but no WebP/AVIF (2/3)
- JS bundles: 9 chunks, no single bundle > 200KB compressed (2/2)
- Compression: Brotli enabled (`content-encoding: br`) (2/2)
- **Cache headers (0/2)**: static `_next/static/*` files served with `cache-control: private, no-cache, no-store, max-age=0` — see critical issue #4
- CDN: hcdn (Hostinger CDN), `alt-svc: h3=":443"` (HTTP/3 enabled) (1/1)

---

## Action Plan — Prioritized

| Priority | Action | Impact | Effort |
|---|---|---|---|
| P0 | Fix 500 errors on all `/blog/[slug]` URLs | High — blocks all blog citation/indexing | Medium |
| P0 | Add 301 redirect: `www.x9elysium.com` → `x9elysium.com` | High — duplicate content | Low |
| P0 | Add canonical tags to homepage, /about, /contact, /careers, /blog | High — indexability | Low |
| P0 | Fix `_next/static/*` cache-control to `public, max-age=31536000, immutable` | High — repeat-visit performance | Low |
| P1 | Add HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy headers | Medium — trust + security | Low |
| P1 | Fix or redirect `/posts` → `/blog` | Medium — broken footer link | Low |
| P1 | Convert hero/team images to WebP via Next.js `<Image>` | Medium — LCP | Medium |
| P1 | Replace placeholder `post-1`…`post-10` slugs in sitemap | Medium — sitemap quality | Medium |
| P2 | Implement IndexNow `.well-known/indexnow-key.txt` + ping on deploy | Medium — Bing/ChatGPT indexing speed | Medium |
| P2 | Reduce HTML `s-maxage` from 31536000 to 3600 | Low — content freshness | Low |
| P2 | Add LinkedIn link to homepage footer | Low — entity consistency | Low |
| P2 | Reconcile deployment target (Netlify vs Hostinger) | Medium — root cause of P0 issues | Medium |

Once P0 items are fixed, the score should jump to the low 90s.
