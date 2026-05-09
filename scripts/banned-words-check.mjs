#!/usr/bin/env node
// Post-build truth gate. Scans out/**/*.html for fabricated metrics, expired
// testimonial fragments, and unearned credentials. The "truth pass" of
// 2026-05-07 stripped these from the live site; re-introduction is a recurring
// risk because copy edits drift faster than memory. CI fails with a specific
// pointer if any pattern hits.
//
// Add a pattern only when something has been *actually* fabricated and stripped.
// Don't over-fit — false positives erode the gate's authority.

import { readFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "out");

const PATTERNS = [
  {
    id: "fabricated-revenue-lift",
    re: /\+\s?40\s?%[^<]{0,40}(revenue|lift|increase)/i,
    why: "+40% revenue lift was a fabricated metric — never substantiated.",
  },
  {
    id: "first-quarter-after-launch",
    re: /first quarter after launch[^<]{0,80}(strongest|best|biggest)/i,
    why: "Old testimonial fragment we could not verify with the named client.",
  },
  {
    id: "fabricated-project-count",
    re: /\b(50|75|100|200)\s?\+\s+(?:successful\s+)?(?:shopify\s+)?(?:projects|stores|launches|migrations|builds)\b/i,
    why: "Project count was fabricated. Use directional / anonymized framing.",
  },
  {
    id: "fabricated-success-rate",
    re: /\b9[89]\s?%\s+(?:success|satisfaction|client|retention)\b/i,
    why: "98%+ success / satisfaction rates were fabricated. Strip on sight.",
  },
  {
    id: "unearned-aws-cert",
    re: /\bAWS Certified\b/i,
    why: "AWS Certified is a real cert. Don't claim it until earned.",
  },
  {
    id: "unearned-shopify-partner-cert",
    re: /\bcertified shopify partner\b/i,
    why: "We are not in the Shopify Partner directory yet. Use 'Shopify Plus partner' (lowercase 'p') if needed.",
  },
];

const SKIP_DIRS = new Set(["_next", "static"]);

// Internal-only routes that legitimately quote stripped phrases as part of
// the audit trail (the CHANGELOG describes the truth pass; the kanban links
// to the strip-list). These pages are docs/ surfaces, not customer claims.
const SKIP_PATH_PREFIXES = [
  join(OUT_DIR, "docs"),
  join(OUT_DIR, "plans"),
  join(OUT_DIR, "changelog"), // legacy /changelog route, mirrors docs/progress
];

function shouldSkipPath(absPath) {
  return SKIP_PATH_PREFIXES.some((p) => absPath === p || absPath.startsWith(p + sep));
}

async function walkHtml(dir, hits = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return hits;
  }
  for (const ent of entries) {
    const abs = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      if (shouldSkipPath(abs)) continue;
      await walkHtml(abs, hits);
    } else if (ent.isFile() && ent.name.endsWith(".html")) {
      hits.push(abs);
    }
  }
  return hits;
}

async function main() {
  try {
    statSync(OUT_DIR);
  } catch {
    console.log(`[banned-words] out/ not found at ${OUT_DIR} — skipping (run after \`next build\`).`);
    return;
  }

  const files = await walkHtml(OUT_DIR);
  if (files.length === 0) {
    console.log("[banned-words] out/ has no HTML files — skipping.");
    return;
  }

  const violations = [];
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    for (const p of PATTERNS) {
      const match = html.match(p.re);
      if (match) {
        violations.push({ file, pattern: p, snippet: match[0] });
      }
    }
  }

  if (violations.length === 0) {
    console.log(`[banned-words] ${files.length} HTML files clean. Truth gate: passed.`);
    return;
  }

  console.error(`\n[banned-words] FAIL — ${violations.length} fabricated-claim hit(s):\n`);
  for (const v of violations) {
    const rel = relative(ROOT, v.file).split(sep).join("/");
    console.error(`  ✗ ${rel}`);
    console.error(`    pattern: ${v.pattern.id}`);
    console.error(`    snippet: "${v.snippet.slice(0, 120)}${v.snippet.length > 120 ? "…" : ""}"`);
    console.error(`    why:     ${v.pattern.why}\n`);
  }
  console.error(
    "Fix the source copy before deploying. If this is a legitimate appearance (e.g. quoting an old line in CHANGELOG), refine the pattern in scripts/banned-words-check.mjs.\n",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("[banned-words] script error:", err);
  process.exit(1);
});
