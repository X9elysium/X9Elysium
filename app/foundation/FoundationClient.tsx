"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Users,
  Rocket,
} from "lucide-react";
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
import { pillarsData, rulesData } from "./data";

const pillarIcons = [TrendingUp, ShieldCheck, Sparkles, Users, Rocket];
const pillars = pillarsData.map((p, i) => ({ ...p, icon: pillarIcons[i] }));
const rules = rulesData;

const manifesto = [
  "X9Elysium exists because most retailers are stuck — fragmented tech, slow stores, painful migrations, and agencies that vanish after launch.",
  "We exist to change that.",
  "We build the invisible commerce infrastructure that lets ambitious North American retailers scale with confidence — and joy.",
  "Every great brand deserves technology that matches its ambition.",
  "Every retailer ready to grow deserves a partner who takes full ownership and delivers measurable results.",
  "The future of commerce belongs to those who move fast, think clearly, and build with unbreakable responsibility.",
];

export default function FoundationClient() {
  const whyRef = useRef(null);
  const pillarsRef = useRef(null);
  const rulesRef = useRef(null);
  const promiseRef = useRef(null);

  const whyInView = useInView(whyRef, { once: true, margin: "-100px" });
  const pillarsInView = useInView(pillarsRef, { once: true, margin: "-100px" });
  const rulesInView = useInView(rulesRef, { once: true, margin: "-100px" });
  const promiseInView = useInView(promiseRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white dark:bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-15%] right-[-10%] w-[640px] h-[640px] bg-emerald-500/[0.08] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[520px] h-[520px] bg-emerald-700/[0.05] rounded-full blur-[160px] pointer-events-none" />
          </div>

          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="section-container relative z-10 pt-[140px] pb-24 sm:pt-[160px] sm:pb-32"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                The Foundation
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              We don&apos;t fix Shopify stores.
              <br />
              <span className="text-gradient-emerald">
                We build commerce empires.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              The Why behind X9Elysium. The five pillars that guide every
              engagement. The ten rules we will not break — even when it costs us.
              This is who we are before we&apos;re who we work with.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-col sm:flex-row items-start gap-4 mt-12"
            >
              <a
                href="#pillars"
                className="btn-primary-light"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pillars")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                The Five Pillars
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/contact" className="btn-outline">
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Why (manifesto) ── */}
        <section className="section-light" ref={whyRef}>
          <div className="section-container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-12"
            >
              <span className="section-label">The Why</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Commerce should be the engine of dreams — not a source of stress.
              </h2>
              <p className="text-base text-neutral-500 dark:text-neutral-500 mt-6 leading-relaxed max-w-2xl">
                X9Elysium is a Shopify Plus consulting agency that builds{" "}
                <Link
                  href="/services"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4"
                >
                  commerce infrastructure
                </Link>{" "}
                for ambitious North American DTC and B2B retailers. The
                paragraphs below are why we get up in the morning.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={whyInView ? "visible" : "hidden"}
              className="flex flex-col gap-6"
            >
              {manifesto.map((line, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className={
                    i === 1 || i === 2
                      ? "text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white leading-snug tracking-tight"
                      : "text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed"
                  }
                >
                  {line}
                </motion.p>
              ))}

              <motion.div
                variants={fadeUp}
                transition={sectionTransition}
                className="pt-8 mt-4 border-t border-neutral-200 dark:border-white/[0.06]"
              >
                <p className="text-base text-neutral-500 dark:text-neutral-500 italic leading-relaxed">
                  In short: we turn serious retailers into unstoppable commerce
                  machines — so founders can get back to what they actually love.
                  Building products. Serving customers. Compounding a legacy.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Five Pillars ── */}
        <section id="pillars" className="section-dark" ref={pillarsRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20 max-w-3xl"
            >
              <span className="section-label">The Five Pillars</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Five non-negotiables. Every decision passes through them.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg mt-6 leading-relaxed">
                Engagements, hires, projects we accept, projects we walk away
                from — all judged against these five. If a choice fails any
                pillar, we don&apos;t make it.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={pillarsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pillars.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 lg:p-10 hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/[0.04] flex items-center justify-center">
                      <p.icon
                        className="w-6 h-6 text-emerald-500"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 tracking-wider">
                      {p.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium italic mb-4 leading-snug">
                    &ldquo;{p.aphorism}&rdquo;
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Ten Rules ── */}
        <section className="section-warm" ref={rulesRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={rulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20 max-w-3xl"
            >
              <span className="section-label">The Ten Rules</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Operating principles we will not break.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg mt-6 leading-relaxed">
                The pillars are who we are. These are how we behave on a Tuesday
                afternoon when nobody&apos;s watching.
              </p>
            </motion.div>

            <motion.ol
              variants={staggerContainer}
              initial="hidden"
              animate={rulesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-white/[0.06] rounded-2xl overflow-hidden"
            >
              {rules.map((rule, i) => (
                <motion.li
                  key={rule.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="bg-[#f7f5f2] dark:bg-neutral-900 p-8 lg:p-10 flex gap-5 hover:bg-white dark:hover:bg-neutral-900/60 transition-colors duration-300"
                >
                  <span className="flex-shrink-0 text-3xl sm:text-4xl font-light text-emerald-500 tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {rule.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ── The Promise ── */}
        <section
          ref={promiseRef}
          className="bg-neutral-950 dark:bg-black py-24 sm:py-32"
        >
          <div className="section-container max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={promiseInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: smoothEase }}
            >
              <span className="text-label font-semibold uppercase tracking-[0.2em] text-emerald-500 mb-6 block">
                The X9Elysium Promise
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white text-balance leading-tight tracking-tight">
                If you&apos;re ambitious enough to build a commerce empire,
                X9Elysium will be the partner who refuses to let it fail.
              </h2>
              <p className="text-neutral-400 text-body-lg mt-10 leading-relaxed max-w-xl mx-auto">
                That&apos;s the whole pitch. No clever tagline. No agency theatre.
                Just a foundation we&apos;ve agreed to live by — and clients
                we&apos;d work with for the next twenty years.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                <Link href="/contact" className="btn-accent">
                  Book a Strategy Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/work"
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  See the work →
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  Our services →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
