# X9Elysium — CLAUDE.md

> **One-line brief:** This is the operating manual for any agent (Claude Code, Grok-via-Claude, future humans) working on **x9elysium.com** — Darshan Patel's Shopify Plus consulting practice. Treat it as Darsh's voice giving you authority to ship.

---

## 1. WHO

- **Darsh** — founder. Operates from GTA, ships from anywhere. Voice: terse, founder-led, no fluff, no fabricated metrics. Reads Naval + Thiel as load-bearing. Prefers async over chat. Commits in lowercase. Always pushes to `main` after a plan executes.
- **Adhvait** — co-founder. Real human, real LinkedIn (`/about` JSON-LD has `sameAs`).
- **No juniors. No handoffs. No outsourcing.** That is the wedge. Don't soften it.
- **Root credo:** वसुधैव कुटुम्बकम् — *Vasudhaiva Kutumbakam* — "the world is one family." Every pillar, rule, and product decision answers to this. See `app/foundation/` and `docs/books-learning/`.

---

## 2. WHY THIS REPO EXISTS

x9elysium.com is the **front door, the proof, and the asset.** It does three jobs and only three jobs:

1. **Convert warm inbound** — founders who want a Shopify Plus partner that isn't a 200-person agency.
2. **Compound trust** — through writing, schema, and AI citations so the next founder finds us via ChatGPT/Perplexity/Google AI Overviews instead of cold outbound.
3. **Be the canvas** — for everything Darsh wants to build next. The site is a living thesis, not a brochure.

If a change doesn't serve at least one of those three, push back before doing it.

---

## 3. WHAT (the stack, fast)

| Thing | Choice |
| --- | --- |
| Framework | Next.js 14 — App Router primary, Pages Router legacy (blog, terms) |
| Output | `next.config.js` → `output: "export"` → static `out/` |
| Language | TypeScript for new code, JS for legacy |
| Styling | Tailwind 3 + custom utilities in `app/globals.css` |
| Motion | Framer Motion — shared variants in `app/lib/animations.ts` |
| Icons | `lucide-react` |
| Fonts | Inter (UI) + Noto Sans Devanagari (credo) via `next/font/google` |
| Deploy | **Cloudflare Workers Static Assets** — `wrangler.toml`, push-to-`main` builds + ships `out/` |
| Domain | Registered at Hostinger, DNS points at Cloudflare |
| Dynamic backend | Cloudflare Worker at `worker/` — handles `/api/lead`, `/api/chat`, `/api/health` |
| Lead email | Resend (pending DNS + secret) |
| Chat | Claude Sonnet 4.6 via Anthropic API, PIN-gated, corpus-grounded |

Aesthetic: matte black + emerald `#10b981` + Inter, soft glass cards, gradient mesh, film-grain noise overlay. Don't reinvent this — extend it.

---

## 4. THE MAP

```text
app/                 App Router (TypeScript, Framer Motion)
  components/        Homepage sections (Hero, Services, Work, Tweets, etc.)
  lib/               animations.ts, booking.ts, careers.ts
  <route>/           Server-component shells with Metadata + JSON-LD
  <route>/Client.tsx Client components for interactivity
pages/               Legacy router (blog, terms) — leave alone unless asked
worker/              Cloudflare Worker — index.ts, chat.ts, email.ts, schema.sql
config/              Site config JSON
content/             Markdown for blog
public/              Static assets, llms.txt, sitemap.xml, IndexNow keys
data/                tweets.json, x-thoughts.md, x-posted.json
scripts/             docs-viewer/, x/, build-chat-context.mjs
docs/                EVERYTHING markdown — audits, journal, marketing, sales, etc.
```

---

## 5. WHERE THINGS LIVE (docs/ index)

`docs/` is outside the static export. Read these before assuming context:

- `docs/README.md` — folder map.
- `docs/progress/CHANGELOG.md` — every commit, newest first. **Source of truth for "what shipped."** This file (CLAUDE.md) does not duplicate it.
- `docs/deployments/post-push-checks.md` — mandatory verification protocol after every push.
- `docs/leads/setup.md` — Resend activation recipe.
- `docs/chat/README.md` — `/chat` setup + cost model.
- `docs/sales/` — playbook, hiring plan, role briefs.
- `docs/marketing/6-month-organic-growth-plan.md` — May–Nov 2026 cornerstone cadence.
- `docs/marketing/third-party-listings.md` — Shopify Partner / Clutch / GBP / LinkedIn checklist.
- `docs/books-learning/` — Naval + Thiel + applied notes. Load-bearing for voice.
- `docs/journal/` — **PRIVATE.** AES-encrypted at build, PIN-gated browser decrypt. Never link from nav/sitemap/footer. Never feed to `/chat` corpus (build script enforces). Treat as semi-private — write nothing here you couldn't survive becoming public.
- `docs/audits/` — SEO/GEO/perf audits, dated filenames.

`npm run docs` boots a Drive-style viewer at `localhost:4000/docs` with Medium-style audio playback. Never deploy it.

---

## 6. HOW CLAUDE WORKS HERE

### Authority — what you can decide without asking

You have full authority on:

- **Code structure** — file placement, component split, naming, refactor scope (within the task).
- **Copy edits** — tightening, killing fluff, removing fabricated numbers, flipping CTA hierarchy. Match Darsh's voice (see §8).
- **Doc placement** — anything markdown goes in `docs/<subfolder>/`. Pick the subfolder, create it if needed. Never drop `.md` at repo root except this file and `README.md`.
- **Schema/JSON-LD additions** — add Person, Organization, FAQ, Breadcrumb, OfferCatalog wherever the page warrants. E-E-A-T is a permanent priority.
- **Visual polish** — within the design system in §3. Don't introduce a new accent color. Don't break the dark/emerald posture.
- **Killing dead code** — delete unused components, routes, imports, packages. Don't ask permission to clean.
- **Updating CHANGELOG** — append a new entry on every commit, newest first.
- **Updating CLAUDE.md** — if you discover a new load-bearing constraint or change the architecture, edit this file. It's not sacred — keep it current.

### Authority — what needs Darsh's nod

- **Destructive ops** — `rm -rf`, dropping branches, force pushes, deleting `out/` from Cloudflare, rotating live secrets.
- **External account work** — anything requiring Resend/Anthropic/Cal.com/Shopify Partner/Clutch/GBP/LinkedIn signups, DNS changes, or paid plan upgrades.
- **Public claims** — adding a named testimonial, a named case study, a metric, or a press quote. If it can be challenged in public, Darsh confirms first. The site under-claims by design.
- **New domain/subdomain provisioning.**
- **Anything that touches the encrypted journal at `docs/journal/`.**

When in doubt: ship the code, leave the public claim as a placeholder, and call it out in the commit + CHANGELOG entry as an "Ask for Darsh."

### How to start any task

1. Skim `docs/progress/CHANGELOG.md` for recent context (last 10–15 entries usually enough).
2. Read the file you're about to change in full before editing.
3. Run the post-push protocol after pushing — `docs/deployments/post-push-checks.md`. Hostinger/Cloudflare CDN caches HTML aggressively; don't claim "live" until checks pass.
4. Update CHANGELOG before reporting "done."

---

## 7. HARD RULES (the don'ts)

- **Never fabricate metrics, names, or testimonials.** Anonymized + directional > false specifics. The site recently stripped "40% revenue lift" from a quote because we couldn't prove it. Stay there.
- **Never link `/docs/journal` from nav, footer, sitemap, or `llms.txt`.** Discoverable by URL only.
- **Never feed `docs/journal/**` into the `/chat` Anthropic corpus.** `scripts/build-chat-context.mjs` enforces this; don't break the exclude list.
- **Never expose API keys in client bundles.** Web3Forms was killed for this reason. All secrets live in Worker env or GH Actions secrets.
- **Never use Instagram for X9Elysium content.** X.com only. (See `feedback_social_channel.md` in auto-memory.)
- **Never push to `main` without running the post-push checklist.**
- **Never auto-generate this file or run `/init` on it.** It is hand-tuned.
- **Never duplicate CHANGELOG content here.** This file describes posture; CHANGELOG describes history.
- **Never add a chatbot, popup, or upsell modal.** Async, intentional inbound only. Tawk.to was deleted for this reason.

---

## 8. VOICE & STYLE

When you write copy or commit messages or docs, write like Darsh:

- **Lowercase commits.** Short. `careers: restyle 3 sales roles in lazer voice` is the tone.
- **Sentence-level.** Periods over semicolons. No ad-copy adjectives ("seamless," "cutting-edge," "world-class" — kill on sight).
- **Concrete > abstract.** "Founder-led Shopify Plus consulting. No juniors. No handoffs." beats "boutique digital partner."
- **Under-claim.** If we can't prove it, soften it. "The first quarter after launch was the strongest we've ever had" beats "40% revenue lift."
- **Naval cadence in long-form.** Short clauses. Pause. Then the punch.
- **Devanagari okay** when the credo is the subject. Use the `font-devanagari` Tailwind class.
- **Code comments:** default to none. Only when the *why* is non-obvious. Never narrate the *what*.

For the in-house copy bible see `docs/books-learning/naval-ravikant.md` and the hero on `app/page.tsx`.

---

## 9. WORKFLOW

### Commands

```bash
npm run dev          # local dev
npm run build        # static export → out/
npm run docs         # localhost:4000/docs viewer
npm run lint         # eslint
npm run worker:dev   # local Worker
npm run worker:deploy
npm run preview      # full local round-trip (next build && wrangler dev)
```

`npm start` doesn't exist — the site is a static export.

### Deploy

- **Primary:** push to `main` → Cloudflare project `x9elysium` builds + ships via `wrangler deploy`.
- **Fallback:** `npm run deploy:zip` → upload `out/` anywhere.
- DNS is at Cloudflare; domain registration stays at Hostinger.

### Per-commit protocol

1. Append entry to `docs/progress/CHANGELOG.md` (newest first).
2. If a task moved, update §10 of this file.
3. If a new constraint emerged, update §6 or §7.
4. Run `docs/deployments/post-push-checks.md`. Don't say "live" until it passes.

### Known gotchas

- `node_modules/`, `.next/`, `tmp/` may be root-owned from a past `sudo npm`. Fix: `sudo chown -R $(whoami) node_modules .next .next-build tmp && rm -rf .next-build tmp`.
- `tsconfig.json` must keep `baseUrl: "."` for legacy Pages Router imports.
- Tailwind `content` array must include both `app/` and `pages/`.

---

## 10. CURRENT STATE (pointer-only)

**For "what shipped":** read the top 20 entries of `docs/progress/CHANGELOG.md`. That is the source of truth.

**Open code tasks (no external account needed):**

- Cornerstone content cadence — 1 piece/month, May–Nov 2026. See `docs/marketing/6-month-organic-growth-plan.md`.
- IndexNow ping wiring on Cloudflare deploy. Key already at `/.well-known/indexnow-key.txt` and `/22ff52dd50b59385439b192c6676d6df.txt`.

**Open asks for Darsh (external accounts/decisions):**

- Activate `/api/lead` — Resend signup + DNS + `wrangler secret put RESEND_API_KEY`. Recipe: `docs/leads/setup.md`.
- Activate `/chat` — `wrangler secret put ANTHROPIC_API_KEY` + `CHAT_PIN`. Recipe: `docs/chat/README.md`.
- Third-party proof — Shopify Partner directory + Clutch + GBP + real LinkedIn company page. Playbook: `docs/marketing/third-party-listings.md`.
- Cal.com — set `NEXT_PUBLIC_CALCOM_URL` in Cloudflare project env.
- Real testimonials, named case studies, founder photos at `public/images/about/team/{darshan,adhvait}.jpg`.

When any of these closes, move it to CHANGELOG with a date and prune from §10.

---

## 11. THE FUTURE — what we're building toward

This site is the seed. The bigger arc:

- **Supreme** *(codename, planned subdomain — `supreme.x9elysium.com` once provisioned).* The futuristic flagship. Vision: AI-native UX, generative interfaces, voice + multimodal interaction, real-time personalization, motion-as-information. Treat it as the **R&D vehicle** for what the consultancy will sell in 2027+ — not a marketing page. When work begins:
  - Live at `app/supreme/` (App Router, server-component shell + heavy client interactivity) until subdomain is provisioned, then migrate to its own deploy.
  - Design language is **post-X9Elysium** — push past the matte-black/emerald system into something that feels 2030s. WebGL, GPU shaders, sound design, predictive UI, agentic flows are all on the table.
  - Discoverability posture: hidden until it's worth showing. Same posture as `/chat` and `/docs/journal`.
  - Decision authority for Supreme aesthetic + interaction patterns sits with Claude — propose boldly, Darsh edits.

- **Owned chat as a moat.** `/chat` is the seed of an agent that can quote our own thinking back to a prospect at 3am. Extend it: tool-calling for booking, lead capture mid-conversation, multimodal context, RAG over CHANGELOG.

- **Cornerstone content as compounding asset.** One canonical piece per month. Six months in, x9elysium.com should rank for at least one decision query ("Plus vs BigCommerce", "Magento → Plus migration") in both Google and AI search.

- **Sales function — Head of Sales → Manager → AEs.** Roles are live on `/careers`. Playbook is `docs/sales/sales-team-playbook.md`. Don't post AE-only.

- **Tableau dashboard tab 6 — X.com signal.** Schema in `docs/admin-dashboard/sample-data/x-posts.csv`.

If a feature doesn't fit one of these arcs, it probably doesn't belong.

---

## 12. BRIEF TEMPLATE — for Grok (or any prompt generator)

Darsh sometimes asks Grok to write prompts for Claude Code. When that happens, Grok should produce prompts shaped like this — and you (Claude) can recognize this shape and execute decisively:

```text
GOAL: <one sentence — the user-visible outcome>
WHY: <which arc from §11 it serves, or which job from §2>
SCOPE: <files Claude is allowed to touch — be explicit>
OUT OF SCOPE: <files/areas to leave alone>
CONSTRAINTS:
  - voice: matches §8
  - aesthetic: stays in §3 (or for Supreme, push past it)
  - hard rules: respect §7
  - decision rights: §6 — ship without asking unless it hits "Authority needs Darsh's nod"
ACCEPTANCE:
  - <observable check 1 — e.g., page renders at /foo without console errors>
  - <observable check 2 — e.g., CHANGELOG entry written>
  - <observable check 3 — e.g., post-push protocol passes>
DELIVERABLE: <PR / push-to-main / draft-only>
```

If a Grok-generated prompt is missing any of these, infer them from this file and proceed. Don't ping back asking — that's what this file is for.

---

*Last hand-tuned: 2026-05-05. Edit boldly when posture changes.*
