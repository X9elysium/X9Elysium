# Post-Push Deployment Checks

Mandatory checklist run **after every `git push origin main`** to x9elysium.com. The site is hosted on Hostinger with an aggressive CDN cache (`s-maxage=31536000`), so a successful push does **not** guarantee the live site is healthy. Always verify.

## When to run

- Immediately after `git push origin main`.
- After Hostinger panel actions (Node.js restart, env var change, manual redeploy).
- Whenever the user reports the site is broken, slow, or showing stale content.

## The checks

Run all of these and only report "deploy verified" when **every** check passes.

### 1. HTML status (cached path)

```bash
curl -sI https://x9elysium.com | head -20
```

Expected:

- `HTTP/2 200`
- `etag` should change after a successful redeploy. If etag matches a known stale version, the CDN is still serving old HTML.
- `age:` should be small (seconds → minutes) right after a deploy. If it's hours/days old after a fresh push, the CDN didn't refresh.

### 2. HTML status (origin path, cache-busted)

```bash
curl -sI -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://x9elysium.com?_=$(date +%s)" | head -10
```

Expected: `HTTP/2 200`. If this returns 503, the **origin Node.js process is down** — fix in Hostinger panel before anything else.

### 3. Static chunks reachable

Pull the chunk filenames out of the live HTML and probe them:

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" \
  | grep -oE '/_next/static/chunks/[^"]+\.js' \
  | sort -u \
  | while read p; do
      echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com$p") $p";
    done
```

Expected: every chunk returns `200`. Any `503` / `404` here means the cached HTML is referencing dead chunk hashes — purge HTML cache in Hostinger or wait for stale-while-revalidate to refresh.

### 4. CSS reachable

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" \
  | grep -oE '/_next/static/css/[^"]+\.css' \
  | sort -u \
  | while read p; do
      echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com$p") $p";
    done
```

Expected: every CSS file returns `200`. A 503 here is the classic "site renders unstyled" failure (e.g. `sr-only` no longer hiding skip-links, no Tailwind utilities applied).

### 5. Critical routes

```bash
for path in / /blog /contact /careers /services /work /locations/toronto /locations/calgary; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "https://x9elysium.com${path}") ${path}";
done
```

Expected: all `200`.

### 6. Visual / DOM sanity

Fetch the homepage and confirm key strings are present in the rendered HTML:

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -oE "X9Elysium|hero|main-content" | sort -u | head
```

If the DOM is missing expected content, hydration is failing.

### 7. Confirm the change you just shipped is actually live

Pick something specific to the commit (a removed string, a new component name, a class change) and grep the live HTML for it. Example after removing skip-to-content:

```bash
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -c "Skip to content"
```

Expected for that change: `0`. If non-zero, the deploy hasn't propagated yet.

## What to do when checks fail

| Failure | Likely cause | Action |
|---|---|---|
| Origin HTML 503 | Hostinger Node.js process crashed / OOM / quota | Restart in hPanel; check resource usage and error log |
| Chunks 503 but origin HTML 200 | Stale CDN HTML referencing dead chunk hashes | Purge cache in Hostinger CDN settings, or push again to bump asset hashes |
| CSS 503 only | Same as above (chunk pipeline broken) | Same |
| Old etag, high `age:` | CDN didn't pick up new HTML | Purge cache; verify build deployed |
| New string not in live HTML | Deploy didn't run / failed silently | Check Hostinger deploy log; if auto-deploy from git, confirm hook fired |
| Routes 200 but DOM blank | Hydration crash | Check Tawk.to / Clarity / any client-only script; check browser console |

## Notes on Hostinger specifics

- `cache-control: s-maxage=31536000` (1 year) on HTML is set by the platform. Combined with `stale-while-revalidate`, the CDN can keep serving old HTML for a long time after a redeploy.
- `x-powered-by: Next.js` + `x-nextjs-cache: HIT` headers confirm a Node.js process is running. If that process dies, all chunks 503 even when cached HTML still serves.
- A push to `main` does **not** guarantee the Hostinger Node.js app picks up the new build. Always verify via the checks above; if HTML etag doesn't change, trigger a manual redeploy or restart in hPanel.
- The `netlify.toml` in the repo is **not active** — Hostinger ignores it.

## Reporting back to the user

After running the checks, report a one-line summary per check result, then either:

- "**Deploy verified live**" — every check green, plus the change-specific check (#7) confirms the new code is rendered.
- "**Deploy failed: <which check failed and why>**" — name the failing check, the inferred cause from the table above, and the next action.

Never claim a deploy is healthy based on a single 200 from `curl https://x9elysium.com`.
