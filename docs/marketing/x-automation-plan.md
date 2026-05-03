# X.com Automation — Step-by-Step Setup

**Owner:** Darsh
**Last updated:** 2026-05-03
**Status:** infra shipped, awaiting your X dev portal credentials

This is the operating manual for the X (Twitter) posting automation. The goal: post your two best thoughts every day, log every post, surface metrics on the admin dashboard, and feature recent tweets on x9elysium.com — all without you ever logging into x.com to compose.

The system is **deliberately X-only**. Instagram is out of scope by design (see `feedback_social_channel.md` in auto-memory; rationale also in CLAUDE.md). Founder-led B2B Shopify Plus consulting plays better in a text-first, operator-dense feed.

---

## How the system works (90-second overview)

```
data/x-thoughts.md   (you write here — queue of thoughts)
        │
        ▼
GitHub Actions cron (2x/day, 09:13 + 17:13 PT)
        │
        ▼
scripts/x/post-next-thought.mjs
   - pops top thought from x-thoughts.md
   - posts via X API v2
   - logs to data/x-posted.json
   - updates data/tweets.json (last 5, used by homepage)
   - commits all three files back to main
        │
        ▼
Cloudflare rebuilds → homepage Tweets section refreshes
        │
        ▼
scripts/x/sync-metrics.mjs (every 6h, separate cron)
   - reads x-posted.json
   - fetches public metrics for each post (likes, replies, RTs, impressions)
   - writes docs/admin-dashboard/sample-data/x-posts.csv
   - commits CSV
        │
        ▼
Tableau workbook reads x-posts.csv → metrics tile lights up
```

You have two responsibilities: (1) keep `data/x-thoughts.md` topped up, (2) read the dashboard once a week. Everything else runs itself.

---

## Step 1 — Create your X developer app

You only do this once. Takes ~10 minutes.

1. Go to https://developer.x.com/en/portal/dashboard and sign in with **the X account you want to post from** (not a personal alt — use `@x9elysium` or whatever the brand handle is). If you don't have a developer account yet, click **"Sign up for Free Account"**.
   - Pick the **Free** tier. It allows 1,500 writes/month and limited reads — plenty for 2 posts/day = 60/mo.
   - Use case description: paste this — *"Automated posting of original content thoughts to my own brand account, twice daily, with internal analytics dashboard for tracking engagement on my own posts."* (Approval is usually instant for Free.)
2. Once approved, in the dashboard click **"+ Create Project"**.
   - Project name: `X9Elysium Brand Automation`
   - Use case: *Making a bot*
   - Description: *Brand account scheduled posting automation*
3. Inside the project, click **"+ Add App"**. Name it `x9elysium-poster`.
4. On the app page, go to **"User authentication settings"** → click **"Set up"**.
   - **App permissions:** **Read and write** (this is the critical one — default is Read only and posting will 403 if you miss it).
   - **Type of App:** *Web App, Automated App or Bot*
   - **Callback URI / Redirect URL:** `https://x9elysium.com/oauth/x/callback` (we don't actually use it for OAuth 1.0a, but the field is required)
   - **Website URL:** `https://x9elysium.com`
   - Save.

> **If you ever change permissions:** you must regenerate the access token afterwards or it'll keep the old (read-only) scope. Most posting failures trace to this.

---

## Step 2 — Generate the four credentials

From the app page → **"Keys and tokens"** tab. You need four secrets:

| Credential | Where to get it | Used as env var |
|---|---|---|
| **API Key** | Consumer Keys section → *Regenerate* | `X_API_KEY` |
| **API Secret** | Consumer Keys section → *Regenerate* | `X_API_SECRET` |
| **Access Token** | Authentication Tokens → *Access Token and Secret* → *Generate* | `X_ACCESS_TOKEN` |
| **Access Token Secret** | Same panel as above | `X_ACCESS_TOKEN_SECRET` |

Save all four into your password manager **now** — X only shows them once and "Regenerate" invalidates the previous values, which would break the workflow until you re-paste.

You also need your **numeric user ID** (not `@handle`). Get it from https://tweeterid.com or `curl https://api.x.com/2/users/by/username/x9elysium -H "Authorization: Bearer $BEARER"`. Save as `X_USER_ID`.

---

## Step 3 — Add credentials to GitHub repo secrets

1. Go to https://github.com/<your-org>/X9Elysium/settings/secrets/actions
2. Click **"New repository secret"** for each of the five:
   - `X_API_KEY`
   - `X_API_SECRET`
   - `X_ACCESS_TOKEN`
   - `X_ACCESS_TOKEN_SECRET`
   - `X_USER_ID`
3. Verify by going to **Actions → "X — post next thought" workflow → Run workflow** (manual trigger). It will run with `--dry-run` by default the first time so you can check secrets are wired without burning a tweet.

---

## Step 4 — Write your first batch of thoughts

Open `data/x-thoughts.md` and add thoughts at the **top** of the file. Format is dead simple:

```markdown
The first thing I do on a Plus migration is lock the freight rules.
99% of cart abandonment after replatforming traces back to surprise shipping math, not the actual product.

---

If your product page LCP is over 2.5s on a real Pixel device, your hero image is doing 80% of the damage.
Compress before you optimize anything else.

---

(rest of queue …)
```

Rules:
- One thought per block, separated by `---` on its own line.
- 280 characters max per thought (the script will refuse longer ones — better to fail in CI than truncate mid-sentence).
- Top of file = posted next.
- The script never deletes your file blindly — it writes a new file with the consumed block removed. You can always recover from `git log data/x-thoughts.md`.
- Keep ~14 thoughts queued at all times (a week of buffer).

**Voice:** match your existing on-site copy. Specific > clever. Operator-true > thought-leader. The litmus test: would a Shopify Plus head of e-comm at 2 AM doom-scrolling find this useful or pretentious? Aim for useful.

**Don't queue:**
- Anything that names a current client without their permission
- Hot takes on competitors — keep that energy on the comparison pages where there's context
- Anything with $ figures you can't substantiate

---

## Step 5 — How to pause, resume, edit

| Want to… | Do this |
|---|---|
| Pause posting for a week (vacation) | GitHub → Actions → **X — post next thought** → ⋯ → Disable workflow. Re-enable when you're back. |
| Skip the next thought | Edit `data/x-thoughts.md`, delete the top block, commit. Next cron picks the new top. |
| Post immediately, off schedule | GitHub → Actions → **X — post next thought** → Run workflow → set `dry_run` to `false` → Run. |
| Edit a thought you already queued | Just edit the file in the GitHub web UI or locally. Last commit wins. |
| Delete a tweet that posted | Delete from x.com manually + remove its row from `data/x-posted.json` (so it stops showing on the homepage) + remove from `data/tweets.json` + commit. |
| Change cadence | Edit `.github/workflows/x-post.yml` cron lines. Default: `13 17 * * *` (09:13 PT) and `13 1 * * *` (17:13 PT). |

---

## Step 6 — Reading the dashboard

Once tweets are flowing, the metrics sync workflow runs every 6h. It updates `docs/admin-dashboard/sample-data/x-posts.csv` with one row per post:

```
tweet_id, posted_at, text, impressions, likes, retweets, replies, bookmarks, url, last_synced_at
```

Tableau picks it up automatically since the workbook is wired to that folder. The dashboard's **Tab 6 — Social (X)** shows:
- Posts published in last 30/90 days
- Top performing posts by engagement rate
- Engagement rate over time (likes + RTs + replies / impressions)
- Avg time-to-first-engagement

Spec is in `docs/admin-dashboard/tableau-integration-plan.md` § Tab 6.

---

## Step 7 — Failure modes & what to do

| Symptom | Cause | Fix |
|---|---|---|
| Workflow fails with `403 Forbidden` | App permissions are still Read only, or access token was generated before you flipped to Read+Write | Step 1 #4 → regenerate access token in Step 2 → update `X_ACCESS_TOKEN` and `X_ACCESS_TOKEN_SECRET` secrets |
| Workflow fails with `401 Unauthorized` | One of the four secrets is wrong / has whitespace | Re-paste from password manager. GitHub secrets do not show value, so suspect every one. |
| Workflow says `no thoughts queued` and exits 0 | Queue is empty | Add more thoughts to `data/x-thoughts.md` |
| Tweet posted but homepage didn't update | Cloudflare cache | Wait ~5 min, then check; if still stale follow `docs/deployments/post-push-checks.md` |
| Metrics CSV stuck at zeros | Free tier may not return `impression_count` for all posts. Likes / RTs / replies always work; impressions may be `null`. | Expected. The Tableau spec marks impressions as best-effort. Upgrade to Basic ($100/mo) only if you start running paid promotions. |
| Workflow ran but no commit appeared | The post failed before the commit step | Check Actions log. The script logs the X API response body on any non-2xx. |

---

## Step 8 — Kill criteria

Re-evaluate the channel quarterly. Pull the trigger if:
- **Q1 from launch:** 0 qualified discovery calls attributable to X (UTM `?utm_source=x` on the booking link, or replies that turn into DMs that turn into calls)
- **Q2 onwards:** engagement rate stuck below 1.5% for 8 consecutive weeks AND no inbound DMs

If you kill it: disable the workflow, leave the historical data CSV in place, write a one-paragraph post-mortem to `docs/marketing/x-channel-post-mortem.md`. Don't delete the infra — second attempts are easier when the rails still exist.

---

## Appendix A — File map

```
data/
  x-thoughts.md              # the queue (you edit this)
  x-posted.json              # log of every post (machine-managed)
  tweets.json                # last 5 tweets for homepage (machine-managed)

scripts/x/
  package.json               # isolated deps so main install stays clean
  client.mjs                 # tiny X API v2 client wrapper
  post-next-thought.mjs      # the poster
  sync-metrics.mjs           # the metrics fetcher
  README.md                  # quick reference

.github/workflows/
  x-post.yml                 # cron 2x/day
  x-sync.yml                 # cron every 6h

app/components/
  Tweets.tsx                 # homepage section, reads data/tweets.json at build time

docs/admin-dashboard/sample-data/
  x-posts.csv                # social tab data source

docs/marketing/
  x-automation-plan.md       # this doc
```

## Appendix B — Why GitHub Actions, not Cloudflare Workers Cron

We're already on Cloudflare for the static deploy, so Workers Cron was an obvious second option. Reasons GitHub Actions won:

1. **Persistence model fits.** The queue + posted log + tweets.json all need to live in git so the static site can read them at build time. Workers Cron would have to commit-back-to-repo via GitHub API anyway — that's exactly what GH Actions does natively.
2. **Easier local dry-runs.** `node scripts/x/post-next-thought.mjs --dry-run` works identically locally and in CI. A Worker would need a separate test harness.
3. **Free tier headroom is bigger.** GitHub Actions: 2,000 minutes/month on free. Two cron jobs averaging 30s each = ~30 min/month. Workers Cron is also free at this volume but couples scheduling to the deploy account, which we want to keep narrow-purpose.
4. **Audit trail.** Every post becomes a git commit. You can `git log data/x-posted.json` and see your post history with timestamps, no extra logging infra.

If we ever need sub-minute cadence or the cron drift becomes a problem (GH Actions cron can be 5–30 min late at top-of-hour times — that's why we use `:13`), we revisit.
