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
    <section id="about" className="relative py-28 sm:py-32" ref={ref}>
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-[0.2em] uppercase mb-4 block">
            Why X9Elysium
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">
            Bridge the gap between vision and execution
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Most agencies build websites. We build commerce infrastructure that
            powers real business growth.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500 tracking-wide">
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
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex gap-5"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <reason.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
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
