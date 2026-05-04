"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

const testimonials = [
  {
    quote:
      "X9Elysium transformed our Shopify store from a basic setup into a high-performing commerce platform. The first quarter after launch was the strongest we've ever had.",
    role: "Head of Ecommerce",
    company: "Premium fashion DTC",
    initial: "F",
  },
  {
    quote:
      "The migration from our legacy platform was seamless. Every detail — data, design, integrations — handled without a single day of downtime.",
    role: "CTO",
    company: "Multi-brand apparel retailer",
    initial: "A",
  },
  {
    quote:
      "Their audit uncovered issues we'd been blind to for years. The roadmap they delivered paid for itself within weeks of implementation.",
    role: "Director of Operations",
    company: "Home & lifestyle DTC",
    initial: "H",
  },
  {
    quote:
      "Load times dropped, conversion lifted, and the team didn't have to babysit the launch. The numbers spoke for themselves at the next board review.",
    role: "Founder & CEO",
    company: "Athletic & outdoor gear",
    initial: "G",
  },
  {
    quote:
      "Custom subscription and inventory integrations took the manual work out of our ops loop. Our team finally has room to breathe.",
    role: "VP of Operations",
    company: "Health & wellness DTC",
    initial: "W",
  },
  {
    quote:
      "X9Elysium took us from disconnected sales channels to a fully unified commerce setup. One source of truth, finally.",
    role: "Head of Digital",
    company: "Multi-location home goods",
    initial: "H",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white py-20 sm:py-28 lg:py-32 overflow-hidden"
      ref={ref}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="section-label">Client Stories</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6">
            What our clients say
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            We measure success by what our clients achieve. Names and metrics
            are anonymized — most of our work runs under NDA, and we&apos;d
            rather under-claim than overstate.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={`${testimonial.company}-${idx}`}
              variants={fadeUp}
              transition={sectionTransition}
              className="glass-card p-8 sm:p-10 flex flex-col hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/[0.03] transition-all duration-500"
            >
              {/* Star rating */}
              <div className="flex items-center mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-emerald-500 text-emerald-500"
                    />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <span className="text-5xl font-serif text-emerald-500/20 leading-none mb-4 block select-none">
                &ldquo;
              </span>

              <p className="text-neutral-700 dark:text-white/80 leading-relaxed text-base mb-8 flex-grow">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900">
                  {testimonial.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
