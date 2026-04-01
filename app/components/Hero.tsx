"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background — solid dark with subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]" />

      {/* Subtle accent glow — very minimal */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/[0.03] rounded-full blur-[150px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="section-container relative z-10 pt-[140px] pb-20 sm:pt-[160px] sm:pb-28"
      >
        <span className="section-label">Shopify Commerce Consulting</span>

        <h1 className="text-display font-light text-white max-w-4xl mt-6 text-balance">
          Unified commerce
          <br />
          solutions that scale
        </h1>

        <p className="text-lg sm:text-xl text-[#9b9b9b] max-w-xl mt-8 leading-relaxed">
          From store audits and custom integrations to full platform migrations
          — we architect commerce infrastructure for ambitious retailers.
        </p>

        <div className="mt-12">
          <a href="#services" className="btn-primary-light">
            Explore Our Services
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
