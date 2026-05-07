"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

const principles = [
  {
    title: "Named references, on request.",
    body:
      "Most of the work runs under NDA. We don't fabricate anonymized quotes to fill a section. Tell us your shape — DTC, B2B, multi-location — and we'll route you to the founders who can vouch for the specific surface.",
  },
  {
    title: "Under-claim. Always.",
    body:
      "If we can't prove a number to a board on a Tuesday morning, it doesn't go on the homepage. Ranges over averages. Directional over decimal. The number we don't ship is usually the one we'd most want to.",
  },
  {
    title: "The brief lives forever.",
    body:
      "Every engagement is touched by both founders, from kickoff through to post-launch. There is no junior cohort, no offshore handoff, no account-manager telephone game. The same two people you meet in week one are the same two people fixing the regression in month nine.",
  },
];
export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white py-20 sm:py-28 lg:py-32 overflow-hidden"
      ref={ref}
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="section-label">How we talk about clients</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6">
            No invented quotes. No invented numbers.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            Most of our work runs under NDA. We&apos;d rather under-claim than
            stage a testimonial section. Three operating principles instead.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {principles.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              transition={sectionTransition}
              className="glass-card p-8 sm:p-10 flex flex-col hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/[0.03] transition-all duration-500"
            >
              <span className="text-5xl font-serif text-emerald-500/20 leading-none mb-4 block select-none">
                §
              </span>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                {p.title}
              </h3>
              <p className="text-neutral-700 dark:text-white/80 leading-relaxed text-sm">
                {p.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
          className="mt-12 text-center"
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
  );
}
