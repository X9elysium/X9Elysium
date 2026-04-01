"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, Users, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Deep Shopify Expertise",
    description:
      "We live and breathe Shopify. Our team has hands-on experience with Shopify Plus, custom storefronts, checkout extensibility, and the latest platform capabilities.",
  },
  {
    icon: Shield,
    title: "Proven Methodology",
    description:
      "Every engagement follows our battle-tested framework: discover, strategize, implement, optimize. No guesswork — just results backed by data.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description:
      "We don't just hand over deliverables and disappear. We embed with your team, transfer knowledge, and stay invested in your long-term success.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused",
    description:
      "Everything we build is designed to scale. From architecture decisions to integration choices, we optimize for where you're headed — not just where you are.",
  },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "3x", label: "Avg. Performance Gain" },
  { value: "24/7", label: "Support & Monitoring" },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-light" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <span className="section-label">Why X9Elysium</span>
          <h2 className="text-h2-display text-[#151515] max-w-3xl text-balance">
            Commerce infrastructure built for growth
          </h2>
          <p className="text-[#9b9b9b] text-lg max-w-2xl mt-6 leading-relaxed">
            Most agencies build websites. We build the commerce infrastructure
            that powers real business growth.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 mb-20"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-8 ${
                i < stats.length - 1 ? "md:border-r md:border-[#cccccc]/40" : ""
              }`}
            >
              <div className="text-display text-[#151515] mb-3">
                {stat.value}
              </div>
              <div className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#9b9b9b]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="flex gap-5"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-[4px] bg-[#10b981]/10 flex items-center justify-center">
                <reason.icon className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#151515] mb-2 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-[#9b9b9b] leading-relaxed text-sm">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
