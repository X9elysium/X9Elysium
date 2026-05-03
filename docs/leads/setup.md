# Lead Capture — Setup

One-time provisioning. Once these steps are done the form just works.

## 1. Resend account + DNS verification

[Resend](https://resend.com) is the transactional email provider — free tier is 3,000 emails / month and 100 / day, more than the entire 6-month plan needs.

1. Sign up at resend.com using `darshan@x9elysium.com`.
2. Add the domain `x9elysium.com` (Domains → Add Domain).
3. Resend shows you 3 DNS records (1× DKIM TXT, 1× SPF MX, 1× SPF TXT). Add them in Cloudflare DNS — fastest path is to import the prefilled BIND file at [`cloudflare-dns-import.zone`](./cloudflare-dns-import.zone):
   - Open the file, replace `PASTE_FULL_DKIM_PUBLIC_KEY_FROM_RESEND_HERE` with the full `p=...` value from Resend's DKIM row (click the truncated value in Resend to expand + copy).
   - In Cloudflare Dashboard → x9elysium.com → DNS → Records → **Import and Export** tab → **Import DNS records** → upload the edited file.
   - Confirm all three new records show **DNS-only** (gray cloud, not orange) — DKIM/SPF must not be proxied. Cloudflare's importer defaults TXT/MX to DNS-only.
4. Wait for verification (usually <5 min). Back in Resend → Domains → click **Verify DNS Records**. Status flips to **Verified**.
5. Create an API key (API Keys → Create). **Permissions: Sending access · Domain: x9elysium.com**. Copy the key.

> **Why DNS verification matters:** without SPF + DKIM, Gmail and Outlook will silently spam-folder your auto-replies. Verified senders land in the inbox.

## 2. Push the API key to the Worker

```bash
cd /Users/darsh/Desktop/X9Elysium
npx wrangler login                 # one-time, opens browser
npx wrangler secret put RESEND_API_KEY
# paste the key when prompted
```

The plain (non-secret) variables `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` are already committed in [wrangler.toml](../../wrangler.toml). If you want to change the recipient or sender, edit that file and redeploy.

## 3. (Optional) Slack webhook for instant ping

Get a notification on your phone the moment a lead lands.

1. In Slack, create a channel `#leads`.
2. Add an **Incoming Webhooks** app, scope to `#leads`, copy the webhook URL.
3. Save it as a Worker secret:
   ```bash
   npx wrangler secret put SLACK_WEBHOOK_URL
   ```

Skip this section to disable Slack notifications — the Worker treats it as opt-in.

## 4. (Optional) KV namespace for rate limiting

Caps each IP at 5 submissions per hour. Without it, anyone could brute-force the form.

```bash
npx wrangler kv namespace create LEADS_KV
# Wrangler prints something like:
#   id = "a1b2c3d4..."
```

Open [wrangler.toml](../../wrangler.toml), uncomment the `[[kv_namespaces]]` block, and paste the `id`.

## 5. (Optional) D1 database for lead persistence

Stores every lead so you can query, segment, and export later.

```bash
# Create the database
npx wrangler d1 create x9elysium-leads
# Wrangler prints database_id — copy it.

# Apply the schema (creates the `leads` table + indexes)
npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql
```

Open [wrangler.toml](../../wrangler.toml), uncomment the `[[d1_databases]]` block, and paste the `database_id`.

## 6. Deploy

```bash
npm run build              # produces ./out
npx wrangler deploy        # ships the Worker + static assets together
```

Cloudflare's auto-deploy already runs `npm run build && npx wrangler deploy` on every push to `main`, so manual deploy is only needed for hotfixes.

## 7. Smoke test

```bash
# Health probe
curl -i https://x9elysium.com/api/health
# Expect: 200 { "ok": true, "ts": ... }

# End-to-end (use a throwaway email)
curl -i -X POST https://x9elysium.com/api/lead \
  -H "Content-Type: application/json" \
  -H "Origin: https://x9elysium.com" \
  -d '{
    "firstName": "Smoke",
    "lastName": "Test",
    "email": "your-throwaway@example.com",
    "company": "Smoke Inc.",
    "message": "End-to-end smoke test from CLI."
  }'
# Expect: 200 { "ok": true }
# Then: notification email lands in darshan@x9elysium.com,
#       auto-reply lands in your throwaway inbox.
```

## Local preview

`npm run dev` (Next.js dev server) does **not** run the Worker — there is no `/api/lead` route locally because the site is a static export. To test the form end-to-end before pushing:

```bash
npm run preview
# → builds the static site, then boots wrangler dev on http://localhost:8787
# → /api/lead is live, /contact is live, full round-trip works
```

For Resend to actually send during local preview, you also need:

```bash
npx wrangler dev --local --var RESEND_API_KEY:re_your_test_key
```

Or just point local previews at a Resend test key (Resend lets you create per-environment keys).

## Rotating the API key

If the Resend key ever leaks:

```bash
# 1. Revoke at resend.com → API Keys → … → Revoke
# 2. Create a new key with the same scope
# 3. Push it
npx wrangler secret put RESEND_API_KEY
# 4. Wrangler hot-replaces the secret — no redeploy needed
```
