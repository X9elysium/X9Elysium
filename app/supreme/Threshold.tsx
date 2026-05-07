"use client";

import { useEffect, useRef, useState } from "react";

export default function Threshold() {
  const [phase, setPhase] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 120);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 flex items-center justify-between px-6 text-[0.65rem] uppercase tracking-[0.4em] text-white/40 md:px-10">
        <span
          className={`transition-opacity duration-700 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}
        >
          x9 / lab
        </span>
        <span
          className={`transition-opacity duration-700 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}
        >
          {`v0.1 · ${new Date().getFullYear()}+`}
        </span>
      </div>

      <p
        className={`text-[0.7rem] uppercase tracking-[0.5em] text-[#67e8f9]/80 transition-all duration-700 ${
          phase >= 1
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        the lab
      </p>

      <h1
        className={`relative mt-6 select-none text-center font-light leading-[0.85] tracking-[-0.04em] transition-all duration-1000 ${
          phase >= 2
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-4 opacity-0 blur-md"
        }`}
        style={{
          fontSize: "clamp(4.5rem, 16vw, 18rem)",
          background:
            "linear-gradient(120deg, #fafafa 0%, #67e8f9 28%, #c084fc 56%, #fbbf24 84%, #fafafa 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation:
            phase >= 2 ? "supreme-shift 14s ease-in-out infinite" : undefined,
        }}
      >
        SUPREME
      </h1>

      <p
        className={`mt-10 max-w-[44rem] text-center text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-white/70 transition-all duration-1000 ${
          phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        not a service. the R&amp;D vehicle for what x9elysium will sell in
        2027 and beyond — ai-native commerce surfaces, generative interfaces,
        agentic workflows. propose boldly. iterate fast.
      </p>

      <div
        className={`mt-20 flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-white/40 transition-opacity duration-1000 ${
          phase >= 3 ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>scroll</span>
        <div className="h-12 w-px overflow-hidden bg-white/10">
          <div className="supreme-scroll-cue h-full w-full bg-[#67e8f9]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes supreme-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .supreme-scroll-cue {
          animation: supreme-cue 2.4s ease-in-out infinite;
        }
        @keyframes supreme-cue {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .supreme-scroll-cue { animation: none; }
        }
      `}</style>
    </section>
  );
}
