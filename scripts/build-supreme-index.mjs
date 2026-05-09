#!/usr/bin/env node
/**
 * Bakes a small, tool-friendly index of x9elysium thoughts + blog posts into
 * worker/supreme-index.json so /api/grok can call search_thoughts / search_blog
 * without hitting any external store.
 *
 * Inputs:
 *   - data/x-thoughts.md       — one thought per `---` block, leading HTML comment
 *   - content/posts/*.mdx      — blog posts (frontmatter + body)
 *
 * Output: worker/supreme-index.json
 *
 * Run from `prebuild` so every deploy ships a fresh index.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const THOUGHTS_FILE = path.join(ROOT, "data/x-thoughts.md");
const POSTS_DIR = path.join(ROOT, "content/posts");
const OUT = path.join(ROOT, "worker/supreme-index.json");

const POST_BODY_CHAR_BUDGET = 2000;
const MAX_THOUGHTS = 200;
const MAX_POSTS = 80;

function hashId(s) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
}

function stripHtmlComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, "");
}

function readThoughts() {
  if (!fs.existsSync(THOUGHTS_FILE)) return [];
  const raw = fs.readFileSync(THOUGHTS_FILE, "utf8");
  const cleaned = stripHtmlComments(raw).trim();
  if (!cleaned) return [];
  const blocks = cleaned
    .split(/^\s*---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean);
  const out = [];
  for (const block of blocks) {
    if (/^DRAFT[:\s]/i.test(block)) continue;
    if (block.length < 10) continue;
    out.push({
      id: hashId(block),
      text: block,
      anchor: `https://x9elysium.com/thoughts#${hashId(block)}`,
    });
    if (out.length >= MAX_THOUGHTS) break;
  }
  return out;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[kv[1]] = val;
  }
  return { meta, body: raw.slice(m[0].length).trim() };
}

function plainExcerpt(body, budget) {
  // Drop common MDX/markdown noise so the index is readable as plain text.
  const cleaned = body
    .replace(/^import\s+[^\n]+\n/gm, "")
    .replace(/^export\s+[^\n]+\n/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= budget) return cleaned;
  // Cut at a word boundary so the excerpt reads naturally.
  const cut = cleaned.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > budget * 0.7 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const out = [];
  for (const name of fs.readdirSync(POSTS_DIR).sort()) {
    if (name.startsWith("_")) continue;
    if (!/\.(md|mdx)$/i.test(name)) continue;
    const slug = name.replace(/\.(md|mdx)$/i, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, name), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    if (meta.draft === "true") continue;
    out.push({
      slug,
      title: meta.title || slug.replace(/-/g, " "),
      description: meta.description || meta.excerpt || "",
      url: `https://x9elysium.com/blog/${slug}`,
      body: plainExcerpt(body, POST_BODY_CHAR_BUDGET),
    });
    if (out.length >= MAX_POSTS) break;
  }
  return out;
}

const thoughts = readThoughts();
const posts = readPosts();

const payload = {
  v: 1,
  builtAt: new Date().toISOString(),
  counts: { thoughts: thoughts.length, posts: posts.length },
  thoughts,
  posts,
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 0));
const bytes = fs.statSync(OUT).size;
console.log(
  `[build-supreme-index] ${thoughts.length} thoughts, ${posts.length} posts, ${(bytes / 1024).toFixed(1)} KB → worker/supreme-index.json`,
);
