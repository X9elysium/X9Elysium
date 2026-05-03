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
- **Deployment:** Hostinger as **static hosting** — `next.config.js` has `output: "export"`, build emits `out/` (HTML + assets). Upload `out/` to Hostinger or wire Hostinger's deploy to publish that directory. No Node.js process runs in production.
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

**Hostinger fallback (FTP):** historical workflow `.github/workflows/deploy-hostinger.yml` was removed (2026-05-02) — Cloudflare is the only deploy path now. See `docs/deployments/github-actions-ftp-deploy.md` for the recipe if you ever need to recreate it.

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
- [x] Tawk.to chatbot removed (2026-05-02) — leads now flow through Web3Forms contact form + direct email only. Reason: Darsh prefers async, intentional inbound over chat triage.

### Remaining

- [ ] **Third-party proof (highest-ROI gap, not codeable):** claim Shopify Partner directory profile + apply to Plus Partner track; claim Clutch profile + collect 5 verified reviews; claim Google Business Profile for the Mississauga HQ; create real LinkedIn company page (placeholder URL still in `config/social.json:4`); generate `/.well-known/indexnow-key.txt` and wire IndexNow ping on deploy. Full playbook in `docs/marketing/third-party-listings.md`.
- [ ] Real testimonials with attributable names + permission (current copy is anonymized — "Head of Ecommerce, premium fashion DTC" etc. Replace once real client testimonials are collected.)
- [ ] Real case studies with named clients + permissioned metrics — at least one named permissioned `/work/[slug]` case study before pitching tier-1 Canadian press in Month 5 of the 6-month plan.
- [ ] Build `/locations/vancouver` page (mirrored from Toronto/Calgary). llms.txt mentions Vancouver as a served location; landing page absence is wasted local intent.
- [ ] Set `NEXT_PUBLIC_CALCOM_URL` (or `NEXT_PUBLIC_BOOKING_URL`) in Cloudflare project env so "Book a Strategy Call" CTAs flip to Cal.com — leaving unset routes them to `/contact` form (current behaviour). Hero CTA now leads with `BookingButton` so the calendar link matters more.
- [ ] Drop real founder photos at `public/images/about/team/darshan.jpg` and `public/images/about/team/adhvait.jpg` (square, 96×96+ recommended). Cards currently render initials avatars; the data structure and UI are ready for the photos. LinkedIn can't be auto-scraped for this — save manually from the profiles.
- [ ] Strip per-quote `metric` badges from `app/components/Testimonials.tsx` (anonymized + specific numbers reads as fabricated). Keep the quote + role/industry; add an NDA-respecting subhead.
- [ ] Add `Person` schema for Darshan + Adhvait to root JSON-LD (currently referenced via `sameAs` only — Person entity strengthens E-E-A-T).
- [ ] Cornerstone content cadence — see `docs/marketing/6-month-organic-growth-plan.md` for the May–November 2026 plan: 1 cornerstone piece per month + Magento → Plus migration field guide + Plus vs BigCommerce decision page in Month 2.

### Recently Completed

- [x] Tree-of-life mark on /foundation credo + Instagram video removed from homepage (2026-05-02): cleaned a 784×1168 source JPG (green tree on near-black with "X9Elysium.com" URL band) into a transparent-bg PNG via a Pillow pipeline (per-pixel brightness → alpha; bbox detection on green-dominant pixels with substantial-row gap split to drop the URL band; 3% padding; tiny Gaussian on alpha to soften JPG ringing). Output `public/images/brand/tree-of-life.png` + `tree-of-life@2x.png` (586×768). Placed the mark above "The Root Value" eyebrow on `/foundation#credo` with responsive sizing `w-24 sm:w-32 md:w-40 lg:w-44`, an emerald drop-shadow `[0_0_60px_rgba(16,185,129,0.28)]`, `priority` for LCP, `aria-hidden="true"`, and a 1.1s scale+fade entrance. Visually grounds the canopy → trunk → roots metaphor against the existing radial glows. Removed `<VideoShowcase />` from homepage + deleted the `VideoShowcase` component and `public/hero-video.mp4` (4.5 MB Instagram clip) — homepage now flows Hero → Services without an autoplay video competing with the hero copy. Build verified: 47 static pages, /foundation 8.66 kB / 150 kB First Load, `out/hero-video.mp4` confirmed gone, `out/images/brand/tree-of-life.png` confirmed present.
- [x] Platform pages for Odoo + WooCommerce (2026-05-02): added `/platforms/odoo` and `/platforms/woocommerce` as deliberate secondary tracks alongside the Shopify Plus core. Odoo positioned for manufacturers / distributors / multi-channel retailers — eight modules (eCommerce, Inventory, MRP, Accounting, Purchase, CRM, POS, Custom modules), four-phase implementation path, edition-agnostic stack (Enterprise / Community / Odoo.sh / Self-Hosted), Shopify ↔ Odoo bridge framing, and three engagement models (Discovery / Full Implementation / Support Retainer). WooCommerce positioned for small clients + custom-logic operators (founders, content-led commerce, custom-logic builds) — eight capability areas (Plugin Dev, Themes, Integrations, Performance, Security, Migrations, Hosting, Headless), four-phase build process, Quick Build / Custom Build / Care Plan engagement tiers, with explicit honesty about when Shopify is the better call. Both pages: server component shell with `OfferCatalog` + 5-question `FAQPage` JSON-LD, dedicated `metadata` (title, canonical, OG, Twitter), and a client component for the interactive sections. Sitemap registers both routes (priority 0.85, monthly). Footer expanded from 5 → 6 columns with a new "Platforms" column linking Shopify Plus / Odoo / WooCommerce. `public/llms.txt` adds a "## Platforms We Build On" block so AI engines understand the secondary tracks. Build verified: 47 static pages emitted, both platform routes ship as `○ (Static)` at ~9.7 kB each.
- [x] Vasudhaiva Kutumbakam adopted as the root value (2026-05-02): added a new `#credo` section to `/foundation` between the Why and the Five Pillars — renders वसुधैव कुटुम्बकम् (Devanagari, large, light weight, emerald-tinted) + transliteration "Vasudhaiva · Kutumbakam" + English headline "The world is one family." + three explanatory paragraphs framing it as the root every pillar/rule answers to + Maha Upanishad 6.71 attribution. Hero CTA hierarchy on /foundation flipped so the primary button now leads to the credo and the Five Pillars button is secondary; Why-section closing paragraph and hero subhead also forward-link to the credo so readers can't miss it. Mirrored a featured callout card on `/about` above the three working principles, retitled "What We Stand For" → "One root value. Three working principles." Foundation page metadata title/description rewritten to lead with the verse; new `Quotation` JSON-LD node added with both Sanskrit + English text and Maha Upanishad attribution; root layout Organization JSON-LD now carries `slogan: "Vasudhaiva Kutumbakam — The world is one family."`. Added Noto Sans Devanagari (weights 300/400/500) via `next/font/google` + a `--font-devanagari` CSS variable + `.font-devanagari` Tailwind utility so the script renders consistently across browsers (Inter doesn't ship Devanagari). `public/llms.txt` got a new `## Core Credo` block before Core Pages so AI engines pull the verse + translation + framing verbatim, and the TL;DR line appends "Rooted in Vasudhaiva Kutumbakam — the world is one family."
- [x] Instagram content plan + automation roadmap (2026-05-02): wrote `docs/marketing/instagram-content-plan.md` — 10 ready-to-ship posts (5 single, 5 carousels) with Grok image prompts locked to brand rails (matte black, emerald `#10b981`, Inter sans-serif, 4:5 / 1:1, X9ELYSIUM watermark) and full captions + hashtags + DM-keyword CTAs across replatforming cost, Plus vs BigCommerce, site speed, founder-led economics, AOV, subscription LTV, B2B, headless ROI, Markets QA, and a founder pitch closer. Three automation tiers: Tier 1 manual (Meta Business Suite, $0–15/mo), Tier 2 semi-auto (n8n + IG Graph API + Notion, ~$20/mo, half-day setup), Tier 3 fully autonomous (Claude API + image gen + Slack approval loop, ~$25–40/mo, ~2 days build). Recommendation: ship Tier 1 first 30 days, only escalate if IG produces qualified DMs. Three IG tracking columns added to the existing engine dashboard. Kill criteria: zero qualified discovery calls attributed to IG by end of Month 2 = kill or rebuild the channel.
- [x] Content audit pass (2026-05-02): reconciled homepage stats to 30+/95%/$5M+ across Hero, WhyChooseUs, and Work; sharpened Hero around the founder-led wedge ("Founder-led Shopify Plus consulting. No juniors. No handoffs."); inverted Hero CTA hierarchy so the booking CTA is dominant. Diversified Footer service links to section anchors + added a Locations column.
- [x] /services, /work, /contact converted to server components with per-page metadata + canonical (2026-05-02). Resolves FULL-AUDIT-REPORT P0 finding (3 of the 5 duplicate-title pages — /about was fixed earlier in the founder-led rewrite). Added `OfferCatalog` + 6-question `FAQPage` JSON-LD on /services; `BreadcrumbList` on /work; `ContactPage` schema on /contact.
- [x] llms.txt rewrite + sitemap improvements (2026-05-02). llms.txt leads with the founder-led wedge, reconciled stats, and a "Frequently Asked" block; sitemap adds `/services` + `/work` and replaces `new Date()` with pinned `STATIC_LASTMOD` so freshness signals don't lie. References to deleted `post-N` URLs removed from llms.txt.
- [x] Legacy template content cleanup (2026-05-02). Deleted `content/posts/post-1.md`…`post-10.md` (Hugo template fluff identified by FULL-AUDIT-REPORT as the largest E-E-A-T drag). `public/_redirects` now returns `410 Gone` on all 10 slugs.
- [x] 6-month organic growth marketing plan + third-party listings checklist written (2026-05-02) — `docs/marketing/6-month-organic-growth-plan.md` (month-by-month plan, weekly engine cadence, conservative + aggressive revenue model) and `docs/marketing/third-party-listings.md` (P0–P3 directory + ecosystem playbook).
- [x] Homepage Team + About Team — LinkedIn-on-hover treatment (2026-05-02). Both `app/components/Team.tsx` (homepage) and `app/about/AboutClient.tsx` (about) now render founder cards as a single anchor to the LinkedIn profile, with a top-right LinkedIn icon pill that fades in on hover. Sam Okaster removed from homepage Team.tsx (was already gone from About). Stock-photo placeholders deleted from `public/images/about/team/` — initials avatars until real photos drop in.
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
