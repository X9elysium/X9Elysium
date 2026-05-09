"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { marked } from "marked";
import {
  ArrowLeft,
  Lock,
  KeyRound,
  Eye,
  Pencil,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  ExternalLink,
} from "lucide-react";
import Comments from "../../components/Comments";

interface Props {
  slug: string;
  title: string;
}

interface PlanState {
  content: string;
  etag: string;
  updatedAt: string;
  fromSeed?: boolean;
}

type ViewMode = "edit" | "preview" | "split";

const SESSION_PIN_KEY = "x9_plans_pin_v1";

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: false,
  mangle: false,
});

export default function PlanClient({ slug, title }: Props) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinBusy, setPinBusy] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const [plan, setPlan] = useState<PlanState | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [view, setView] = useState<ViewMode>("split");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  // Restore PIN from sessionStorage so refresh doesn't kick you out.
  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_PIN_KEY);
    if (stored) {
      setPin(stored);
      setUnlocked(true);
    }
  }, []);

  // Fetch the plan once unlocked.
  useEffect(() => {
    if (!unlocked || !pin) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/plans?slug=${encodeURIComponent(slug)}`, {
      headers: { "X-Plans-Pin": pin, Accept: "application/json" },
    })
      .then(async (r) => {
        if (r.status === 401) {
          if (!cancelled) {
            sessionStorage.removeItem(SESSION_PIN_KEY);
            setUnlocked(false);
            setPin("");
            setPinError("Session expired. Re-enter the PIN.");
          }
          return null;
        }
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data?.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        const next: PlanState = {
          content: typeof data.content === "string" ? data.content : "",
          etag: typeof data.etag === "string" ? data.etag : "",
          updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
          fromSeed: Boolean(data.fromSeed),
        };
        setPlan(next);
        setDraft(next.content);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err?.message || "Couldn't load the plan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [unlocked, pin, slug]);

  const dirty = plan ? draft !== plan.content : false;
  const renderedHtml = useMemo(() => renderMarkdown(draft), [draft]);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/plans/${slug}`
      : `/plans/${slug}`;

  async function unlockPin(e: FormEvent) {
    e.preventDefault();
    if (!pin.trim() || pinBusy) return;
    setPinBusy(true);
    setPinError(null);
    try {
      const res = await fetch("/api/plans/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) {
        setPinError(
          data?.error ||
            "Plans aren't configured on the server yet. Set PLANS_PIN via wrangler.",
        );
        return;
      }
      if (!res.ok) {
        setPinError(data?.error || "Invalid PIN");
        return;
      }
      sessionStorage.setItem(SESSION_PIN_KEY, pin.trim());
      setUnlocked(true);
    } catch {
      setPinError("Network blip. Try once more.");
    } finally {
      setPinBusy(false);
    }
  }

  async function save() {
    if (!plan || saving) return;
    if (draft.length < 10) {
      setSaveError("Content too short.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaveOk(null);
    try {
      const res = await fetch("/api/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          content: draft,
          pin,
          etag: plan.etag,
          author: "darsh",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setSaveError(
          "This plan was edited elsewhere since you opened it. Reload to merge.",
        );
        return;
      }
      if (res.status === 401) {
        sessionStorage.removeItem(SESSION_PIN_KEY);
        setUnlocked(false);
        setPin("");
        setSaveError("Session expired. Re-enter the PIN.");
        return;
      }
      if (!res.ok) {
        setSaveError(data?.error || `Couldn't save (HTTP ${res.status}).`);
        return;
      }
      setPlan({
        content: draft,
        etag: data.etag,
        updatedAt: data.updatedAt,
        fromSeed: false,
      });
      setSaveOk("saved");
      setTimeout(() => setSaveOk(null), 2000);
    } catch {
      setSaveError("Network blip. Try once more.");
    } finally {
      setSaving(false);
    }
  }

  async function reload() {
    setPlan(null);
    setDraft("");
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/plans?slug=${encodeURIComponent(slug)}`, {
        headers: { "X-Plans-Pin": pin, Accept: "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoadError(data?.error || `HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      const next: PlanState = {
        content: typeof data.content === "string" ? data.content : "",
        etag: typeof data.etag === "string" ? data.etag : "",
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
        fromSeed: Boolean(data.fromSeed),
      };
      setPlan(next);
      setDraft(next.content);
    } catch (err: any) {
      setLoadError(err?.message || "Couldn't reload.");
    } finally {
      setLoading(false);
    }
  }

  function copyShareLink() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareUrl).catch(() => {});
  }

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Link
          href="/plans"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          back
        </Link>
        <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs font-mono mb-4">
            <Lock className="w-3.5 h-3.5" />
            PIN required
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-1">
            {title}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Enter the plan PIN to view and edit. Same posture as{" "}
            <Link href="/chat" className="underline">
              /chat
            </Link>
            .
          </p>
          <form onSubmit={unlockPin} className="space-y-3">
            <label className="block">
              <span className="sr-only">PIN</span>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15"
                />
              </div>
            </label>
            {pinError && (
              <p className="text-sm text-red-600 dark:text-red-400 inline-flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {pinError}
              </p>
            )}
            <button
              type="submit"
              disabled={pinBusy || !pin.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:scale-[1.02] active:scale-[0.99] transition disabled:opacity-50"
            >
              {pinBusy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Unlocking…
                </>
              ) : (
                "Unlock"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <Link
          href="/plans"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          plans
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            title="Copy share link"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-white/[0.06] text-xs text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <Copy className="w-3 h-3" />
            link
          </button>
          <button
            onClick={reload}
            title="Reload from server"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-white/[0.06] text-xs text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <RefreshCw className="w-3 h-3" />
            reload
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500 flex items-center gap-2">
          {plan?.fromSeed && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              seed
            </span>
          )}
          {plan?.updatedAt && (
            <span>
              updated {new Date(plan.updatedAt).toLocaleString("en-CA")}
            </span>
          )}
        </div>
      </div>

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-400 inline-flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {loadError}
        </div>
      )}

      {/* View toggle */}
      <div className="inline-flex rounded-lg border border-neutral-200 dark:border-white/[0.06] overflow-hidden mb-4 text-xs font-mono">
        {(["edit", "split", "preview"] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setView(m)}
            className={`px-3 py-1.5 inline-flex items-center gap-1.5 transition ${
              view === m
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.03]"
            }`}
          >
            {m === "edit" && <Pencil className="w-3 h-3" />}
            {m === "preview" && <Eye className="w-3 h-3" />}
            {m === "split" && <span className="font-bold tracking-wider">|</span>}
            {m}
          </button>
        ))}
        <div className="ml-2 flex items-center gap-1 px-2 text-[10px] text-neutral-500">
          {dirty ? (
            <span className="text-amber-600 dark:text-amber-400">● unsaved</span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400">✓ clean</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-12 text-center text-sm text-neutral-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          Loading…
        </div>
      )}

      {!loading && plan && (
        <>
          <div
            className={`rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden grid ${
              view === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {(view === "edit" || view === "split") && (
              <div className="border-r border-neutral-200/70 dark:border-white/[0.06] last:border-r-0">
                <div className="px-4 py-2 border-b border-neutral-200/70 dark:border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                  <span>source.md</span>
                  <span>{draft.length.toLocaleString()} chars</span>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  spellCheck={false}
                  className="w-full min-h-[60vh] px-4 py-4 bg-transparent text-sm font-mono leading-relaxed text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none resize-y"
                />
              </div>
            )}
            {(view === "preview" || view === "split") && (
              <div>
                <div className="px-4 py-2 border-b border-neutral-200/70 dark:border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  preview
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none px-4 py-4 prose-headings:tracking-tight prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-pre:bg-neutral-100 dark:prose-pre:bg-white/[0.03] prose-pre:text-neutral-800 dark:prose-pre:text-neutral-200 prose-code:before:hidden prose-code:after:hidden prose-code:bg-neutral-100 dark:prose-code:bg-white/[0.05] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-a:text-emerald-700 dark:prose-a:text-emerald-300"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
            <div className="text-xs text-neutral-500 dark:text-neutral-500 inline-flex items-center gap-2 flex-wrap">
              {saveError && (
                <span className="text-red-600 dark:text-red-400 inline-flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {saveError}
                </span>
              )}
              {saveOk && (
                <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {saveOk}
                </span>
              )}
              {plan.fromSeed && (
                <span>
                  no D1 row yet — first save will create one.
                </span>
              )}
            </div>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        </>
      )}

      <div className="mt-10">
        <Comments
          threadId={`plans/${slug}`}
          title="Comments"
          prompt="Private thread on this plan. Anyone with the PIN can read; anyone on the internet can post (same open-comment posture as the rest of the site, with link-moderation)."
        />
      </div>
    </div>
  );
}

function renderMarkdown(src: string): string {
  try {
    const html = marked.parse(src ?? "", { async: false }) as string;
    // marked sanitizes by default for known XSS vectors but does pass through
    // raw HTML in the markdown. We strip <script> as a belt-and-braces measure.
    return html.replace(/<script[\s\S]*?<\/script>/gi, "");
  } catch {
    return "";
  }
}
