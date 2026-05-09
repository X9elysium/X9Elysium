#!/usr/bin/env node
/**
 * Bakes the markdown plans listed in `docs/plans-allowlist.json` into
 * `worker/plans-seed.json` so the Worker can serve a fallback copy before
 * any D1 row exists for the slug.
 *
 * Runs as part of `prebuild` so every `npm run build` ships a fresh seed.
 *
 * Output shape (consumed by worker/plans.ts):
 *   {
 *     v: 1,
 *     builtAt: ISO,
 *     plans: { [slug]: { title: string, content: string, etag: string } }
 *   }
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ALLOWLIST = path.join(ROOT, "docs/plans-allowlist.json");
const OUT = path.join(ROOT, "worker/plans-seed.json");

const SLUG_RE = /^[a-z0-9][a-z0-9_\-]{0,80}$/i;

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function fail(msg) {
  console.error(`[build-plans-seed] ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(ALLOWLIST)) {
  // No allowlist — write an empty seed and move on. Lets the build succeed
  // for clones that haven't opted into the plans surface yet.
  fs.writeFileSync(
    OUT,
    JSON.stringify({ v: 1, builtAt: new Date().toISOString(), plans: {} }, null, 0),
  );
  console.log("[build-plans-seed] no allowlist found — wrote empty seed");
  process.exit(0);
}

let allowlist;
try {
  allowlist = JSON.parse(fs.readFileSync(ALLOWLIST, "utf8"));
} catch (err) {
  fail(`failed to parse ${path.relative(ROOT, ALLOWLIST)}: ${err.message}`);
}

if (!allowlist || !Array.isArray(allowlist.plans)) {
  fail("allowlist missing `plans` array");
}

const plans = {};
const seen = new Set();

for (const entry of allowlist.plans) {
  if (!entry || typeof entry !== "object") {
    fail(`invalid plan entry: ${JSON.stringify(entry)}`);
  }
  const { slug, title, source } = entry;
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    fail(`invalid slug: ${JSON.stringify(slug)}`);
  }
  if (seen.has(slug)) {
    fail(`duplicate slug: ${slug}`);
  }
  if (typeof title !== "string" || title.length === 0) {
    fail(`plan ${slug} missing title`);
  }
  if (typeof source !== "string" || source.length === 0) {
    fail(`plan ${slug} missing source path`);
  }
  const sourcePath = path.join(ROOT, source);
  if (!fs.existsSync(sourcePath)) {
    fail(`plan ${slug}: source file not found at ${source}`);
  }
  const content = fs.readFileSync(sourcePath, "utf8");
  if (content.length < 10) {
    fail(`plan ${slug}: source file is empty or too short`);
  }
  plans[slug] = {
    title,
    content,
    etag: sha256Hex(content),
  };
  seen.add(slug);
}

const payload = {
  v: 1,
  builtAt: new Date().toISOString(),
  plans,
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 0));
const sizeKb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(
  `[build-plans-seed] ${Object.keys(plans).length} plans baked → worker/plans-seed.json (${sizeKb} KB)`,
);
