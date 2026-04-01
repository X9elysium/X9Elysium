"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
    <section className="section-warm" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label text-center block">Trusted By</span>
          <h2 className="text-h2-display text-[#151515] text-center max-w-2xl mx-auto mb-16">
            Partners and platforms we work with
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {partners.map((partner) => (
              <div
                key={partner}
                className="group flex items-center justify-center px-6 py-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <span className="text-[#151515] text-lg sm:text-xl font-medium tracking-tight whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
