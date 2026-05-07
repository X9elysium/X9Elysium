"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 16;
const ROWS = 9;
const CELLS = COLS * ROWS;

// One short fragment per row — clicked node lights it up.
const FRAGMENTS = [
  "every storefront is a graph",
  "every visitor is a query",
  "every product is a node",
  "every order is an edge",
  "every cart is a forecast",
  "every refund is a signal",
  "every cohort is a current",
  "every brand is a shared ledger",
  "the world is one family",
];

type Node = { x: number; y: number; live: number };

export default function Loom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes: Node[] = [];
    let w = 0;
    let h = 0;
    const mouse = { x: -1e6, y: -1e6, down: false };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.length = 0;
      for (let i = 0; i < CELLS; i++) {
        const cx = i % COLS;
        const cy = Math.floor(i / COLS);
        nodes.push({
          x: ((cx + 0.5) / COLS) * w,
          y: ((cy + 0.5) / ROWS) * h,
          live: 0,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -1e6;
      mouse.y = -1e6;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      let nearestRow = 0;
      let bestD = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.x - mx;
        const dy = n.y - my;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          nearestRow = Math.floor(i / COLS);
          // Pulse a wave outward from the click.
          n.live = 1.0;
        }
      }
      // Pulse adjacent cells.
      nodes.forEach((n) => {
        const dx = n.x - mx;
        const dy = n.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 220) n.live = Math.max(n.live, 1 - d / 220);
      });
      setActiveRow(nearestRow % FRAGMENTS.length);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Subtle grid.
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        const px = (x / COLS) * w;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        const py = (y / ROWS) * h;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }

      // Connections to neighbours, opacity weighted by mouse proximity.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const cx = i % COLS;
        const cy = Math.floor(i / COLS);
        const neighbours: number[] = [];
        if (cx + 1 < COLS) neighbours.push(i + 1);
        if (cy + 1 < ROWS) neighbours.push(i + COLS);
        const dx = a.x - mouse.x;
        const dy = a.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 1 - d / 280);
        const baseAlpha = 0.04 + mouseInfluence * 0.18 + a.live * 0.5;
        for (const ni of neighbours) {
          const b = nodes[ni];
          ctx.strokeStyle = `rgba(103,232,249,${baseAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.6 + mouseInfluence * 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const m = Math.max(0, 1 - d / 220);
        const radius = 1.1 + m * 2.4 + n.live * 4;
        const baseHue = m > 0.4 ? "#c084fc" : "#67e8f9";
        ctx.fillStyle = baseHue;
        ctx.globalAlpha = 0.35 + m * 0.55 + n.live * 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (!reduce) n.live *= 0.96;
      }

      // Slow drift even with no mouse.
      if (!reduce && Math.floor(t / 1000) % 6 === 0 && (t | 0) % 1000 < 16) {
        const i = Math.floor(Math.random() * nodes.length);
        nodes[i].live = Math.max(nodes[i].live, 0.6);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-[1280px] px-6 py-24 md:px-10 md:py-40">
      <div className="mb-12 flex items-baseline justify-between">
        <h2
          className="font-light tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          the loom
        </h2>
        <span className="hidden text-[0.65rem] uppercase tracking-[0.4em] text-white/30 md:block">
          click a node
        </span>
      </div>

      <p className="mb-10 max-w-[42rem] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-white/55">
        every storefront is a graph. every gesture is an edge. drag your cursor
        through the field, click anywhere to send a pulse.
      </p>

      <div
        ref={wrapRef}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-crosshair"
          aria-label="Interactive loom — click to pulse the graph"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center pb-6 md:pb-10">
          <div
            className={`mx-6 max-w-[40rem] rounded-full border border-white/10 bg-black/40 px-5 py-3 text-center text-[clamp(0.85rem,1.1vw,1rem)] tracking-tight text-white/85 backdrop-blur-md transition-all duration-500 ${
              activeRow !== null
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            {activeRow !== null
              ? FRAGMENTS[activeRow]
              : "every storefront is a graph"}
          </div>
        </div>
      </div>
    </section>
  );
}
