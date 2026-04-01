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

### Remaining
- [ ] About page (App Router)
- [ ] Services detail page (App Router)
- [ ] Work/case studies page (App Router)
- [ ] Contact page with form (App Router)
- [ ] Blog migration to App Router
- [ ] Real testimonials and case study content
- [ ] Favicon and OG image assets
- [ ] Production build verification
