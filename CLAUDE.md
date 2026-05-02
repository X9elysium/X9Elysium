# X9Elysium — Project Guide

## Overview
X9Elysium is a Shopify unified commerce consulting agency website built with Next.js 14 (App Router + legacy Pages Router). Deployed as a static export on Netlify at x9elysium.com. Premium dark-mode aesthetic with emerald green accent.

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
- **Deployment:** Static export (`output: "export"` in next.config.js) → Netlify
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
- `docs/journal/` — Darsh's private go-to-market journal and goal tracking. **Never link from site navigation, sitemap, footer, or content.** Outside `app/`/`pages/` so it is not part of the static export. Treat it as a private working folder.
- `docs/progress/CHANGELOG.md` — running log of commits and which redesign tasks moved.

### Per-commit update protocol

Every time changes are committed or pushed:

1. **Append a new entry to `docs/progress/CHANGELOG.md`** (newest first) using the format documented at the bottom of that file.
2. **Move completed items in `CLAUDE.md → Redesign Progress`** from `### Remaining` to `### Completed`.
3. **Add new tasks discovered during the commit** to `### Remaining`.
4. If the commit produced a new audit / report, save it under `docs/audits/` with a dated filename.
5. Never create a new `.md` outside `docs/` (except `README.md` and `CLAUDE.md`, which stay at root).

## Commands
```bash
npm run dev      # Dev server
npm run build    # Production build (static export to out/)
npm run lint     # ESLint
npm start        # Production server
```

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
- [x] Skip-to-content link for accessibility
- [x] Focus-visible styles for keyboard navigation
- [x] Static export deployed on Netlify (x9elysium.com)

### Remaining
- [ ] About page (App Router)
- [ ] Services detail page (App Router)
- [ ] Work/case studies page (App Router)
- [ ] Blog migration to App Router (verify all posts render after 74c97f4)
- [ ] Careers page polish (added in 74c97f4 — confirm content + SEO)
- [ ] Real testimonials and case study content
- [ ] OG image asset for social shares
- [ ] Structured data / JSON-LD (Organization, WebSite, Service)
- [ ] sitemap.xml generation
- [ ] Replace placeholder social links with real profiles
- [ ] Booking integration (Calendly/Cal.com) for "Book a Strategy Call"
- [ ] Light/dark theme toggle finalize (cd6a936 added "dar light" — confirm parity)
