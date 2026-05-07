"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { smoothEase } from "../lib/animations";

const caseStudies = [
  {
    tag: "Shopify Plus Migration",
    title: "Legacy → Plus, without the launch panic",
    blurb:
      "Magento, WooCommerce, BigCommerce, or a custom build. Catalog, redirects, customer history, ERP — all moved under a real cutover plan.",
    bg: "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]",
  },
  {
    tag: "Custom App Development",
    title: "Subscriptions, OMS, ERP — the unglamorous wiring",
    blurb:
      "Purpose-built Shopify apps and integrations that hold the back-office together. Built in TypeScript, deployed on the edge, owned by one team.",
    bg: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0a0a1a]",
  },
  {
    tag: "Unified Commerce",
    title: "POS + online + wholesale, one source of truth",
    blurb:
      "Click-and-collect, real-time inventory across locations, B2B portals — built on Shopify so the merchandiser and the developer agree on what a SKU is.",
    bg: "bg-gradient-to-br from-[#0d1f22] via-[#1a3a3a] to-[#0a1a1a]",
  },
  {
    tag: "Performance & Headless",
    title: "Hydrogen storefronts, edge delivery, sub-2s LCP",
    blurb:
      "Re-architected for Core Web Vitals and editorial-grade content without giving up the Shopify back-end. Server components, image pipelines, and the boring stuff that ships.",
    bg: "bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917]",
  },
];

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="section-dark" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-16 sm:mb-20 max-w-3xl"
        >
          <span className="section-label">The shape of our work</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
            Four problem-shapes. One team behind every brief.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-body-lg mt-6 leading-relaxed">
            We don&apos;t list anonymized client logos with invented metrics.
            Below is the shape of work we ship. Named references and specifics
            on request, with client permission.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[300px]"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`group relative rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 ${caseStudies[0].bg}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/[0.05] to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-10">
              <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                {caseStudies[0].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-3 max-w-md">
                {caseStudies[0].title}
              </h3>
              <p className="text-white/60 text-sm max-w-md leading-relaxed mb-4">
                {caseStudies[0].blurb}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`group relative rounded-2xl overflow-hidden lg:col-span-2 ${caseStudies[1].bg}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                {caseStudies[1].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-3">
                {caseStudies[1].title}
              </h3>
              <p className="text-white/60 text-sm max-w-md leading-relaxed">
                {caseStudies[1].blurb}
              </p>
            </div>
          </motion.div>

          {caseStudies.slice(2).map((study) => (
            <motion.div
              key={study.title}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`group relative rounded-2xl overflow-hidden lg:col-span-1 ${study.bg}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <span className="text-label-sm uppercase tracking-[0.15em] text-emerald-400 mb-3">
                  {study.tag}
                </span>
                <h3 className="text-lg font-light text-white mb-2">
                  {study.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {study.blurb}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
          className="mt-12"
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            See how we scope each shape
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
