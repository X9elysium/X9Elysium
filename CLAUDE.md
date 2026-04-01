# X9Elysium — Project Guide

## Overview
X9Elysium is a Shopify unified commerce consulting agency website. The site is being redesigned from a Pages Router (Next.js 14) template to a modern App Router build with a premium dark-mode aesthetic.

## Architecture

### Dual-Router Setup
- **`app/`** — New App Router pages (TypeScript, Framer Motion)
- **`pages/`** — Legacy Pages Router (JavaScript, GSAP) — retained for blog, about, contact during migration
- **IMPORTANT:** `pages/index.js` was removed to avoid route conflict with `app/page.tsx` on `/`. App Router takes priority but Next.js 14 doesn't resolve the conflict gracefully.

### Tech Stack (New)
- **Framework:** Next.js 14 (App Router + Pages Router coexisting)
- **Language:** TypeScript (new code), JavaScript (legacy)
- **Styling:** Tailwind CSS 3 (dark mode, custom utility classes in `app/globals.css`)
- **Animations:** Framer Motion
- **Icons:** lucide-react
- **Fonts:** Inter (via `next/font/google`)

### Key Directories
- `app/` — App Router root (layout, page, globals.css)
- `app/components/` — Client components for homepage sections
- `pages/` — Legacy router (blog, about, contact, etc.)
- `config/` — Site config JSON (menu, theme, social, config)
- `content/` — Markdown content for pages and blog posts
- `public/images/` — Static assets

### Design System
- Background: `#09090b` (near-black)
- Accents: indigo-500 (`#6366f1`) + teal-400 (`#2dd4bf`)
- Text: zinc-100 (primary), zinc-400 (secondary), zinc-500 (muted)
- Borders: `border-white/[0.06]` for subtle card edges
- Typography: Inter, bold headings with tight tracking
- Buttons: `.btn-primary` (gradient), `.btn-secondary` (outline) in globals.css

### Config Compatibility
- `tsconfig.json` must keep `baseUrl: "."` for Pages Router imports (e.g., `import "styles/style.scss"` in `_app.js`)
- `jsconfig.json` still exists — Next.js uses tsconfig when present
- Tailwind `content` array includes both `app/` and `pages/` paths

## Commands
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
npm start        # Production server
```

## Known Issues
- `node_modules/`, `.next/`, `.next-build/`, `tmp/` are owned by root (from a previous `sudo npm` run). Fix with: `sudo chown -R $(whoami) node_modules .next .next-build tmp`
- After fixing permissions: `rm -rf .next-build tmp` to clean stale build caches

## Redesign Progress

### Completed
- [x] Homepage hero section (gradient text, CTAs, grid bg pattern)
- [x] Navigation (sticky, transparent-to-solid scroll, mobile hamburger menu)
- [x] Services section (6-card grid with hover glow effects)
- [x] Why Choose Us (stats bar + 4 differentiator blocks)
- [x] Testimonials (3 placeholder cards with avatar initials)
- [x] CTA banner (gradient glow orbs, Book a Strategy Call)
- [x] Footer (4-column: brand, services, company, connect)
- [x] SEO metadata (OG tags, Twitter cards, keywords)
- [x] Tailwind CSS globals (custom utilities, scrollbar, selection)
- [x] TypeScript config (compatible with both routers)
- [x] Route conflict resolved (pages/index.js removed)
- [x] Framer Motion scroll-reveal animations on all sections
- [x] Inter font via next/font
- [x] Git history cleaned — single commit, sole author (Darsh Patel), all stale branches deleted

### Remaining
- [ ] About page (App Router)
- [ ] Services detail page (App Router)
- [ ] Work/case studies page (App Router)
- [ ] Contact page with form (App Router)
- [ ] Blog migration to App Router
- [ ] Real testimonials and case study content
- [ ] Favicon and OG image assets
- [ ] Production build verification

---

## Site Audit — snazzy-pothos-4a8a27.netlify.app (2026-04-01)

### What's Working Well

**Homepage (App Router — new design)**
- All 7 sections render correctly: Nav, Hero, Services, Why Us, Testimonials, CTA Banner, Footer
- Dark mode aesthetic applied (`#09090b` background via Tailwind CSS)
- Inter font loads and renders via `next/font` (woff2 preloaded)
- Framer Motion JS bundled and hydrates client-side (scroll-reveal, hover effects)
- Single optimized CSS bundle (`/_next/static/css/96b3cdd266bd70b9.css`)
- Anchor IDs present in code: `#services`, `#about`, `#work`, `#contact`

**SEO — Present**
- `<title>`: "X9Elysium — Shopify Unified Commerce Consulting"
- `<meta name="description">`: present and keyword-rich
- `<meta name="keywords">`: Shopify, unified commerce, ecommerce consulting, Shopify Plus, etc.
- Open Graph tags: og:title, og:description, og:url, og:site_name, og:type
- Twitter Card: summary_large_image with title + description
- Robots: `index, follow`
- `<html lang="en">` present
- Viewport meta: `width=device-width, initial-scale=1`

**Responsiveness**
- Viewport meta tag present
- Tailwind responsive breakpoints used throughout (sm/md/lg prefixes)
- Mobile hamburger menu with AnimatePresence transitions
- Responsive grid: 1-col mobile → 2-col tablet → 3-col desktop on services
- Text scales responsively (text-4xl → sm:text-5xl → md:text-6xl → lg:text-7xl)
- CTAs stack vertically on mobile, horizontal on sm+

**Legacy Pages (Pages Router — still working)**
- `/about` — loads, shows team + company info (old design/content)
- `/posts` — blog listing with 7 articles, author Darshan Patel
- `/contact` — loads and functional
- `/terms-policy` — loads with Terms & Privacy content

**Infrastructure**
- robots.txt present: `Allow: /`, `Disallow: /api/*`
- Clean HTML with Next.js streaming/RSC
- No visible script errors

### Issues Found

**SEO — Missing**
- [ ] **No favicon linked in layout.tsx** — file exists at `public/images/favicon.png` but not referenced in App Router layout
- [ ] **No canonical URL** — missing from metadata, hurts SEO deduplication
- [ ] **No OG image** — og:title/description set but no og:image (social shares will have no preview image)
- [ ] **No structured data / JSON-LD** — no schema.org markup (Organization, WebSite, Service)
- [ ] **No sitemap.xml** — only robots.txt exists, no sitemap for search engines

**Accessibility**
- [ ] **Only 1 ARIA attribute** — just `aria-label="Toggle menu"` on hamburger button
- [ ] **No skip-to-content link** — keyboard users can't skip navigation
- [ ] **No focus-visible styles** — tab navigation isn't visually indicated
- [ ] **Testimonial quotes use `&ldquo;`/`&rdquo;`** — fine, but no `<blockquote>` semantic element

**Content Mismatches (Legacy Pages vs New Brand)**
- [ ] **About page is outdated** — mentions WooCommerce, WordPress, Wix (not Shopify-focused), lists old team members, references "New York" office
- [ ] **Blog posts** — old content from 2023-2024, styled with legacy light-mode Poppins design, not matching new dark-mode aesthetic
- [ ] **Contact page** — uses old template design, doesn't match homepage

**Functionality**
- [ ] **Placeholder social links** — Footer Connect section has generic `https://linkedin.com`, `https://twitter.com`, `https://instagram.com` (not actual company profiles)
- [ ] **No contact form on homepage** — `#contact` scrolls to footer (email/phone only), no actual form
- [ ] **"Book a Strategy Call" has no booking integration** — links to `#contact` (footer), not a Calendly/Cal.com embed

**Performance**
- [ ] **No image optimization** — homepage has zero images (acceptable for now, but hero could benefit from a visual)
- [ ] **Framer Motion bundle size** — adds ~40KB to client JS; acceptable but worth monitoring

### Priority Fixes (Quick Wins)
1. Add favicon to `app/layout.tsx` → `<link rel="icon" href="/images/favicon.png" />`
2. Add canonical URL to metadata → `metadataBase: new URL("https://x9elysium.com")`
3. Add OG image (create or use existing brand image)
4. Replace placeholder social links with real X9Elysium profiles
5. Add skip-to-content link in layout
6. Generate sitemap.xml (use `next-sitemap` or manual)
