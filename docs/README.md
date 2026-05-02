# X9Elysium — Docs

All generated and maintained markdown lives here. Nothing in this folder is published to the site (it sits outside `app/` and `pages/`, so the static export ignores it).

## Structure

- **`audits/`** — Audit reports (SEO, GEO, performance, accessibility, etc.). One file per audit, dated.
- **`journal/`** — Private go-to-market journal and progress notes. **Not linked from site navigation.** Use freely as a personal log.
- **`progress/`** — Running changelog of commits and redesign-task progress. Updated on every commit/push.

## Conventions

- Filenames: `KEBAB-CASE.md` for audits, `YYYY-MM-DD-slug.md` for dated entries.
- Every audit file starts with: title, date, score (if applicable), summary, then sections.
- Progress changelog entries are appended top-down (newest first).
