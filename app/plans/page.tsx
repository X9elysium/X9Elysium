import Link from "next/link";
import { Lock, FileText } from "lucide-react";
import { getAllPlans } from "./lib";

export default function PlansIndexPage() {
  const plans = getAllPlans();
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs font-mono mb-6">
        <Lock className="w-3.5 h-3.5" />
        private surface
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">
        Plans
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
        Editable plan documents behind a PIN. Reachable by direct link only — no
        nav, no sitemap, no llms.txt. Each link is shareable; the PIN is the gate.
      </p>

      <ul className="space-y-2">
        {plans.map((p) => (
          <li
            key={p.slug}
            className="rounded-xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm"
          >
            <Link
              href={`/plans/${p.slug}`}
              className="flex items-center gap-3 px-4 py-3 group"
            >
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
                {p.title}
              </span>
              <span className="ml-auto font-mono text-[11px] text-neutral-500 dark:text-neutral-500">
                /{p.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {plans.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          No plans configured. Add an entry to{" "}
          <code className="font-mono text-emerald-700 dark:text-emerald-300">
            docs/plans-allowlist.json
          </code>{" "}
          and rebuild.
        </p>
      )}
    </div>
  );
}
