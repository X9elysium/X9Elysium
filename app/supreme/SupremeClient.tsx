"use client";

import { useEffect } from "react";
import ShaderField from "./ShaderField";
import Threshold from "./Threshold";
import Pillars from "./Pillars";
import Loom from "./Loom";
import Console from "./Console";

export default function SupremeClient() {
  useEffect(() => {
    // Lock the body to a deeper void while /supreme is mounted.
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#03030a";
    document.body.style.backgroundColor = "#03030a";
    return () => {
      document.documentElement.style.backgroundColor = prev;
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <main className="supreme-root relative min-h-screen overflow-x-hidden bg-[#03030a] text-[#fafafa] antialiased selection:bg-[#67e8f9] selection:text-[#03030a]">
      <ShaderField />

      <div className="relative z-10">
        <Threshold />
        <Pillars />
        <Loom />
        <Console />

        <footer className="relative px-6 py-32 text-center md:py-48">
          <p className="font-devanagari text-[clamp(1rem,2vw,1.4rem)] tracking-wide text-white/40">
            वसुधैव कुटुम्बकम्
          </p>
          <p className="mt-6 text-[clamp(1rem,1.6vw,1.25rem)] text-white/55">
            this is not a service. this is the lab.
          </p>
          <a
            href="mailto:darshan@x9elysium.com?subject=supreme"
            className="mt-10 inline-block text-[0.78rem] uppercase tracking-[0.32em] text-white/35 transition-colors hover:text-[#67e8f9]"
          >
            knock →
          </a>
        </footer>
      </div>
    </main>
  );
}
