# GitHub Actions → Hostinger FTP Auto-Deploy

**What this gives you:** every `git push origin main` → GitHub builds the static site → uploads `out/` to Hostinger via FTP → live in ~2 minutes. No SSH, no manual zip uploads, no Node.js process on Hostinger.

This is the recommended setup. The workflow file is `.github/workflows/deploy-hostinger.yml`.

---

## One-time setup (~5 minutes)

### Step 1 — Reset Hostinger to clean static hosting

You said you're OK deleting the current setup. Do this:

1. **hpanel.hostinger.com → Websites → x9elysium.com**.
2. **Advanced → Node.js**: if any Node.js app exists, click the three-dot menu → **Delete**. (Stop is not enough.)
3. **Advanced → Git**: if any Git repo is connected, click **Disconnect / Delete**.
4. **File Manager → public_html/**: select all → **Delete**. (Empty the folder.)
5. **File Manager → public_html/**: check for hidden `.htaccess`. If present, delete it. (Show hidden files via the "View" or settings icon in File Manager.)

### Step 2 — Get FTP credentials from Hostinger

1. hPanel → x9elysium.com → **Files → FTP Accounts**.
2. Note the **FTP host** (e.g. `ftp.x9elysium.com` or an IP).
3. Note the **username** (typically `u411223084` or similar).
4. Click **Change FTP password** → set a fresh password. Copy it somewhere safe — you won't see it again.
5. Note the **directory** for x9elysium.com — usually `/public_html/` or `/domains/x9elysium.com/public_html/`. This becomes `HOSTINGER_FTP_DIR`.

### Step 3 — Add the credentials as GitHub secrets

1. Go to https://github.com/X9elysium/X9Elysium → **Settings** → **Secrets and variables → Actions** → **New repository secret**.
2. Add four secrets, one at a time:

   | Name | Value |
   |---|---|
   | `HOSTINGER_FTP_HOST` | the FTP host from step 2 (no `ftp://` prefix) |
   | `HOSTINGER_FTP_USER` | the FTP username |
   | `HOSTINGER_FTP_PASSWORD` | the FTP password you just set |
   | `HOSTINGER_FTP_DIR` | the directory path, e.g. `/public_html/` (must end with `/`) |

3. Optional fifth secret if you use Microsoft Clarity:
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID` — value `nhmfksrzgs` (this is already public; the secret is just so you can change it later without touching code)

### Step 4 — Trigger the first deploy

Two ways:

**Option A — push anything:**

```bash
git commit --allow-empty -m "trigger first deploy"
git push origin main
```

**Option B — manual run from GitHub UI:**

- Repo → **Actions** tab → **Deploy to Hostinger** → **Run workflow** → branch `main` → **Run workflow**.

Watch the workflow run. It should: checkout → install deps (~1 min) → build (~30s) → verify → upload via FTP (~1 min). Total ~2-3 min.

### Step 5 — Verify

Once the workflow shows green:

1. Open https://x9elysium.com in **incognito** (regular tabs may show cached old version).
2. View page source → confirm `<title>X9Elysium — Shopify Plus Consulting for Canada & United States Retailers</title>` is present.
3. From your terminal:
   ```bash
   curl -sI -H "Cache-Control: no-cache" "https://x9elysium.com?nocache=$(date +%s)"
   ```
   Should return `HTTP/2 200`. Etag should be different from `W/"4m55pecn2m2eex"`.

If you still see stale content, purge the Hostinger CDN cache one more time: **hPanel → Performance → Cache Manager → Purge All**.

---

## Recurring deploys

Just push:

```bash
git push origin main
```

GitHub Actions takes over. Watch progress at:
https://github.com/X9elysium/X9Elysium/actions

---

## Troubleshooting the workflow

### `530 Login authentication failed`

Wrong FTP credentials. Re-check secrets in GitHub. Most common: typo in host, password contains a special char that didn't paste cleanly.

### `Could not connect to server`

Wrong host. Try the IP shown in hPanel **FTP Accounts** instead of the hostname.

### Files uploaded but site still 503

Hostinger Node.js app is still running. Go back to Step 1 and confirm it's **Deleted**, not just stopped.

### Files uploaded but `/services` 404s

`trailingSlash: true` in `next.config.js` produces `out/services/index.html`. Hostinger should serve this on `/services` automatically. If not, drop this `.htaccess` in `public_html/`:

```apache
RewriteEngine On
RewriteRule ^([^.]+[^/])$ /$1/ [R=301,L]
```

(This redirects `/services` → `/services/`.)

### Workflow runs but takes forever / hangs on FTP step

FTP_DIR path is wrong. The action keeps trying to traverse non-existent folders. Verify the exact path in hPanel File Manager (right-click the public_html folder → properties → copy path).

### "ENOENT: no such file or directory, scandir './out/'"

Build step failed. Check the **Build static site** step in the workflow log for the actual error.

---

## Why FTP and not Hostinger's built-in Git?

Hostinger's native Git integration **clones source code** but doesn't reliably run a build step on every plan. Our project needs `npm install && npm run build` to produce `out/`, then publish that output. GitHub Actions does the build in a known-good environment (Node 20 on Ubuntu) and ships only the built artifact via FTP.

---

## Manual fallback

If the workflow ever breaks and you need to ship right now:

```bash
npm run deploy:zip
```

Then upload `x9elysium-static.zip` via Hostinger File Manager and extract into `public_html/` (full steps in `hostinger-static-deploy.md`).
