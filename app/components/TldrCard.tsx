import { Sparkles } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import type { Tldr } from "../lib/tldr";

interface Props {
  tldr: Tldr;
  /** Speakable transcript for the audio player. If omitted, the player is hidden. */
  speakable?: string;
  /** Eyebrow above the punch — e.g., "TL;DR" (default), "Field Note", "Journal Entry". */
  eyebrow?: string;
  /** Player eyebrow — e.g., "Listen". */
  playerEyebrow?: string;
}

export default function TldrCard({
  tldr,
  speakable,
  eyebrow = "TL;DR",
  playerEyebrow = "Listen",
}: Props) {
  return (
    <aside
      aria-label={`${eyebrow} summary`}
      className="not-prose relative overflow-hidden rounded-2xl border border-emerald-500/20 dark:border-emerald-400/15 bg-gradient-to-br from-emerald-500/[0.04] via-white/60 to-white/40 dark:from-emerald-500/[0.06] dark:via-white/[0.02] dark:to-transparent backdrop-blur-sm shadow-[0_1px_0_rgba(16,185,129,0.08)] my-10 lg:my-12"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700/60 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-5">
          <Sparkles className="w-3 h-3" />
          {eyebrow}
        </div>

        {tldr.punch && (
          <p className="text-xl sm:text-[1.4rem] leading-snug font-light tracking-tight text-neutral-900 dark:text-white text-balance">
            {tldr.punch}
          </p>
        )}

        {tldr.summary && tldr.summary !== tldr.punch && (
          <p className="mt-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {tldr.summary}
          </p>
        )}

        {tldr.truths.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {tldr.truths.map((t, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300"
              >
                <span
                  aria-hidden
                  className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        )}

        {speakable && speakable.trim().length > 0 && (
          <div className="mt-7 pt-6 border-t border-emerald-500/15 dark:border-emerald-400/10">
            <AudioPlayer speakableText={speakable} eyebrow={playerEyebrow} />
          </div>
        )}
      </div>
    </aside>
  );
}
