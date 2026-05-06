"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Lock, Send, Sparkles, Trash2, AlertCircle } from "lucide-react";
import { clarity } from "../lib/clarity";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const SESSION_PIN_KEY = "x9_chat_pin_v1";
const SESSION_HISTORY_KEY = "x9_chat_history_v1";

const SUGGESTIONS = [
  "What does Vasudhaiva Kutumbakam mean and how does it shape engagements?",
  "Walk me through a typical Magento → Shopify Plus migration.",
  "How does X9Elysium price an audit vs a project vs a retainer?",
  "What's the 6-month organic growth plan and where are we in it?",
];

export default function ChatClient() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinBusy, setPinBusy] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore unlock + history from sessionStorage on mount
  useEffect(() => {
    const storedPin = sessionStorage.getItem(SESSION_PIN_KEY);
    if (storedPin) {
      setPin(storedPin);
      setUnlocked(true);
      clarity.event("chat_session_resumed");
    }
    const storedHistory = sessionStorage.getItem(SESSION_HISTORY_KEY);
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          clarity.tag("chat_history_restored", String(parsed.length));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Persist history on every change
  useEffect(() => {
    if (messages.length === 0) {
      sessionStorage.removeItem(SESSION_HISTORY_KEY);
    } else {
      sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages or streaming text change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setPinError(null);
    setPinBusy(true);
    clarity.event("chat_pin_attempt");
    try {
      // Validate the PIN by sending a no-op probe message — the Worker will
      // 401 if wrong, 503 if backend not configured, 200 with stream if right.
      const probe = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim(), messages: [{ role: "user", content: "ping" }] }),
      });
      if (probe.status === 401) {
        setPinError("Invalid PIN.");
        clarity.event("chat_pin_invalid");
        return;
      }
      if (probe.status === 503) {
        const body = (await probe.json().catch(() => ({}))) as { error?: string };
        setPinError(body.error || "Chat is not configured yet.");
        clarity.event("chat_unavailable");
        return;
      }
      if (!probe.ok) {
        const body = (await probe.json().catch(() => ({}))) as { error?: string };
        setPinError(body.error || `Chat is unavailable (${probe.status}).`);
        clarity.event("chat_pin_error");
        return;
      }
      // Drain + drop the probe stream so we don't show a "ping" exchange.
      try {
        await probe.body?.cancel();
      } catch {
        // ignore
      }
      sessionStorage.setItem(SESSION_PIN_KEY, pin.trim());
      setPin(pin.trim());
      setUnlocked(true);
      clarity.event("chat_unlocked");
      clarity.upgrade("chat_intent");
    } catch {
      setPinError("Network error. Try again.");
      clarity.event("chat_pin_network_error");
    } finally {
      setPinBusy(false);
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    clarity.event("chat_cleared");
    clarity.tag("chat_messages_at_clear", String(messages.length));
    setMessages([]);
    setError(null);
  }

  function lock() {
    abortRef.current?.abort();
    clarity.event("chat_locked");
    sessionStorage.removeItem(SESSION_PIN_KEY);
    sessionStorage.removeItem(SESSION_HISTORY_KEY);
    setMessages([]);
    setUnlocked(false);
    setPin("");
    setError(null);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const newHistory: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newHistory);
    setInput("");
    setStreaming(true);

    clarity.event("chat_message_sent");
    clarity.tag("chat_message_count", String(newHistory.length));
    clarity.tag(
      "chat_message_size",
      trimmed.length < 80 ? "short" : trimmed.length < 240 ? "medium" : "long"
    );
    if (newHistory.length === 1) clarity.event("chat_first_message");
    if (newHistory.length === 5) clarity.upgrade("chat_engaged");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, messages: newHistory }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        setError("PIN was rejected. Lock and try again.");
        setStreaming(false);
        clarity.event("chat_auth_lost");
        return;
      }
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error || `Chat is unavailable (${res.status}).`);
        setStreaming(false);
        clarity.event("chat_send_error");
        return;
      }
      clarity.event("chat_response_started");

      // Add an empty assistant message that we'll fill in as the stream arrives.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by blank lines
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const block of events) {
          const dataLine = block
            .split("\n")
            .find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const json = dataLine.slice(5).trim();
          if (!json) continue;
          try {
            const evt = JSON.parse(json);
            if (
              evt.type === "content_block_delta" &&
              evt.delta?.type === "text_delta" &&
              typeof evt.delta.text === "string"
            ) {
              assistant += evt.delta.text;
              setMessages((prev) => {
                const next = prev.slice();
                next[next.length - 1] = { role: "assistant", content: assistant };
                return next;
              });
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Network error while streaming. Try again.");
        clarity.event("chat_stream_error");
      } else {
        clarity.event("chat_stream_aborted");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      clarity.event("chat_response_complete");
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  // ─── PIN lock screen ────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="relative min-h-screen bg-black text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to x9elysium.com
          </Link>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>

          <h1 className="mb-2 text-2xl font-medium tracking-tight">X9 · Internal Chat</h1>
          <p className="mb-10 max-w-xs text-center text-sm text-neutral-400">
            Claude, grounded on the full X9Elysium documentation corpus. Enter the PIN to begin.
          </p>

          <form onSubmit={handleUnlock} className="w-full">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                inputMode="text"
                autoFocus
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-base text-white placeholder:text-neutral-500 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {pinError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-3 py-2.5 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pinBusy || pin.length === 0}
              className="mt-4 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pinBusy ? "Unlocking…" : "Unlock"}
            </button>
          </form>

          <p className="mt-10 max-w-xs text-center text-xs leading-relaxed text-neutral-500">
            Ask about services, philosophy, migrations, the 6-month plan, or anything in the docs.
            The encrypted journal at <code className="text-neutral-400">/docs/journal</code> is intentionally excluded.
          </p>
        </div>
      </div>
    );
  }

  // ─── Chat UI ────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">x9elysium.com</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">X9 Chat</span>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="rounded-md p-1.5 text-neutral-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={lock}
              title="Lock"
              className="rounded-md p-1.5 text-neutral-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center pt-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="mb-2 text-xl font-medium tracking-tight">How can I help?</h2>
              <p className="mb-8 max-w-md text-sm text-neutral-400">
                Grounded on the full documentation corpus. Ask about anything from migration playbooks
                to founder philosophy.
              </p>
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => {
                      clarity.event("chat_suggestion_clicked");
                      clarity.tag("chat_suggestion_index", String(i));
                      void send(s);
                    }}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-sm text-neutral-300 transition hover:border-emerald-500/30 hover:bg-white/[0.04] hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {streaming && messages[messages.length - 1]?.role === "user" && (
                <MessageBubble role="assistant" content="" pending />
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-3 py-2.5 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="relative"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask about migrations, services, philosophy…"
              className="block max-h-48 w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-5 pr-14 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={{ minHeight: "52px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 px-1 text-[11px] text-neutral-500">
            Claude Sonnet 4.6 · enter to send · shift-enter for newline · sessionStorage only
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  pending = false,
}: {
  role: Role;
  content: string;
  pending?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl bg-emerald-500/10 px-4 py-2.5 text-sm text-white ring-1 ring-emerald-500/20"
            : "max-w-[92%] text-sm leading-relaxed text-neutral-200"
        }
      >
        {pending ? (
          <span className="inline-flex items-center gap-1.5 text-neutral-500">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:120ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:240ms]" />
          </span>
        ) : (
          <pre className="whitespace-pre-wrap font-sans">{content}</pre>
        )}
      </div>
    </div>
  );
}
