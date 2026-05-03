# Lead Capture — Architecture

## Request lifecycle

```
1. User submits the contact form on /contact
   └─ POST https://x9elysium.com/api/lead
        body: { firstName, lastName, email, phone, company, website, revenue,
                platform, service, message, _gotcha, _ts }

2. Cloudflare edge routes the request to the X9Elysium Worker
   (same Cloudflare project as the static site — single deploy unit)

3. worker/index.ts handler runs at the edge:
     a. Method check (POST only; OPTIONS returns CORS preflight)
     b. Origin allowlist (x9elysium.com, www.x9elysium.com, localhost)
     c. Honeypot — if `_gotcha` is non-empty, return 200 silently (bot trap)
     d. Dwell trap — if `Date.now() - _ts < 2000ms`, return 200 silently
     e. Validation — firstName, lastName, valid email, message ≥10 chars, ≤5000 chars
     f. Rate limit — KV get `rl:<ip>`; reject if ≥5 in the trailing 60-minute window
     g. Persist — D1 insert into `leads` (best-effort, won't block response)
     h. Notify — Resend API → darshan@x9elysium.com (BLOCKING; gates the response)
     i. Auto-reply — Resend API → lead's inbox (best-effort, ctx.waitUntil)
     j. Slack ping — webhook POST (best-effort, ctx.waitUntil)

4. Worker returns { ok: true } or { error: "...", fields: ["..."] }
   ContactClient.tsx flips form state to "sent" or "error" accordingly.

5. Background work (steps g, i, j) finishes after the response — Cloudflare's
   ctx.waitUntil keeps the Worker alive for up to 30s post-response so the user
   doesn't wait on Slack/D1 latency.
```

## Why notify is blocking, auto-reply isn't

- **Notify (Resend → Darshan)** is the contract. If it fails, the lead is lost from the user's POV. Block on it so we can return a 502 → form shows the "email us directly" fallback.
- **Auto-reply (Resend → lead)** is courtesy. If it bounces (typo email, full mailbox), we still got the lead. Don't block.
- **Slack ping** is convenience. Same logic.

## Spam defense layers

In order of cheapness (cheaper checks fail-closed first so we never burn Resend quota on bots):

1. **Origin allowlist** — Worker rejects requests whose `Origin` header isn't a known site (`https://x9elysium.com`, etc.). Eliminates basic curl spam.
2. **Honeypot** — A hidden `company_role` input rendered off-screen. Real users never see it. Bots that auto-fill all fields trigger it. Worker accepts and 200s silently — bot thinks it succeeded.
3. **Dwell trap** — Form mount records `Date.now()` in a ref. If submit happens <2s later, it's a bot. Same silent-200 response.
4. **KV rate limit** — Per-IP, 5 submissions / hour. Stops a spammer who solves the first three checks.
5. **Validation** — Rejects garbage (no email, message <10 chars, >5KB).

What we don't use:

- **CAPTCHA** — adds friction, hurts conversion, not needed at our volume. Cloudflare's Turnstile is the upgrade path if spam becomes a problem; integration is a 20-line addition (verify the token in the Worker).

## Cost model

| Component | Free tier | Cost beyond | Realistic monthly cost |
| --- | --- | --- | --- |
| Cloudflare Workers | 100k requests / day | $5 / 10M extra | **$0** at any plausible volume |
| Resend | 3,000 emails / month, 100 / day | $20 / mo for 50k | **$0** until the firm has >100 leads/day |
| Cloudflare KV | 100k reads / 1k writes per day | $0.50 / 10M reads | **$0** |
| Cloudflare D1 | 5M rows reads / 100k writes per day | $0.001 per 1k rows written | **$0** until ~10k leads/month |

Total expected monthly cost for the next 12 months: **$0**.

## Failure modes

| Failure | What happens | User experience |
| --- | --- | --- |
| Resend API down | Notify fails → 502 returned | Form shows error + "email us at darshan@x9elysium.com" |
| Resend domain unverified | Notify fails (403) → 502 returned | Same as above. Fix: complete DNS verification at resend.com |
| Worker exception | 500 returned | Form shows generic error, lead lost (rare; check `wrangler tail` logs) |
| KV/D1 unavailable | Worker silently skips them, still emails | No user impact, lead in inbox but not in DB |
| User on slow network | Resend takes >30s | Cloudflare kills Worker, user sees error |

## Why this lives on Cloudflare and not Vercel/Netlify Functions

The site is already a static export deployed via Cloudflare Workers Static Assets (see `wrangler.toml`). Adding a Worker route is **zero new infrastructure** — same project, same deploy, same domain, same DNS, same observability. A serverless function on Vercel/Netlify would mean splitting the deploy across two providers and adding cross-origin handling.

## Why not just use Cloudflare Email Routing?

Email Routing is **inbound only** — it forwards mail received at `darshan@x9elysium.com` to a destination address. It does not let a Worker send outbound mail. For outbound from Workers we need an API like Resend, MailChannels, or SendGrid. Resend is the cleanest, has the best DX, and has a real free tier.

## Future enhancements (parked)

- **Cloudflare Turnstile** — drop-in CAPTCHA replacement if/when spam volume warrants it
- **Lead enrichment** — call Clearbit / Apollo on the email domain in `ctx.waitUntil` and stash company size + tech stack in D1 for sales prioritization
- **CRM sync** — POST to HubSpot/Pipedrive in `ctx.waitUntil`. Keep D1 as the source-of-truth backup.
- **Calendly/Cal.com link in auto-reply** — once `NEXT_PUBLIC_CALCOM_URL` is set, append a "Pick a time that works" CTA to the auto-reply HTML
