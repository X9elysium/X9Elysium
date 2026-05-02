"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CTABanner from "../components/CTABanner";
import {
  fadeUp,
  fadeUpBlur,
  fadeIn,
  staggerContainer,
  heroStagger,
  smoothEase,
  sectionTransition,
} from "../lib/animations";

const categories = [
  "All",
  "Platform Migration",
  "Custom Apps",
  "Headless / Hydrogen",
  "Performance",
  "Unified Commerce",
];

const projects = [
  {
    id: 1,
    category: "Platform Migration",
    tag: "Shopify Plus Migration",
    title: "Premium Fashion Retailer",
    description:
      "Full migration from Magento 2 to Shopify Plus — 80k SKUs, custom ERP sync, and a bespoke theme that launched on time.",
    metric: "+40% Revenue in Q1",
    bg: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    large: true,
  },
  {
    id: 2,
    category: "Custom Apps",
    tag: "Custom App Development",
    title: "DTC Health & Wellness",
    description:
      "Subscription engine, loyalty programme, and a custom OMS integration — built as a single unified Shopify app.",
    metric: "3× Faster Order Processing",
    bg: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0a0a1a]",
    large: false,
  },
  {
    id: 3,
    category: "Unified Commerce",
    tag: "Unified Commerce Build",
    title: "Multi-Location Retail Chain",
    description:
      "Shopify POS + online + wholesale consolidated into one back-end. Three channels, one inventory source of truth.",
    metric: "Omnichannel live in 90 days",
    bg: "bg-gradient-to-br from-[#0d1f22] via-[#1a3a3a] to-[#0a1a1a]",
    large: false,
  },
  {
    id: 4,
    category: "Performance",
    tag: "Performance Overhaul",
    title: "High-Volume Marketplace",
    description:
      "Hydrogen headless rebuild, image pipeline optimisation, and Edge delivery. LCP dropped from 5.8s to 0.9s.",
    metric: "Sub-1s load time achieved",
    bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917]",
    large: false,
  },
  {
    id: 5,
    category: "Headless / Hydrogen",
    tag: "Headless Storefront",
    title: "Luxury Lifestyle Brand",
    description:
      "Shopify Hydrogen + Sanity CMS: editorial-grade content with commerce performance. Fully server-rendered, edge-deployed.",
    metric: "98 Lighthouse score",
    bg: "bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827]",
    large: false,
  },
  {
    id: 6,
    category: "Custom Apps",
    tag: "B2B Portal",
    title: "Industrial Wholesale Co.",
    description:
      "Custom B2B customer portal with tiered pricing, quote management, and net-terms billing integrated with NetSuite.",
    metric: "€2.1M B2B GMV in year one",
    bg: "bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#0a1628]",
    large: false,
  },
  {
    id: 7,
    category: "Platform Migration",
    tag: "WooCommerce → Shopify Plus",
    title: "Outdoor & Adventure Brand",
    description:
      "300k product catalogue, six years of order history, and a custom affiliate integration — migrated with zero data loss.",
    metric: "Zero downtime cutover",
    bg: "bg-gradient-to-br from-[#132212] via-[#1a3a1a] to-[#0d1a0d]",
    large: false,
  },
  {
    id: 8,
    category: "Unified Commerce",
    tag: "Omnichannel Integration",
    title: "Canadian Grocery Chain",
    description:
      "Click-and-collect, real-time local inventory, and loyalty points across 12 locations — all managed through a single Shopify admin.",
    metric: "12 locations unified",
    bg: "bg-gradient-to-br from-[#1a0f0a] via-[#2d1f14] to-[#1a0f0a]",
    large: false,
  },
];

const stats = [
  { value: "30+", label: "Stores Shipped" },
  { value: "$5M+", label: "GMV Managed" },
  { value: "95%", label: "Client Retention" },
  { value: "6", label: "Industries Served" },
];

const testimonials = [
  {
    quote:
      "X9Elysium transformed our Shopify store from a basic setup into a high-performing commerce platform. Revenue increased 40% in the first quarter after launch.",
    role: "Head of Ecommerce",
    company: "Premium fashion DTC",
    metric: "+40% revenue",
    initial: "F",
  },
  {
    quote:
      "The migration from our legacy platform was seamless. Every detail — data, design, integrations — handled without a single day of downtime.",
    role: "CTO",
    company: "Multi-brand apparel retailer",
    metric: "Zero downtime",
    initial: "A",
  },
  {
    quote:
      "Load times dropped from 6.2s to 1.8s. Conversion rate jumped 28% — the numbers speak for themselves.",
    role: "Founder & CEO",
    company: "Athletic & outdoor gear",
    metric: "1.8s load time",
    initial: "G",
  },
];

export default function WorkClient() {
  const [activeFilter, setActiveFilter] = useState("All");

  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const featured = filtered.find((p) => p.large) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-50 dark:bg-black pt-[140px] pb-20 sm:pt-[160px] sm:pb-24"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.05] rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-700/[0.03] rounded-full blur-[140px] pointer-events-none" />

          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="section-container relative z-10"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, ease: smoothEase }}
            >
              <span className="section-label">Our Work</span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight mt-2"
            >
              30+ stores.{" "}
              <span className="text-gradient-emerald">$5M+ GMV.</span>
              <br />
              Every brief, founder-delivered.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-6 leading-relaxed"
            >
              From headless storefronts to complex ERP integrations — every project
              is driven by measurable outcomes. Selected work below; named
              references available on request, with client permission.
            </motion.p>

            {/* Inline stats */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-wrap gap-x-10 gap-y-4 mt-12"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-3xl font-light text-neutral-900 dark:text-white tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Filter + Grid ── */}
        <section className="section-light" ref={gridRef}>
          <div className="section-container">
            {/* Filter bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="flex flex-wrap gap-2 mb-12"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === cat
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* Bento grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]"
              >
                {featured && (
                  <motion.div
                    layout
                    whileHover={{ scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`group relative rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 ${featured.bg} cursor-pointer`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.07] to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
                      <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                        {featured.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">
                        {featured.title}
                      </h3>
                      <p className="text-white/60 text-sm max-w-md mb-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {featured.description}
                      </p>
                      <p className="text-emerald-400/80 text-sm mb-4">{featured.metric}</p>
                      <div className="flex items-center overflow-hidden h-5">
                        <ArrowRight className="w-5 h-5 text-emerald-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {rest.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`group relative rounded-2xl overflow-hidden ${project.bg} cursor-pointer`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.07] to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-7">
                      <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-2">
                        {project.tag}
                      </span>
                      <h3 className="text-lg font-light text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-emerald-400/80 text-sm mb-3">{project.metric}</p>
                      <div className="flex items-center overflow-hidden h-5">
                        <ArrowRight className="w-4 h-4 text-emerald-400 transform -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section
          ref={statsRef}
          className="bg-neutral-950 dark:bg-black py-16 sm:py-20"
        >
          <div className="section-container">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden"
            >
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="bg-neutral-950 dark:bg-black px-8 py-10 text-center"
                >
                  <div className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-2">
                    {s.value}
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="section-light" ref={testimonialsRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16"
            >
              <span className="section-label">Client Stories</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                What our clients say
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={`${t.company}-${idx}`}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 flex flex-col hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/[0.03] transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {t.metric}
                    </span>
                  </div>

                  <span className="text-5xl font-serif text-emerald-500/20 leading-none mb-4 block select-none">
                    &ldquo;
                  </span>

                  <p className="text-neutral-700 dark:text-white/80 leading-relaxed text-base mb-8 flex-grow">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900">
                      {t.initial}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                        {t.role}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {t.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
