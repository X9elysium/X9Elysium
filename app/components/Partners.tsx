"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { smoothEase } from "../lib/animations";

const partners = [
  "Shopify",
  "Shopify Plus",
  "Klaviyo",
  "Gorgias",
  "ReCharge",
  "ShipBob",
];

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-warm overflow-hidden" ref={ref}>
      <div className="section-container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center"
        >
          <span className="section-label text-center block">Trusted By</span>
          <h2 className="text-h2-display text-neutral-900 text-center max-w-2xl mx-auto">
            Partners and platforms we work with
          </h2>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[#f7f5f2] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[#f7f5f2] to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 sm:gap-24"
        >
          {[...partners, ...partners, ...partners, ...partners].map(
            (partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="flex-shrink-0 px-4 py-6"
              >
                <span className="text-neutral-900/30 text-xl sm:text-2xl font-semibold tracking-tight whitespace-nowrap hover:text-neutral-900/70 transition-colors duration-500 cursor-default">
                  {partner}
                </span>
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
