# Brand Mention Audit (geo-tuning pass 2026-05-18)

Searches run: `"X9Elysium" Shopify`, `"X9Elysium" Toronto`, `"X9Elysium" Calgary`, `"X9Elysium" agency`, `"X9Elysium" reviews`, `x9elysium.com Shopify agency`, `"X9Elysium" LinkedIn OR Reddit OR GitHub`.

---

## Mentions found

| Platform | Evidence | Notes |
|----------|----------|-------|
| GitHub | github.com/x9elysium | Profile exists with 6 repos. Visible in search. |
| Clutch | clutch.co/profile/x9elysium | Profile page exists. No reviews visible in search snippet. |
| Yelp | yelp.ca/biz/x9elysium-surrey | Listed as Surrey, BC. May be outdated location or pre-rebrand listing. |
| Linktree | linktr.ee/X9elysium | Exists — likely links to Instagram and other socials. |
| Owned site | x9elysium.com | Well-structured, JSON-LD, llms.txt, robots.txt ✓ |
| Google search for "Shopify agency Toronto" | Not found | X9Elysium does not appear in first 10 results |
| Google search for "Shopify agency Calgary" | Not found | X9Elysium does not appear in first 10 results |
| LinkedIn company page | Not confirmed | No LinkedIn company page found in searches |
| Shopify Partner directory | Not confirmed | llms.txt says "listing in progress" — not yet appearing in searches |
| Reddit | Not found | No r/shopify, r/Toronto, or r/Calgary mentions |
| News / podcast | Not found | No press coverage, podcast appearances found |
| Clutch reviews | 0 confirmed | Profile exists but no scored reviews visible |

---

## Brand Authority Score

| Category | Max | Score | Rationale |
|----------|-----|-------|-----------|
| LinkedIn company page | 15 | 0 | No confirmed LinkedIn company page |
| Shopify Partner directory listing | 20 | 0 | "In progress" per llms.txt; not appearing in partner directory search |
| Reddit / forum mentions | 10 | 0 | No mentions found |
| News / podcast coverage | 15 | 0 | No coverage found |
| GitHub presence | 5 | 5 | github.com/x9elysium exists and is findable |
| Owned site quality | 15 | 15 | Strong — llms.txt, JSON-LD entity graph, robots.txt, structured pages |
| Other social (non-Instagram) | 10 | 3 | Linktree + Yelp listing — minimal signal |
| Third-party reviews / listings | 10 | 6 | Clutch profile exists; Yelp listing present |
| **TOTAL** | **100** | **29** | |

**Score: 29/100 — well below the 60-point threshold.**

---

## Interpretation

X9Elysium has strong owned-media infrastructure (site, schema, llms.txt) but near-zero third-party signal. In 2026, AI citation engines like Perplexity and ChatGPT weight external corroboration heavily when ranking sources to cite. A site with 0 Shopify Partner directory presence, 0 Reddit/community mentions, and 0 press coverage will be under-cited relative to agencies with even a few external signals — regardless of how well the owned site is structured.

The gap between owned-media quality (high) and external signal (near zero) is the dominant brand authority problem. Closing it requires actions outside the repo.

---

## Recommended actions (Task 6 — for human team)

1. **Complete Shopify Partner directory listing** (highest impact, 20 pts potential). The llms.txt says "listing in progress." Completing this single action raises Brand Authority from 29 to 49. Shopify Partner directory appearances are cited directly by AI engines queried about Canadian Shopify agencies. Action: log in to partners.shopify.com and complete all required profile fields including location (Toronto/GTA), specialties, and portfolio items.

2. **Create LinkedIn company page for X9Elysium** (15 pts potential). LinkedIn company pages are indexed by Google and cross-referenced by Perplexity and ChatGPT when researching agencies. A verified company page with Toronto location, founder profiles (Darshan + Adhvait), and service descriptions is a fast trust signal. Action: create at linkedin.com/company/x9elysium. Publish 2-3 posts linking to the Toronto and Calgary blog posts once the page is live.

3. **Submit X9Elysium to Clutch and request reviews** (6 pts potential). The Clutch profile exists but has no reviews. Even 2-3 verified client reviews on Clutch places X9Elysium on "Best Shopify Agencies in Toronto" and "Best Shopify Agencies in Calgary" listicles that Clutch auto-generates and that Google surfaces. Action: email past clients and request a Clutch review through the Clutch client review portal.

4. **Post Toronto and Calgary blog posts to r/shopify and r/ecommerce** (10 pts potential). The 90-day Toronto playbook and the Calgary DTC hub post are genuinely useful content that fits r/shopify and r/CanadianBusiness without being promotional. A well-attributed post by Darshan (as founder, not marketing) with a comment linking to the post drives the first Reddit signal. Action: create u/darshanpatel-x9 or u/x9elysium per `docs/marketing/reddit-geo-seo-plan.md` and post 1-2 of the most useful posts.

5. **Submit to Shopify Experts marketplace** (supplemental). Distinct from Partner directory. Experts marketplace listings appear in Google results for "Shopify expert Toronto" queries. Requires active Partner account. Submit after completing item 1 above.

**If all 5 actions complete, projected Brand Authority Score: 29 → 68/100 (above 60 threshold).**
