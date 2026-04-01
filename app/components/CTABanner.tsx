"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-[#009eff] py-16 sm:py-[100px]" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-h2-display text-white mb-6 text-balance">
            Ready to elevate your commerce experience?
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Let&apos;s discuss how we can help you build, optimize, and scale
            your Shopify ecosystem.
          </p>
          <Link href="/contact" className="btn-primary">
            Book a Strategy Call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
