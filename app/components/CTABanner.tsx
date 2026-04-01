"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 sm:py-28" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-16 md:p-20 text-center"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-[#09090b] to-teal-600/15" />
          <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />

          {/* Glow orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/15 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">
              Ready to transform your commerce experience?
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Let&apos;s discuss how we can help you build, optimize, and scale
              your Shopify ecosystem.
            </p>
            <a href="#contact" className="btn-primary">
              Book a Free Strategy Call
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
