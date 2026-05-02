"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Eye, TrendingUp } from "lucide-react";
import Image from "next/image";
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

const milestones = [
  { year: "2022", event: "Founded in Vancouver", detail: "Started as a two-person Shopify consultancy with a focus on DTC brands." },
  { year: "2023", event: "First Shopify Plus Client", detail: "Delivered a zero-downtime Magento migration for a 7-figure fashion retailer." },
  { year: "2024", event: "$10M GMV milestone", detail: "Crossed $10M in managed GMV across a portfolio of 30+ active stores." },
  { year: "2025", event: "Expanded to 3 cities", detail: "Opened offices in Calgary and Mississauga to serve clients coast to coast." },
];

const values = [
  {
    icon: Shield,
    title: "Outcomes First",
    description:
      "We measure every engagement by revenue moved, conversions gained, and costs saved — not by tickets closed or hours billed.",
  },
  {
    icon: Eye,
    title: "Radical Transparency",
    description:
      "You always know what we're building, why we're building it, and what it will cost. No surprises — ever.",
  },
  {
    icon: TrendingUp,
    title: "Long-term Thinking",
    description:
      "We build systems and relationships that outlast the initial engagement. Your growth in year three is part of the brief from day one.",
  },
];

const team = [
  {
    name: "Darshan Patel",
    role: "Founder & Ops Lead",
    bio: "Darshan spent years managing e-commerce operations before founding X9Elysium. He bridges the gap between business strategy and technical execution — ensuring every build delivers real commercial outcomes.",
    initials: "DP",
  },
  {
    name: "Adhvait Jadav",
    role: "Product Lead",
    bio: "Adhvait owns the product roadmap on every engagement. With a background in UX and systems design, he ensures what gets built is both technically sound and commercially purposeful.",
    initials: "AJ",
  },
  {
    name: "Sam Okaster",
    role: "Engineering Lead",
    bio: "Sam leads all technical delivery — from Hydrogen headless builds to complex third-party integrations. He has shipped over 40 Shopify projects and written more Liquid than he cares to admit.",
    initials: "SO",
  },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "$12M+", label: "GMV Managed" },
  { value: "98%", label: "Client Retention" },
  { value: "40%+", label: "Avg. Revenue Lift" },
];

const certifications = [
  "Shopify Partner",
  "Shopify Plus Partner",
  "Klaviyo Partner",
  "Google Analytics Certified",
  "Hydrogen Certified",
  "ReCharge Partner",
];

export default function AboutPage() {
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const statsRef = useRef(null);
  const certsRef = useRef(null);

  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const certsInView = useInView(certsRef, { once: true, margin: "-80px" });

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white dark:bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
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
                About X9Elysium
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              Built by operators,
              <br />
              <span className="text-gradient-emerald">for operators.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              We&apos;re a Shopify unified commerce consultancy founded by people who
              have managed the chaos of scaling e-commerce first-hand. We build what
              we wish we&apos;d had — and we partner with clients who expect more than
              a vendor.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-col sm:flex-row items-start gap-4 mt-12"
            >
              <a
                href="#team"
                className="btn-primary-light"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Meet the Team
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/contact" className="btn-outline">
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Our Story ── */}
        <section className="section-light" ref={storyRef}>
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left — prose */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: smoothEase }}
              >
                <span className="section-label">Our Story</span>
                <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-xl text-balance mb-8">
                  We started where most clients are standing right now.
                </h2>
                <div className="flex flex-col gap-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  <p>
                    X9Elysium was founded in Vancouver in 2022 by a team that had
                    spent years inside growing e-commerce brands — managing platforms,
                    fighting integrations, and watching agencies deliver beautiful
                    things that didn&apos;t actually move numbers.
                  </p>
                  <p>
                    We built the consultancy we wished existed: one that starts with
                    outcomes, is brutally honest about scope, and stays in the trenches
                    long enough to see the results compound.
                  </p>
                  <p>
                    Today we work with retailers across Canada and beyond — from
                    fast-growing DTC brands to multi-location retail chains going
                    headless. The brief is always the same: build commerce
                    infrastructure that scales.
                  </p>
                </div>
              </motion.div>

              {/* Right — timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={storyInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: smoothEase }}
                className="flex flex-col gap-0"
              >
                {milestones.map((m, i) => (
                  <div key={m.year} className="flex gap-6 relative">
                    {/* Vertical line */}
                    {i < milestones.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-neutral-200 dark:bg-white/[0.06]" />
                    )}
                    {/* Dot */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mt-1 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    {/* Content */}
                    <div className="pb-10">
                      <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                        {m.year}
                      </span>
                      <h4 className="text-base font-semibold text-neutral-900 dark:text-white mt-1 mb-1.5">
                        {m.event}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {m.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="section-dark" ref={valuesRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">What We Stand For</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Three principles that guide every engagement
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={valuesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 lg:p-10 hover:border-emerald-500/15 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.04] flex items-center justify-center mb-6">
                    <v.icon className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                    {v.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Team ── */}
        <section id="team" className="section-light" ref={teamRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">The Team</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                The people behind the work
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Small by design. Senior across the board. Every client works
                directly with decision-makers — never handed off to juniors.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={teamInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="group glass-card p-8 text-center hover:border-emerald-500/15 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden mb-6 ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-white dark:ring-offset-neutral-900">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                        {member.initials}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-500 text-sm font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </motion.div>
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

        {/* ── Certifications ── */}
        <section className="section-warm" ref={certsRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={certsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-12"
            >
              <span className="section-label">Certifications & Partners</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Recognised by the platforms we build on
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={certsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
              className="flex flex-wrap gap-3"
            >
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300
                    bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]
                    rounded-full hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400
                    transition-all duration-300 cursor-default shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {cert}
                </span>
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
