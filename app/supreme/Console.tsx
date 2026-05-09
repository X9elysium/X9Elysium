"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { clarity } from "../lib/clarity";

// ─── Protocol types ──────────────────────────────────────────────────────────
//
// The Worker streams a normalized SSE envelope (see worker/grok.ts). We render
// each message as a sequence of nodes — text spans, search/tool ribbons, image
// thumbnails, citations — so reasoning, tool calls, and prose interleave in
// the order Grok produced them.

type StreamEvent =
  | { type: "meta"; model: string }
  | { type: "text"; delta: string }
  | { type: "reasoning"; delta: string }
  | { type: "search"; kind: "web" | "x"; query: string }
  | { type: "tool_call"; name: string; args: Record<string, unknown> }
  | { type: "tool_result"; name: string; summary: string }
  | { type: "citation"; url: string; title?: string; snippet?: string }
  | { type: "done" }
  | { type: "error"; error: string };

type Node =
  | { kind: "text"; text: string }
  | { kind: "search"; channel: "web" | "x"; query: string }
  | { kind: "tool"; name: string; status: "calling" | "done"; args?: Record<string, unknown>; summary?: string }
  | { kind: "citation"; url: string; title?: string; snippet?: string };

interface AssistantMessage {
  role: "assistant";
  nodes: Node[];
  reasoning: string;
  model?: string;
}
interface UserMessage {
  role: "user";
  text: string;
  images: string[]; // data: URIs
}
type Message = AssistantMessage | UserMessage;

interface Attachment {
  id: string;
  dataUrl: string;
  bytes: number;
  name: string;
}

const SESSION_PIN_KEY = "x9_supreme_pin_v1";
const SESSION_HISTORY_KEY = "x9_supreme_history_v1";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_IMAGES = 4;

const SUGGESTIONS = [
  "what does ai-native commerce mean for a $20m brand?",
  "scan x for what darshan thinks about hydrogen vs themes.",
  "summarize the 6-month organic growth plan.",
  "I have a magento → plus migration in q3, what should I be worried about?",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Console() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinBusy, setPinBusy] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore unlock + history on mount.
  useEffect(() => {
    const storedPin = sessionStorage.getItem(SESSION_PIN_KEY);
    if (storedPin) {
      setPin(storedPin);
      setUnlocked(true);
      clarity.event("supreme_session_resumed");
    }
    const storedHistory = sessionStorage.getItem(SESSION_HISTORY_KEY);
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory) as Message[];
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      sessionStorage.removeItem(SESSION_HISTORY_KEY);
    } else {
      try {
        sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(messages));
      } catch {
        // sessionStorage may be full when there are large images — best-effort only.
      }
    }
  }, [messages]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  // ─── PIN unlock ────────────────────────────────────────────────────────────
  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setPinError(null);
    setPinBusy(true);
    clarity.event("supreme_pin_attempt");
    try {
      const probe = await fetch("/api/grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim(), messages: [{ role: "user", content: "ping" }] }),
      });
      if (probe.status === 401) {
        setPinError("invalid pin.");
        clarity.event("supreme_pin_invalid");
        return;
      }
      if (probe.status === 503) {
        const body = (await probe.json().catch(() => ({}))) as { error?: string };
        setPinError(body.error || "supreme is not configured yet.");
        clarity.event("supreme_unavailable");
        return;
      }
      if (!probe.ok) {
        const body = (await probe.json().catch(() => ({}))) as { error?: string };
        setPinError(body.error || `supreme is unavailable (${probe.status}).`);
        return;
      }
      try {
        await probe.body?.cancel();
      } catch {
        // ignore
      }
      sessionStorage.setItem(SESSION_PIN_KEY, pin.trim());
      setPin(pin.trim());
      setUnlocked(true);
      clarity.event("supreme_unlocked");
      clarity.upgrade("supreme_intent");
    } catch {
      setPinError("network error. try again.");
    } finally {
      setPinBusy(false);
    }
  }

  function lock() {
    abortRef.current?.abort();
    sessionStorage.removeItem(SESSION_PIN_KEY);
    sessionStorage.removeItem(SESSION_HISTORY_KEY);
    setUnlocked(false);
    setMessages([]);
    setPin("");
    setError(null);
    clarity.event("supreme_locked");
  }

  function clearTranscript() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setAttachments([]);
    clarity.event("supreme_cleared");
  }

  // ─── Attachments ───────────────────────────────────────────────────────────
  const addFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    const accepted: Attachment[] = [];
    for (const f of list) {
      if (!/^image\/(png|jpe?g|webp)$/i.test(f.type)) continue;
      if (f.size > MAX_IMAGE_BYTES) continue;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(f);
      });
      accepted.push({ id: `${Date.now()}-${f.name}`, dataUrl, bytes: f.size, name: f.name });
    }
    setAttachments((prev) => [...prev, ...accepted].slice(0, MAX_IMAGES));
    if (accepted.length) clarity.event("supreme_image_attached");
  }, []);

  function onPickFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) void addFiles(e.target.files);
    e.target.value = "";
  }
  function onDrop(e: DragEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.dataTransfer.files) void addFiles(e.dataTransfer.files);
  }
  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  // ─── Send ──────────────────────────────────────────────────────────────────
  async function send(rawText: string) {
    const text = rawText.trim();
    if ((!text && attachments.length === 0) || streaming) return;

    setError(null);
    const userMsg: UserMessage = { role: "user", text, images: attachments.map((a) => a.dataUrl) };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setAttachments([]);
    setStreaming(true);

    clarity.event("supreme_message_sent");
    if (next.filter((m) => m.role === "user").length === 1) clarity.event("supreme_first_message");

    // Build the wire payload — the Worker accepts string-or-blocks content.
    const wireMessages = next.map((m) => {
      if (m.role === "user") {
        const blocks: Array<Record<string, unknown>> = [];
        if (m.text) blocks.push({ type: "input_text", text: m.text });
        for (const url of m.images) {
          blocks.push({ type: "input_image", image_url: url, detail: "high" });
        }
        return { role: "user", content: blocks.length === 1 && m.text ? m.text : blocks };
      }
      // Assistant — flatten nodes back to plain text for the model's context.
      const flat = m.nodes
        .filter((n): n is Extract<Node, { kind: "text" }> => n.kind === "text")
        .map((n) => n.text)
        .join("");
      return { role: "assistant", content: flat };
    });

    const controller = new AbortController();
    abortRef.current = controller;

    const assistant: AssistantMessage = { role: "assistant", nodes: [], reasoning: "" };
    setMessages((prev) => [...prev, assistant]);

    try {
      const res = await fetch("/api/grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, messages: wireMessages }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        setError("pin was rejected. lock and re-enter.");
        setStreaming(false);
        return;
      }
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error || `supreme is unavailable (${res.status}).`);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl = buffer.indexOf("\n\n");
        while (nl !== -1) {
          const block = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 2);
          nl = buffer.indexOf("\n\n");

          const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const json = dataLine.slice(5).trim();
          if (!json) continue;
          let evt: StreamEvent;
          try {
            evt = JSON.parse(json) as StreamEvent;
          } catch {
            continue;
          }
          applyEvent(evt);
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("network error while streaming. try again.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function applyEvent(evt: StreamEvent) {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.role !== "assistant") return prev;
      const next = prev.slice();
      const a: AssistantMessage = { ...last, nodes: last.nodes.slice(), reasoning: last.reasoning };

      switch (evt.type) {
        case "meta":
          a.model = evt.model;
          break;
        case "text": {
          const tail = a.nodes[a.nodes.length - 1];
          if (tail && tail.kind === "text") {
            a.nodes[a.nodes.length - 1] = { kind: "text", text: tail.text + evt.delta };
          } else {
            a.nodes.push({ kind: "text", text: evt.delta });
          }
          break;
        }
        case "reasoning":
          a.reasoning += evt.delta;
          break;
        case "search":
          a.nodes.push({ kind: "search", channel: evt.kind, query: evt.query });
          break;
        case "tool_call":
          a.nodes.push({ kind: "tool", name: evt.name, status: "calling", args: evt.args });
          break;
        case "tool_result": {
          // mark the most recent calling-tool of this name as done
          for (let i = a.nodes.length - 1; i >= 0; i--) {
            const n = a.nodes[i];
            if (n.kind === "tool" && n.name === evt.name && n.status === "calling") {
              a.nodes[i] = { ...n, status: "done", summary: evt.summary };
              break;
            }
          }
          break;
        }
        case "citation":
          a.nodes.push({ kind: "citation", url: evt.url, title: evt.title, snippet: evt.snippet });
          break;
        case "error":
          a.nodes.push({ kind: "text", text: `\n\n[supreme] ${evt.error}` });
          break;
        case "done":
          break;
      }

      next[next.length - 1] = a;
      return next;
    });

    if (evt.type === "meta") setModel(evt.model);
    if (evt.type === "error") setError(evt.error);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  // ─── Ghost echo of the latest user input ────────────────────────────────────
  const ghost = useMemo(() => {
    if (input.trim()) return input.slice(0, 80);
    const lastUser = [...messages].reverse().find((m): m is UserMessage => m.role === "user");
    return lastUser?.text ? lastUser.text.slice(0, 80) : "";
  }, [input, messages]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 py-24 md:px-10 md:py-40">
      <div className="mb-10 flex items-baseline justify-between">
        <div>
          <h2
            className="font-light tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            the console
          </h2>
          <p className="mt-4 max-w-[44rem] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-white/55">
            live in the lab. grok with web + x search, vision, and the x9 corpus
            wired in. ask anything. drop a screenshot. it answers in our voice
            and cites where it pulled from.
          </p>
        </div>
        {unlocked && (
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
              {model ?? "supreme"}
            </span>
            <button
              onClick={clearTranscript}
              type="button"
              className="text-[0.65rem] uppercase tracking-[0.32em] text-white/40 transition-colors hover:text-[#67e8f9]"
            >
              clear
            </button>
            <button
              onClick={lock}
              type="button"
              className="text-[0.65rem] uppercase tracking-[0.32em] text-white/40 transition-colors hover:text-[#c084fc]"
            >
              lock
            </button>
          </div>
        )}
      </div>

      {!unlocked ? (
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/40 px-6 py-10 backdrop-blur-md">
          <p className="mb-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#67e8f9]/80">
            the lab is keyed
          </p>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-white/60">
            supreme is hidden by design. enter the pin to enter the console.
          </p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              autoFocus
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="pin"
              className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-base text-white placeholder:text-white/30 focus:border-[#67e8f9]/60 focus:outline-none"
            />
            {pinError && (
              <p className="mt-3 text-[0.85rem] text-[#fbbf24]">{pinError}</p>
            )}
            <button
              type="submit"
              disabled={pinBusy || pin.length === 0}
              className="mt-5 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-white/85 transition-all hover:border-[#67e8f9]/60 hover:text-[#67e8f9] disabled:opacity-40"
            >
              {pinBusy ? "unlocking…" : "enter →"}
            </button>
          </form>
          <p className="mt-8 text-[0.7rem] leading-relaxed text-white/30">
            no logging beyond rate-limit. session-only history. journal at
            /docs/journal is excluded by design.
          </p>
        </div>
      ) : (
        <>
          {/* Massive ghost echo of the live input */}
          <div
            aria-hidden
            className="pointer-events-none relative mb-8 h-[clamp(5rem,12vw,10rem)] w-full overflow-hidden"
          >
            <div
              className="absolute inset-0 flex items-center justify-center text-center font-light leading-[0.9] tracking-[-0.04em] transition-all duration-300"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 9rem)",
                background:
                  "linear-gradient(120deg, rgba(103,232,249,0.18), rgba(192,132,252,0.18), rgba(251,191,36,0.14))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "blur(0.5px)",
                opacity: ghost ? 1 : 0.18,
              }}
            >
              {ghost || "•••"}
            </div>
          </div>

          {/* Transcript */}
          <div
            ref={transcriptRef}
            className="mb-6 max-h-[60vh] overflow-y-auto rounded-2xl border border-white/8 bg-black/30 p-6 backdrop-blur-sm md:p-8"
          >
            {messages.length === 0 ? (
              <div className="py-6">
                <p className="mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-white/30">
                  suggestions
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        clarity.event("supreme_suggestion_clicked");
                        clarity.tag("supreme_suggestion_index", String(i));
                        void send(s);
                      }}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left text-[0.92rem] leading-relaxed text-white/75 transition-all hover:border-[#67e8f9]/40 hover:bg-white/[0.04] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <UserBubble key={i} m={m} />
                  ) : (
                    <AssistantBubble
                      key={i}
                      m={m}
                      pending={streaming && i === messages.length - 1}
                    />
                  ),
                )}
              </div>
            )}
            {error && (
              <p className="mt-6 rounded-lg border border-[#fbbf24]/30 bg-[#fbbf24]/[0.05] px-4 py-3 text-[0.85rem] text-[#fbbf24]">
                {error}
              </p>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="group relative flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md transition-colors focus-within:border-[#67e8f9]/60 md:px-6 md:py-5"
          >
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((a) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <div key={a.id} className="relative">
                    <img
                      src={a.dataUrl}
                      alt={a.name}
                      className="h-16 w-16 rounded-lg border border-white/15 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(a.id)}
                      className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black text-[0.65rem] text-white/70 transition-colors hover:text-[#fbbf24]"
                      aria-label={`remove ${a.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-3">
              <span className="pb-2 text-[0.7rem] uppercase tracking-[0.4em] text-white/40">
                ask
              </span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder={
                  streaming
                    ? "supreme is thinking…"
                    : "ask anything. drop an image. shift-enter for newline."
                }
                disabled={streaming}
                className="block max-h-48 flex-1 resize-none bg-transparent py-2 text-[clamp(0.95rem,1.2vw,1.1rem)] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={onPickFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={streaming || attachments.length >= MAX_IMAGES}
                title="attach image"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[0.85rem] text-white/70 transition-all hover:border-[#67e8f9]/60 hover:text-[#67e8f9] disabled:opacity-40"
              >
                +
              </button>
              <button
                type="submit"
                disabled={(!input.trim() && attachments.length === 0) || streaming}
                className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-[0.7rem] uppercase tracking-[0.32em] text-white/85 transition-all hover:border-[#67e8f9]/60 hover:text-[#67e8f9] disabled:opacity-40"
              >
                {streaming ? "…" : "send →"}
              </button>
            </div>
          </form>

          <p className="mt-3 px-1 text-[0.7rem] text-white/30">
            grok with live search · enter to send · shift-enter newline ·
            session-only history · pin gates the door, not the inference
          </p>
        </>
      )}
    </section>
  );
}

// ─── Bubbles ─────────────────────────────────────────────────────────────────

function UserBubble({ m }: { m: UserMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.95rem] leading-relaxed text-white">
        {m.images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {m.images.map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={src}
                alt="attached"
                className="h-32 w-32 rounded-lg border border-white/10 object-cover"
              />
            ))}
          </div>
        )}
        {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
      </div>
    </div>
  );
}

function AssistantBubble({ m, pending }: { m: AssistantMessage; pending: boolean }) {
  const empty = m.nodes.length === 0;
  return (
    <div className="flex">
      <div className="max-w-[95%] flex-1 text-[0.95rem] leading-relaxed text-white/85">
        {empty && pending && (
          <span className="inline-flex items-center gap-1.5 text-white/40">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#67e8f9]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#c084fc] [animation-delay:120ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#fbbf24] [animation-delay:240ms]" />
          </span>
        )}
        {m.nodes.map((n, i) => (
          <NodeView key={i} node={n} />
        ))}
        {pending && !empty && (
          <span
            aria-hidden
            className="ml-1 inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-[#67e8f9]"
            style={{ animation: "supreme-blink 0.9s steps(2) infinite" }}
          />
        )}
      </div>
      <style jsx>{`
        @keyframes supreme-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function NodeView({ node }: { node: Node }) {
  if (node.kind === "text") {
    return <span className="whitespace-pre-wrap">{node.text}</span>;
  }
  if (node.kind === "search") {
    const accent = node.channel === "x" ? "text-[#c084fc]" : "text-[#67e8f9]";
    return (
      <span
        className={`my-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] ${accent}`}
      >
        <span className="text-white/40">{node.channel === "x" ? "x search" : "web search"}</span>
        <span className="normal-case tracking-normal text-white/70">{node.query}</span>
      </span>
    );
  }
  if (node.kind === "tool") {
    const label = node.status === "calling" ? "calling" : "done";
    return (
      <span className="my-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-[#fbbf24]/80">
        <span className="text-white/40">{label}</span>
        <span className="normal-case tracking-normal text-white/70">{node.name}</span>
        {node.summary && (
          <span className="normal-case tracking-normal text-white/45">— {node.summary}</span>
        )}
      </span>
    );
  }
  if (node.kind === "citation") {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="my-1 mr-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.72rem] text-white/65 transition-colors hover:border-[#67e8f9]/40 hover:text-[#67e8f9]"
      >
        <span className="text-white/35">↗</span>
        <span className="truncate max-w-[18rem]">{node.title || hostname(node.url)}</span>
      </a>
    );
  }
  return null;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
