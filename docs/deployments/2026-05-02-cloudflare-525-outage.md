# 2026-05-02 — x9elysium.com serving Hostinger parked page; HTTPS returning 525

## Summary

After pushing commits `d3595cf` (OG image / booking / privacy pass) and `3932205`
(About page rewrite) to `main`, **the live site at `https://x9elysium.com` is
not serving the new build**. It is also not serving the *previous* build.
Investigation showed:

- `https://x9elysium.com` → `HTTP/2 525` (Cloudflare "SSL handshake failed")
- `https://www.x9elysium.com` → `HTTP/2 525` (same)
- `http://x9elysium.com` → `HTTP/1.1 200`, body is **Hostinger's "Parked Domain
  name on Hostinger DNS system"** placeholder page (not our Next.js export)
- DNS for `x9elysium.com` resolves to `172.64.80.1` (Cloudflare anycast)
- Polled for ~7.5 min after push — state did not change

## What this means

The chain `DNS → Cloudflare frontline → origin` is reaching Cloudflare correctly
(anycast IP responds), but the **origin is currently Hostinger, not the
Cloudflare Workers Static Assets project**. Hostinger has the domain in a
"parked" state — meaning either the hosting plan attached to x9elysium.com
expired/lapsed, or the domain was disconnected from the active hosting plan in
hPanel. The parked page is served fine over HTTP, but the parked-page origin
has no valid SSL cert, so Cloudflare's HTTPS handshake to it fails → 525.

This is a **deployment infrastructure problem**, not a code problem. The most
recent `npm run build` ran clean locally (53 static pages, OG image rendered,
sitemap valid). `git push origin main` succeeded. The breakage is between
Cloudflare and whatever Hostinger surfaces as the origin.

## Most likely fixes (Darsh-side)

Pick whichever path is intended.

### Path A — Make Cloudflare Workers Static Assets the actual origin

Per `CLAUDE.md`, the intended primary deploy path is Cloudflare Workers Static
Assets. `wrangler.toml` is configured. Confirm in the Cloudflare dashboard:

1. **Workers & Pages → x9elysium project**
   - Most recent deployment: did it succeed? When?
   - Are static assets attached? (`./out` directory should be uploaded.)
2. **Workers project → Settings → Domains & Routes**
   - Is `x9elysium.com` (and `www.x9elysium.com`) listed as a **Custom
     Domain** on this Worker?
   - If not, add it. Cloudflare will provision a managed cert and route traffic
     directly to the Worker — fixing both the parked page and the 525.
3. **DNS (Cloudflare → x9elysium.com zone)**
   - The `A`/`CNAME` records for `@` and `www` should point at the Worker, not
     at Hostinger's IP. With the Custom Domain set, Cloudflare manages this
     automatically.

### Path B — Fix Hostinger origin and keep Cloudflare in front

If the deploy is meant to keep going to Hostinger (legacy):

1. Log in to **hPanel** for x9elysium.com
2. Confirm the domain is on an active hosting plan (not "parked")
3. Re-upload `out/` (or `x9elysium-static.zip` from `npm run deploy:zip`) to
   `public_html`
4. Verify Hostinger SSL cert is issued and active
5. In Cloudflare DNS, set **SSL/TLS encryption mode** to *Full (Strict)* once
   the Hostinger cert is valid

## Verification once fixed

Re-run `docs/deployments/post-push-checks.md`. All 7 checks should pass. The
change-specific checks for the 2026-05-02 work:

```bash
# OG image emitted and reachable
curl -s -o /dev/null -w '%{http_code}' https://x9elysium.com/opengraph-image
# expected: 200, content-type image/png

# JSON-LD no longer references the placeholder LinkedIn
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -c "linkedin.com/company/x9elysium"
# expected: 0

# Phone number scrubbed from footer + contact page
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -c "604-968-6952\|6049686952"
# expected: 0
curl -s "https://x9elysium.com/contact?_=$(date +%s)" | grep -c "604-968-6952\|6049686952"
# expected: 0

# Anonymized testimonials shipped (no fabricated person names in homepage HTML)
curl -s "https://x9elysium.com?_=$(date +%s)" | grep -cE "Sarah Chen|Marcus Johnson|Priya Patel|David Kim"
# expected: 0

# About page rewrite (commit 3932205) live
curl -s "https://x9elysium.com/about?_=$(date +%s)" | grep -c "Sam Okaster"
# expected: 0
curl -s "https://x9elysium.com/about?_=$(date +%s)" | grep -c "dpatel99\|adhvaitjadav"
# expected: ≥1 each
```

## Status

- **Code state:** healthy. `main` at `3932205`, both recent commits build
  cleanly, `out/` contains all expected static pages plus the OG image.
- **Live site state:** **broken**. Serving Hostinger parked page (HTTP) /
  525 (HTTPS). User intervention required in Cloudflare or Hostinger panel.
- **Next action:** Darsh to confirm which deploy path is active and fix the
  origin binding, then re-run post-push checks.
