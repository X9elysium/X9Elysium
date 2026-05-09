# X9Elysium — Docs

All generated and maintained markdown lives here. Nothing in this folder is published to the site (it sits outside `app/` and `pages/`, so the static export ignores it).

## Structure

- **`ai-access/`** — Front door for AI agents and crawlers consuming x9elysium.com. Mirrors what an agent needs to know on top of `robots.txt`, `llms.txt`, and the `x9elysium.json` manifest.
- **`admin-dashboard/`** — Tableau-style internal dashboard specs and sample data.
- **`analytics/`** — Microsoft Clarity event taxonomy and Copilot prompt library.
- **`audits/`** — Audit reports (SEO, GEO, performance, accessibility, marketing). One file per audit, dated. Plus a rolling `STATE-<date>.md` reconciliation file that records what's true today vs the older dated reports.
- **`books-learning/`** — Naval / Thiel / applied notes that feed the voice and posture in CLAUDE.md §6.
- **`branding/`** — Brand bible (credo, voice, surface, refusals).
- **`chat/`** — `/chat` setup, cost model, and the deep integration plan that ties `/chat` into the thoughts feed and share surface.
- **`deployments/`** — Deploy recipes (Cloudflare) and the mandatory post-push verification protocol.
- **`journal/`** — Private go-to-market journal and progress notes. **Not linked from site navigation. AES-encrypted at build. Excluded from `/chat` corpus.** Use freely as a personal log.
- **`leads/`** — Resend / `/api/lead` activation recipe.
- **`marketing/`** — Six-month organic growth plan, third-party listings checklist, channel plans (X.com, LinkedIn, Reddit), Instagram strategy doc (deliberately not posted on).
- **`mcp/`** — Project-scoped MCP server config and setup recipe.
- **`plans/`** — Living kanban of work-in-flight, surfaced via the PIN-gated `/plans/<slug>` viewer.
- **`progress/`** — Running changelog of commits and redesign-task progress. Updated on every commit/push.
- **`sales/`** — Sales playbook, hiring plan, role briefs.

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
