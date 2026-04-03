"use client";

import { motion } from "framer-motion";
import { fadeUp, smoothEase } from "../lib/animations";

export default function VideoShowcase() {
  return (
    <section className="relative py-20 sm:py-28 bg-black overflow-hidden">
      {/* Subtle emerald glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[200px] pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-emerald-500/5">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
