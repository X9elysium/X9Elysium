"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  fadeUp,
  fadeUpBlur,
  fadeIn,
  staggerContainer,
  heroStagger,
  smoothEase,
} from "../lib/animations";
import {
  changelogEntries,
  CHANGELOG_CATEGORIES,
  type ChangelogCategory,
  type ChangelogEntry,
} from "./data";

const CATEGORY_STYLE: Record<ChangelogCategory, string> = {
  "New page":
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  "New feature":
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  Foundation:
    "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300",
  Marketing:
    "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-300",
  Infrastructure:
    "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:text-violet-300",
  Improvement:
    "bg-neutral-900/[0.04] text-neutral-700 border-neutral-300 dark:bg-white/[0.05] dark:text-neutral-300 dark:border-white/[0.10]",
  Removed:
    "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300",
};

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(entries: ChangelogEntry[]) {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const e of entries) {
    if (!groups.has(e.date)) groups.set(e.date, []);
    groups.get(e.date)!.push(e);
  }
  // newest first
  return Array.from(groups.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function ChangelogClient() {
  const [active, setActive] = useState<ChangelogCategory | "All">("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? changelogEntries
        : changelogEntries.filter((e) => e.category === active),
    [active]
  );

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-white dark:bg-black"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-15%] right-[-10%] w-[640px] h-[640px] bg-emerald-500/[0.08] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[520px] h-[520px] bg-emerald-700/[0.05] rounded-full blur-[160px] pointer-events-none" />
          </div>

          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="section-container relative z-10 pt-[140px] pb-16 sm:pt-[160px] sm:pb-20"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Changelog
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              What we shipped,
              <br />
              <span className="text-gradient-emerald">in the open.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: smoothEase, delay: 0.1 }}
              className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed"
            >
              Every meaningful change to X9Elysium &mdash; new pages, new
              features, infrastructure, and the things we removed because they
              didn&apos;t earn their place. Updated continuously.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: smoothEase, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-white/[0.10] text-sm text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Rss className="w-3.5 h-3.5" />
                Subscribe to the blog
              </Link>
              <Link
                href="/foundation"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Why we ship like this
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Filter strip ── */}
        <section className="sticky top-[64px] z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-y border-neutral-200 dark:border-white/[0.06]">
          <div className="section-container py-3 sm:py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {(["All", ...CHANGELOG_CATEGORIES] as const).map((cat) => {
                const isActive = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-white/[0.10] hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="bg-white dark:bg-black py-16 sm:py-20 lg:py-24">
          <div className="section-container">
            {grouped.length === 0 ? (
              <div className="py-32 text-center text-neutral-500 dark:text-neutral-400">
                Nothing in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {grouped.map(([date, entries]) => (
                  <DateGroup key={date} date={date} entries={entries} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function DateGroup({
  date,
  entries,
}: {
  date: string;
  entries: ChangelogEntry[];
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="contents">
      {/* Date column */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="lg:col-span-3"
      >
        <div className="lg:sticky lg:top-[140px]">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500 mb-2">
            {formatDate(date)}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-500">
            {entries.length} {entries.length === 1 ? "release" : "releases"}
          </div>
        </div>
      </motion.div>

      {/* Entries column */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="lg:col-span-9 flex flex-col gap-8 sm:gap-10"
      >
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </motion.div>
    </div>
  );
}

function EntryCard({ entry }: { entry: ChangelogEntry }) {
  const inner = (
    <article
      className={`glass-card p-6 sm:p-8 transition-all duration-300 ${
        entry.href
          ? "group-hover:border-emerald-500/30 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-emerald-500/[0.06]"
          : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${
            CATEGORY_STYLE[entry.category]
          }`}
        >
          {entry.category}
        </span>
        {entry.href && (
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500 group-hover:text-emerald-500 transition-colors">
            View
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <h2
        className={`text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white text-balance mb-3 ${
          entry.href
            ? "group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            : ""
        }`}
      >
        {entry.title}
      </h2>

      <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
        {entry.description}
      </p>

      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {entry.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.6, ease: smoothEase }}
    >
      {entry.href ? (
        <Link href={entry.href} className="block group">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}
