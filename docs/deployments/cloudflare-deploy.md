# Cloudflare Deploy — Setup + Operating Manual

> **Status (2026-05-06):** active. `git push origin main` triggers `.github/workflows/deploy.yml` → Cloudflare Workers Static Assets → IndexNow ping. This is the only live deploy path.

## What ships, where

| Surface | Source | Output | Lives at |
|---|---|---|---|
| Static site (HTML/CSS/JS) | `app/`, `pages/`, `content/`, `public/` | `out/` (via `next build`, `output: "export"`) | Cloudflare Workers asset binding |
| Dynamic backend | `worker/index.ts` + `worker/{chat,email,comments}.ts` | bundled into the Worker | `/api/*` on the same Worker |
| Domain | Registered at Hostinger, DNS at Cloudflare | A/AAAA → Cloudflare proxied | `x9elysium.com` |

Both ship from a single `wrangler deploy`. The Worker handles `/api/*` first, then falls through to the asset binding for everything else.

## One-time setup (per fresh checkout / new contributor)

### 1. Cloudflare API token

1. https://dash.cloudflare.com → top-right profile → **My Profile** → **API Tokens** → **Create Token**.
2. Use the **Edit Cloudflare Workers** template, scoped to:
   - Account → `<your account>` → Workers Scripts: Edit
   - Account → `<your account>` → Workers KV Storage: Edit (only if `LEADS_KV` is bound)
   - Account → `<your account>` → D1: Edit (only if `LEADS_DB` is bound)
   - Zone → `x9elysium.com` → Workers Routes: Edit (if a custom route is configured)
3. Copy the token once — Cloudflare won't show it again.

### 2. Cloudflare account ID

Cloudflare dash → any zone → right sidebar → **Account ID**. Copy it.

### 3. GitHub secrets

Repo → **Settings** → **Secrets and variables → Actions** → **New repository secret**:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | from step 2 |
| `NEXT_PUBLIC_CALCOM_URL` (optional) | full Cal.com URL when booking is live |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` (optional) | Clarity project ID; defaults to `nhmfksrzgs` baked into `next.config.js` |

### 4. Worker secrets (set once via `wrangler`, never via GitHub)

These are **not** GitHub secrets — they live inside the Worker runtime:

```bash
npx wrangler secret put RESEND_API_KEY      # /api/lead activation
npx wrangler secret put ANTHROPIC_API_KEY   # /api/chat activation
npx wrangler secret put CHAT_PIN            # /api/chat PIN gate
npx wrangler secret put SLACK_WEBHOOK_URL   # optional, lead Slack ping
```

Verify: `npx wrangler secret list`.

### 5. Trigger the first deploy

```bash
git commit --allow-empty -m "deploy: trigger cloudflare workflow"
git push origin main
```

Or run manually: GitHub → Actions → **Deploy — Cloudflare** → **Run workflow** → branch `main`.

## What the workflow does (`.github/workflows/deploy.yml`)

1. `actions/checkout@v4` + `actions/setup-node@v4` (Node 20, npm cache).
2. `npm ci --no-audit --no-fund` (uses `package-lock.json`).
3. `npm run lint` (continue-on-error — lint warnings don't block deploys).
4. `npm run build` → `out/` static export. `prebuild` rebuilds `/chat` corpus.
5. `cloudflare/wrangler-action@v3` → `wrangler deploy` → publishes `out/` + Worker.
6. `node scripts/indexnow-submit.mjs` → reads `out/sitemap.xml`, POSTs every URL to `https://api.indexnow.org/indexnow`.
7. Smoke test: `curl` each critical route, log non-200s as warnings.

## What gets skipped

`paths-ignore` skips the workflow for changes in:

- `docs/**` and any `**/*.md`
- `.github/workflows/x-*.yml` (the X.com automation workflows)
- `data/x-thoughts.md`, `data/x-posted.json`, `data/tweets.json`, `scripts/x/**`

The X.com automation pushes to these paths on cron — deploying for every tweet metric sync would burn Actions minutes for no user-visible change. Site-affecting code changes always deploy.

To force a deploy on a docs-only commit: empty commit (`git commit --allow-empty -m "redeploy"`) or use the **Run workflow** button.

## Common operations

```bash
# Local end-to-end (build + Worker preview)
npm run preview

# Deploy from workstation (skips GH Actions)
npm run build && npx wrangler deploy

# Tail live Worker logs
npx wrangler tail

# Purge HTML cache (Cloudflare dash → Caching → Purge "x9elysium.com/*")
# or via API:
# curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/purge_cache" \
#   -H "Authorization: Bearer <token>" \
#   -H "Content-Type: application/json" \
#   -d '{"purge_everything":true}'
```

## Rollback

There's no auto-rollback today. Two options:

1. **Push the previous good commit:** `git revert <bad-sha>` and push. Workflow runs and ships the prior state.
2. **Cloudflare dashboard rollback:** dash → Workers → **x9elysium** → Deployments → pick a previous version → **Rollback**. Faster than a re-build but bypasses GH (so the live site temporarily diverges from `main`).

## Why this shape

- One workflow = one mental model. No FTP fallback wired up; no Amplify deploy; no Netlify branch deploy. Cloudflare or nothing.
- Static + Worker on the same `wrangler deploy` = one transaction. No window where the static export is new but the Worker is old.
- IndexNow runs *after* the deploy succeeds. A failed deploy does not ping search engines with URLs that aren't actually live.
- `paths-ignore` keeps the X.com automation from triggering a full site rebuild every 6 hours.
- Lint failures are warnings, not blockers — Darsh's preference is "ship the truth, fix lint inline." A real type/build error still fails the workflow because `npm run build` is hard.
