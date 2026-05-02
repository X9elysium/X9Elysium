"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  ChevronRight,
  ArrowLeft,
  FileText,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

type FileNode = {
  type: "file";
  name: string;
  path: string;
  slug: string;
  title: string;
  html: string;
};

type DirNode = {
  type: "dir";
  name: string;
  path: string;
  children: TreeNode[];
};

type TreeNode = FileNode | DirNode;

interface EncryptedBlob {
  v: 1;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  count: number;
}

interface Props {
  blob: EncryptedBlob;
}

const SESSION_KEY = "x9e_journal_unlocked_v1";

function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function decrypt(blob: EncryptedBlob, pin: string): Promise<{ tree: TreeNode[] } | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;
  const salt = b64ToBytes(blob.salt);
  const iv = b64ToBytes(blob.iv);
  const ct = b64ToBytes(blob.ciphertext);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: blob.iterations },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  try {
    const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    const text = new TextDecoder().decode(buf);
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function flattenFiles(nodes: TreeNode[]): FileNode[] {
  const out: FileNode[] = [];
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    else out.push(...flattenFiles(n.children));
  }
  return out;
}

export default function JournalApp({ blob }: Props) {
  const [tree, setTree] = useState<TreeNode[] | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Restore unlock state from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      decrypt(blob, stored).then((res) => {
        if (res?.tree) setTree(res.tree);
        else sessionStorage.removeItem(SESSION_KEY);
      });
    }
  }, [blob]);

  // Hash routing — sync activeSlug with location.hash
  useEffect(() => {
    function readHash() {
      const h = window.location.hash.replace(/^#\/?/, "");
      setActiveSlug(h || null);
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const files = useMemo(() => (tree ? flattenFiles(tree) : []), [tree]);
  const activeFile = useMemo(
    () => (activeSlug ? files.find((f) => f.slug === activeSlug) || null : null),
    [files, activeSlug]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await decrypt(blob, pin.trim());
    if (result?.tree) {
      setTree(result.tree);
      sessionStorage.setItem(SESSION_KEY, pin.trim());
      setPin("");
    } else {
      setError("Incorrect PIN.");
    }
    setBusy(false);
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    setTree(null);
    setActiveSlug(null);
    if (window.location.hash) window.location.hash = "";
  }

  if (!tree) {
    return <PinGate pin={pin} setPin={setPin} onSubmit={onSubmit} error={error} busy={busy} count={blob.count} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 lg:mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to docs
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">
            <ShieldCheck className="w-3 h-3" />
            Unlocked · {files.length} {files.length === 1 ? "entry" : "entries"}
          </div>
          <h1 className="text-h2-display font-light tracking-tight text-neutral-900 dark:text-white">
            Private <span className="text-gradient-emerald">Journal</span>
          </h1>
          <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">
            Go-to-market notes, weekly reflections, and progress tracking. Unlocked for this session only.
          </p>
        </div>
        <button
          type="button"
          onClick={lock}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          Lock
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 xl:gap-12">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
          <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-4 space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 px-2 mb-3">
              Entries
            </p>
            {tree.map((node) => (
              <TreeItem key={node.path} node={node} activeSlug={activeSlug} depth={0} />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          {activeFile ? (
            <article>
              <header className="mb-8 pb-6 border-b border-neutral-200/70 dark:border-white/[0.06]">
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-500 mb-2">
                  journal/{activeFile.path}
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  {activeFile.title}
                </h2>
              </header>
              <div
                className="docs-prose prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: activeFile.html }}
              />
            </article>
          ) : (
            <JournalIndex tree={tree} files={files} />
          )}
        </main>
      </div>
    </div>
  );
}

function PinGate({
  pin,
  setPin,
  onSubmit,
  error,
  busy,
  count,
}: {
  pin: string;
  setPin: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  busy: boolean;
  count: number;
}) {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="w-full max-w-md">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to docs
        </Link>

        <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.02] backdrop-blur-sm p-8 lg:p-10 shadow-xl shadow-black/5 dark:shadow-black/30">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center mb-5">
            <Lock className="w-5 h-5" />
          </div>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 text-[10px] font-semibold uppercase tracking-[0.18em] mb-3">
            <Sparkles className="w-3 h-3" />
            Encrypted · AES-GCM
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
            Private Journal
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-7">
            Enter the PIN to decrypt {count} {count === 1 ? "entry" : "entries"}. Content stays encrypted in the bundle until unlocked locally.
          </p>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                aria-label="PIN"
                className="w-full pl-11 pr-4 py-3.5 text-base font-mono tracking-[0.4em] text-center bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.08] rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/[0.06] border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || pin.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? "Decrypting…" : "Unlock"}
              {!busy && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-6 text-[11px] text-neutral-500 dark:text-neutral-500 leading-relaxed">
            Unlock state is kept in this browser session only. Closing the tab re-locks the journal.
          </p>
        </div>
      </div>
    </div>
  );
}

function TreeItem({
  node,
  activeSlug,
  depth,
}: {
  node: TreeNode;
  activeSlug: string | null;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  const padding = `${0.5 + depth * 0.65}rem`;

  if (node.type === "dir") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-900 dark:hover:text-white transition"
          style={{ paddingLeft: padding }}
        >
          <ChevronRight
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""} text-neutral-400 dark:text-neutral-500`}
          />
          <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400/80" />
          <span className="truncate font-medium">{humanize(node.name)}</span>
        </button>
        {open && (
          <div className="mt-0.5">
            {node.children.map((child) => (
              <TreeItem key={child.path} node={child} activeSlug={activeSlug} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = activeSlug === node.slug;
  return (
    <a
      href={`#/${node.slug}`}
      className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-sm transition truncate ${
        isActive
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-900 dark:hover:text-white"
      }`}
      style={{ paddingLeft: padding }}
    >
      <span className="w-3.5 flex-shrink-0" aria-hidden />
      <FileText
        className={`w-3.5 h-3.5 flex-shrink-0 ${
          isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"
        }`}
      />
      <span className="truncate">{node.title}</span>
    </a>
  );
}

function JournalIndex({ tree, files }: { tree: TreeNode[]; files: FileNode[] }) {
  return (
    <div>
      <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-gradient-to-br from-emerald-500/[0.04] to-transparent p-6 mb-6">
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          Pick an entry from the sidebar, or jump in below.
        </p>
      </div>

      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.path}>
            <a
              href={`#/${f.slug}`}
              className="group flex items-center gap-3 px-5 py-3.5 rounded-xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-colors"
            >
              <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{f.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 font-mono truncate">
                  journal/{f.path}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function humanize(s: string) {
  return s.replace(/^[0-9]+[-_\s]+/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
