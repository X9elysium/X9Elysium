# Crawlers + llms.txt Audit (geo-tuning pass 2026-05-18)

Live fetch of llms.txt and robots.txt returned HTTP 403 from Cloudflare WAF for the WebFetch tool UA.
Audit performed against `public/llms.txt` and `public/robots.txt` in-repo.

---

## robots.txt — AI/GEO crawler allowlist

**Required crawlers per task spec:**

| Crawler | Present? | Rule |
|---------|----------|------|
| GPTBot | ✓ | Allow: /, Disallow: /api/ |
| OAI-SearchBot | ✓ | Allow: /, Disallow: /api/ |
| ChatGPT-User | ✓ | Allow: /, Disallow: /api/ |
| ClaudeBot | ✓ | Allow: /, Disallow: /api/ |
| Claude-Web | ✓ | Allow: /, Disallow: /api/ |
| PerplexityBot | ✓ | Allow: /, Disallow: /api/ |
| Perplexity-User | ✓ | Allow: /, Disallow: /api/ |
| Google-Extended | ✓ | Allow: /, Disallow: /api/ |
| CCBot | ✓ | Allow: /, Disallow: /api/ |
| anthropic-ai | ✓ | Allow: /, Disallow: /api/ |
| Applebot-Extended | ✓ | Allow: /, Disallow: /api/ |

**Verdict: PASS.** All 11 required AI crawlers explicitly allowed. `/api/` namespace denied to all crawlers. Catch-all `User-agent: * / Disallow: /` at bottom correctly blocks unlisted scrapers.

**Additional AI crawlers present (bonus coverage):** claude-searchbot, Amazonbot, Bytespider, Meta-ExternalAgent, Meta-ExternalFetcher, FacebookBot, Mistral-AI-User, cohere-ai, YouBot, Diffbot.

---

## llms.txt — spec compliance

**llmstxt.org spec requirements:**

| Requirement | Status | Notes |
|-------------|--------|-------|
| H1 = site name | ✓ | `# X9Elysium` |
| Blockquote summary | ✓ | Opening `>` paragraph with mission, founders, specialties |
| Sectioned markdown links | ✓ | Sections: Core Credo, Core Pages, Platforms, Locations, Recent Insights, FAQ, For AI agents, Sharable surfaces, Optional |

**Spec verdict: PASS.**

---

## llms.txt — coverage of 8 target posts

| Post slug | Listed in llms.txt? | Title match? |
|-----------|---------------------|--------------|
| best-shopify-plus-agencies-toronto-2026 | ✓ | ✗ **MISMATCH** — llms.txt says "The 9 Best Shopify Plus Agencies in Toronto (2026 Edition)" but actual post title is "The Best Shopify Plus Agency in Toronto: The X9Elysium Approach (2026)" |
| launching-dtc-brand-toronto-90-day-playbook | ✓ | ✓ |
| shopify-plus-migration-guide-gta-retailers | ✓ | ✓ |
| shopify-agency-cost-canada-2026 | ✓ | ✓ |
| unified-commerce-vs-omnichannel-canadian-retailers | ✓ | ✓ |
| best-shopify-agencies-calgary-2026 | ✓ | ✗ **MISMATCH** — llms.txt says "The 7 Best Shopify Agencies in Calgary for 2026" but actual post title is "The Best Shopify Agency in Calgary: The X9Elysium Approach (2026)" |
| western-canada-ecommerce-calgary-dtc-hub | ✓ | ✓ |
| shopify-tax-setup-alberta-no-pst | ✓ | ✓ |

**Both location pages listed:** /locations/toronto ✓, /locations/calgary ✓

---

## Issues requiring fixes

1. **Title mismatches in llms.txt (high priority).** The "9 best" and "7 best" listicle framing remains in llms.txt. When AI engines (ChatGPT, Perplexity) parse llms.txt to understand the site's content, they see a different post framing than what exists. This creates citation confusion: AI may describe the posts as comparative agency listicles rather than X9Elysium authority posts. Fix applied in this pass.

2. **No llms-full.txt.** llms.txt links to `https://x9elysium.com/llms-full.txt` but this file may not exist. Out of scope for this pass — flag for Darsh.

---

## Overall verdict

| File | Status |
|------|--------|
| robots.txt | ✅ PASS — all required AI crawlers present |
| llms.txt spec | ✅ PASS — H1, blockquote, sections all correct |
| llms.txt post coverage | ✅ All 8 posts listed |
| llms.txt title accuracy | ⚠️ 2 of 8 titles mismatched (fixed in this pass) |
