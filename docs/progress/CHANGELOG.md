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
