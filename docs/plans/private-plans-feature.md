# Feature plan — private editable plan pages with comments

**Generated:** 2026-05-09
**Status:** plan only, awaiting one decision before build
**Owner:** darsh

---

## What you asked for

> "plan and post it on separate link with pin — it can be md file but make it editable and preview like github and make sure to accept comments on md file like github feature. plan all, test and deploy."

Read as:

1. **Private URL** (not in nav/footer/sitemap — same posture as `/chat` and `/docs/journal` per CLAUDE.md §7).
2. **PIN-gated** (same posture as `/chat`).
3. **Renders a markdown file** (e.g., `docs/marketing/linkedin-content-plan-20.md`).
4. **GitHub-style preview** — split source/preview view, GFM rendering.
5. **Editable in the browser** — saves persist server-side.
6. **Comments on the file** — like GitHub PR / issue comments.
7. **Plan → test → deploy.**

---

## Constraints from CLAUDE.md

- `output: "export"` static — anything dynamic must round-trip through the Worker (`worker/`).
- D1 already exists (`worker/schema.sql`); comments table is already there but **not yet applied to remote D1** (open ask §10).
- Worker pattern: PIN gate via `CHAT_PIN` secret, validated server-side per call (`worker/chat.ts`).
- Comments pattern: open thread system (`worker/comments.ts`) with honeypot + math captcha + IP rate limit.
- Never link the route from nav / footer / sitemap / `llms.txt`.
- Never feed it into the `/chat` corpus (`scripts/build-chat-context.mjs` enforces an exclude list — extend it).

---

## Architecture

```text
Browser:
  /plans                           → PIN unlock screen
  /plans/<slug>                    → split editor + preview + comments thread
                                     ├── reads from /api/plans?slug=…   (Worker → D1, fallback to seed)
                                     ├── writes via /api/plans (PUT)    (Worker → D1, PIN required)
                                     └── comments via /api/comments      (existing endpoint, thread = "plans/<slug>")

Worker (worker/plans.ts — new):
  GET  /api/plans?slug=<slug>      → return { content, updatedAt, etag }
  PUT  /api/plans                  → { slug, content, pin } → write D1, return new etag
                                     PIN must equal env.PLAN_EDIT_PIN (or fall back to CHAT_PIN)
                                     Optimistic concurrency via If-Match etag header
  POST /api/plans/unlock           → { pin } → returns { ok: true } if PIN matches
                                     (the read PIN — for the gate screen)

D1 (additive — no destructive changes):
  CREATE TABLE plans (
    slug         TEXT PRIMARY KEY,
    content      TEXT NOT NULL,
    updated_at   TEXT NOT NULL,
    updated_by   TEXT,
    seed_hash    TEXT
  );
  CREATE INDEX idx_plans_updated ON plans(updated_at DESC);

  -- Comments reuse the existing `comments` table.
  -- thread_id format: "plans/<slug>"
  -- THREAD_PREFIX_RE in worker/comments.ts already accepts custom prefixes —
  -- we extend it to allow "plans/<slug>".

Build-time seed:
  scripts/build-plans-seed.mjs reads docs/plans-allowlist.json
    [ { slug: "linkedin-20", source: "docs/marketing/linkedin-content-plan-20.md", title: "..." }, ... ]
  → bakes seed into worker/plans-seed.json
  → on first Worker GET, if D1 has no row for that slug, returns the seed
  → first PUT inserts the row in D1; subsequent reads are from D1
```

### Frontend

- `app/plans/page.tsx` — server component shell + `generateStaticParams` is not needed (single index page).
- `app/plans/[slug]/page.tsx` — server component. Pre-renders shell with metadata `noindex,nofollow`. Client component (`PlanClient.tsx`) handles PIN unlock, fetch, edit, preview, comments.
- `app/plans/components/PinGate.tsx` — reuses pattern from `app/chat/ChatClient.tsx` (sessionStorage `x9_plans_pin_v1`).
- `app/plans/components/MarkdownEditor.tsx` — left = `<textarea>` source, right = live preview rendered with `marked` + `remark-gfm` (already in deps). GitHub-Light or GitHub-Dark theme via Tailwind typography plugin.
- `app/plans/components/PlanComments.tsx` — adapts the existing comment UI used on `/blog/[slug]` and `/thoughts` (find via `grep -r 'thread_id'` in `app/`).

### Discoverability posture

- `app/plans/layout.tsx` sets `<meta name="robots" content="noindex,nofollow">`.
- `app/sitemap.ts` excludes `/plans/**` (audit `app/sitemap.ts` and verify).
- `public/llms.txt` excludes `/plans/`.
- No nav/footer/internal links.
- Slugs are short but unguessable (e.g., `linkedin-20-may26`) — light obscurity, not security. Real gate is the PIN.

---

## The four real decisions

### 1. Persistence model — **D1-only** (recommended)

| | D1-only (recommended) | Git push-back via GitHub API |
| --- | --- | --- |
| Latency | Instant save | Seconds + commit roundtrip |
| Conflict handling | etag (simple) | Real merge conflicts |
| Dependencies | None new | `GITHUB_PAT` secret + push perms on `main` |
| Source of truth | D1 (md file is seed only) | Git |
| Risk if Darsh rolls back D1 | Edits lost | Edits are in git |
| Build complexity | Low | Medium-high |

**Recommendation:** D1-only for MVP. Periodically you can pull D1 → md file → commit (a one-line script). v2 can add git push-back if you want it.

### 2. Comment model — **file-level threads** (recommended)

| | File-level (recommended) | Line-anchored (GitHub PR style) |
| --- | --- | --- |
| Reuses existing `/api/comments` | Yes | No — needs new schema column + UI |
| Build complexity | Low | High |
| Useful for plans? | Yes — matches blog pattern | Marginal — plans aren't code |

**Recommendation:** file-level. Thread id = `plans/<slug>`.

### 3. Edit auth — **single PIN** (recommended)

Reuse `CHAT_PIN`, OR add a second `PLANS_PIN` secret if you want a different password for plans. Either is one-line.

**Recommendation:** add a separate `PLANS_PIN` so sharing a plans link doesn't grant chat access (and vice versa). One extra `wrangler secret put` for you, real isolation.

### 4. Scope — **generic, allowlist-driven** (recommended)

Build it as a generic `/plans/<slug>` system. Allowlist of slugs in `docs/plans-allowlist.json`. Adding a new plan = one line of JSON + rebuild. First entry is the LinkedIn plan.

**Recommendation:** generic. Marginal extra cost, much higher reuse.

---

## Build / test / deploy plan

### Phase 1 — local build (~2h)

1. `worker/plans.ts` — three routes (GET / PUT / unlock). Mirror `worker/chat.ts` patterns.
2. Wire into `worker/index.ts` route map.
3. Extend `worker/schema.sql` with `plans` table.
4. Extend `THREAD_PREFIX_RE` in `worker/comments.ts` to accept `plans/<slug>`.
5. `scripts/build-plans-seed.mjs` + `docs/plans-allowlist.json` — first slug `linkedin-20`.
6. `app/plans/page.tsx` + `app/plans/[slug]/page.tsx` + components. PIN gate, editor, preview, comments.
7. `app/sitemap.ts` — confirm exclusion.
8. `scripts/build-chat-context.mjs` — confirm `app/plans/**` and `worker/plans.ts` aren't fed into the chat corpus (or are, if you want X9 to know about the feature — your call).
9. `wrangler.toml` — note new secret `PLANS_PIN` in the comment block.

### Phase 2 — local test

```bash
npm run lint
npm run build              # static export must succeed
npm run preview            # full local round-trip: next build && wrangler dev
```

Manual smoke checks (localhost:8787):

- `/plans` → PIN screen renders, wrong PIN rejects, correct PIN unlocks.
- `/plans/linkedin-20` → seed renders. Edit → save → reload → updated content sticks.
- Comment posts → thread shows up. Posting with a link → goes to moderation queue (per existing comments rule).
- `curl -I http://localhost:8787/plans/linkedin-20` → `X-Robots-Tag: noindex,nofollow`.
- `grep "/plans" out/sitemap.xml` → no matches.

### Phase 3 — deploy

`docs/deployments/post-push-checks.md` for the protocol. Sequence:

1. Commit + push.
2. GitHub Actions runs `wrangler deploy`. Requires `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets (open ask in CLAUDE.md §10 — without these the workflow fails).
3. **Darsh runs (one-time):**
   - `npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql` — applies the additive schema (`plans` table + existing `comments`/`leads`).
   - `npx wrangler secret put PLANS_PIN` — sets the read+edit PIN.
   - Optionally: provision `LEADS_KV` + uncomment in `wrangler.toml` to enable rate limiting on edits/comments.
4. Smoke-test prod:
   - `curl -I https://x9elysium.com/plans/linkedin-20` → returns HTML, `X-Robots-Tag: noindex,nofollow`.
   - PIN unlock → fetches D1 seed → renders.
   - Save → reload → content persists.
   - Comment → appears in thread.
5. Append CHANGELOG entry.

---

## Risks + mitigations

| Risk | Mitigation |
| --- | --- |
| Schema migration not applied → 503 on save/comment | Worker returns clear error; UI shows "comments paused" banner (already in `comments.ts`). Add same fallback for `/api/plans`. |
| `CLOUDFLARE_API_TOKEN` not set → deploy fails | Pre-check the GHA secrets list before pushing. If unset, deploy via local `npx wrangler deploy`. |
| Slug guessable → privacy leak | Slugs are short but the PIN is the real gate. Server returns 401 without PIN even if slug is correct. |
| Markdown XSS via `<script>` in saved content | `marked` sanitizes by default; we additionally strip on read (mirror `comments.ts` `stripUnsafe`). |
| Concurrent edits | etag header — server rejects PUT if etag is stale. UI shows "out of date — reload to merge." |
| D1 row deleted / corrupted | Md file remains as eternal seed; first GET after the row is gone falls back to seed automatically. |

---

## Open asks (must close before prod is fully live)

- **Apply D1 schema** (already an ask in CLAUDE.md §10): `npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql`
- **Set the PIN secret:** `npx wrangler secret put PLANS_PIN`
- **GHA secrets** (already an ask in CLAUDE.md §10): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

The code can ship without these — the route will render the PIN screen but error on unlock until secrets are set, which is acceptable.

---

## What I'll ship if you say "go"

- 1 new Worker module (`worker/plans.ts`) + 1 schema addition + 1 regex tweak in `worker/comments.ts`.
- 1 new build script (`scripts/build-plans-seed.mjs`).
- 1 new allowlist (`docs/plans-allowlist.json`) seeded with the LinkedIn plan.
- 1 new app route (`app/plans/[slug]/...`) + supporting components.
- Sitemap exclusion + `noindex` headers.
- CLAUDE.md §7 updated with the new private surface.
- CHANGELOG entry.

Estimated commit size: ~600–900 lines added across ~10 files.
