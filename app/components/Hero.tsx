"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  heroStagger,
  fadeIn,
  fadeUpBlur,
  fadeUp,
  smoothEase,
} from "../lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
        {/* Top-right emerald glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] will-change-transform pointer-events-none" />
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] will-change-transform pointer-events-none" />
        {/* Center subtle radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] rounded-full blur-[200px] will-change-transform pointer-events-none" />
      </div>

      {/* Content */}
      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 pt-[120px] pb-24 sm:pt-[140px] sm:pb-32 lg:pt-[160px]"
      >
        <motion.div
          variants={fadeIn}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-400" fill="currentColor">
            <path d="M15.34 3.38c-.15-.12-.35-.14-.52-.06l-1.84.93c-.16-.24-.39-.42-.66-.52-.17-.43-.46-.8-.84-1.05-.56-.37-1.2-.47-1.83-.27-.4.12-.73.39-.95.72l-.04-.02-1.8.92c-.18.09-.3.27-.32.47l-1.7 14.7c0 .02 0 .04 0 .06l2.53 1.3c.22.12.48.14.72.08.24-.07.44-.22.57-.43.12-.2.25-.38.4-.54.37.28.82.44 1.29.44.16 0 .32-.02.48-.06.7-.18 1.24-.72 1.45-1.4l.62-2.05 2.56 1.32c.15.08.33.08.48 0 .16-.08.27-.23.3-.4l1.7-14.7c.02-.18-.05-.36-.18-.48zM10.7 17.44c-.2.52-.7.83-1.23.83-.22 0-.44-.06-.64-.17l-.02-.01c.08-.18.14-.36.18-.56l.85-3.5.07-.3c.08-.32.36-.54.68-.56h.05c.32 0 .6.2.72.5l.09.24-.75 3.53z"/>
          </svg>
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Shopify Plus Partner — Serving Canada &amp; United States</span>
        </motion.div>

        <motion.h1
          variants={fadeUpBlur}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-display font-light text-neutral-900 dark:text-white max-w-4xl mt-6 text-balance tracking-tight"
        >
          Shopify Plus consulting for North American retailers
          <br />
          <span className="text-gradient-emerald">ready to scale.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-xl mt-8 leading-relaxed"
        >
          50+ Shopify Plus stores delivered across Canada and the United States.
          98% client retention. Store audits, platform migrations to Shopify
          Plus, custom apps, and unified commerce strategy — built by a senior
          team that ships.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col sm:flex-row items-start gap-4 mt-12"
        >
          <a href="#work" className="btn-primary-light">
            Explore Our Work
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link href="/contact" className="btn-outline">
            Book a Strategy Call
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border border-neutral-300 dark:border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-neutral-400 dark:bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
