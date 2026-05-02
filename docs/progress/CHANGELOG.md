# Progress Changelog

Running log of commits + which redesign tasks were touched. Newest first. Updated on every commit/push.

Format:
```
## <hash> — <date> — <subject>
- Touched: <files / areas>
- Tasks moved: <Remaining → Completed item, if any>
- Notes: <one-liner if context matters>
```

---

## 74c97f4 — 2026-05-02 — added blogs and career pages
- Touched: blog and careers routes
- Tasks moved: Blog migration to App Router → Completed (partial — verify all posts render)
- Notes: Career page is new, not on the original Remaining list — added under Completed.

## 81f6e37 — 2026-05-02 — update nav
- Touched: Navigation component
- Tasks moved: none
- Notes: Iterative nav polish.

## cd6a936 — 2026-05-02 — added dar light
- Touched: theme / light mode work
- Tasks moved: none
- Notes: Dark/light variant support.

## 86717c2 — 2026-05-01 — add clarity project id to netlify build env
- Touched: Netlify env config
- Tasks moved: none
- Notes: Microsoft Clarity analytics wiring.

## 9cde0bc — 2026-05-01 — sync updates from dev: copy refresh, partner badge, clarity tracking
- Touched: copy across pages, partner badge, Clarity tracking script
- Tasks moved: none
- Notes: Merge from dev branch.

---

## How to update

After every commit (or push of multiple commits):
1. Append a new entry at the top under `---`.
2. If the commit completed a `Remaining` item in `CLAUDE.md → Redesign Progress`, move the checkbox from `### Remaining` to `### Completed` in `CLAUDE.md`.
3. Note any new tasks discovered during the commit under `### Remaining` in `CLAUDE.md`.
