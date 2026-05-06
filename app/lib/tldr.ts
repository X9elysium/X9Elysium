// Naval-style TL;DR builder. Server-only.
// Reads explicit `tldr` frontmatter or derives a 1-line punch + 3 key truths
// + a cleaned speakable transcript from raw markdown/MDX content.

export type Tldr = {
  punch: string;
  summary: string;
  truths: string[];
};

export type SpeakableSource = {
  title: string;
  tldr?: Tldr;
  body: string; // raw markdown/MDX (without frontmatter)
};

/** Strip markdown to plain text. Used both for derivation and for TTS. */
export function markdownToPlainText(md: string): string {
  let s = md;
  s = s.replace(/^---\n[\s\S]*?\n---\n?/, "");
  s = s.replace(/```[\s\S]*?```/g, "\n\n");
  s = s.replace(/`([^`]*)`/g, "$1");
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/^>\s?/gm, "");
  s = s.replace(/^[-*+]\s+/gm, "");
  s = s.replace(/^\d+\.\s+/gm, "");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  s = s.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
  s = s.replace(/~~([^~]+)~~/g, "$1");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/[✅⚠️\u{1F6D1}\u{1F7E2}\u{1F7E1}\u{1F534}]/gu, "");
  s = s.replace(/\|/g, ", ");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function firstParagraph(md: string): string {
  const text = markdownToPlainText(md);
  const para = text.split(/\n{2,}/).find((p) => p.trim().length > 0) ?? "";
  return para.trim();
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Pull "key truths" — short, opinionated bullets — from the markdown body. */
function deriveKeyTruths(md: string, max = 3): string[] {
  const lines = md.split(/\n/);
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    // Bold-led bullets ("- **Point.** rest…") usually carry the punch.
    let m = line.match(/^[-*+]\s+\*\*([^*]+)\*\*\s*[—:.\-]?\s*(.+)?$/);
    if (m) {
      const head = m[1].replace(/[#*_`]/g, "").trim();
      const tail = (m[2] || "").replace(/\[(.+?)\]\(.+?\)/g, "$1").trim();
      const combined = tail ? `${head} — ${tail}` : head;
      out.push(clip(combined, 180));
      if (out.length >= max) break;
      continue;
    }
    // Plain bullet
    m = line.match(/^[-*+]\s+(.{20,})$/);
    if (m) {
      const text = m[1].replace(/[#*_`]/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1").trim();
      if (text.length >= 20) out.push(clip(text, 180));
      if (out.length >= max) break;
    }
  }
  return out;
}

/** One-line punch — the Naval cadence. Prefer first short sentence under 110 chars. */
function derivePunch(body: string, fallback: string): string {
  const para = firstParagraph(body);
  const sents = splitSentences(para);
  for (const s of sents) {
    if (s.length >= 30 && s.length <= 140) return s;
  }
  if (sents[0]) return clip(sents[0], 140);
  return clip(fallback, 140);
}

/** 2–3 sentence summary — under 320 chars total. */
function deriveSummary(body: string, fallback: string): string {
  const para = firstParagraph(body);
  if (!para) return clip(fallback, 320);
  const sents = splitSentences(para);
  let acc = "";
  for (const s of sents) {
    if ((acc + " " + s).trim().length > 320) break;
    acc = acc ? `${acc} ${s}` : s;
  }
  return acc || clip(para, 320);
}

/**
 * Build a Naval-style TL;DR from explicit frontmatter (preferred) or derive
 * from the body. Always returns punch + summary + truths so consumers can
 * lay it out without extra checks.
 */
export function buildTldr(opts: {
  body: string;
  /** Explicit override from frontmatter (`tldr` field). */
  override?: Partial<Tldr>;
  /** Optional fallback string (e.g., frontmatter description) if body is empty. */
  fallback?: string;
}): Tldr {
  const fb = opts.fallback ?? "";
  const punch = opts.override?.punch?.trim() || derivePunch(opts.body, fb);
  const summary = opts.override?.summary?.trim() || deriveSummary(opts.body, fb);
  const truths =
    opts.override?.truths && opts.override.truths.length > 0
      ? opts.override.truths.map((t) => clip(t.trim(), 200)).filter(Boolean)
      : deriveKeyTruths(opts.body, 3);
  return { punch, summary, truths };
}

/** Build the speakable transcript (TLDR up top + body). Used by the audio player. */
export function buildSpeakable(src: SpeakableSource): string {
  const { title, tldr, body } = src;
  const head = tldr
    ? [
        title ? `${title}.` : "",
        tldr.punch ? `In one line: ${tldr.punch}` : "",
        tldr.summary ? tldr.summary : "",
        tldr.truths.length > 0
          ? "Three things to keep in mind. " +
            tldr.truths.map((t, i) => `${i + 1}. ${t}.`).join(" ")
          : "",
        "Now the full piece.",
      ]
        .filter(Boolean)
        .join(" ")
    : title
      ? `${title}.`
      : "";
  const plainBody = markdownToPlainText(body);
  return [head, plainBody].filter(Boolean).join("\n\n");
}
