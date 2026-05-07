"use client";

import { useEffect, useRef, useState } from "react";

const PILLARS = [
  {
    n: "01",
    label: "ai-native ux",
    title: "interfaces that anticipate, not respond.",
    body:
      "the cursor is a query. the scroll is a question. the input box is a relic. supreme treats every gesture as intent and pre-renders the next move while you're still deciding it.",
  },
  {
    n: "02",
    label: "generative surfaces",
    title: "the page is a prompt, not a layout.",
    body:
      "static pdps die in 2027. the storefront generates itself per visitor — copy, imagery, sequence — composited at the edge from a brand's source-of-truth and the visitor's signal. one shopify backend. infinite frontends.",
  },
  {
    n: "03",
    label: "agentic ops",
    title: "merchandising team of one.",
    body:
      "the catalog manager, the email writer, the support tier, the cro analyst — collapsed into agent flows the founder approves at a glance. supreme is where we build the ones we'll deploy on plus stores.",
  },
  {
    n: "04",
    label: "motion as information",
    title: "ui that behaves like physics.",
    body:
      "weight, momentum, refraction, decay. animation is no longer decoration — it's the visual grammar that tells you what just happened, what will happen, what's possible. gpu-driven. 120fps minimum.",
  },
];

function PillarRow({
  p,
  index,
}: {
  p: (typeof PILLARS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "-15% 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(p.title);
      return;
    }
    const id = setInterval(() => {
      i += 1;
      setTyped(p.title.slice(0, i));
      if (i >= p.title.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [visible, p.title]);

  return (
    <div
      ref={ref}
      className={`grid gap-8 border-t border-white/10 py-16 transition-all duration-700 md:grid-cols-12 md:gap-12 md:py-24 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: visible ? `${index * 60}ms` : "0ms" }}
    >
      <div className="md:col-span-3">
        <div
          className="font-light leading-none text-white/30"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
        >
          {p.n}
        </div>
        <div className="mt-4 text-[0.7rem] uppercase tracking-[0.32em] text-[#67e8f9]/80">
          {p.label}
        </div>
      </div>
      <div className="md:col-span-9">
        <h3
          className="font-light leading-[1.05] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
        >
          {typed}
          <span
            aria-hidden
            className={`ml-1 inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-[#c084fc] ${
              typed.length < p.title.length ? "opacity-100" : "opacity-0"
            }`}
            style={{ animation: "supreme-blink 0.9s steps(2) infinite" }}
          />
        </h3>
        <p
          className="mt-6 max-w-[42rem] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-white/65"
        >
          {p.body}
        </p>
      </div>
    </div>
  );
}

export default function Pillars() {
  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 py-24 md:px-10 md:py-40">
      <div className="mb-16 flex items-baseline justify-between md:mb-24">
        <h2
          className="font-light tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          the manifesto
        </h2>
        <span className="hidden text-[0.65rem] uppercase tracking-[0.4em] text-white/30 md:block">
          0/4 — what we build toward
        </span>
      </div>

      <div>
        {PILLARS.map((p, i) => (
          <PillarRow key={p.n} p={p} index={i} />
        ))}
      </div>

      <style jsx>{`
        @keyframes supreme-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
