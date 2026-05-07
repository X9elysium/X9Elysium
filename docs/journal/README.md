# Journal — PIN-Gated

This folder is for Darsh's personal go-to-market plan, business goals, milestones, weekly notes, and progress reflections.

**Encrypted on the live site.** Contents are read at build time, rendered to HTML, and encrypted with AES-GCM (key derived from a PIN via PBKDF2-SHA-256, 100k iterations). Only the ciphertext ships to the browser; decryption happens client-side after PIN entry.

- **Default PIN:** `8344` (override at build time with `JOURNAL_PIN=...` env var)
- **Public URL:** `/docs/journal` — never linked from main site nav, sitemap, or footer
- **Strength:** 4-digit PIN ≈ 14 bits of entropy. PBKDF2 slows brute force to roughly tens of hours but does not make it infeasible. Treat as a friction gate, not strong privacy.

The `npm run docs` local viewer always shows the journal in cleartext (it reads `docs/` directly without encryption) — use it for editing.

## Files in this folder

- [chanakya-musk-engine/](./chanakya-musk-engine/) — strategic operating system. Foundation (CliftonStrengths × Chanakya) → Naval/Thiel deep research → niche & secret working draft.
- [lessons.md](./lessons.md) — lessons paid for in real commits. What recent dev cycles taught about the practice.
- [wins.md](./wins.md) — asset-base inventory. What's actually shipped, dated, defensible. Naval frame: "wealth is assets that earn while you sleep."
- [weekly/](./weekly/) — weekly notes (`YYYY-Www.md`). Format: shipped → learned → next.

Other suggested filenames if needed:

- `go-to-market.md` — overall GTM strategy, ICP, positioning, channels, targets
- `goals.md` — quarterly / yearly goals and targets

Add files freely — the [docs README](../README.md) describes naming conventions.
