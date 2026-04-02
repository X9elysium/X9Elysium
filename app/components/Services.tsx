"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  Code2,
  ArrowRightLeft,
  Gauge,
  Lightbulb,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

const services = [
  {
    icon: Search,
    title: "Store Optimization & Audits",
    description:
      "Comprehensive audits covering performance, UX, conversion funnels, and technical health. We pinpoint what's holding you back and build a clear roadmap to fix it.",
  },
  {
    icon: Code2,
    title: "Custom Apps & Integrations",
    description:
      "Bespoke Shopify app development and third-party integrations that connect your ERP, PIM, OMS, and fulfillment systems into one seamless commerce ecosystem.",
  },
  {
    icon: ArrowRightLeft,
    title: "Platform Migrations",
    description:
      "Seamless migrations from legacy platforms to Shopify and Shopify Plus. We handle data, design, and integrations — zero downtime, zero headaches.",
  },
  {
    icon: Gauge,
    title: "Performance & Scaling",
    description:
      "Optimize storefront speed, handle high-traffic events, and architect your infrastructure for reliable growth — from thousands to millions of orders.",
  },
  {
    icon: Lightbulb,
    title: "Strategy Consulting",
    description:
      "Unified commerce strategy that aligns your online, retail, and wholesale channels. We help you plan, prioritize, and execute with confidence.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Custom dashboards and analytics that surface what matters. Track performance, customer behavior, and ROI across every channel in real time.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-light" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-16 sm:mb-20"
        >
          <span className="section-label">What We Do</span>
          <h2 className="text-h2-display text-neutral-900 max-w-2xl text-balance">
            End-to-end Shopify expertise
          </h2>
          <p className="text-neutral-500 text-body-lg max-w-2xl mt-6 leading-relaxed">
            We partner with retailers at every stage — from initial audit to
            full-scale unified commerce transformation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              transition={sectionTransition}
              className="group relative bg-white rounded-xl border border-neutral-200/60 p-8 lg:p-10
                hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.04]
                hover:-translate-y-1 transition-all duration-500 ease-out cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.04] flex items-center justify-center mb-6 group-hover:from-emerald-500/15 group-hover:to-emerald-500/[0.06] transition-all duration-500">
                <service.icon
                  className="w-6 h-6 text-emerald-500"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-neutral-500 leading-relaxed text-body-sm mb-6">
                {service.description}
              </p>
              <span className="text-label-sm text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto flex items-center gap-1.5">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
