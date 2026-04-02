"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { fadeUp, smoothEase } from "../lib/animations";

const caseStudies = [
  {
    tag: "Shopify Plus Migration",
    title: "Premium Fashion Retailer",
    metric: "40% revenue increase in Q1",
    bg: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
  },
  {
    tag: "Custom App Development",
    title: "DTC Health & Wellness",
    metric: "3x order processing speed",
    bg: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0a0a1a]",
  },
  {
    tag: "Unified Commerce Strategy",
    title: "Multi-Location Retail Chain",
    metric: "Omnichannel in 90 days",
    bg: "bg-gradient-to-br from-[#0d1f22] via-[#1a3a3a] to-[#0a1a1a]",
  },
  {
    tag: "Performance Optimization",
    title: "High-Volume Marketplace",
    metric: "Sub-second load times",
    bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917]",
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
          transition={{ duration: 0.6, ease: smoothEase }}
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
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[300px]"
        >
          {/* Large featured card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`group relative rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 ${caseStudies[0].bg} cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.05] to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
              <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                {caseStudies[0].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">
                {caseStudies[0].title}
              </h3>
              <p className="text-emerald-400/70 text-sm mb-4">
                {caseStudies[0].metric}
              </p>
              <div className="flex items-center overflow-hidden h-5">
                <ArrowRight className="w-5 h-5 text-emerald-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Wide card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`group relative rounded-2xl overflow-hidden lg:col-span-2 ${caseStudies[1].bg} cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.05] to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                {caseStudies[1].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
                {caseStudies[1].title}
              </h3>
              <p className="text-emerald-400/70 text-sm mb-4">
                {caseStudies[1].metric}
              </p>
              <div className="flex items-center overflow-hidden h-5">
                <ArrowRight className="w-5 h-5 text-emerald-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Small square cards */}
          {caseStudies.slice(2).map((study) => (
            <motion.div
              key={study.title}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`group relative rounded-2xl overflow-hidden lg:col-span-1 ${study.bg} cursor-pointer`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.05] to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                  {study.tag}
                </span>
                <h3 className="text-lg font-light text-white mb-2">
                  {study.title}
                </h3>
                <p className="text-emerald-400/70 text-sm mb-4">
                  {study.metric}
                </p>
                <div className="flex items-center overflow-hidden h-5">
                  <ArrowRight className="w-5 h-5 text-emerald-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
