"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, Loader2, ShieldCheck } from "lucide-react";

interface Comment {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

interface Props {
  /** Stable thread id, e.g. "blog/<slug>" or "docs/<slug>" or "thoughts/<id>". */
  threadId: string;
  /** Section heading. Defaults to "Comments". */
  title?: string;
  /** Callout above the input. Defaults to a friendly open-door line. */
  prompt?: string;
}

// Always relative — the Worker handles `/api/*` on the same origin in
// production, and `next dev` returns a 404 (so the form just shows a friendly
// error). Avoids touching `window` at module scope.
const API_BASE = "";

export default function Comments({ threadId, title = "Comments", prompt }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Math captcha — recompute on mount + after each successful submit.
  const [captcha, setCaptcha] = useState<{ a: number; b: number }>(() => randCaptcha());
  const [answer, setAnswer] = useState("");

  const tsRef = useRef<number>(Date.now());

  useEffect(() => {
    tsRef.current = Date.now();
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/api/comments?thread=${encodeURIComponent(threadId)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (r) => (r.ok ? r.json() : { comments: [] }))
      .then((data) => {
        if (cancelled) return;
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setSuccess(null);

    if (message.trim().length < 2) {
      setError("Add a couple of words first.");
      return;
    }
    const ans = parseInt(answer.trim(), 10);
    if (!Number.isFinite(ans)) {
      setError("Solve the sum to prove you're human.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          name: name.trim(),
          message: message.trim(),
          captcha: { a: captcha.a, b: captcha.b, answer: ans },
          _gotcha: "",
          _ts: tsRef.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Couldn't post — try again in a minute.");
        setCaptcha(randCaptcha());
        setAnswer("");
        return;
      }
      if (data.approved && data.comment) {
        setComments((prev) => [data.comment as Comment, ...prev]);
        setSuccess("Thanks — it's live.");
      } else {
        setSuccess(
          data?.message ||
            "Thanks. Comments with links go through review before they appear.",
        );
      }
      setMessage("");
      setAnswer("");
      setCaptcha(randCaptcha());
      tsRef.current = Date.now();
    } catch {
      setError("Network blip. Try once more.");
    } finally {
      setBusy(false);
    }
  }

  const promptCopy =
    prompt ||
    "Open thread. Anyone can reply — no signup. Be real, be specific. Anything with a link goes through review.";

  return (
    <section
      aria-label="Open comments"
      className="not-prose rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h3>
        {!loading && (
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-500 ml-1">
            · {comments.length}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">{promptCopy}</p>

      <form onSubmit={onSubmit} className="space-y-3 mb-7">
        <div className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            maxLength={60}
            aria-label="Your name"
            className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15 transition"
          />
          {/* Honeypot — must stay invisible to humans */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />
          <input
            type="text"
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={`What is ${captcha.a} + ${captcha.b}?`}
            aria-label={`Captcha: what is ${captcha.a} plus ${captcha.b}`}
            className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15 transition tabular-nums"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Drop a thought, a counter, a link to your project. Specific beats clever."
          rows={3}
          maxLength={1000}
          aria-label="Your comment"
          className="w-full px-3.5 py-3 text-sm bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/15 transition resize-y leading-relaxed"
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {success}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-500">
            {message.length}/1000
          </p>
          <button
            type="submit"
            disabled={busy || message.trim().length < 2}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:scale-[1.02] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Post
              </>
            )}
          </button>
        </div>
      </form>

      <CommentList loading={loading} comments={comments} />
    </section>
  );
}

function CommentList({ loading, comments }: { loading: boolean; comments: Comment[] }) {
  if (loading) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-500 inline-flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Loading…
      </p>
    );
  }
  if (comments.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-500">
        No comments yet — be the first.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li
          key={c.id}
          className="border-l-2 border-emerald-500/40 dark:border-emerald-400/30 pl-4"
        >
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {c.name || "anon"}
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500">
              {formatRelative(c.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words">
            {c.message}
          </p>
        </li>
      ))}
    </ul>
  );
}

function randCaptcha() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  return { a, b };
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
