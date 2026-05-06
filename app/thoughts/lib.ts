import "server-only";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const THOUGHTS_FILE = path.join(process.cwd(), "data", "x-thoughts.md");

export interface Thought {
  /** Stable id derived from a hash of the thought text. */
  id: string;
  /** Plain-text body of the thought. */
  text: string;
  /** Character count — handy in the UI. */
  length: number;
}

function stripHtmlComments(s: string): string {
  return s.replace(/<!--[\s\S]*?-->/g, "");
}

function hashId(text: string): string {
  return crypto.createHash("sha1").update(text).digest("hex").slice(0, 10);
}

/**
 * Parse data/x-thoughts.md (queue file). Format: thoughts separated by `---`
 * lines. The leading HTML comment is style guide — drop it. Drafts can be
 * marked by prefixing the thought with `DRAFT:` and they're filtered out.
 */
export function getThoughts(): Thought[] {
  if (!fs.existsSync(THOUGHTS_FILE)) return [];
  const raw = fs.readFileSync(THOUGHTS_FILE, "utf8");
  const cleaned = stripHtmlComments(raw).trim();
  if (!cleaned) return [];

  const blocks = cleaned
    .split(/^\s*---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean);

  const thoughts: Thought[] = [];
  for (const block of blocks) {
    if (/^DRAFT[:\s]/i.test(block)) continue;
    if (block.length < 10) continue;
    thoughts.push({
      id: hashId(block),
      text: block,
      length: block.length,
    });
  }
  return thoughts;
}
