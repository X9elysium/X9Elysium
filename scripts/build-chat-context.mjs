#!/usr/bin/env node
/**
 * Bakes the full X9Elysium documentation corpus into worker/chat-context.json
 * so the /api/chat Worker can serve it as a (cached) system prompt.
 *
 * Includes:
 *   - public/llms.txt                       — curated public summary
 *   - docs/**\/*.md                          — internal strategy + plans + audits
 *   - content/posts/*.md                    — published blog posts
 *
 * Excludes:
 *   - docs/journal/**                       — encrypted, intentionally private
 *
 * Run as a `prebuild` hook so every `npm run build` ships fresh context.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCES = [
  { label: "public/llms.txt", file: path.join(ROOT, "public/llms.txt") },
  { label: "docs/", dir: path.join(ROOT, "docs"), exclude: ["journal"] },
  { label: "content/posts/", dir: path.join(ROOT, "content/posts") },
];

const OUT = path.join(ROOT, "worker/chat-context.json");
const MAX_BYTES = 600_000; // ~150k tokens — safely under Sonnet 4.6's window with room for chat

function walk(dir, exclude = []) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (exclude.includes(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs, exclude));
    } else if (entry.isFile() && /\.(md|txt)$/i.test(entry.name)) {
      out.push(abs);
    }
  }
  return out.sort();
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function header(filePath) {
  return `\n\n===== ${rel(filePath)} =====\n`;
}

let body = "";
let fileCount = 0;
const filesIncluded = [];
const filesSkipped = [];

for (const src of SOURCES) {
  if (src.file) {
    if (!fs.existsSync(src.file)) continue;
    const text = fs.readFileSync(src.file, "utf8");
    const chunk = header(src.file) + text.trim();
    if (body.length + chunk.length > MAX_BYTES) {
      filesSkipped.push(rel(src.file));
      continue;
    }
    body += chunk;
    fileCount++;
    filesIncluded.push(rel(src.file));
  } else if (src.dir) {
    for (const f of walk(src.dir, src.exclude || [])) {
      const text = fs.readFileSync(f, "utf8");
      // Strip frontmatter to save tokens — we want the body, not metadata
      const stripped = text.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
      if (!stripped) continue;
      const chunk = header(f) + stripped;
      if (body.length + chunk.length > MAX_BYTES) {
        filesSkipped.push(rel(f));
        continue;
      }
      body += chunk;
      fileCount++;
      filesIncluded.push(rel(f));
    }
  }
}

const payload = {
  v: 1,
  builtAt: new Date().toISOString(),
  files: fileCount,
  bytes: body.length,
  filesIncluded,
  filesSkipped,
  context: body.trim(),
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 0));
console.log(
  `[build-chat-context] ${fileCount} files, ${(body.length / 1024).toFixed(1)} KB → ${rel(OUT)}` +
    (filesSkipped.length ? ` (skipped ${filesSkipped.length} for size cap)` : ""),
);
