"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

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
    <section className="bg-[#151515] text-white py-16 sm:py-[100px]" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="section-label">Client Stories</span>
          <h2 className="text-h2-display text-white mb-6">
            Trusted by ambitious retailers
          </h2>
          <p className="text-[#9b9b9b] text-lg max-w-2xl mx-auto leading-relaxed">
            We measure our success by our clients&apos; results. Here&apos;s
            what they have to say.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-8 sm:p-10 rounded-[4px] border border-white/10 bg-black/40 flex flex-col"
            >
              <Quote className="w-8 h-8 text-[#10b981]/30 mb-6 flex-shrink-0" />

              <p className="text-white/80 leading-relaxed text-base mb-8 flex-grow">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white uppercase tracking-wide">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#9b9b9b]">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
