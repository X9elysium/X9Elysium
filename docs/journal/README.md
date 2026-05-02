# Journal — PIN-Gated

This folder is for Darsh's personal go-to-market plan, business goals, milestones, weekly notes, and progress reflections.

**Encrypted on the live site.** Contents are read at build time, rendered to HTML, and encrypted with AES-GCM (key derived from a PIN via PBKDF2-SHA-256, 100k iterations). Only the ciphertext ships to the browser; decryption happens client-side after PIN entry.

- **Default PIN:** `8344` (override at build time with `JOURNAL_PIN=...` env var)
- **Public URL:** `/docs/journal` — never linked from main site nav, sitemap, or footer
- **Strength:** 4-digit PIN ≈ 14 bits of entropy. PBKDF2 slows brute force to roughly tens of hours but does not make it infeasible. Treat as a friction gate, not strong privacy.

The `npm run docs` local viewer always shows the journal in cleartext (it reads `docs/` directly without encryption) — use it for editing.

## Suggested files

- `go-to-market.md` — overall GTM strategy, ICP, positioning, channels, targets
- `goals.md` — quarterly / yearly goals and targets
- `weekly/YYYY-Www.md` — weekly progress notes
- `wins.md` — log of wins (signed clients, traffic milestones, etc.)
- `lessons.md` — lessons learned, what to keep doing, what to stop

Add files freely — the [docs README](../README.md) describes naming conventions.
