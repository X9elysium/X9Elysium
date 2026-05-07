"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  heroStagger,
  fadeIn,
  fadeUpBlur,
  fadeUp,
  smoothEase,
} from "../lib/animations";
import { BookingButton } from "./BookingButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black">
      {/* Single soft emerald glow — kept minimal so the type is the hero. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[180px] will-change-transform pointer-events-none" />
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
          className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-[0.18em]">
            Toronto · Calgary · Vancouver
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUpBlur}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-display font-light text-neutral-900 dark:text-white max-w-4xl mt-6 text-balance tracking-tight"
        >
          Founder-led Shopify Plus consulting.
          <br />
          <span className="text-gradient-emerald">No juniors. No handoffs.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-xl mt-8 leading-relaxed"
        >
          Two senior founders. Eight years each. 30+ Shopify and Shopify Plus
          stores shipped, 95% client retention, and every brief delivered by
          the people you hire — store audits, Plus migrations, custom apps,
          and unified commerce strategy for Canadian and US retailers.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col sm:flex-row items-start gap-4 mt-12"
        >
          <BookingButton variant="primary-light" source="hero" />
          <a
            href="#work"
            className="btn-outline"
            data-track-cta="view_work"
            data-track-location="hero"
          >
            Explore Our Work
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>

    </section>
  );
}
