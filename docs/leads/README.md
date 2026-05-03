# Lead Capture System — x9elysium.com

Custom lead-capture pipeline that replaces Web3Forms with a Cloudflare Worker the agency owns end-to-end.

## At a glance

```
visitor                     Cloudflare edge                       darshan@x9elysium.com
  │                                                                    ▲
  │  POST /api/lead          ┌───────────────────────────┐             │
  ├────────────────────────▶ │  worker/index.ts          │             │
  │                          │   ├─ honeypot + dwell     │             │
  │                          │   ├─ origin allowlist     │             │
  │                          │   ├─ KV rate limit (opt)  │             │
  │                          │   ├─ D1 insert (opt)      │ ──notify──▶ │
  │                          │   └─ Resend API           │             │
  │ ◀──── { ok: true } ───── │                           │ ──reply───▶ visitor inbox
  │                          │                           │
  │                          │   Slack webhook (opt)     │ ──ping────▶ phone
  │                          └───────────────────────────┘
```

## Why custom over Web3Forms

| Concern | Web3Forms | This Worker |
| --- | --- | --- |
| Vendor risk | Single point of failure | Owned end-to-end on the same Cloudflare project as the site |
| API key exposure | `NEXT_PUBLIC_WEB3FORMS_KEY` shipped in client bundle | Resend key lives only in Worker env, never in HTML |
| Spam control | Limited | Honeypot + 2s dwell trap + origin allowlist + KV rate-limit |
| Lead persistence | None | D1 database (every lead stored, queryable for follow-up) |
| Auto-reply branding | Generic | Branded HTML from `leads@x9elysium.com` |
| Phone notifications | Manual | Optional Slack webhook for instant ping |
| Cost at our volume | $0 (until you outgrow the free tier) | $0 (Workers free tier 100k req/day, Resend free tier 3k emails/mo) |

## Files

- [worker/index.ts](../../worker/index.ts) — request handler, validation, rate limit, fan-out
- [worker/email.ts](../../worker/email.ts) — branded HTML + plain-text email templates
- [worker/schema.sql](../../worker/schema.sql) — D1 table definition for the leads database
- [worker/tsconfig.json](../../worker/tsconfig.json) — isolated TS config (the root tsconfig excludes `worker/`)
- [wrangler.toml](../../wrangler.toml) — Worker + assets binding + vars + (commented) KV/D1 bindings
- [app/contact/ContactClient.tsx](../../app/contact/ContactClient.tsx) — form posts to `/api/lead`

## Read next

- [setup.md](./setup.md) — one-time provisioning steps (Resend, secrets, KV, D1, Slack)
- [architecture.md](./architecture.md) — request lifecycle, error handling, cost model
- [operations.md](./operations.md) — daily ops (tailing logs, querying leads, exporting)
