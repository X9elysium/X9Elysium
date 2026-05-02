import fs from "fs";
import path from "path";
import { marked } from "marked";

const DOCS_DIR = path.join(process.cwd(), "docs");

// Folders/files to keep off the public site.
// `journal/` is private per CLAUDE.md and must never appear in nav, sitemap, or content.
const PRIVATE_PATHS = ["journal"];

export type DocFile = {
  type: "file";
  name: string;
  /** Original filesystem-relative path, e.g. "audits/FULL-AUDIT-REPORT.md" */
  path: string;
  /** URL slug array, e.g. ["audits", "full-audit-report"] */
  slug: string[];
  /** Display title — first H1 if present, else humanized filename. */
  title: string;
  ext: string;
};

export type DocDir = {
  type: "dir";
  name: string;
  path: string;
  children: DocNode[];
};

export type DocNode = DocFile | DocDir;

function slugifySegment(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pathToSlug(relPath: string): string[] {
  return relPath.split("/").map(slugifySegment).filter(Boolean);
}

function readTitle(absPath: string, fallback: string): string {
  try {
    const content = fs.readFileSync(absPath, "utf8");
    const m = content.match(/^\s*#\s+(.+?)\s*$/m);
    if (m) return m[1].replace(/[#*_`]/g, "").trim();
  } catch {}
  return fallback;
}

function humanize(name: string): string {
  return name
    .replace(/\.md$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPrivate(relPath: string): boolean {
  const head = relPath.split("/")[0];
  return PRIVATE_PATHS.includes(head);
}

function buildTree(dir: string, rel = ""): DocNode[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: DocNode[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const relPath = rel ? `${rel}/${e.name}` : e.name;
    if (isPrivate(relPath)) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      const children = buildTree(abs, relPath);
      if (children.length === 0) continue;
      nodes.push({ type: "dir", name: e.name, path: relPath, children });
    } else if (e.isFile() && /\.md$/i.test(e.name)) {
      const title = readTitle(abs, humanize(e.name));
      nodes.push({
        type: "file",
        name: e.name,
        path: relPath,
        slug: pathToSlug(relPath),
        title,
        ext: "md",
      });
    }
  }
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return nodes;
}

let cachedTree: DocNode[] | null = null;
export function getTree(): DocNode[] {
  if (!cachedTree) cachedTree = buildTree(DOCS_DIR);
  return cachedTree;
}

export function getAllFiles(): DocFile[] {
  const out: DocFile[] = [];
  function walk(nodes: DocNode[]) {
    for (const n of nodes) {
      if (n.type === "file") out.push(n);
      else walk(n.children);
    }
  }
  walk(getTree());
  return out;
}

export function findBySlug(slug: string[]): DocFile | null {
  const target = slug.map((s) => s.toLowerCase()).join("/");
  for (const f of getAllFiles()) {
    if (f.slug.join("/") === target) return f;
  }
  return null;
}

export type RenderedDoc = {
  file: DocFile;
  html: string;
  raw: string;
  toc: { id: string; text: string; level: number }[];
};

export function renderDoc(file: DocFile): RenderedDoc {
  const abs = path.join(DOCS_DIR, file.path);
  const raw = fs.readFileSync(abs, "utf8");

  const toc: RenderedDoc["toc"] = [];
  const renderer = new marked.Renderer();
  renderer.heading = (text, level, rawText) => {
    const id = slugifySegment(rawText);
    if (level >= 2 && level <= 3) toc.push({ id, text: stripMd(rawText), level });
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  const html = marked.parse(raw, { renderer }) as string;
  return { file, html, raw, toc };
}

function stripMd(s: string): string {
  return s.replace(/[#*_`]/g, "").trim();
}

export function fileSlugUrl(slug: string[]): string {
  return "/docs/" + slug.join("/");
}

/** Top-level groups for sidebar — order + display labels. */
export const GROUP_ORDER = ["audits", "deployments", "progress"];
export const GROUP_LABELS: Record<string, string> = {
  audits: "Audits",
  deployments: "Deployments",
  progress: "Progress",
};
