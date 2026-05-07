"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cloud, Pause, Play, Volume2, X } from "lucide-react";

type Mode = "drone" | "rain" | "ocean" | "forest" | "cloud";

type CloudTrack = {
  key: string;
  title: string;
  durationSec: number | null;
  url: string;
};

type Manifest = {
  tracks: CloudTrack[];
  synthesis: boolean;
  message?: string;
};

const SYNTH_MODES: { id: Mode; title: string; sub: string }[] = [
  { id: "drone", title: "Drone", sub: "Layered solfeggio sines, slow LFO" },
  { id: "rain", title: "Rain", sub: "Filtered pink noise, soft attack" },
  { id: "ocean", title: "Ocean", sub: "Brown noise with slow swell" },
  { id: "forest", title: "Forest", sub: "Filtered noise, gentle wind" },
];

export default function SanctuaryClient() {
  const [mode, setMode] = useState<Mode>("drone");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [activeCloudKey, setActiveCloudKey] = useState<string | null>(null);
  const [breathOn, setBreathOn] = useState(false);
  const [stayOn, setStayOn] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthNodesRef = useRef<AudioNode[]>([]);
  const cloudAudioRef = useRef<HTMLAudioElement | null>(null);

  // Keep master gain in sync with volume slider.
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume,
        ctx.currentTime + 0.1,
      );
    }
    if (cloudAudioRef.current) {
      cloudAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Fetch manifest once on mount. Empty manifest is the truth posture; the UI
  // does not invent tracks.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/sanctuary/manifest", { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`);
        return (await r.json()) as Manifest;
      })
      .then((m) => {
        if (!cancelled) setManifest(m);
      })
      .catch(() => {
        if (!cancelled) setManifest({ tracks: [], synthesis: true });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Tear everything down on unmount.
  useEffect(() => {
    return () => {
      teardownSynth();
      stopCloud();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ensureCtx(): AudioContext {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctor();
      audioCtxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      masterGainRef.current = gain;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }

  function teardownSynth() {
    synthNodesRef.current.forEach((n) => {
      try {
        if ("stop" in n && typeof (n as AudioScheduledSourceNode).stop === "function") {
          (n as AudioScheduledSourceNode).stop();
        }
        n.disconnect();
      } catch {
        // noop — node may already be stopped/disconnected
      }
    });
    synthNodesRef.current = [];
  }

  function stopCloud() {
    if (cloudAudioRef.current) {
      cloudAudioRef.current.pause();
      cloudAudioRef.current.src = "";
      cloudAudioRef.current = null;
    }
  }

  function startSynth(activeMode: Mode) {
    teardownSynth();
    if (!masterGainRef.current) return;
    const ctx = ensureCtx();
    const out = masterGainRef.current;

    if (activeMode === "drone") {
      // Layered solfeggio + supporting fifth. Slow LFO on detune for breath.
      [174, 285, 396, 528, 639].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i === 0 ? "sine" : i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        oscGain.gain.value = 0;
        oscGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4 + i);

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.04 + i * 0.012;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 6 + i * 1.2;
        lfo.connect(lfoGain).connect(osc.detune);

        osc.connect(oscGain).connect(out);
        osc.start();
        lfo.start();
        synthNodesRef.current.push(osc, oscGain, lfo, lfoGain);
      });
    } else {
      // Noise-based natural soundscapes via filtered noise buffer.
      const buffer = makeNoiseBuffer(ctx, activeMode);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 3);

      if (activeMode === "rain") {
        filter.type = "highpass";
        filter.frequency.value = 1400;
        filter.Q.value = 0.7;
      } else if (activeMode === "ocean") {
        filter.type = "lowpass";
        filter.frequency.value = 540;
        filter.Q.value = 0.7;
        // Slow swell via LFO on gain.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.13;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.18;
        lfo.connect(lfoGain).connect(g.gain);
        lfo.start();
        synthNodesRef.current.push(lfo, lfoGain);
      } else {
        // forest
        filter.type = "bandpass";
        filter.frequency.value = 900;
        filter.Q.value = 1.4;
        // Subtle wind via LFO on filter cutoff.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.07;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 220;
        lfo.connect(lfoGain).connect(filter.frequency);
        lfo.start();
        synthNodesRef.current.push(lfo, lfoGain);
      }

      noise.connect(filter).connect(g).connect(out);
      noise.start();
      synthNodesRef.current.push(noise, filter, g);
    }
  }

  async function play(activeMode: Mode, cloudKey?: string) {
    teardownSynth();
    stopCloud();

    if (activeMode === "cloud" && cloudKey) {
      const audio = new Audio();
      audio.src = `/api/sanctuary/track/${encodeURIComponent(cloudKey)}`;
      audio.loop = true;
      audio.volume = volume;
      audio.preload = "auto";
      cloudAudioRef.current = audio;
      try {
        await audio.play();
      } catch {
        // Autoplay refused; mark not-playing so the user can retry by tapping.
        setPlaying(false);
        return;
      }
      setActiveCloudKey(cloudKey);
      setPlaying(true);
      return;
    }

    ensureCtx();
    startSynth(activeMode);
    setPlaying(true);
  }

  function pause() {
    setPlaying(false);
    teardownSynth();
    if (cloudAudioRef.current) {
      cloudAudioRef.current.pause();
    }
  }

  function pickMode(next: Mode, cloudKey?: string) {
    setMode(next);
    if (next === "cloud" && cloudKey) {
      setActiveCloudKey(cloudKey);
      void play("cloud", cloudKey);
    } else {
      setActiveCloudKey(null);
      void play(next);
    }
  }

  const cloudTracks = manifest?.tracks ?? [];
  const cloudEmpty = manifest != null && cloudTracks.length === 0;

  // Stay mode: full-screen blackout with only the breath circle pulsing.
  if (stayOn) {
    return (
      <main className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center overflow-hidden">
        <BreathCircle />
        <button
          onClick={() => setStayOn(false)}
          className="absolute top-6 right-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/80 transition-colors"
          aria-label="Leave stay mode"
        >
          Leave <X className="w-3.5 h-3.5" />
        </button>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.22em] text-white/40">
          Box breathing — 4 in · 4 hold · 4 out · 4 hold
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <AmbientBackdrop />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-10 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to x9elysium
        </Link>

        <header className="mt-16 sm:mt-24">
          <p
            className="font-devanagari text-emerald-500/90 text-2xl sm:text-3xl tracking-tight"
            lang="sa"
            aria-label="Vasudhaiva Kutumbakam"
          >
            वसुधैव कुटुम्बकम्
          </p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-light tracking-tight text-balance leading-[1.05]">
            Sanctuary.
            <br />
            <span className="text-white/50">The alone space.</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-xl leading-relaxed text-sm sm:text-base">
            A quiet corner of x9elysium.com. Generative ambient drones and
            synthesized natural sound, plus a small cloud library of calm
            tracks when the bucket is provisioned. No tracking, no chat, no
            chrome. Somewhere to think.
          </p>
        </header>

        <section className="mt-16">
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/40 mb-5">
            In-browser synthesis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SYNTH_MODES.map((m) => {
              const active = mode === m.id && playing;
              return (
                <button
                  key={m.id}
                  onClick={() => pickMode(m.id)}
                  className={`group relative text-left rounded-xl border p-5 transition-all duration-300 ${
                    active
                      ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                      : "border-white/10 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-medium ${
                        active ? "text-emerald-300" : "text-white/90"
                      }`}
                    >
                      {m.title}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-white/40 leading-relaxed">
                    {m.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xs uppercase tracking-[0.22em] text-white/40">
              Cloud library
            </h2>
            {manifest && (
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-white/30">
                <Cloud className="w-3 h-3" />
                {cloudEmpty ? "empty" : `${cloudTracks.length} tracks`}
              </span>
            )}
          </div>

          {!manifest && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/50">
              Loading manifest…
            </div>
          )}

          {manifest && cloudEmpty && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60 leading-relaxed">
              The cloud library is empty.{" "}
              {manifest.synthesis
                ? "The R2 bucket isn't provisioned yet — the page falls back to in-browser synthesis above. We don't list invented tracks."
                : "No tracks have been uploaded. Sanctuary is honest about an empty shelf."}
            </div>
          )}

          {manifest && !cloudEmpty && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cloudTracks.map((t) => {
                const active = mode === "cloud" && activeCloudKey === t.key && playing;
                return (
                  <li key={t.key}>
                    <button
                      onClick={() => pickMode("cloud", t.key)}
                      className={`w-full text-left rounded-xl border p-5 transition-all duration-300 ${
                        active
                          ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                          : "border-white/10 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-base font-medium ${
                            active ? "text-emerald-300" : "text-white/90"
                          }`}
                        >
                          {t.title}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      {t.durationSec != null && (
                        <p className="mt-1.5 text-[11px] text-white/40">
                          {formatDuration(t.durationSec)}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={() => (playing ? pause() : void play(mode, activeCloudKey ?? undefined))}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/20"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="w-5 h-5" strokeWidth={2.2} />
              ) : (
                <Play className="w-5 h-5 translate-x-0.5" strokeWidth={2.2} />
              )}
            </button>

            <div className="flex-1 w-full flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-white/40 flex-shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
                aria-label="Volume"
              />
            </div>

            <button
              onClick={() => setBreathOn((v) => !v)}
              className={`text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 rounded-full border transition-all duration-300 ${
                breathOn
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 text-white/60 hover:border-emerald-500/30 hover:text-white/90"
              }`}
            >
              {breathOn ? "Breath: on" : "Breath pacer"}
            </button>

            <button
              onClick={() => setStayOn(true)}
              className="text-[11px] uppercase tracking-[0.18em] px-4 py-2.5 rounded-full border border-white/10 text-white/60 hover:border-white/40 hover:text-white/90 transition-all duration-300"
            >
              Stay
            </button>
          </div>

          {breathOn && (
            <div className="mt-8 flex flex-col items-center">
              <BreathCircle compact />
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/40">
                4 in · 4 hold · 4 out · 4 hold
              </p>
            </div>
          )}
        </section>

        <footer className="mt-16 text-[11px] text-white/30 leading-relaxed max-w-xl">
          <p>
            Synthesis runs on your device with the Web Audio API — nothing is
            streamed when you pick Drone, Rain, Ocean, or Forest. Cloud tracks
            stream from a Cloudflare R2 bucket through this site&apos;s Worker.
            No analytics fire on this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

function AmbientBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-emerald-500/[0.06] rounded-full blur-[200px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-emerald-700/[0.04] rounded-full blur-[160px]" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[140px]" />
    </div>
  );
}

function BreathCircle({ compact = false }: { compact?: boolean }) {
  // 4-4-4-4 box breathing — full cycle is 16s.
  const size = compact ? 96 : 240;
  return (
    <div
      className="rounded-full bg-emerald-500/20 border border-emerald-500/40"
      style={{
        width: size,
        height: size,
        animation: "x9-breath 16s ease-in-out infinite",
      }}
      aria-hidden="true"
    />
  );
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function makeNoiseBuffer(ctx: AudioContext, activeMode: Mode): AudioBuffer {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    if (activeMode === "ocean") {
      // Brown noise — integrated white noise. Heavy in low end.
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    } else {
      // Pink noise — Voss-McCartney approximation.
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        data[i] = pink * 0.11;
      }
    }
  }
  return buffer;
}
