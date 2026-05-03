# scripts/x — X.com automation

Quick reference. Full setup + operating manual: [`docs/marketing/x-automation-plan.md`](../../docs/marketing/x-automation-plan.md).

## Local commands

```bash
cd scripts/x
npm install               # one-time

# Dry-run (no API calls, no file mutations) — safe to run anytime
npm run post:dry
npm run sync:dry

# Live — needs all five X_* env vars set in your shell
npm run post              # posts top thought from data/x-thoughts.md
npm run sync              # refreshes metrics for last 90d of posts
```

In CI both commands run from the workflow with secrets injected. No npm install needed at runtime — the `node_modules/` is created during the GH Action job.

## Files this directory writes

- `data/x-thoughts.md` — top block consumed on each post
- `data/x-posted.json` — append-only log of posts + their latest metrics
- `data/tweets.json` — last 5 tweets, consumed at build time by `app/components/Tweets.tsx`
- `docs/admin-dashboard/sample-data/x-posts.csv` — feeds the Tableau Social tab

## Auth

OAuth 1.0a User Context. Four secrets:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

App must have **Read and write** permissions or posting will 403. After flipping permissions, regenerate the access token — old one keeps the old scope.
