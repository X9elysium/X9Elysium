import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, ArrowLeft, Calendar, FileText } from "lucide-react";
import fs from "fs";
import path from "path";
import { findBySlug, getAllFiles, renderDoc } from "../lib";

interface Props {
  params: { slug: string[] };
}

export function generateStaticParams() {
  return getAllFiles().map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const file = findBySlug(params.slug);
  if (!file) return { title: "Not found · X9Elysium Docs", robots: { index: false, follow: false } };
  return {
    title: `${file.title} · X9Elysium Docs`,
    description: `Internal documentation: ${file.title}`,
    robots: { index: false, follow: false },
  };
}

export default function DocFilePage({ params }: Props) {
  const file = findBySlug(params.slug);
  if (!file) notFound();

  const { html, toc } = renderDoc(file);
  const abs = path.join(process.cwd(), "docs", file.path);
  const stat = fs.statSync(abs);

  return (
    <article>
      {/* Breadcrumb */}
      <nav
        className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 mb-6"
        aria-label="Breadcrumb"
      >
        <Link
          href="/docs"
          className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Docs
        </Link>
        {file.path.split("/").map((seg, i, arr) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
            <span
              className={
                i === arr.length - 1
                  ? "text-neutral-900 dark:text-white font-medium font-mono"
                  : "font-mono"
              }
            >
              {seg.replace(/\.md$/i, "")}
            </span>
          </span>
        ))}
      </nav>

      {/* Header card */}
      <header className="mb-8 lg:mb-10 pb-6 lg:pb-8 border-b border-neutral-200/70 dark:border-white/[0.06]">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.18em] mb-4">
          <FileText className="w-3 h-3" />
          {file.path.split("/")[0]}
        </div>
        <h1 className="text-h2-display font-light tracking-tight text-neutral-900 dark:text-white mb-3">
          {file.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Updated {stat.mtime.toISOString().slice(0, 10)}
          </span>
          <span className="font-mono">{file.path}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px] gap-12">
        {/* Markdown body */}
        <div
          className="docs-prose prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* On-page TOC */}
        {toc.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-[100px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-3">
                On this page
              </p>
              <ul className="space-y-1.5 border-l border-neutral-200/70 dark:border-white/[0.06]">
                {toc.map((h) => (
                  <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1.25rem" : "0.75rem" }}>
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

      {/* Footer nav */}
      <div className="mt-12 pt-8 border-t border-neutral-200/70 dark:border-white/[0.06]">
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
