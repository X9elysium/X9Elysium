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
      "X9Elysium transformed our Shopify store from a basic setup into a high-performing commerce platform. Revenue increased 40% in the first quarter after launch.",
    name: "Sarah Chen",
    role: "Head of Ecommerce",
    company: "Retail Brand Co.",
  },
  {
    quote:
      "The migration from our legacy platform was seamless. Their team handled every detail — data, design, integrations — without a single day of downtime.",
    name: "Marcus Johnson",
    role: "CTO",
    company: "StyleHouse",
  },
  {
    quote:
      "Their audit uncovered issues we'd been blind to for years. The optimization roadmap they delivered paid for itself within weeks of implementation.",
    name: "Priya Patel",
    role: "Director of Operations",
    company: "NovaMart",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative bg-neutral-900 text-white py-20 sm:py-28 lg:py-32 overflow-hidden"
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
          <h2 className="text-h2-display text-white mb-6">
            Trusted by ambitious retailers
          </h2>
          <p className="text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            We measure our success by our clients&apos; results. Here&apos;s
            what they have to say.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              transition={sectionTransition}
              className="glass-card p-8 sm:p-10 flex flex-col hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/[0.03] transition-all duration-500"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-emerald-500 text-emerald-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <span className="text-5xl font-serif text-emerald-500/20 leading-none mb-4 block select-none">
                &ldquo;
              </span>

              <p className="text-white/80 leading-relaxed text-base mb-8 flex-grow">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-neutral-900">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white tracking-wide">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {testimonial.role}, {testimonial.company}
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
