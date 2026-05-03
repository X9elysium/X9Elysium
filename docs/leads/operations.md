# Lead Capture — Operations

Day-to-day handling once the system is live.

## Live-tail Worker logs

```bash
npx wrangler tail
# streams console.log + console.error from production in real time
```

Useful when:
- Debugging why a specific submission failed
- Verifying that the Worker actually fired after a deploy
- Spotting Resend rate-limit errors (429s on `/emails`)

## Inspect / export leads from D1

> Only applies if you completed step 5 in [setup.md](./setup.md).

```bash
# Last 25 leads
npx wrangler d1 execute x9elysium-leads --remote \
  --command "SELECT received_at, first_name, last_name, email, company, platform, service FROM leads ORDER BY received_at DESC LIMIT 25"

# Unique companies in the last 30 days
npx wrangler d1 execute x9elysium-leads --remote \
  --command "SELECT DISTINCT company FROM leads WHERE received_at >= datetime('now','-30 days') AND company IS NOT NULL"

# Export everything to CSV (for HubSpot / Notion import)
npx wrangler d1 execute x9elysium-leads --remote \
  --command "SELECT * FROM leads ORDER BY received_at DESC" --json \
  > leads-$(date +%F).json

# Wipe a test lead (use the integer id from a SELECT)
npx wrangler d1 execute x9elysium-leads --remote \
  --command "DELETE FROM leads WHERE id = 7"
```

## Manage rate-limit state

> Only applies if you completed step 4 in [setup.md](./setup.md).

```bash
# See whether an IP is currently rate-limited
npx wrangler kv key get --binding=LEADS_KV "rl:1.2.3.4"

# Manually un-throttle an IP (e.g. you tested the form too aggressively)
npx wrangler kv key delete --binding=LEADS_KV "rl:1.2.3.4"
```

## Rotate the Resend API key

```bash
# 1. resend.com → API Keys → revoke the old key
# 2. Create a new key (Sending access, Domain: x9elysium.com)
# 3. Push it
npx wrangler secret put RESEND_API_KEY
# Wrangler hot-reloads the secret. No redeploy needed.
```

## Common 422 / 502 patterns

- `422 Validation failed { fields: ["email"] }` — email regex rejected. Usually a typo from a real user.
- `429 Too many submissions...` — single IP hit 5 in the last hour. KV un-throttle if it was you testing.
- `502 We couldn't send your message...` — Resend rejected the call. Check `wrangler tail` for the actual Resend response. Most common causes:
  - Domain unverified (DNS records didn't propagate yet)
  - API key revoked or scope-restricted
  - Resend free-tier daily limit (100/day) — upgrade to paid

## Adjusting copy / fields

- **Form fields** — edit `app/contact/ContactClient.tsx`. New fields will land in the email automatically as long as they're in `formState`. Add them to `worker/email.ts`'s `renderLeadEmail` row list and `worker/index.ts`'s `NormalizedLead` interface.
- **Notification email styling** — `worker/email.ts → renderLeadEmail`
- **Auto-reply copy** — `worker/email.ts → renderAutoReply`
- **Subject line** — `worker/index.ts → handleLead → subject`

After editing the Worker:

```bash
npx wrangler deploy
```

The site doesn't need rebuilding for Worker-only changes.

## Spam-handling escalation

If spam becomes an issue (>5 fake submissions / day):

1. **Tighten KV rate-limit window** — drop `RATE_LIMIT_MAX` from 5 to 2 in `worker/index.ts`.
2. **Add Cloudflare Turnstile** — sign up at [turnstile.cloudflare.com](https://turnstile.cloudflare.com), drop the widget into the form, and verify the token in the Worker before processing. ~20 lines of code total.
3. **Block AS-level offenders** — Cloudflare Dashboard → WAF → Custom Rules. Block ASNs known for spam (DigitalOcean, Hetzner, certain VPS ranges) from `/api/lead`.

## Quarterly hygiene

- Review the last 90 days of leads (D1 query above) — flag any patterns (industries, revenue bands) for sales follow-up.
- Confirm Resend DNS records still verify (Resend dashboard → Domains).
- Confirm Worker is actually being deployed on every push (check Cloudflare Workers dashboard → Deployments).
- Rotate Resend API key.
