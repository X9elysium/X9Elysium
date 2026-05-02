# Hostinger Static Deploy — Step-by-Step

**Goal:** Switch x9elysium.com from running a Next.js Node.js app (which keeps crashing → 503) to plain static hosting that just serves the `out/` folder. Once this is done, the site cannot 503 from "process crashed" because there is no process.

---

## One-time setup (do this once)

### Step 1 — Stop the Node.js app on Hostinger

1. Log into Hostinger → **hpanel.hostinger.com**.
2. Click **Websites** → select **x9elysium.com**.
3. In the left sidebar, look for **Advanced → Node.js** (or **Website → Node.js**).
4. If a Node.js app is listed for this domain: click **Stop** (or **Delete**). You don't need it anymore.
   - If you don't see Node.js listed, skip — it's already off.

### Step 2 — Confirm `public_html` is the document root

1. In hPanel for x9elysium.com → **Files → File Manager**.
2. The folder for the live site is `public_html/` (or `domains/x9elysium.com/public_html/` on some plans).
3. **Back up what's there** if you want a rollback: select all → right-click → **Compress** → save the zip somewhere safe.
4. Then **delete everything inside `public_html/`** (not the folder itself, just its contents).

### Step 3 — Build the static site locally

On your Mac, in the project folder:

```bash
cd ~/Desktop/X9Elysium
npm install              # only if you haven't recently
npm run deploy:zip
```

This produces `x9elysium-static.zip` at the project root. It contains the entire `out/` folder zipped up.

### Step 4 — Upload to Hostinger

**Option A — File Manager (easiest, no extra tools):**

1. hPanel → x9elysium.com → **Files → File Manager**.
2. Navigate into `public_html/`.
3. Click **Upload Files** → upload `x9elysium-static.zip`.
4. Right-click the zip in File Manager → **Extract** → extract into the **current directory** (`public_html`).
5. Delete `x9elysium-static.zip` from `public_html` after extraction.
6. You should now see `index.html`, `_next/`, `blog/`, `careers/`, `contact/`, `services/`, `work/`, `locations/`, `images/`, `robots.txt`, `sitemap.xml`, etc. directly inside `public_html/`.

**Option B — FTP/SFTP (faster for repeat uploads):**

1. hPanel → **Files → FTP Accounts** → note the FTP host, username, and create/copy a password.
2. In an FTP client (Cyberduck, FileZilla, Transmit):
   - Host: `ftp.x9elysium.com` (or what hPanel shows)
   - Port: 21 (FTP) or 22 (SFTP)
   - Connect, navigate to `public_html/`, drag the **contents of `out/`** (not the `out` folder itself) into it.

### Step 5 — Purge Hostinger CDN cache

This is critical — without this, visitors keep seeing the year-old broken HTML.

1. hPanel → x9elysium.com → look for **Performance → Cache** or **Advanced → Cache Manager**.
2. Click **Purge All / Clear All Cache**.
3. Wait 30–60 seconds for the purge to propagate.

### Step 6 — Verify

After cache purge:

```bash
curl -sI https://x9elysium.com | grep -iE "^(http|etag|age)"
```

- `etag` should be **different** from `W/"4m55pecn2m2eex"` (the old stuck one).
- `age:` should be small (seconds, not days).

Then load https://x9elysium.com in a private/incognito window. Site should load instantly with no console errors.

---

## Recurring deploys (every time you push code)

Once Step 1–6 above are done, future deploys are just two commands:

```bash
npm run deploy:zip
# then upload x9elysium-static.zip to public_html, extract, replace existing files, purge cache
```

Or set up automated deploy with **Hostinger's GitHub auto-deploy** (next section).

---

## Optional — wire up auto-deploy from GitHub

If your Hostinger plan supports it (Business plan and above usually do):

1. hPanel → x9elysium.com → **Advanced → Git**.
2. Click **Create Repository** → enter:
   - **Repository URL:** `https://github.com/X9elysium/X9Elysium.git`
   - **Branch:** `main`
   - **Directory:** `public_html`
3. After clone, look for **Build settings** or a **`.hostinger-deploy.sh`** option:
   - Build command: `npm install && npm run build`
   - Publish directory: `out`
4. Enable **Auto-deploy on push**.

Now `git push origin main` triggers Hostinger to: clone → build → publish `out/` → done.

---

## Why this is the right move

The Hostinger Node.js app was crashing (probably OOM on a small plan), which made every static asset 503. Plain static hosting:

- Cannot crash — there's no process.
- Is faster — no server-rendering on each request, just CDN-served static files.
- Has no cold-start cost.
- Costs less to run.
- Is what Next.js recommends when every route is static (which ours are).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Still seeing old HTML | CDN didn't purge | Re-purge cache; hard reload (Cmd+Shift+R) |
| Pages 404 on direct nav (e.g. `/blog/some-post`) | Hostinger isn't following `trailingSlash: true` | Ensure each route has its own folder + `index.html` (the build does this); if still broken, add an `.htaccess` rule (see below) |
| `_next/` assets 404 | Upload missed the `_next/` folder | Re-extract zip; confirm `public_html/_next/static/...` exists |
| Site loads but unstyled | CSS path mismatch | Check `public_html/_next/static/css/` exists; purge cache |

### `.htaccess` for clean URLs (only if needed)

If direct visits to `/blog/some-post/` 404, drop this in `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^.]+)$ $1.html [NC,L]
```
