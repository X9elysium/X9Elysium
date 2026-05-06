"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, X, Headphones, ChevronDown } from "lucide-react";

// Browser-native multi-voice audio player. No API key.
// Lifted from app/docs/audits/full-audit-report/Player.tsx and made reusable
// across blog posts, docs, and the journal. Voices ship from the OS engine.

type Preset = {
  id: string;
  label: string;
  flag: string;
  accent: "British" | "Indian";
  patterns: string[];
  pitch?: number;
  rate?: number;
};

const PRESETS: Preset[] = [
  {
    id: "british-kate",
    label: "Kate · Crisp BBC",
    flag: "GB",
    accent: "British",
    patterns: ["Kate.*en[-_]GB", "Microsoft Hazel", "Google UK English Female"],
  },
  {
    id: "british-serena",
    label: "Serena · Soft & Warm",
    flag: "GB",
    accent: "British",
    patterns: ["Serena.*en[-_]GB", "Microsoft Susan", "Google UK English Female"],
    pitch: 1.05,
  },
  {
    id: "british-lily",
    label: "Lily · Bright & Young",
    flag: "GB",
    accent: "British",
    patterns: ["Lily.*en[-_]GB", "Microsoft Libby", "Google UK English Female"],
    pitch: 1.1,
  },
  {
    id: "british-martha",
    label: "Martha · Velvet Newsreader",
    flag: "GB",
    accent: "British",
    patterns: ["Martha.*en[-_]GB", "Microsoft Sonia", "Google UK English Female"],
    pitch: 0.95,
  },
  {
    id: "indian-veena",
    label: "Veena · Bombay Crisp",
    flag: "IN",
    accent: "Indian",
    patterns: ["Veena.*en[-_]IN", "Microsoft Heera", "Google English.*India", "en[-_]IN"],
  },
  {
    id: "indian-heera",
    label: "Heera · Delhi Newsroom",
    flag: "IN",
    accent: "Indian",
    patterns: ["Microsoft Heera", "Veena.*en[-_]IN", "Google English.*India", "en[-_]IN"],
    pitch: 1.05,
  },
  {
    id: "indian-isha",
    label: "Isha · Calm Hindi-English",
    flag: "IN",
    accent: "Indian",
    patterns: ["Microsoft Neerja", "Google.*Hindi", "Veena.*en[-_]IN", "en[-_]IN"],
    pitch: 1.08,
  },
  {
    id: "indian-priya",
    label: "Priya · Bright South Indian",
    flag: "IN",
    accent: "Indian",
    patterns: ["Microsoft Prabhat", "Veena.*en[-_]IN", "Google English.*India", "en[-_]IN"],
    pitch: 1.12,
    rate: 1.02,
  },
];

const SPEEDS = [0.85, 1, 1.15, 1.3, 1.5, 1.75];

function pickVoice(voices: SpeechSynthesisVoice[], preset: Preset): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  for (const pat of preset.patterns) {
    let re: RegExp | null = null;
    try {
      re = new RegExp(pat, "i");
    } catch {
      re = null;
    }
    if (!re) continue;
    const m = voices.find((v) => re!.test(`${v.name} ${v.lang}`));
    if (m) return m;
  }
  if (preset.accent === "British") {
    return voices.find((v) => /en[-_]GB|en[-_]UK/i.test(v.lang)) ?? null;
  }
  return voices.find((v) => /en[-_]IN|hi[-_]IN/i.test(v.lang)) ?? null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return resolve([]);
    }
    const got = window.speechSynthesis.getVoices();
    if (got && got.length) return resolve(got);
    const onChange = () => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = onChange;
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 800);
  });
}

function chunkText(text: string): string[] {
  const sents = text
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const s of sents) {
    if ((cur + " " + s).length > 280 && cur) {
      out.push(cur.trim());
      cur = s;
    } else {
      cur = cur ? cur + " " + s : s;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  speakableText: string;
  /** Optional eyebrow label, e.g. "Listen · Field Report 002". Defaults to "Listen". */
  eyebrow?: string;
  /** Compact mode shrinks paddings + hides voice picker labels. Used in tighter contexts. */
  compact?: boolean;
}

export default function AudioPlayer({ speakableText, eyebrow = "Listen", compact = false }: Props) {
  const [presetId, setPresetId] = useState<string>("british-kate");
  const [speed, setSpeed] = useState<number>(1);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState<{ cur: number; total: number }>({ cur: 0, total: 0 });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voicesAvailable, setVoicesAvailable] = useState<SpeechSynthesisVoice[]>([]);

  const cancelledRef = useRef(false);
  const startTsRef = useRef(0);
  const elapsedAtPauseRef = useRef(0);
  const tickRef = useRef<number | null>(null);
  const totalRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    loadVoices().then(setVoicesAvailable);
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  function estimateTotalSec(text: string, sp: number) {
    const words = text.trim().split(/\s+/).length;
    const wps = (165 / 60) * sp;
    return wps > 0 ? words / wps : 0;
  }

  function startTick(total: number) {
    if (tickRef.current) window.clearInterval(tickRef.current);
    startTsRef.current = Date.now();
    tickRef.current = window.setInterval(() => {
      const elapsed = elapsedAtPauseRef.current + (Date.now() - startTsRef.current) / 1000;
      setProgress({ cur: Math.min(elapsed, total), total });
    }, 200);
  }

  function stopTick() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  function reset() {
    cancelledRef.current = true;
    stopTick();
    elapsedAtPauseRef.current = 0;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setState("idle");
    setProgress({ cur: 0, total: 0 });
  }

  async function play() {
    if (!supported) return;
    cancelledRef.current = false;
    setState("loading");
    const voices = voicesAvailable.length ? voicesAvailable : await loadVoices();
    if (!voicesAvailable.length) setVoicesAvailable(voices);
    const voice = pickVoice(voices, preset);
    const chunks = chunkText(speakableText);
    if (chunks.length === 0) {
      setState("idle");
      return;
    }
    const total = estimateTotalSec(speakableText, speed);
    totalRef.current = total;
    elapsedAtPauseRef.current = 0;
    setProgress({ cur: 0, total });
    setState("playing");
    startTick(total);

    const speak = (idx: number) => {
      if (cancelledRef.current) return;
      if (idx >= chunks.length) {
        stopTick();
        setProgress({ cur: total, total });
        setState("idle");
        elapsedAtPauseRef.current = 0;
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[idx]);
      if (voice) u.voice = voice;
      u.rate = (preset.rate ?? 1) * speed;
      u.pitch = preset.pitch ?? 1;
      u.volume = 1;
      u.onend = () => speak(idx + 1);
      u.onerror = () => speak(idx + 1);
      window.speechSynthesis.speak(u);
    };
    speak(0);
  }

  function pause() {
    if (state !== "playing") return;
    try {
      window.speechSynthesis.pause();
    } catch {}
    elapsedAtPauseRef.current += (Date.now() - startTsRef.current) / 1000;
    stopTick();
    setState("paused");
  }

  function resume() {
    if (state !== "paused") return;
    try {
      window.speechSynthesis.resume();
    } catch {}
    setState("playing");
    startTick(totalRef.current);
  }

  function onTogglePlay() {
    if (state === "loading") return;
    if (state === "playing") return pause();
    if (state === "paused") return resume();
    return play();
  }

  function changePreset(id: string) {
    setPresetId(id);
    setPickerOpen(false);
    if (state === "playing" || state === "paused") {
      reset();
      setTimeout(() => {
        setPresetId(id);
        play();
      }, 50);
    }
  }

  function bumpSpeed() {
    const i = SPEEDS.indexOf(speed);
    const next = SPEEDS[(i + 1) % SPEEDS.length];
    setSpeed(next);
    if (state === "playing" || state === "paused") {
      reset();
      setTimeout(() => play(), 50);
    }
  }

  const ratio = progress.total > 0 ? Math.min(1, progress.cur / progress.total) : 0;
  const britishPresets = PRESETS.filter((p) => p.accent === "British");
  const indianPresets = PRESETS.filter((p) => p.accent === "Indian");

  if (!supported) {
    return (
      <div className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02] p-4 text-sm text-neutral-500 dark:text-neutral-400">
        Your browser doesn&apos;t support speech synthesis. Try Chrome, Safari, or Edge.
      </div>
    );
  }

  return (
    <div className="grok-player relative">
      <div
        className={`flex items-center gap-3 rounded-2xl border border-neutral-200/70 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] backdrop-blur-sm shadow-sm ${
          compact ? "p-2.5" : "p-3 lg:p-4"
        }`}
      >
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={state === "playing" ? "Pause" : "Play"}
          className={`grok-play-btn shrink-0 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 grid place-items-center hover:scale-[1.04] active:scale-95 transition-transform ${
            compact ? "w-10 h-10" : "w-11 h-11 lg:w-12 lg:h-12"
          }`}
        >
          {state === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : state === "playing" ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Headphones className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 truncate">
              {eyebrow} · {preset.label}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500 tabular-nums shrink-0">
              {fmtTime(progress.cur)}
            </span>
            <div className="grok-progress relative flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-white/[0.08] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-200"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500 tabular-nums shrink-0">
              {fmtTime(progress.total)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={bumpSpeed}
          className="shrink-0 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/[0.1] text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors tabular-nums"
          aria-label="Playback speed"
        >
          {speed}×
        </button>

        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/[0.1] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-emerald-500/60 transition-colors"
          aria-label="Choose voice"
          aria-expanded={pickerOpen}
        >
          <span>{preset.flag}</span>
          {!compact && <span className="hidden sm:inline">Voice</span>}
          <ChevronDown className={`w-3 h-3 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
        </button>

        {(state === "playing" || state === "paused") && (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors"
            aria-label="Stop"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {pickerOpen && (
        <div className="absolute top-full right-0 mt-2 w-[min(420px,calc(100vw-32px))] rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-neutral-950 shadow-xl z-30 overflow-hidden">
          <PresetGroup label="British" flag="GB" presets={britishPresets} currentId={presetId} onPick={changePreset} />
          <div className="h-px bg-neutral-200 dark:bg-white/[0.06]" />
          <PresetGroup label="Indian" flag="IN" presets={indianPresets} currentId={presetId} onPick={changePreset} />
          <div className="px-4 py-2.5 bg-neutral-50 dark:bg-white/[0.02] border-t border-neutral-200 dark:border-white/[0.06] text-[11px] text-neutral-500 dark:text-neutral-500 leading-relaxed">
            Voices use your operating system&apos;s speech engine. Coverage varies — macOS/iOS ship the
            richest set of British and Indian female voices.
          </div>
        </div>
      )}
    </div>
  );
}

function PresetGroup({
  label,
  flag,
  presets,
  currentId,
  onPick,
}: {
  label: string;
  flag: string;
  presets: Preset[];
  currentId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
        <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
          {flag}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 font-semibold">
          {label}
        </span>
      </div>
      <ul className="px-1.5 pb-2">
        {presets.map((p) => {
          const active = p.id === currentId;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPick(p.id)}
                className={`w-full flex items-center justify-between gap-3 text-left px-2.5 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-700 dark:text-neutral-200"
                }`}
              >
                <span className="text-sm font-medium">{p.label}</span>
                {active && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                    On
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
