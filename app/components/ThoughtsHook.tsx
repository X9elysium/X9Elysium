import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { getThoughts } from "../thoughts/lib";

export default function ThoughtsHook() {
  const thoughts = getThoughts().slice(0, 3);
  if (thoughts.length === 0) return null;

  return (
    <section
      className="relative bg-white dark:bg-black py-20 sm:py-28 overflow-hidden border-t border-neutral-200/70 dark:border-white/[0.06]"
      aria-labelledby="thoughts-hook-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.05] blur-3xl" />
      </div>

      <div className="relative section-container">
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-5">
            <Sparkles className="w-3 h-3" />
            Open Thread
          </span>
          <h2
            id="thoughts-hook-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-neutral-900 dark:text-white text-balance"
          >
            Push back. <span className="text-gradient-emerald">No signup.</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
            Field notes from the consulting practice. Anyone can drop a counter, a war story, or
            ask a stupid question without making an account. We read everything.
          </p>
        </div>

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {thoughts.map((t) => (
            <li key={t.id}>
              <Link
                href={`/thoughts#${t.id}`}
                className="group block h-full rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-colors"
              >
                <p className="text-[0.95rem] leading-[1.65] text-neutral-800 dark:text-neutral-200 line-clamp-6">
                  {t.text}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-500">
                  <MessageCircle className="w-3 h-3" />
                  reply on the page
                  <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/thoughts"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
          >
            Read all thoughts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://x.com/x9elysium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-neutral-200 dark:border-white/[0.1] text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Or follow on x.com
          </a>
        </div>
      </div>
    </section>
  );
}
