# Post-Push Deployment Checks

Mandatory checklist run **after every `git push origin main`** to x9elysium.com. The site deploys via the Cloudflare Workers Static Assets pipeline (`.github/workflows/deploy.yml`). A green push does **not** guarantee the live site is healthy — always verify.

## When to run

- Immediately after `git push origin main`.
- After a manual `wrangler deploy` from the workstation.
- After Cloudflare dashboard actions (cache purge, env var changes, secret rotation).
- After a Worker-only deploy (`npm run worker:deploy`).
- Whenever the user reports the site is broken, slow, or showing stale content.

## 0. Confirm the deploy actually ran

Open the GitHub Actions run for the commit:

```text
https://github.com/X9elysium/X9Elysium/actions/workflows/deploy.yml
```

Expected:

- `deploy` job → green.
- `Deploy to Cloudflare` step → "Successfully published" with a `*.workers.dev` URL in the log.
- `IndexNow ping` step → "indexnow: ok (200) N urls" or "submitted N urls."
- `Post-deploy smoke test` → all listed paths return `200`.

If the workflow is red, fix that first — the site you're checking is the previous deploy, not the one you just pushed.

## 1. HTML status

```bash
curl -sI https://x9elysium.com | head -20
```

Expected:

- `HTTP/2 200`.
- `cf-ray:` header present (proves you're hitting Cloudflare).
- `etag` should change after a successful redeploy. Same etag = previous build still serving.

## 2. Cache-busted origin probe

```bash
curl -sI -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://x9elysium.com?_=$(date +%s)" | head -10
```

Expected: `HTTP/2 200`. A non-200 here means the Worker itself (`worker/index.ts`) is failing — check `npx wrangler tail` from the workstation.

## 3. Static chunks reachable

Pull the chunk filenames out of the live HTML and probe them:

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" \
  | grep -oE '/_next/static/chunks/[^"]+\.js' \
  | sort -u \
  | while read p; do
      echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com$p") $p";
    done
```

Expected: every chunk returns `200`. A 404 here means cached HTML is referencing a previous build's chunk hashes — purge `x9elysium.com/*` from the Cloudflare dashboard.

## 4. CSS reachable

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" \
  | grep -oE '/_next/static/css/[^"]+\.css' \
  | sort -u \
  | while read p; do
      echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com$p") $p";
    done
```

Expected: every CSS file returns `200`. A 404 here is the "site renders unstyled" failure.

## 5. Critical routes

```bash
for path in / /blog/ /thoughts/ /contact/ /careers/ /services/ /work/ \
            /locations/toronto/ /locations/calgary/ /locations/vancouver/ \
            /platforms/odoo/ /platforms/woocommerce/ /foundation/ /docs/; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com${path}") ${path}";
done
```

Expected: all `200`.

## 6. 404 path is a real 404 (not a soft 404)

```bash
curl -s -o /dev/null -w '%{http_code}\n' "https://x9elysium.com/this-page-should-not-exist-$(date +%s)"
```

Expected: `404`. The static export ships `app/not-found.tsx` and `wrangler.toml` sets `not_found_handling = "404-page"` — both required.

## 7. Worker APIs (only after secrets are wired — see CLAUDE.md §10)

```bash
curl -s https://x9elysium.com/api/health

# Lead intake (will 502 if RESEND_API_KEY isn't set — expected today)
curl -sI -X POST -H "content-type: application/json" \
  -d '{"name":"deploy-check","email":"check@example.com","message":"ignore"}' \
  https://x9elysium.com/api/lead

# Comments (will 503 if D1 schema isn't applied yet — expected today)
curl -s 'https://x9elysium.com/api/comments?thread=blog/test'
```

Expected when secrets/D1 are live: `200`. While they're pending, the failures are documented and not blockers for the static site.

## 8. Visual / DOM sanity

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -oE "X9Elysium|Vasudhaiva|main-content" | sort -u
```

If the DOM is missing expected content, hydration is failing or the wrong build is live.

## 9. Confirm the change you just shipped is actually live

Pick something specific to the commit (a removed string, a new route, a class change) and grep the live HTML for it.

For a new blog post:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://x9elysium.com/blog/<new-slug>/
```

For a new schema field, fetch the HTML and grep for the JSON-LD key. Until you can prove the new bits are on the live site, do **not** report "deploy verified."

## 10. Sitemap freshness + IndexNow confirmation

```bash
curl -s https://x9elysium.com/sitemap.xml | grep -c "<loc>"
```

Expected: matches the route count (plus blog/career permutations). The deploy workflow auto-pings IndexNow with this list — `indexnow: submitted N urls.` in the log is the proof.

## What to do when checks fail

| Failure | Likely cause | Action |
|---|---|---|
| Workflow red on `Deploy to Cloudflare` | Wrong/expired API token, account ID, or wrangler.toml drift | Re-issue token, update `CLOUDFLARE_API_TOKEN` in repo secrets |
| Workflow red on `Build static export` | TS error, missing module, env var missing | Reproduce locally with `npm run build`; check `scripts/build-chat-context.mjs` against any new MDX |
| 404s on `/_next/*` | Cloudflare cache pinning previous build's chunk hashes | Cloudflare dash → Caching → Purge `x9elysium.com/*` |
| 5xx on `/api/*` | Worker error in `worker/index.ts` | `npx wrangler tail` to stream live logs |
| 200 on `/should-not-exist` | Wrangler not finding 404 page | Confirm `wrangler.toml` has `not_found_handling = "404-page"` and `app/not-found.tsx` is in the build |
| Sitemap shows old `lastmod` | `STATIC_LASTMOD` map in `app/sitemap.ts` not bumped | Bump the relevant key when content meaningfully changed |

## Manual fallback (only if GH Actions is unavailable)

```bash
npm ci --no-audit --no-fund
npm run build
npx wrangler deploy
node scripts/indexnow-submit.mjs
```

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the local shell.

## Hostinger fallback (archived)

If Cloudflare is unreachable for an extended outage, the static export in `out/` can be uploaded to Hostinger:

```bash
npm run deploy:zip
# upload x9elysium-static.zip to public_html → Extract
```

Recipe: `docs/deployments/hostinger-static-deploy.md`. Cloudflare is the live target.

## Reporting back to the user

Report a one-line summary per check result, then either:

- "**Deploy verified live**" — every check green, plus #9 confirms the new code is rendered.
- "**Deploy failed: <which check failed and why>**" — name the failing check, the inferred cause, and the next action.

Never claim a deploy is healthy based on a single 200 from `curl https://x9elysium.com`.
