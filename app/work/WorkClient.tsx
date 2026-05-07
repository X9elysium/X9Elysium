"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    title: "Legacy → Plus, without launch panic",
    description:
      "Magento, WooCommerce, BigCommerce, or a custom build — moved to Shopify Plus with a real cutover plan. Catalog, redirects, customer history, payment tokens, and ERP sync all reconciled before DNS flips.",
    bg: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    large: true,
  },
  {
    id: 2,
    category: "Custom Apps",
    tag: "Custom App Development",
    title: "Subscription, OMS, and back-office wiring",
    description:
      "Purpose-built Shopify apps and integrations connecting OMS, ERP, PIM, and fulfillment. TypeScript, edge-deployed, owned by one team — no app-marketplace duct tape.",
    bg: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0a0a1a]",
    large: false,
  },
  {
    id: 3,
    category: "Unified Commerce",
    tag: "Unified Commerce Build",
    title: "POS + online + wholesale, one back-end",
    description:
      "Shopify POS, online store, and B2B portal consolidated. One inventory source of truth, click-and-collect across multiple locations, and a merchandiser who finally agrees with the developer on what a SKU is.",
    bg: "bg-gradient-to-br from-[#0d1f22] via-[#1a3a3a] to-[#0a1a1a]",
    large: false,
  },
  {
    id: 4,
    category: "Performance",
    tag: "Performance Overhaul",
    title: "Core Web Vitals without breaking the brand",
    description:
      "Image pipeline, third-party script audit, edge delivery, and theme refactor. The boring stuff that compounds into LCP and INP that pass — without throwing the design out.",
    bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917]",
    large: false,
  },
  {
    id: 5,
    category: "Headless / Hydrogen",
    tag: "Headless Storefront",
    title: "Hydrogen + a real CMS",
    description:
      "Shopify Hydrogen with Sanity, Contentful, or Storyblok — server-rendered, edge-deployed, and editorial-grade. The right call only when the math justifies the maintenance burden, and we will tell you when it doesn&apos;t.",
    bg: "bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827]",
    large: false,
  },
  {
    id: 6,
    category: "Custom Apps",
    tag: "B2B Portal",
    title: "B2B portals with tiered pricing and net terms",
    description:
      "Customer-specific catalogues, quote management, net-terms billing, and ERP integration. Built on Shopify B2B where it fits, custom where it doesn&apos;t.",
    bg: "bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#0a1628]",
    large: false,
  },
  {
    id: 7,
    category: "Platform Migration",
    tag: "WooCommerce → Shopify Plus",
    title: "WooCommerce → Plus, history intact",
    description:
      "Large catalogues, multi-year order history, and custom plugin behaviour migrated cleanly. Redirects mapped 1:1, SEO equity preserved, customers re-authenticated without a forced password reset.",
    bg: "bg-gradient-to-br from-[#132212] via-[#1a3a1a] to-[#0d1a0d]",
    large: false,
  },
  {
    id: 8,
    category: "Unified Commerce",
    tag: "Omnichannel Integration",
    title: "Multi-location retailers on one Shopify admin",
    description:
      "Click-and-collect, real-time local inventory, loyalty across stores, and a single Shopify admin that the regional manager can actually use on a Tuesday.",
    bg: "bg-gradient-to-br from-[#1a0f0a] via-[#2d1f14] to-[#1a0f0a]",
    large: false,
  },
];

const stats = [
  { value: "30+", label: "Stores Shipped" },
  { value: "8+ yrs", label: "Per-Founder Experience" },
  { value: "95%", label: "Client Retention" },
  { value: "2", label: "Founders on Every Brief" },
];

const principles = [
  {
    title: "We don&apos;t ship anonymized testimonials with invented metrics.",
    body:
      "Most of our work runs under NDA. The fastest way to verify our claims is to ask for a named reference — we&apos;ll route you to the founder of a store with the same shape as yours, and they&apos;ll tell you the unvarnished version.",
  },
  {
    title: "Specific numbers stay private until the client signs off.",
    body:
      "Conversion lifts, AOV moves, infrastructure cost reductions — we have them. We just don&apos;t put them in a hero unit until the client has reviewed the framing. It&apos;s slower. It&apos;s also why our clients refer us.",
  },
  {
    title: "Every brief is delivered by both founders.",
    body:
      "Discovery, architecture, and implementation. The same two people you meet in week one are the same two people patching the regression in month nine. No juniors, no offshore handoffs, no telephone game.",
  },
];

export default function WorkClient() {
  const [activeFilter, setActiveFilter] = useState("All");

  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const statsRef = useRef(null);
  const principlesRef = useRef(null);

  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const principlesInView = useInView(principlesRef, { once: true, margin: "-80px" });

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
              30+ stores shipped.{" "}
              <span className="text-gradient-emerald">Founder-delivered.</span>
              <br />
              Named references on request.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-6 leading-relaxed"
            >
              Most of our work runs under NDA. Below is the shape of the work
              we ship, not a gallery of anonymized client logos with invented
              metrics. Tell us your shape and we&apos;ll route you to a founder
              who can vouch for it.
            </motion.p>

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

        <section className="section-light" ref={gridRef}>
          <div className="section-container">
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
                    className={`group relative rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 ${featured.bg}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.07] to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
                      <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                        {featured.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-light text-white mb-3 max-w-md">
                        {featured.title}
                      </h3>
                      <p className="text-white/70 text-sm max-w-md leading-relaxed">
                        {featured.description}
                      </p>
                    </div>
                  </motion.div>
                )}

                {rest.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`group relative rounded-2xl overflow-hidden ${project.bg}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-700" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.07] to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-7">
                      <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-2">
                        {project.tag}
                      </span>
                      <h3 className="text-lg font-light text-white mb-2 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

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

        <section className="section-light" ref={principlesRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={principlesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 max-w-3xl"
            >
              <span className="section-label">How we talk about work</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                No invented quotes. No invented numbers.
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={principlesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {principles.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 flex flex-col"
                >
                  <span className="text-3xl font-serif text-emerald-500/30 leading-none mb-3 block select-none">
                    §
                  </span>
                  <h3
                    className="text-base font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight"
                    dangerouslySetInnerHTML={{ __html: p.title }}
                  />
                  <p
                    className="text-neutral-700 dark:text-white/80 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={principlesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
              className="mt-12"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
              >
                Ask for a named reference
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
