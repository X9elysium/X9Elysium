"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { smoothEase } from "../lib/animations";

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
      ref={ref}
    >
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-neutral-950 to-emerald-900/30" />

      {/* Glow orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.12] rounded-full blur-[150px] will-change-transform pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-100px] w-[400px] h-[300px] bg-emerald-600/[0.06] rounded-full blur-[120px] will-change-transform pointer-events-none" />

      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-display-sm text-white mb-6 text-balance">
            Ready to elevate your commerce experience?
          </h2>
          <p className="text-neutral-400 text-body-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Let&apos;s discuss how we can help you build, optimize, and scale
            your Shopify ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-accent">
              Book a Strategy Call
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="mailto:darshanpatel1902@gmail.com" className="btn-outline">
              Email Us Directly
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
