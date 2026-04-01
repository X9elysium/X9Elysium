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
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <span className="section-label">What We Do</span>
          <h2 className="text-h2-display text-[#151515] max-w-2xl text-balance">
            End-to-end Shopify expertise
          </h2>
          <p className="text-[#9b9b9b] text-lg max-w-2xl mt-6 leading-relaxed">
            We partner with retailers at every stage — from initial audit to
            full-scale unified commerce transformation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-white rounded-[4px] border border-[#cccccc]/30 p-8 hover:border-[#cccccc]/60 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-[4px] bg-[#10b981]/10 flex items-center justify-center mb-6">
                <service.icon className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-medium text-[#151515] mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-[#9b9b9b] leading-relaxed text-sm mb-6">
                {service.description}
              </p>
              <div className="flex items-center overflow-hidden h-5">
                <ArrowRight className="w-5 h-5 text-[#10b981] transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
