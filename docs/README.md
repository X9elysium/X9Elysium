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

## Local viewer

`npm run docs` boots a Google Drive-style browser at `http://localhost:4000/docs`:

- Folder tree on the left, search across paths, click any file to read it
- Markdown renders styled (Inter, dark theme, code blocks, tables)
- "Edit" turns any `.md` / `.txt` / `.json` / `.yml` file into an editable textarea with live preview — Cmd/Ctrl+S to save straight to disk
- "PDF" opens the browser print dialog with print-optimized styles (Save as PDF)
- "Download" exports the raw file
- "+ File" / "+ Folder" creates new entries; the trash button deletes the current file

The viewer source is in `scripts/docs-viewer/` and is **never deployed** — `docs/` (and the journal especially) stays off the live site.
