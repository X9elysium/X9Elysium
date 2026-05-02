"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { smoothEase } from "../../lib/animations";
import { BookingButton } from "../../components/BookingButton";

export default function NewsletterCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40 dark:from-neutral-950 dark:via-black dark:to-neutral-950"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="section-label">Ready to talk?</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance mb-6">
            Build a Shopify store that compounds.
          </h2>
          <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            We work with Canadian retailers in Toronto, Calgary, and Vancouver who are ready to scale with unified commerce. Book a free 30-minute strategy call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookingButton variant="accent" />
            <Link href="/services" className="btn-outline">
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
