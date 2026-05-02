import fs from "fs";
import path from "path";
import { webcrypto } from "crypto";
import { marked } from "marked";

const JOURNAL_DIR = path.join(process.cwd(), "docs", "journal");

// PIN is intentionally hard-coded as a fallback. Override at build time with
// JOURNAL_PIN env var if you want to rotate it. See docs/journal/README.md.
const PIN = process.env.JOURNAL_PIN || "8344";
const ITERATIONS = 100_000;
const SALT_LEN = 16;
const IV_LEN = 12;

type FileEntry = {
  type: "file";
  name: string;
  path: string;
  slug: string;
  title: string;
  html: string;
  raw: string;
};

type DirEntry = {
  type: "dir";
  name: string;
  path: string;
  children: TreeEntry[];
};

type TreeEntry = FileEntry | DirEntry;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pathToSlug(rel: string): string {
  return rel.split("/").map(slugify).filter(Boolean).join("/");
}

function humanize(name: string): string {
  return name
    .replace(/\.md$/i, "")
    .replace(/^[0-9]+[-_\s]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function readTitle(content: string, fallback: string): string {
  const m = content.match(/^\s*#\s+(.+?)\s*$/m);
  if (m) return m[1].replace(/[#*_`]/g, "").trim();
  return fallback;
}

function buildTree(dir: string, rel = ""): TreeEntry[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: TreeEntry[] = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const abs = path.join(dir, e.name);
    const relPath = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      const children = buildTree(abs, relPath);
      if (children.length === 0) continue;
      out.push({ type: "dir", name: e.name, path: relPath, children });
    } else if (e.isFile() && /\.md$/i.test(e.name)) {
      const raw = fs.readFileSync(abs, "utf8");
      marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
      const html = marked.parse(raw) as string;
      out.push({
        type: "file",
        name: e.name,
        path: relPath,
        slug: pathToSlug(relPath),
        title: readTitle(raw, humanize(e.name)),
        html,
        raw,
      });
    }
  }
  out.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return out;
}

function bufToB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Buffer.from(bytes).toString("base64");
}

async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return webcrypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export type EncryptedBlob = {
  v: 1;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  /** Number of files protected (for showing a count on the lock screen) */
  count: number;
};

/** Build-time: read journal/, render md, encrypt the whole structure. */
export async function getEncryptedJournal(): Promise<EncryptedBlob> {
  const tree = buildTree(JOURNAL_DIR);

  // Strip raw markdown — clients only need rendered HTML
  function stripRaw(nodes: TreeEntry[]): unknown {
    return nodes.map((n) =>
      n.type === "dir"
        ? { type: "dir", name: n.name, path: n.path, children: stripRaw(n.children) as unknown[] }
        : {
            type: "file",
            name: n.name,
            path: n.path,
            slug: n.slug,
            title: n.title,
            html: n.html,
          }
    );
  }
  const payload = JSON.stringify({ tree: stripRaw(tree) });

  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(PIN, salt);
  const ct = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(payload)
  );

  return {
    v: 1,
    iterations: ITERATIONS,
    salt: bufToB64(salt),
    iv: bufToB64(iv),
    ciphertext: bufToB64(new Uint8Array(ct)),
    count: countFiles(tree),
  };
}

function countFiles(nodes: TreeEntry[]): number {
  let n = 0;
  for (const node of nodes) {
    if (node.type === "file") n++;
    else n += countFiles(node.children);
  }
  return n;
}
