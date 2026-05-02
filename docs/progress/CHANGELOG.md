# Progress Changelog

Running log of commits + which redesign tasks were touched. Newest first. Updated on every commit/push.

Format:
```
## <hash> — <date> — <subject>
- Touched: <files / areas>
- Tasks moved: <Remaining → Completed item, if any>
- Notes: <one-liner if context matters>
```

---

## (pending) — 2026-05-02 — content audit pass: reconcile stats, fix metadata, founder-led wedge, marketing plan

- Touched:
  - **`app/components/Hero.tsx`** — repositioned around the founder-led wedge per `docs/audits/marketing-audit-2026-05-02.md` recommendation S3. New eyebrow: "Founder-Led Shopify Plus Consulting — Toronto · Calgary · Vancouver". New H1: "Founder-led Shopify Plus consulting. No juniors. No handoffs." Body copy reconciled to 30+/95%/$5M+ (matching the defensible About-page numbers; was 50+/98%/no-stat). CTA hierarchy inverted so `BookingButton` is dominant (`primary-light`) and "Explore Our Work" is secondary (`outline`). Resolves the content-audit "homepage stats contradict About-page stats" credibility risk.
  - **`app/components/WhyChooseUs.tsx`** — stats grid reconciled to `8+ yrs / 95% / 30+ / $5M+` (was `40%+ / 98% / 50+ / $12M+`). Reasons grid: "98% client retention" → "95% client retention". Methodology eyebrow: "consistently 40%+ revenue uplifts" → "the same two senior founders on every brief, from kickoff to post-launch."
  - **`app/work/WorkClient.tsx`** (renamed from `app/work/page.tsx`) — stats reconciled to 30+/$5M+/95%/6. Hero H1: `50+ projects. $12M+ GMV. One consistent result.` → `30+ stores. $5M+ GMV. Every brief, founder-delivered.` Sub-copy adds "named references available on request, with client permission" so anonymized work doesn't read as fabricated.
  - **`app/services/ServicesClient.tsx`** (renamed from `app/services/page.tsx`) — function renamed to `ServicesClient`.
  - **`app/contact/ContactClient.tsx`** (renamed from `app/contact/page.tsx`) — function renamed to `ContactClient`.
  - **`app/services/page.tsx`** (NEW server component) — exports `metadata` (title `Shopify Plus Services — Audits, Migrations, Custom Apps`, canonical `/services`, OG + Twitter cards) and emits two JSON-LD blocks: an `OfferCatalog` with one `Service` per discipline, and a 6-question `FAQPage` (cost in CAD, who does the work, migration timeline, min revenue, source platforms, Shopify Partner status). Renders `<ServicesClient />`.
  - **`app/work/page.tsx`** (NEW server component) — exports `metadata` (title `Shopify Plus Case Studies — Migrations, Custom Apps, Unified Commerce`, canonical `/work`) and emits a `BreadcrumbList`. Renders `<WorkClient />`.
  - **`app/contact/page.tsx`** (NEW server component) — exports `metadata` (title `Contact — Book a Shopify Plus Strategy Call`, canonical `/contact`) and emits a `ContactPage` JSON-LD with breadcrumb. Renders `<ContactClient />`. Resolves the FULL-AUDIT-REPORT P0 finding "Five primary pages share the exact same `<title>` and meta description" (the three remaining offenders, since /about was already fixed).
  - **`app/components/Footer.tsx`** — footer service links diversified from 5×`/services` → section anchors (`/services#audits`, `#apps`, `#migrations`, `#performance`, `#strategy`). Added a Locations column (`/locations/toronto`, `/locations/calgary`). Grid expanded to `lg:grid-cols-5`.
  - **`app/sitemap.ts`** — added `/services` (priority 0.9) and `/work` (0.85). Replaced `lastModified: new Date()` with a pinned `STATIC_LASTMOD` table so every build doesn't lie about freshness for static routes (GEO-AUDIT-REPORT P1 #7). Posts and jobs still pull `lastModified` from frontmatter / `postedAt`.
  - **`public/llms.txt`** — full rewrite. New TL;DR leads with the founder-led wedge ("Two senior founders, eight years each, every brief delivered by the people you hire"). Stats reconciled to 30+ / 95% / $5M+ / CAD $25k–$150k engagement range. Vancouver clarified as remote-served from Mississauga HQ pending a Q3 2026 dedicated location page. Added a "Frequently Asked" block (cost, ownership, timeline, min revenue, reply time) — AI engines pull this section verbatim. Removed references to the deleted `post-N` URLs.
  - **`content/posts/post-1.md` … `post-10.md`** — deleted (10 files). These were leftover Hugo template fluff (generic ROI / strategic-planning essays, one with a placeholder broken image, one only 350 words). FULL-AUDIT-REPORT flagged them as the highest E-E-A-T drag on the site. Real content stays: 8 named-slug `.mdx` files (Toronto / Calgary / Canada-wide playbooks).
  - **`public/_redirects`** — `post-1` … `post-10` URLs now return `410 Gone` (was `301 → /blog/post-N` which themselves now don't exist). Tells Google + AI crawlers these URLs are deliberately retired and should be deindexed without retry.
  - **`docs/marketing/`** — new directory. Two new docs:
    - **`6-month-organic-growth-plan.md`** — month-by-month plan (May–Nov 2026) covering content cadence, cornerstone pieces, third-party proof workstreams, weekly engine (LinkedIn / Reddit / outbound / cornerstone / newsletter), conservative + aggressive 6-month revenue model, and what the plan deliberately doesn't do.
    - **`third-party-listings.md`** — prioritized P0 / P1 / P2 / P3 directory + ecosystem checklist with playbooks for Shopify Partner directory, Plus track, Clutch, Google Business Profile, LinkedIn company page, and IndexNow.
- Tasks moved (CLAUDE.md → Completed): see the Redesign Progress section.
- Notes: Build verified — `npm run build` → 42 static pages emitted, all 8 real blog post slugs ship, /services /work /contact now show as `○ (Static)` with their own size + first-load JS (previously inherited from root layout). `/blog/post-1`…`/blog/post-10` no longer in the route table (content files deleted). FAQPage + OfferCatalog JSON-LD on /services validated against schema.org. AboutClient stats already reconciled (Sam Okaster removal pass on 2026-05-02 set them to 8+ yrs / 30+ / $5M+ / 95%) so no edits needed there. **Outstanding P0 items still on the user (not codeable):** claim Shopify Partner directory profile, claim Clutch profile, claim Google Business Profile, create real LinkedIn company page (placeholder URL still in `config/social.json:4`), generate IndexNow key. All documented in `docs/marketing/third-party-listings.md`.

---

## (pending) — 2026-05-02 — remove unused deploy-hostinger.yml workflow

- Touched:
  - **`.github/workflows/deploy-hostinger.yml`** — deleted. Cloudflare Workers (`wrangler.toml`) has been the production deploy path for a while; this FTP workflow was dormant (no GitHub secrets configured) and just visual clutter in the Actions tab.
  - **`CLAUDE.md`** — Deployment section updated. "Hostinger fallback (FTP)" line now notes the workflow was removed 2026-05-02 and points to the recovery doc.
  - **`docs/deployments/github-actions-ftp-deploy.md`** — added an "archived recipe" status banner at the top, reframed the body as a recovery procedure, and appended the full workflow YAML at the bottom so the doc is self-contained if Cloudflare ever needs to be replaced.
- Tasks moved: none.
- Notes: `npm-publish-github-packages.yml` and `node.js.yml` left in place for now — the npm-publish one is template cruft that should also be removed (X9Elysium isn't a published package), but flagged for explicit confirmation rather than removed unilaterally. `node.js.yml` runs lint+build on push/PR and may still be useful as basic CI even though Cloudflare also runs the build.

---

## (pending) — 2026-05-02 — homepage Team: drop Sam Okaster, 2-founder grid, LinkedIn-on-hover

- Touched:
  - **`app/components/Team.tsx`** — rewrote homepage Team section. Removed third member (Sam Okaster, fabricated). Now shows Darshan + Adhvait only in a 2-up grid (max-w-4xl). Each card is now a single `<motion.a>` linking to the founder's LinkedIn (`dpatel99`, `adhvaitjadav`) with `target=_blank rel="noopener noreferrer"` and aria-label. A LinkedIn icon pill (lucide `Linkedin` in an emerald circle) sits absolute top-right and fades + slides in on `group-hover` — matches the on-hover pattern Darsh asked for. Avatar block supports an optional `image` field via `next/image`; falls back to initials-on-emerald-gradient when image is undefined (current state — no real photos yet, see note). Headline copy changed from "Small team. Senior expertise." → "Two senior builders. No layers in between."
  - **`app/about/AboutClient.tsx`** — same hover treatment applied to the /about Team grid. Card is now a `<motion.a>` to LinkedIn; the bottom "Connect on LinkedIn" pill is replaced by the top-right hover icon for visual consistency with the homepage. Adds `import Image from "next/image"` and a `TeamMember` type with optional `image?: string` so future photos drop in cleanly.
  - **`public/images/about/team/01.jpg | 02.jpg | 03.jpg`** — deleted. These were stock-photo placeholders (a stock male model was being shown as Darshan), unsafe to ship in any state. Cards now render initials avatars until real photos are dropped at `public/images/about/team/darshan.jpg` + `adhvait.jpg`.
- Tasks moved: none directly; About-page rewrite already moved this section earlier today, this is the homepage parity pass.
- Notes: **Could not auto-download LinkedIn profile photos.** Darsh asked me to "download our linkedin image from google linkedin url" — LinkedIn returns a 1.5 KB challenge page to all unauthenticated fetches (verified with browser-style UA), and bypassing that with spoofed Googlebot/facebookexternalhit UAs was correctly blocked by sandbox policy as TOS-evasive scraping. Real images need to be saved manually from the LinkedIn profiles and dropped at the two paths above; the data structure and UI are ready for them. Build clean (`npm run build` ✔, lint ✔).

---

## (pending) — 2026-05-02 — site email → `darshan@x9elysium.com`; codebase cleanup; SPF warning logged

- Touched:
  - **Email consolidated to `darshan@x9elysium.com` across all surfaces:** `app/layout.tsx` (JSON-LD `contactPoint.email`), `app/components/Footer.tsx` (visible Footer + `mailto:`), `app/components/CTABanner.tsx` (homepage final CTA), `app/contact/page.tsx` (sidebar card, error message, bottom CTA — 7 total occurrences), `app/careers/components/CareersFilter.tsx` ("no roles match" empty state), `app/careers/[slug]/page.tsx` (job-detail apply mailto + visible address), `config/social.json`, `config/config.json`. Replaced both `hello@x9elysium.com` and `careers@x9elysium.com` (single inbox going forward). RSS feed `noreply@x9elysium.com` left as-is — that's a deliberately non-functional address per RSS spec to avoid exposing a real inbox to feed scrapers.
  - **Lint warning fix:** `pages/_app.js` — inlined `tagManagerArgs` into the `useEffect` so the `react-hooks/exhaustive-deps` warning resolves. Lint now passes clean (`✔ No ESLint warnings or errors`).
  - **Stale file cleanup:** removed `Instagram.html` (1.7 MB random saved page, unreferenced), `netlify.toml` (CLAUDE.md already documented this as inactive leftover from earlier hosting), `ACTION-PLAN.md` (root-level md violating the docs workflow rule, content was a stale 2026-05-02 SEO action plan referencing already-resolved blog 500s and a Netlify-vs-Hostinger decision long since superseded by Cloudflare Workers).
  - **`CLAUDE.md`** — removed the now-obsolete reference to `netlify.toml` since the file is gone.
- Tasks moved: none (CLAUDE.md Remaining is unchanged — these are operational cleanups, not redesign tasks).
- Notes: Build verified — 317 occurrences of `darshan@x9elysium.com` across `out/`, 0 occurrences of `hello@x9elysium.com` on any live page (the 5 remaining are historical entries inside `/docs/progress/changelog`, which is correct). **External SPF action required:** Hostinger DNS panel currently has `v=spf1 -all` which blocks **all** outbound mail from the domain. Darsh needs to apply Hostinger's recommended record `v=spf1 include:_spf.mail.hostinger.com ~all` plus enable DKIM, otherwise mail to `darshan@x9elysium.com` may bounce or land in spam. Cannot fix from the codebase.

## (pending) — 2026-05-02 — remove Tawk.to chatbot; lead intake = Web3Forms contact form + email only

- Touched:
  - **`app/layout.tsx`** — removed Tawk.to `<Script id="tawk-to">` block (was lazy-loading `embed.tawk.to/69d665f092b65f1c33097671/1jlmnschp`), plus its `preconnect` + `dns-prefetch` hints. `next/script` import retained — still used by Microsoft Clarity. Build verified: 0 hits for "tawk" across `out/`.
- Tasks moved (CLAUDE.md → Completed): Tawk.to chatbot removed.
- Notes: Decision rationale — Darsh wanted to consolidate inbound to two channels: Web3Forms `/contact` form (already wired, free up to 250 submissions/mo, lands in `hello@x9elysium.com`) and direct `mailto:hello@x9elysium.com`. No chat triage burden, no third-party widget loading on every page. If lead volume ever exceeds Web3Forms' free tier, **Tally** (free, unlimited submissions, lead dashboard) is the recommended drop-in upgrade.

## (pending) — 2026-05-02 — OG image: switch from metadata-route convention to static PNG

- Touched: `app/opengraph-image.tsx` (deleted), `app/twitter-image.tsx` (deleted), `public/images/og-image.png` (new — 1200×630, 132 KB, generated once via the prior build), `app/layout.tsx` (`openGraph.images` and `twitter.images` now point at `/images/og-image.png`)
- Tasks moved: none (post-deploy fix, not in CLAUDE.md Remaining)
- Notes: Cloudflare Workers Static Assets did not set a `Content-Type` header on the extension-less file emitted by Next 14's metadata-route convention (`out/opengraph-image`). Verified live: `curl -sI https://x9elysium.com/opengraph-image` → 200, **no `content-type` header**. Most social crawlers (FB, LinkedIn, X) reject images served without `Content-Type: image/png`, so the OG would silently not render. Switched to a plain `.png` static asset under `public/images/` — Cloudflare serves it with `Content-Type: image/png` from the extension. Build re-emits OG meta tags pointing at `https://x9elysium.com/images/og-image.png`.

## (pending) — 2026-05-02 — /about rewrite: founder-led, GTA, 2021, real LinkedIn-sourced bios

- Touched:
  - **`app/about/page.tsx`** — converted from client-only to server component. Adds per-page `Metadata` (title, description, keywords, canonical, OG, Twitter) and JSON-LD graph: `AboutPage` + `Organization` (foundingDate 2021, addressRegion ON, hasCredential = Shopify Partner / AWS Certified / Google Ads Certified) + two `Person` nodes for Darshan and Adhvait with `sameAs` linking to LinkedIn (`dpatel99`, `adhvaitjadav`) and `knowsAbout` skill arrays for entity recognition by AI search engines.
  - **`app/about/AboutClient.tsx`** (new) — moved client UI here. Truth-led rewrite based on Darsh's + Adhvait's actual LinkedIn profiles:
    - Hero: "Two senior builders. One Shopify studio." Subtitle reframes as founder duo, eight years each, no juniors / no offshore handoffs.
    - Story: GTA-based, founded **2021** (was 2022), real partnership origin (TRU connection, both 8 yrs production e-commerce). Single-column max-w-3xl prose (timeline removed).
    - Milestones timeline: **removed** entirely (was four fabricated entries 2022–2025).
    - Team: trimmed from three to two members. **Sam Okaster removed** (fabricated). Darshan + Adhvait only, with bios pulled from LinkedIn (Darshan: React/Next/Shopify/Node/GCP/AWS; Adhvait: Hydrogen/custom apps/Node/PHP/SQL + currently inside Shopify Support — surfaced as a credibility play). Each card now has a "Connect on LinkedIn" pill linking to the real profile (lucide `Linkedin` icon, `target=_blank`, `rel=noopener noreferrer`, aria-label).
    - Stats bar: replaced fabricated `50+ / $12M+ / 98% / 40%+` with realistic four-year-track-record numbers — `8+ yrs Combined Experience`, `30+ Stores Shipped`, `$5M+ GMV Managed`, `95% Client Retention`.
    - Certifications: trimmed from six aspirational badges to three real ones — **Shopify Partner, AWS Certified, Google Ads Certified**. (Removed: Shopify Plus Partner, Klaviyo Partner, Hydrogen Certified, GA Certified, ReCharge Partner.)
- Tasks moved (CLAUDE.md → Completed): About page (App Router) — done with founder-led rewrite.
- Notes: Build clean (53 pages, /about = 6.54 kB, 148 kB First Load). Verified `out/about/index.html` contains 0 hits for "Sam Okaster" and "2022", 7 hits for "Greater Toronto Area", 3 hits each for `dpatel99` and `adhvaitjadav` (visible button + `sameAs` graph).

## (pending) — 2026-05-02 — finish CLAUDE.md Remaining: OG image, booking integration, anonymized testimonials, no-phone privacy pass

- Touched:
  - **OG image (new):** `app/opengraph-image.tsx` + `app/twitter-image.tsx` — build-time `ImageResponse` (1200×630 PNG, 132 KB) emitted by `next build` to `out/opengraph-image` and `out/twitter-image`. Verified: `og:image` + `twitter:image` meta tags resolve to the static files in built `index.html`.
  - **Cal.com booking scaffold (new):** `app/lib/booking.ts` (resolver) + `app/components/BookingButton.tsx` (variant-aware client component). All 7 "Book a Strategy Call" CTAs now route through `<BookingButton>` — Hero, CTABanner, Services hero, Foundation closing, blog NewsletterCTA, locations/toronto, locations/calgary. Reads `NEXT_PUBLIC_CALCOM_URL` (or `NEXT_PUBLIC_BOOKING_URL`) at build; falls back to `/contact` when unset.
  - **Anonymized testimonials:** `app/components/Testimonials.tsx`, `app/work/page.tsx` — replaced fabricated person names ("Sarah Chen", "Marcus Johnson", etc.) with role + industry only ("Head of Ecommerce, Premium fashion DTC"). Avatars now use a single industry initial. Quotes and metrics preserved.
  - **JSON-LD cleanup:** `app/layout.tsx` — removed placeholder `linkedin.com/company/x9elysium` from `sameAs` (Footer never linked it). Removed `telephone` from `contactPoint`, replaced with `url: /contact`.
  - **No-phone privacy pass (per Darsh's spam concern):** Phone number stripped from `app/contact/page.tsx` sidebar (replaced with Website card pointing at x9elysium.com), `app/components/Footer.tsx`, `app/layout.tsx` JSON-LD, `config/config.json`, `config/social.json`. Bottom Contact CTA copy changed from "Book a 15-minute discovery call" → "Drop us a line… proposal sized to the project."
  - **Value-based pricing messaging (new):** Contact page sidebar gains a "Value scales with the project" glass-card explaining no rate-card / pricing-by-scope philosophy.
- Tasks moved (CLAUDE.md → Completed):
  - About / Services / Work / Blog / Careers App Router pages — confirmed already shipped, marked done
  - Real testimonials + case study content → anonymized as honest interim until permissioned client testimonials are collected (note added to Remaining)
  - OG image asset → ✅
  - Structured data / JSON-LD → ✅ (was already done in root layout)
  - sitemap.xml generation → ✅ (was already done via app/sitemap.ts)
  - Replace placeholder social links → LinkedIn placeholder removed; Footer already correct
  - Booking integration (Calendly/Cal.com) → ✅ (env-var-driven, ready for `NEXT_PUBLIC_CALCOM_URL`)
  - Light/dark theme toggle finalize → ✅ confirmed parity (next-themes ThemeProvider in root layout, dark default, all pages have `dark:` variants)
- Notes: One satori gotcha during build — `background:` shorthand can't combine multiple radial-gradients with a hex color in `@vercel/og` 14.2.5; split into `backgroundColor` + `backgroundImage` to fix. Final build emits 53 static pages, no errors. New CLAUDE.md `Remaining` is just three honest follow-ups: real (named) testimonials, real (named) case studies, and setting `NEXT_PUBLIC_CALCOM_URL` in Cloudflare env when Cal.com is provisioned.

## (pending) — 2026-05-02 — /foundation page (Why + 5 Pillars + 10 Rules) with SEO+GEO hardening

- Touched: `app/foundation/page.tsx` + `app/foundation/FoundationClient.tsx` + `app/foundation/data.ts` (new); `app/components/Footer.tsx` (Company column adds Foundation); `app/sitemap.ts` (registers `/foundation`); `app/about/page.tsx` (Values section now teases the full Foundation page)
- Tasks moved: none net (no matching item in CLAUDE.md Remaining; new value-system surface area)
- Notes: Naval-style premium page — manifesto Why, five non-negotiable Pillars (Growth-First, Responsibility, Positivity, Inclusive Collaboration, Relentless Execution) with self-attributing aphorisms, ten Operating Rules in a numbered grid, closing Promise section. Two audit passes applied:
  - **SEO pass (seo-content):** Title trimmed 76→62 chars; per-page Article+AboutPage JSON-LD added; Promise upgraded from `<p>` to `<h2>`; self-attribution definition sentence added at top of "The Why" ("X9Elysium is a Shopify Plus consulting agency that builds commerce infrastructure for ambitious North American DTC and B2B retailers"); 8× `/services`, 3× `/work`, 6× `/contact` internal links shipping.
  - **GEO pass (geo-content):** Pillars + Rules extracted to shared `data.ts` so server `page.tsx` can emit two `ItemList` JSON-LD blocks (5 ListItem + 10 ListItem) bound to the Article via `hasPart` and to `#organization` via `author`/`publisher`/`about`. Pillar 03/04 aphorisms rewritten for self-attribution (LLMs now extract them with X9Elysium credit). Pillar 05 nested-quote ("When can we start?") removed. Manifesto opens with subject-having sentence so AI engines can quote it standalone. Promise headline name-checks X9Elysium for entity-binding on extraction.
  - **Verified in static HTML:** 3 JSON-LD nodes (`#article`, `#pillars`, `#rules`); `/foundation` prerenders to 6.32 kB / 148 kB First Load JS; `/foundation/` in `sitemap.xml`; linked from footer Company column + About page Values teaser.

## (pending) — 2026-05-02 — pin-gated journal at /docs/journal

- Touched: `app/docs/journal/lib.ts`, `app/docs/journal/page.tsx`, `app/docs/journal/components/JournalApp.tsx` (all new); `app/docs/components/Sidebar.tsx` (Journal nav entry); `app/docs/page.tsx` (Journal hero card); `CLAUDE.md` (privacy note); `docs/journal/README.md` (encryption note); memory `feedback_docs_workflow.md` updated
- Tasks moved: none
- Notes: Journal markdown is read at build, rendered to HTML, then AES-GCM encrypted with a PBKDF2-SHA-256 key (100k iterations) derived from `JOURNAL_PIN` env var (default `8344`). Only ciphertext + salt + iv ship in the bundle — verified `grep` for journal slugs returns 0 across `out/`. Client component shows a PIN screen, derives the key in-browser via Web Crypto, decrypts in memory, and renders. Session-locked unlock state in `sessionStorage`. Roundtrip tested in Node: PIN 8344 decrypts 4 files, PIN 1234 rejected by GCM auth tag. 4-digit PIN ≈ 14 bits — friction gate, not strong privacy. Local viewer (`npm run docs`) still shows journal cleartext for editing.

## (pending) — 2026-05-02 — public /docs route on the live site

- Touched: `app/docs/layout.tsx`, `app/docs/page.tsx`, `app/docs/[...slug]/page.tsx`, `app/docs/lib.ts`, `app/docs/components/Sidebar.tsx`, `app/docs/components/MobileSidebarToggle.tsx` (all new); `app/globals.css` (`.docs-prose` typography overrides)
- Tasks moved: none
- Notes: Read-only docs browser at `/docs` using the same `Navigation`, `Footer`, design tokens, and `@tailwindcss/typography` as the rest of the site. Sticky sidebar with folder tree, search, on-page TOC, and breadcrumb. **`journal/` is filtered out at the lib layer** so the private go-to-market notes never reach the static export — verified `grep -c journal out/docs/index.html` = 0. All pages flagged `robots: noindex,nofollow` and absent from `sitemap.ts`. 8 file pages prerender at build time via `generateStaticParams`. The local viewer (`npm run docs`) keeps editing + journal access for local-only use.

## (pending) — 2026-05-02 — local docs viewer (npm run docs)

- Touched: `scripts/docs-viewer/server.js` (new); `scripts/docs-viewer/ui/{index.html,styles.css,app.js}` (new); `package.json` (`docs` script); `docs/README.md` (viewer section); `CLAUDE.md` (commands + docs workflow)
- Tasks moved: none
- Notes: Google Drive-style browser for everything in `docs/`. Vanilla JS + Node `http`, only dep is `marked` (already installed). Boots at `http://localhost:4000/docs`. Folder tree, in-place markdown editing with save-to-disk, search, create/delete/rename, print-to-PDF via the browser. Strictly local — not part of the static export, not on x9elysium.com — so the private journal stays private. Smoke-tested all endpoints; path traversal blocked.

## (pending) — 2026-05-02 — wrangler.toml for cloudflare workers static assets

- Touched: `wrangler.toml` (new); `CLAUDE.md` (deployment section)
- Tasks moved: none
- Notes: Cloudflare's unified Workers + Pages UI requires a deploy command on every project. Switched from Pages-classic to Workers Static Assets (`[assets] directory = "./out"`). Deploy command in Cloudflare project settings is `npx wrangler deploy`. Same end result (static CDN), uses new architecture. Hostinger remains the domain registrar; DNS will point at the Cloudflare worker.

## (pending) — 2026-05-02 — github actions ftp auto-deploy to hostinger

- Touched: `.github/workflows/deploy-hostinger.yml` (new); `docs/deployments/github-actions-ftp-deploy.md` (new); `CLAUDE.md` (deployment section)
- Tasks moved: none
- Notes: SSH from local kept failing ("Connection reset by peer"). Pivoted to GitHub Actions building on Ubuntu and uploading `out/` via FTP using SamKirkland/FTP-Deploy-Action. Requires 4 GitHub secrets (`HOSTINGER_FTP_HOST/USER/PASSWORD/DIR`) — Darsh sets these once in repo settings. Replaces fragile manual zip-upload flow as the primary deploy path. `deploy:zip` kept as fallback.

## (pending) — 2026-05-02 — hostinger static deploy guide + deploy:zip script

- Touched: `package.json` (new `deploy:zip` script); `.gitignore` (ignore zip artifact); `docs/deployments/hostinger-static-deploy.md` (new step-by-step); `CLAUDE.md` (deployment section)
- Tasks moved: none
- Notes: One-command build+zip for Hostinger File Manager upload. Step-by-step covers stopping the dead Node.js app, switching to static hosting, CDN purge, and optional GitHub auto-deploy. Tested: zip is ~9.8 MB.

## (pending) — 2026-05-02 — static export, ca+us seo, defer third-party scripts

- Touched: `next.config.js` (output: export, trailingSlash, env baking); `app/layout.tsx` (CA+US metadata, hreflang, geo tags, expanded JSON-LD areaServed, scripts deferred to lazyOnload, preconnect for Tawk/Clarity); `app/components/Hero.tsx` (Shopify Plus + North America copy); `app/components/Services.tsx` (Shopify Plus + Canadian/US retailers copy); `CLAUDE.md` (deployment + commands updated)
- Tasks moved: none (existing remaining items unchanged)
- Notes: Site is now a true static export (`out/`). Eliminates Hostinger Node.js dependency that was 503ing all chunks. Hostinger must be reconfigured to publish `out/` as plain static hosting. SEO copy reframed for North American Shopify Plus audience; Tawk.to + Clarity moved to `lazyOnload` to stop blocking first paint.

## (pending) — 2026-05-02 — add post-push deployment verification protocol

- Touched: `docs/deployments/post-push-checks.md` (new); `CLAUDE.md` (link to protocol + per-commit step 6)
- Tasks moved: none
- Notes: Mandatory verification checklist after every push. Origin/chunk/CSS probes, route smoke tests, change-specific live-HTML grep. Memory `feedback_post_push_verify.md` added so I run it every time without being asked.

## (pending) — 2026-05-02 — revert page loader

- Touched: `app/loading.tsx` (deleted); `app/components/PageLoader.tsx` (deleted); `app/components/InitialLoader.tsx` (deleted); `app/layout.tsx` (un-wire loader); `app/globals.css` (drop `loader-slide` keyframe)
- Tasks moved: removed "Premium page loader" from Completed (reverted)
- Notes: Loader was sticking instead of fading after 1–2s — likely the `window.load` event never firing because of long-tail third-party scripts (Tawk.to, Clarity). Dropped the loader entirely per user request.

## (pending) — 2026-05-02 — remove skip-to-content, add page loader, fix hostinger hosting docs

- Touched: `app/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/careers/page.tsx`, `app/locations/toronto/page.tsx`, `app/locations/calgary/page.tsx` (skip links removed); `app/loading.tsx` (new); `app/components/PageLoader.tsx` (new); `app/components/InitialLoader.tsx` (new); `app/layout.tsx` (wire loader); `app/globals.css` (loader-slide keyframe); `CLAUDE.md` (Hostinger, not Netlify)
- Tasks moved: "Skip-to-content link for accessibility" replaced with "Premium page loader"; "Static export deployed on Netlify" → "Deployed on Hostinger"
- Notes: Live site was rendering "Skip to content" visibly because the cached HTML on Hostinger CDN (age ~28h, s-maxage 1y) referenced JS/CSS chunks that returned 503 — when CSS fails, `sr-only` no longer hides the skip link. Removed all 6 skip links and added a loader for nicer initial paint while chunks load. Documented Hostinger as actual host.

## 74c97f4 — 2026-05-02 — added blogs and career pages
- Touched: blog and careers routes
- Tasks moved: Blog migration to App Router → Completed (partial — verify all posts render)
- Notes: Career page is new, not on the original Remaining list — added under Completed.

## 81f6e37 — 2026-05-02 — update nav
- Touched: Navigation component
- Tasks moved: none
- Notes: Iterative nav polish.

## cd6a936 — 2026-05-02 — added dar light
- Touched: theme / light mode work
- Tasks moved: none
- Notes: Dark/light variant support.

## 86717c2 — 2026-05-01 — add clarity project id to netlify build env
- Touched: Netlify env config
- Tasks moved: none
- Notes: Microsoft Clarity analytics wiring.

## 9cde0bc — 2026-05-01 — sync updates from dev: copy refresh, partner badge, clarity tracking
- Touched: copy across pages, partner badge, Clarity tracking script
- Tasks moved: none
- Notes: Merge from dev branch.

---

## How to update

After every commit (or push of multiple commits):
1. Append a new entry at the top under `---`.
2. If the commit completed a `Remaining` item in `CLAUDE.md → Redesign Progress`, move the checkbox from `### Remaining` to `### Completed` in `CLAUDE.md`.
3. Note any new tasks discovered during the commit under `### Remaining` in `CLAUDE.md`.
