"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Users,
  Zap,
  Linkedin,
  MapPin,
  Mail,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  fadeUp,
  staggerContainer,
  smoothEase,
  sectionTransition,
} from "../lib/animations";

const strengths = [
  {
    icon: Sparkles,
    name: "Positivity",
    summary:
      "Contagious enthusiasm. Spots the good in people and projects, turns engagements into something worth showing up for.",
  },
  {
    icon: BarChart3,
    name: "Analytical",
    summary:
      "Data-driven and pattern-finding. Kills wishful thinking early, turns big visions into workable plans grounded in P&L reality.",
  },
  {
    icon: ShieldCheck,
    name: "Responsibility",
    summary:
      "Psychological ownership and ironclad ethics. Relentless follow-through — what gets promised gets shipped.",
  },
  {
    icon: Users,
    name: "Includer",
    summary:
      "Stretches the circle wider. Treats clients, vendors, and teammates as one family — the credo in action.",
  },
  {
    icon: Zap,
    name: "Activator",
    summary:
      "“When can we start?” Impatient for action, learns by doing, judges work by what actually ships.",
  },
];

const principles = [
  {
    title: "Two founders, every engagement.",
    body:
      "No juniors. No offshore handoffs. Both Darshan and Adhvait are hands-on through discovery, architecture, and delivery — that's the wedge, and it isn't softened.",
  },
  {
    title: "Under-claim policy.",
    body:
      "We don't publish revenue-lift numbers, anonymized testimonials, or invented case studies. If a metric isn't on the site, it doesn't exist. Named references are available with client permission.",
  },
  {
    title: "Action over decks.",
    body:
      "A working prototype beats a pitch deck. Most projects run 8–14 weeks; speed of execution is treated as the moat.",
  },
  {
    title: "Vasudhaiva Kutumbakam.",
    body:
      "“The world is one family.” Every engagement is a shared ledger of trust between people who depend on each other — read the full Foundation doc to see how it shows up in the work.",
  },
];

const founders = [
  {
    name: "Darshan Patel",
    role: "Founder & Full-Stack Lead",
    bio: "Eight years building Shopify stores, custom apps, and headless storefronts across React, Next.js, Node, GCP, and AWS. Owns strategy, architecture, and client delivery — and is the operator's voice inside every brief.",
    initials: "DP",
    linkedin: "https://www.linkedin.com/in/dpatel99/",
  },
  {
    name: "Adhvait Jadav",
    role: "Full-Stack Lead",
    bio: "Eight years across Shopify, full-stack web, and e-commerce platforms. Leads delivery on Hydrogen storefronts, custom apps, and back-end integrations — currently embedded inside Shopify Support, giving the agency an insider view of merchant pain points.",
    initials: "AJ",
    linkedin: "https://www.linkedin.com/in/adhvaitjadav/",
  },
];

const stats = [
  { value: "2022", label: "Founded" },
  { value: "8+ yrs", label: "Per Founder" },
  { value: "30+", label: "Stores Shipped" },
  { value: "95%", label: "Client Retention" },
];

const locations = [
  { city: "Mississauga, ON", label: "Headquarters" },
  { city: "Calgary, AB", label: "Western Canada" },
  { city: "Vancouver, BC", label: "Pacific" },
];

export default function IntroPage() {
  const foundersRef = useRef(null);
  const strengthsRef = useRef(null);
  const principlesRef = useRef(null);
  const closingRef = useRef(null);

  const foundersInView = useInView(foundersRef, {
    once: true,
    margin: "-100px",
  });
  const strengthsInView = useInView(strengthsRef, {
    once: true,
    margin: "-100px",
  });
  const principlesInView = useInView(principlesRef, {
    once: true,
    margin: "-100px",
  });
  const closingInView = useInView(closingRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" className="bg-white dark:bg-black">
        {/* Hero */}
        <section className="relative pt-[160px] sm:pt-[180px] pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smoothEase }}
            className="section-container relative z-10 text-center"
          >
            <span className="section-label inline-block">An Introduction</span>
            <h1 className="text-display font-light text-neutral-900 dark:text-white tracking-tight">
              The people behind
              <br />
              <span className="text-gradient-emerald">X9Elysium.</span>
            </h1>
            <p className="text-[1.125rem] leading-[1.75] text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-8">
              Founder-led Shopify Plus consulting from the Greater Toronto
              Area. Two senior builders, eight years each, every brief
              delivered by the people you hire. Rooted in the credo
              <span className="font-devanagari text-neutral-900 dark:text-white">
                {" "}वसुधैव कुटुम्बकम्{" "}
              </span>
              — the world is one family.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="bg-neutral-100/60 dark:bg-neutral-950/60 border-y border-neutral-200/60 dark:border-white/[0.04] py-12">
          <div className="section-container">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-200 dark:bg-white/[0.06] rounded-2xl overflow-hidden">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-neutral-950 p-6 sm:p-8 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders */}
        <section ref={foundersRef} className="py-20 sm:py-28 lg:py-32">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={foundersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="max-w-3xl mb-14 sm:mb-16"
            >
              <span className="section-label">The Founders</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6 tracking-tight">
                No juniors. No handoffs.
              </h2>
              <p className="text-[1.125rem] leading-[1.75] text-neutral-600 dark:text-neutral-400">
                Both founders work hands-on every engagement — discovery,
                architecture, and implementation. There are no account
                managers between the client and the people building.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={foundersInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {founders.map((f) => (
                <motion.div
                  key={f.name}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 group hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] transition-all duration-500"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-500/10 ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-white dark:ring-offset-neutral-950 flex items-center justify-center text-emerald-400 font-semibold tracking-tight">
                      {f.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                          {f.name}
                        </h3>
                        <a
                          href={f.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${f.name} on LinkedIn`}
                          className="text-neutral-500 hover:text-emerald-400 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-sm font-medium text-emerald-500 mb-4">
                        {f.role}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        {f.bio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/about" className="btn-accent">
                Read the full About
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/foundation" className="btn-outline">
                The Elysium Method
              </Link>
            </div>
          </div>
        </section>

        {/* CliftonStrengths */}
        <section
          ref={strengthsRef}
          className="bg-neutral-100/60 dark:bg-neutral-950/60 border-y border-neutral-200/60 dark:border-white/[0.04] py-20 sm:py-28 lg:py-32"
        >
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={strengthsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
            >
              <span className="section-label">How Darshan Operates</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6 tracking-tight">
                Five strengths, one operating system.
              </h2>
              <p className="text-[1.125rem] leading-[1.75] text-neutral-600 dark:text-neutral-400">
                Verified through Gallup&apos;s CliftonStrengths assessment.
                Optimistic visionary, rigorous thinker, dependable executor,
                team-unifier, action machine — the combination is what
                clients feel from the first call onward.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={strengthsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {strengths.map((s, i) => (
                <motion.div
                  key={s.name}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-8 group hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                      <s.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-neutral-500 font-mono">
                        0{i + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                        {s.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {s.summary}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Principles */}
        <section
          ref={principlesRef}
          className="py-20 sm:py-28 lg:py-32"
        >
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={principlesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="max-w-3xl mb-16 sm:mb-20"
            >
              <span className="section-label">What We Stand For</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6 tracking-tight">
                Principles, not pitches.
              </h2>
              <p className="text-[1.125rem] leading-[1.75] text-neutral-600 dark:text-neutral-400">
                Four things you&apos;ll feel from the first call. None are
                optional, and none are negotiable.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={principlesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-white/[0.06] rounded-2xl overflow-hidden"
            >
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="bg-white dark:bg-neutral-950 p-8 sm:p-10 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors duration-500"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-xs text-emerald-500 font-mono pt-1.5">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3 tracking-tight">
                        {p.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-[15px] leading-[1.7]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Locations + Contact */}
        <section
          ref={closingRef}
          className="relative bg-neutral-100/60 dark:bg-neutral-950 py-20 sm:py-28 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-white to-emerald-50/20 dark:from-emerald-950/40 dark:via-neutral-950 dark:to-emerald-900/20" />
            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.08] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </div>

          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={closingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <span className="section-label">Where We Are</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6 tracking-tight">
                Greater Toronto Area, serving CA &amp; US.
              </h2>
              <p className="text-[1.125rem] leading-[1.75] text-neutral-600 dark:text-neutral-400">
                Headquartered in Mississauga, with service coverage across
                Calgary and Vancouver — and clients across Canada and the
                United States.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={closingInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto"
            >
              {locations.map((loc) => (
                <motion.div
                  key={loc.city}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-neutral-900 dark:text-white font-medium mb-1">
                    {loc.city}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase tracking-[0.12em]">
                    {loc.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={closingInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: smoothEase,
              }}
              className="flex flex-col items-center gap-6"
            >
              <a
                href="mailto:darshan@x9elysium.com"
                className="inline-flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
                darshan@x9elysium.com
              </a>
              <Link href="/contact" className="btn-accent">
                Start the Conversation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
