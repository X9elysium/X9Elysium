import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import { ArrowLeft, Calendar, FileText, Sparkles } from "lucide-react";
import AudioPlayer from "../../../components/AudioPlayer";

const REL_PATH = "audits/FULL-AUDIT-REPORT.md";

export const metadata: Metadata = {
  title: "Full SEO Audit · X9Elysium Docs",
  description:
    "X9Elysium SEO audit — health score, critical issues, technical findings, and prioritized fixes. Listen with British or Indian voices.",
  robots: { index: false, follow: false },
};

function readDoc() {
  const abs = path.join(process.cwd(), "docs", REL_PATH);
  const raw = fs.readFileSync(abs, "utf8");
  const stat = fs.statSync(abs);

  const toc: { id: string; text: string; level: number }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = (text, level, rawText) => {
    const id = String(rawText)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (level >= 2 && level <= 3) {
      toc.push({ id, text: String(rawText).replace(/[#*_`]/g, "").trim(), level });
    }
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  const html = marked.parse(raw, { renderer }) as string;

  // Build speakable text: strip markdown so the TTS engine reads cleanly.
  const speakable = markdownToSpeechText(raw);
  return { raw, html, toc, mtime: stat.mtime, speakable };
}

function markdownToSpeechText(md: string) {
  let s = md;
  s = s.replace(/^---\n[\s\S]*?\n---\n/, "");
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
  // Drop emoji status markers — they don't read well
  s = s.replace(/[✅⚠️🛑🟢🟡🔴]/g, "");
  // Tables: replace pipes with commas so they read as lists
  s = s.replace(/\|/g, ", ");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function readingTimeMin(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export default function FullAuditReportPage() {
  const { html, toc, mtime, speakable } = readDoc();
  const updated = mtime.toISOString().slice(0, 10);
  const minutes = readingTimeMin(speakable);

  return (
    <article className="grok-article">
      {/* Breadcrumb */}
      <nav
        className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 mb-8"
        aria-label="Breadcrumb"
      >
        <Link
          href="/docs"
          className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Docs
        </Link>
      </nav>

      {/* Grok-style header */}
      <header className="grok-header relative mb-10 lg:mb-14">
        <div className="grok-grain absolute inset-0 -z-10 opacity-[0.04] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-300 dark:border-white/[0.12] text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-700 dark:text-neutral-300 mb-6">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Field Report · 001
        </div>

        <h1 className="grok-title font-light tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.02] mb-5">
          The state of <span className="grok-em">x9elysium.com</span>,
          <br />
          told straight.
        </h1>

        <p className="grok-deck text-neutral-600 dark:text-neutral-300 max-w-3xl mb-8">
          A full SEO and AI-search audit of x9elysium.com — what&apos;s working, what&apos;s quietly broken,
          and the five fixes that unlock the next twenty points of health score before any new
          content ships.
        </p>

        {/* Byline strip */}
        <div className="grok-byline flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-500 pb-6 border-b border-neutral-200 dark:border-white/[0.08]">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            X9Elysium Audit Desk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Updated {updated}
          </span>
          <span>{minutes} min read · or listen below</span>
        </div>
      </header>

      {/* Audio player */}
      <div className="mb-10 lg:mb-14">
        <AudioPlayer speakableText={speakable} eyebrow="Listen · Full SEO Audit" />
      </div>

      {/* Body + TOC */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-12">
        <div
          className="grok-prose docs-prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {toc.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-[100px]">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400 mb-3">
                In this report
              </p>
              <ul className="space-y-1.5 border-l border-neutral-200 dark:border-white/[0.08]">
                {toc.map((h) => (
                  <li
                    key={h.id}
                    style={{ paddingLeft: h.level === 3 ? "1.5rem" : "0.85rem" }}
                  >
                    <a
                      href={"#" + h.id}
                      className="block text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-0.5 -ml-px border-l-2 border-transparent hover:border-emerald-500"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-white/[0.08]">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all docs
        </Link>
      </div>
    </article>
  );
}
