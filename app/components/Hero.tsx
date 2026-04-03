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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient fade to blend into next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        {/* Subtle emerald accent glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[180px] will-change-transform pointer-events-none" />
      </div>

      {/* Content */}
      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 pt-[120px] pb-24 sm:pt-[140px] sm:pb-32 lg:pt-[160px]"
      >
        <motion.span
          variants={fadeIn}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="section-label"
        >
          Shopify Commerce Consulting
        </motion.span>

        <motion.h1
          variants={fadeUpBlur}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-display font-light text-white max-w-4xl mt-6 text-balance tracking-tight"
        >
          Unified commerce
          <br />
          <span className="text-gradient-emerald">solutions that scale</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-body-lg text-neutral-400 max-w-xl mt-8 leading-relaxed"
        >
          From store audits and custom integrations to full platform migrations
          — we architect commerce infrastructure for ambitious retailers.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col sm:flex-row items-start gap-4 mt-12"
        >
          <a href="#services" className="btn-primary-light">
            Explore Our Services
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
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
