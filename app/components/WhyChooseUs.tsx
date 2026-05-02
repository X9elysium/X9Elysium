"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Lightbulb, Rocket, BarChart3, Zap, Shield, Users, TrendingUp } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

const methodologySteps = [
  {
    icon: Search,
    phase: "01",
    title: "Discover",
    duration: "Wk 1–2",
    description:
      "A deep audit of your store — performance, UX, conversion flow, tech stack, and growth blockers. We don't guess; we map.",
  },
  {
    icon: Lightbulb,
    phase: "02",
    title: "Strategize",
    duration: "Wk 2–3",
    description:
      "A data-backed roadmap: prioritized initiatives, clear KPIs, timelines, and architecture decisions aligned to your goals.",
  },
  {
    icon: Rocket,
    phase: "03",
    title: "Implement",
    duration: "Wk 3–10",
    description:
      "We embed with your team to build, migrate, or optimize — from custom apps to full platform launches.",
  },
  {
    icon: BarChart3,
    phase: "04",
    title: "Optimize",
    duration: "Ongoing",
    description:
      "Continuous measurement, A/B testing, and iteration. We stay after launch because that's when the real work begins.",
  },
];

const reasons = [
  {
    icon: Zap,
    title: "Deep Shopify Expertise",
    description:
      "Real hands-on work across Shopify Plus, custom storefronts, checkout extensibility, and the full platform — not just credentials.",
  },
  {
    icon: Shield,
    title: "Certified Partner",
    description:
      "Shopify Partner with live expertise across Klaviyo, Gorgias, ReCharge, ShipBob, and enterprise-grade integrations.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description:
      "We embed with your team and transfer knowledge. 98% client retention because we stay invested in your long-term success.",
  },
  {
    icon: TrendingUp,
    title: "Growth-First Thinking",
    description:
      "Every decision — architecture, integrations, tooling — is made with where you're going in mind, not just where you are.",
  },
];

const stats = [
  { value: "40%+", label: "Avg. Revenue Lift" },
  { value: "98%", label: "Client Retention" },
  { value: "50+", label: "Projects Delivered" },
  { value: "$12M+", label: "Client GMV Managed" },
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
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-16 sm:mb-20"
        >
          <span className="section-label">Why X9Elysium</span>
          <h2 className="text-h2-display text-neutral-900 max-w-3xl text-balance">
            Built for growth. Proven in the real world.
          </h2>
          <p className="text-neutral-500 text-body-lg max-w-2xl mt-6 leading-relaxed">
            We don&apos;t build websites. We build the commerce infrastructure
            that powers serious retail growth.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200/60 rounded-2xl overflow-hidden mb-20"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={sectionTransition}
              className="bg-neutral-100 text-center py-10 lg:py-12"
            >
              <div className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-label-sm uppercase text-neutral-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* The Elysium Method */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-4">
              The Elysium Method
            </span>
            <p className="text-neutral-500 text-body-sm max-w-xl mx-auto">
              Four phases. No surprises. Consistently 40%+ revenue uplifts for
              the retailers we work with.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {methodologySteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={sectionTransition}
                className="relative p-6 rounded-xl bg-white/60 border border-neutral-200/40 hover:bg-white hover:border-emerald-500/20 hover:shadow-sm transition-all duration-500 group"
              >
                {/* Connector line */}
                {index < methodologySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 lg:-right-3 w-6 h-px bg-emerald-500/30" />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <step.icon
                      className="w-4.5 h-4.5 text-emerald-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600/60 uppercase tracking-widest">
                    Phase {step.phase}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-neutral-900 mb-1 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-[11px] font-medium text-emerald-600/80 mb-3 uppercase tracking-wider">
                  {step.duration}
                </p>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={fadeUp}
              transition={sectionTransition}
              className="flex gap-5 p-6 lg:p-8 rounded-xl bg-white/60 border border-neutral-200/40 hover:bg-white hover:border-neutral-200 hover:shadow-sm transition-all duration-500"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] flex items-center justify-center">
                <reason.icon
                  className="w-5 h-5 text-emerald-500"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-body-sm">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
