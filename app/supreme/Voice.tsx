"use client";

import { useEffect, useRef, useState } from "react";

// Canned, grounded "predictive" responses. The /chat infra exists but is
// PIN-gated — supreme echoes the prompt back as ghost type, then drops a
// short reflection drawn from this list. It's a vibe, not an oracle.
const REFLECTIONS = [
  "the catalog is already a graph. the agent just walks it for you.",
  "less buttons. more intent.",
  "the storefront is a prompt. the cart is the answer.",
  "ops collapses. the founder stays.",
  "ship is the design system. truth is the brand voice.",
  "every storefront is a country. the world is one family.",
  "the next interface is invisible until it isn't.",
  "shopify plus is the substrate. supreme is the surface.",
];

function pick(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return REFLECTIONS[Math.abs(h) % REFLECTIONS.length];
}

export default function Voice() {
  const [value, setValue] = useState("");
  const [echo, setEcho] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Live ghost echo as the user types — fades behind the input.
  useEffect(() => {
    setEcho(value);
  }, [value]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setReflection(null);
    setTyping(true);
    const target = pick(q);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setReflection(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, 24);
  };

  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 py-24 md:px-10 md:py-40">
      <div className="mb-12">
        <h2
          className="font-light tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          the voice
        </h2>
        <p className="mt-4 max-w-[42rem] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-white/55">
          ask supreme anything. it echoes back. there is no chatbot here — just
          a prompt surface and a single reflection drawn from the lab&apos;s
          working notes.
        </p>
      </div>

      {/* Massive ghost echo of the live input */}
      <div
        aria-hidden
        className="pointer-events-none relative mb-10 h-[clamp(7rem,18vw,18rem)] w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 flex items-center justify-center text-center font-light leading-[0.9] tracking-[-0.04em] transition-all duration-300"
          style={{
            fontSize: "clamp(3rem, 14vw, 16rem)",
            background:
              "linear-gradient(120deg, rgba(103,232,249,0.20), rgba(192,132,252,0.20), rgba(251,191,36,0.16))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "blur(0.5px)",
            opacity: echo ? 1 : 0.25,
          }}
        >
          {echo || "•••"}
        </div>
      </div>

      <form
        onSubmit={submit}
        className="group relative flex w-full items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md transition-colors focus-within:border-[#67e8f9]/60 md:px-6 md:py-4"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.4em] text-white/40">
          ask
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 80))}
          placeholder="what does ai-native commerce mean for a $20m brand?"
          className="flex-1 bg-transparent text-[clamp(1rem,1.4vw,1.2rem)] text-white placeholder:text-white/30 focus:outline-none"
          autoComplete="off"
          aria-label="Ask supreme anything"
        />
        <button
          type="submit"
          disabled={!value.trim() || typing}
          className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.32em] text-white/80 transition-all hover:border-[#67e8f9]/60 hover:text-[#67e8f9] disabled:opacity-40"
        >
          send →
        </button>
      </form>

      <div
        className="mt-12 min-h-[6rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {reflection ? (
          <p
            className="max-w-[44rem] text-[clamp(1.4rem,2.4vw,2rem)] font-light leading-snug tracking-[-0.01em] text-white/85"
          >
            <span className="mr-3 text-[0.6rem] uppercase tracking-[0.5em] text-[#c084fc]/80 align-middle">
              echo
            </span>
            {reflection}
            <span
              aria-hidden
              className={`ml-1 inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-[#67e8f9] ${
                typing ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animation: "supreme-voice-blink 0.9s steps(2) infinite",
              }}
            />
          </p>
        ) : (
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-white/30">
            awaiting signal.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes supreme-voice-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
