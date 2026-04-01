"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const caseStudies = [
  {
    tag: "Shopify Plus Migration",
    title: "Premium Fashion Retailer",
    metric: "40% revenue increase in Q1",
    bg: "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]",
  },
  {
    tag: "Custom App Development",
    title: "DTC Health & Wellness",
    metric: "3x order processing speed",
    bg: "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
  },
  {
    tag: "Unified Commerce Strategy",
    title: "Multi-Location Retail Chain",
    metric: "Omnichannel in 90 days",
    bg: "bg-gradient-to-br from-[#0f2027] to-[#203a43]",
  },
  {
    tag: "Performance Optimization",
    title: "High-Volume Marketplace",
    metric: "Sub-second load times",
    bg: "bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a]",
  },
];

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="section-dark" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <span className="section-label">Our Work</span>
          <h2 className="text-h2-display text-white max-w-3xl text-balance">
            Projects that deliver measurable impact
          </h2>
        </motion.div>

        {/* Asymmetric Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[280px]"
        >
          {/* Large featured card — spans 2 cols + 2 rows */}
          <div
            className={`group relative rounded-[4px] overflow-hidden lg:col-span-2 lg:row-span-2 ${caseStudies[0].bg} cursor-pointer`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#10b981] mb-3">
                {caseStudies[0].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">
                {caseStudies[0].title}
              </h3>
              <p className="text-[#9b9b9b] text-sm mb-4">
                {caseStudies[0].metric}
              </p>
              <div className="flex items-center overflow-hidden h-5">
                <ArrowRight className="w-5 h-5 text-[#10b981] transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Wide card — spans 2 cols */}
          <div
            className={`group relative rounded-[4px] overflow-hidden lg:col-span-2 ${caseStudies[1].bg} cursor-pointer`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#10b981] mb-3">
                {caseStudies[1].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
                {caseStudies[1].title}
              </h3>
              <p className="text-[#9b9b9b] text-sm mb-4">
                {caseStudies[1].metric}
              </p>
              <div className="flex items-center overflow-hidden h-5">
                <ArrowRight className="w-5 h-5 text-[#10b981] transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Small square cards */}
          {caseStudies.slice(2).map((study) => (
            <div
              key={study.title}
              className={`group relative rounded-[4px] overflow-hidden lg:col-span-1 ${study.bg} cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#10b981] mb-3">
                  {study.tag}
                </span>
                <h3 className="text-lg font-light text-white mb-2">
                  {study.title}
                </h3>
                <p className="text-[#9b9b9b] text-sm mb-4">{study.metric}</p>
                <div className="flex items-center overflow-hidden h-5">
                  <ArrowRight className="w-5 h-5 text-[#10b981] transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
