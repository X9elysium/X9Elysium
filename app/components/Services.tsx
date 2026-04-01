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
} from "lucide-react";

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
    <section id="services" className="relative py-28 sm:py-32" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-sm font-semibold text-teal-400 tracking-[0.2em] uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            End-to-end Shopify expertise
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We partner with retailers at every stage — from initial audit to
            full-scale unified commerce transformation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 cursor-default"
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-teal-500/[0.04]" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-teal-500/15 flex items-center justify-center mb-6 group-hover:from-indigo-500/25 group-hover:to-teal-500/25 transition-all duration-500">
                  <service.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
