import Link from "next/link";
import { ArrowRight, FileText, Folder, Sparkles, Lock } from "lucide-react";
import { getAllFiles, getTree, GROUP_LABELS, GROUP_ORDER } from "./lib";

export default function DocsIndexPage() {
  const tree = getTree();
  const files = getAllFiles();

  const groups = GROUP_ORDER.map((key) => {
    const node = tree.find((n) => n.type === "dir" && n.name === key);
    if (!node || node.type !== "dir") return null;
    return { key, label: GROUP_LABELS[key] || key, dir: node };
  }).filter(Boolean) as Array<{ key: string; label: string; dir: Extract<ReturnType<typeof getTree>[number], { type: "dir" }> }>;

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 lg:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-[0.15em] mb-5">
          <Sparkles className="w-3 h-3" />
          Internal Documentation
        </div>
        <h1 className="text-h2-display font-light tracking-tight text-neutral-900 dark:text-white mb-4">
          X9Elysium <span className="text-gradient-emerald">Docs</span>
        </h1>
        <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Audits, deployment runbooks, and the running progress changelog. Everything below is generated and maintained alongside the codebase.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-neutral-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06]">
            <strong className="text-neutral-900 dark:text-white font-semibold">{files.length}</strong> files
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06]">
            <strong className="text-neutral-900 dark:text-white font-semibold">{groups.length}</strong> sections
          </span>
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-8">
        {groups.map(({ key, label, dir }) => {
          const dirFiles = collectFiles(dir.children);
          if (dirFiles.length === 0) return null;
          return (
            <section
              key={key}
              className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            >
              <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/70 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">{label}</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {dirFiles.length} {dirFiles.length === 1 ? "file" : "files"}
                    </p>
                  </div>
                </div>
              </header>
              <ul className="divide-y divide-neutral-200/70 dark:divide-white/[0.05]">
                {dirFiles.map((f) => (
                  <li key={f.path}>
                    <Link
                      href={"/docs/" + f.slug.join("/")}
                      className="group flex items-center gap-3 px-6 py-3.5 hover:bg-emerald-500/[0.04] transition-colors"
                    >
                      <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {f.title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate font-mono">
                          {f.path}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Journal — PIN-gated */}
      <Link
        href="/docs/journal"
        className="group mt-8 flex items-center gap-4 p-5 rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent hover:border-emerald-500/40 transition-colors"
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 grid place-items-center flex-shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Journal</h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              PIN required
            </span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Encrypted at build, decrypted in your browser. Go-to-market notes, weekly reflections, progress.
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </Link>

      {/* README block */}
      <ReadmeNote />
    </div>
  );
}

function collectFiles(nodes: ReturnType<typeof getTree>) {
  const out: Array<Extract<ReturnType<typeof getTree>[number], { type: "file" }>> = [];
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    else out.push(...collectFiles(n.children));
  }
  return out;
}

function ReadmeNote() {
  const files = getAllFiles();
  const readme = files.find((f) => f.path.toLowerCase() === "readme.md");
  if (!readme) return null;
  return (
    <div className="mt-10 rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 grid place-items-center flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Conventions & Workflow</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            Filename conventions, per-commit update protocol, and how the local docs viewer fits in.
          </p>
          <Link
            href={"/docs/" + readme.slug.join("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors"
          >
            Read the docs README
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
