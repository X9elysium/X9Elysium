# X9Elysium — Project Guide

## Overview
X9Elysium is a Shopify unified commerce consulting agency website built with Next.js 14 (App Router + legacy Pages Router). Deployed on Hostinger at x9elysium.com (site + domain). Premium dark-mode aesthetic with emerald green accent.

## Architecture

### Dual-Router Setup
- **`app/`** — New App Router pages (TypeScript, Framer Motion)
- **`pages/`** — Legacy Pages Router (JavaScript, GSAP) — retained for blog, about during migration
- **IMPORTANT:** `pages/index.js` was removed to avoid route conflict with `app/page.tsx` on `/`.

### Tech Stack
- **Framework:** Next.js 14 (App Router + Pages Router coexisting)
- **Language:** TypeScript (new code), JavaScript (legacy)
- **Styling:** Tailwind CSS 3 (custom utility classes in `app/globals.css`)
- **Animations:** Framer Motion (shared variants in `app/lib/animations.ts`)
- **Icons:** lucide-react
- **Fonts:** Inter (via `next/font/google`, weights: 300, 400, 500, 600, 700)
- **Deployment:** Hostinger as **static hosting** — `next.config.js` has `output: "export"`, build emits `out/` (HTML + assets). Upload `out/` to Hostinger or wire Hostinger's deploy to publish that directory. No Node.js process runs in production. `netlify.toml` is a leftover from earlier hosting and is not active.
- **Contact Form:** Web3Forms API (client-side)

### Key Directories
- `app/` — App Router root (layout, page, globals.css)
- `app/components/` — Client components for homepage sections (9 components)
- `app/lib/` — Shared utilities (animations.ts)
- `app/contact/` — Contact page with Web3Forms integration
- `pages/` — Legacy router (blog, about, terms)
- `config/` — Site config JSON (menu, theme, social, config)
- `content/` — Markdown content for pages and blog posts
- `public/images/` — Static assets
- `docs/` — All generated/maintained markdown (audits, journal, progress log). Outside `app/`/`pages/` so it is not part of the static export. See `docs/README.md`.

### Design System
- **Background:** `#000000` (black), `#171717` (neutral-900), `#0a0a0a` (neutral-950)
- **Light sections:** `#f5f5f5` (neutral-100), `#f7f5f2` (warm beige)
- **Accent:** Emerald green scale (`#10b981` primary, `#34d399` light, `#059669` dark)
- **Text:** white (primary on dark), `#a3a3a3` neutral-400 (secondary on dark), `#737373` neutral-500 (on light), `#171717` neutral-900 (headings on light)
- **Borders:** `border-white/[0.06]` on dark, `border-neutral-200/60` on light
- **Cards:** `rounded-xl` (services), `rounded-2xl` (glass cards, case studies)
- **Typography:** Inter, fluid clamp() sizing, negative letter-spacing on headings
- **Buttons:** `.btn-primary`, `.btn-primary-light`, `.btn-accent`, `.btn-outline` in globals.css (all `rounded-lg` with shadow hover)
- **Glassmorphism:** `.glass-card` utility (bg-white/[0.03], backdrop-blur, rounded-2xl)
- **Animation library:** `app/lib/animations.ts` — shared variants (fadeUp, fadeUpBlur, fadeIn, scaleIn, staggerContainer, heroStagger) and easing (smoothEase)
- **Noise overlay:** Subtle film-grain texture at 1.5% opacity via SVG filter in globals.css

### Config Compatibility
- `tsconfig.json` must keep `baseUrl: "."` for Pages Router imports (e.g., `import "styles/style.scss"` in `_app.js`)
- `jsconfig.json` still exists — Next.js uses tsconfig when present
- Tailwind `content` array includes both `app/` and `pages/` paths

## Documentation Workflow

All generated markdown (audits, reports, plans, notes) lives in `docs/`. Never drop a new `.md` at the repo root — put it in `docs/<subfolder>/`.

- `docs/audits/` — audit reports (SEO, GEO, performance, accessibility). One file per audit.
- `docs/journal/` — Darsh's go-to-market journal and goal tracking. Exposed at `/docs/journal` **encrypted at build time** (AES-GCM + PBKDF2-SHA-256, 100k iterations, default PIN `8344` overridable via `JOURNAL_PIN` env var). Ciphertext-only ships in the bundle; decryption happens in the browser after PIN entry. Still **not linked from main site nav, sitemap, or footer** — only from inside `/docs`. Treat as semi-private; don't write anything you wouldn't be OK with a determined person eventually finding.
- `docs/progress/CHANGELOG.md` — running log of commits and which redesign tasks moved.
- `docs/deployments/post-push-checks.md` — mandatory post-push verification protocol. **Run after every `git push origin main`** before reporting "done" to Darsh.

### Local viewer

Run `npm run docs` to open a Google Drive-style browser of `docs/` at `http://localhost:4000/docs`. Folder tree, search, in-place markdown editing (saves to disk), create/delete, and print-to-PDF via the browser. Lives in `scripts/docs-viewer/` and is not part of the static export — keeps the journal private.

### Per-commit update protocol

Every time changes are committed or pushed:

1. **Append a new entry to `docs/progress/CHANGELOG.md`** (newest first) using the format documented at the bottom of that file.
2. **Move completed items in `CLAUDE.md → Redesign Progress`** from `### Remaining` to `### Completed`.
3. **Add new tasks discovered during the commit** to `### Remaining`.
4. If the commit produced a new audit / report, save it under `docs/audits/` with a dated filename.
5. Never create a new `.md` outside `docs/` (except `README.md` and `CLAUDE.md`, which stay at root).
6. **Run the post-push verification protocol** in `docs/deployments/post-push-checks.md`. Don't claim a deploy is "live" until every check passes — Hostinger CDN aggressively caches HTML and can mask broken builds.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build → static export in out/
npm run deploy:zip   # Build + zip out/ → x9elysium-static.zip (upload to Hostinger)
npm run docs         # Local docs viewer at http://localhost:4000/docs (Google Drive-style browser for docs/)
npm run lint         # ESLint
```

`npm start` is not used because the site is a static export — no Node.js process in production.

## Deployment

x9elysium.com is served as plain static hosting from Hostinger's `public_html/`.

**Primary path — Cloudflare Workers (Static Assets):** repo is connected to a Cloudflare project named `x9elysium`. On push to `main`, Cloudflare clones, runs `npm run build`, then `npx wrangler deploy` ships `out/` as static assets via Workers (configured in `wrangler.toml`). DNS for x9elysium.com points at the Cloudflare project; domain remains registered with Hostinger.

**Hostinger fallback (FTP):** `.github/workflows/deploy-hostinger.yml` exists for ad-hoc Hostinger deploys but is dormant unless GitHub secrets are set. See `docs/deployments/github-actions-ftp-deploy.md`.

**Manual fallback:** `npm run deploy:zip` builds + zips `out/` for direct upload anywhere.

## Known Issues
- `node_modules/`, `.next/`, `.next-build/`, `tmp/` may be owned by root (from a previous `sudo npm` run). Fix with: `sudo chown -R $(whoami) node_modules .next .next-build tmp`
- After fixing permissions: `rm -rf .next-build tmp` to clean stale build caches
- Placeholder social links in footer (generic LinkedIn/Twitter/Instagram URLs — not real company profiles)

## Redesign Progress

### Completed
- [x] Homepage hero (gradient mesh bg, staggered blur-reveal animations, gradient text, dual CTAs, scroll indicator)
- [x] Navigation (sticky, transparent-to-backdrop-blur scroll, reduced height, mobile gradient overlay with touch targets)
- [x] Services section (6-card grid, rounded-xl cards, lift+glow hover, stagger animations, WCAG AA contrast)
- [x] Case Studies (asymmetric masonry grid, rounded-2xl cards, scale hover, emerald glow overlay, richer gradients)
- [x] Partners (infinite marquee animation, fade-edge gradients)
- [x] Why Choose Us (gap-px stats bar in rounded-2xl container, reason cards in subtle containers, circular icons)
- [x] Testimonials (glass-card treatment, gradient mesh bg, star ratings, gradient avatar rings)
- [x] CTA banner (dark gradient mesh with emerald glow orbs, dual CTAs, gradient line separator)
- [x] Footer (gradient top border accent, link hover translate-x, back-to-top button)
- [x] Contact page (Web3Forms, glassmorphism inputs, rounded-xl, select chevrons, connector line for steps, gradient mesh CTA)
- [x] SEO metadata (OG tags, Twitter cards, keywords, canonical URL via metadataBase, favicon)
- [x] Tailwind CSS globals (glass-card, glow-emerald, text-gradient-emerald, noise-overlay, focus-visible, refined buttons)
- [x] Shared animation library (app/lib/animations.ts)
- [x] TypeScript config (compatible with both routers)
- [x] Route conflict resolved (pages/index.js removed)
- [x] Framer Motion scroll-reveal animations with shared variants
- [x] Inter font via next/font (weights 300-700 including 600)
- [x] Focus-visible styles for keyboard navigation
- [x] Deployed on Hostinger (x9elysium.com)
- [x] Foundation page at /foundation (Why + 5 Pillars + 10 Operating Rules; Naval-style premium copy; per-page SEO metadata + OG/Twitter; linked from Footer + About; registered in sitemap)

### Remaining

- [ ] Real testimonials with attributable names + permission (current copy is anonymized — "Head of Ecommerce, premium fashion DTC" etc. Replace once real client testimonials are collected.)
- [ ] Real case studies with named clients + permissioned metrics
- [ ] Set `NEXT_PUBLIC_CALCOM_URL` (or `NEXT_PUBLIC_BOOKING_URL`) in Cloudflare project env so "Book a Strategy Call" CTAs flip to Cal.com — leaving unset routes them to `/contact` form (current behaviour)

### Recently Completed

- [x] About page (App Router) — founder-led rewrite (2026-05-02). GTA-based, founded 2021, only Darshan + Adhvait with real LinkedIn-sourced bios + `sameAs` JSON-LD. Removed fabricated milestones timeline + Sam Okaster + aspirational certs. Stats reframed to defensible four-year numbers. Per-page Metadata + AboutPage/Organization/Person JSON-LD graph for AI entity recognition.
- [x] About page (App Router) — milestones, values, team, stats, certifications
- [x] Services detail page (App Router) — services grid, process, tech stack, engagement models
- [x] Work/case studies page (App Router) — filterable bento grid, stats, testimonials
- [x] Blog App Router migration — index + dynamic `[slug]` route with TOC, share, related posts, RSS
- [x] Careers page polish — copy, SEO metadata, JobPosting JSON-LD per role
- [x] Anonymized testimonials & case study attribution (role + industry only, no fabricated person names)
- [x] OG + Twitter image at build time via `app/opengraph-image.tsx` (1200×630 PNG, brand-aware)
- [x] Structured data / JSON-LD (Organization, WebSite, ProfessionalService) in root layout, Blog/BlogPosting on /blog, JobPosting on /careers, Breadcrumb on both
- [x] sitemap.xml via `app/sitemap.ts` (static routes + posts + jobs)
- [x] Removed placeholder LinkedIn URL from JSON-LD `sameAs` (Footer already only listed real Instagram + Facebook)
- [x] Booking integration scaffold — `app/lib/booking.ts` + `BookingButton` component routes 7 "Book a Strategy Call" CTAs through `NEXT_PUBLIC_CALCOM_URL` env var with `/contact` fallback
- [x] Phone number removed site-wide for spam mitigation — Contact page, Footer, JSON-LD `contactPoint`, `config/config.json`, `config/social.json`. Replaced with website + email-only.
- [x] "Value scales with project size" messaging added to Contact page sidebar (no rate card; pricing by scope/complexity/upside)
- [x] Light/dark theme parity confirmed — `next-themes` ThemeProvider in root layout, defaults to dark, all App Router pages use `dark:` variants throughout
