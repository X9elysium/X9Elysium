"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Eye, TrendingUp, Linkedin } from "lucide-react";
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

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  image?: string;
  linkedin: string;
};

const team: TeamMember[] = [
  {
    name: "Darshan Patel",
    role: "Founder & Full-Stack Lead",
    bio: "Eight years building Shopify stores, custom apps, and headless storefronts across React, Next.js, Node, GCP, and AWS. Darshan owns strategy, architecture, and client delivery — and is the operator's voice inside every brief.",
    initials: "DP",
    linkedin: "https://www.linkedin.com/in/dpatel99/",
  },
  {
    name: "Adhvait Jadav",
    role: "Full-Stack Lead",
    bio: "Eight years across Shopify, full-stack web, and e-commerce platforms. Adhvait leads delivery on Hydrogen storefronts, custom apps, and back-end integrations across Node, PHP, and SQL — and currently works inside Shopify Support, giving X9Elysium an insider's view of merchant pain points.",
    initials: "AJ",
    linkedin: "https://www.linkedin.com/in/adhvaitjadav/",
  },
];

const stats = [
  { value: "8+ yrs", label: "Combined Experience" },
  { value: "30+", label: "Stores Shipped" },
  { value: "$5M+", label: "GMV Managed" },
  { value: "95%", label: "Client Retention" },
];

const certifications = [
  "Shopify Partner",
  "AWS Certified",
  "Google Ads Certified",
];

export default function AboutClient() {
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
              Two senior builders.
              <br />
              <span className="text-gradient-emerald">One Shopify studio.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              X9Elysium is a Shopify and unified-commerce consultancy run by two
              senior developers with eight years each in production e-commerce.
              Every brief is delivered by founders — no juniors, no offshore
              handoffs, no account-manager telephone game.
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
                Meet the Founders
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: smoothEase }}
              className="max-w-3xl"
            >
              <span className="section-label">Our Story</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance mb-8">
                We started where most clients are standing right now.
              </h2>
              <div className="flex flex-col gap-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  X9Elysium was founded in 2021 in the Greater Toronto Area by
                  Darshan Patel and Adhvait Jadav — two senior full-stack
                  developers who&apos;d each spent eight years inside production
                  e-commerce: Shopify stores, custom apps, headless storefronts,
                  and the unglamorous integrations that hold real retailers
                  together.
                </p>
                <p>
                  After a shared stretch at Thompson Rivers University and a
                  decade of being pulled into the same kinds of projects —
                  ambitious DTC and B2B retailers who&apos;d outgrown their first
                  agency and needed senior operators rather than junior
                  implementers — we made the partnership official.
                </p>
                <p>
                  Today we run a deliberately small studio. Every engagement is
                  touched by both of us. There are no account managers, no
                  offshore handoffs, and no juniors learning on your store. The
                  brief is always the same: build commerce infrastructure that
                  scales for years, not quarters.
                </p>
              </div>
            </motion.div>
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
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg mt-6 leading-relaxed max-w-2xl">
                The condensed version. The full set — five pillars, ten
                operating rules, and the Why behind X9Elysium — lives on the{" "}
                <Link
                  href="/foundation"
                  className="text-emerald-500 hover:text-emerald-400 underline-offset-4 hover:underline transition-colors"
                >
                  Foundation page
                </Link>
                .
              </p>
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
              <span className="section-label">The Founders</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Two senior operators. No layers in between.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Small by design. Senior by default. You work directly with the
                people writing the code and making the calls — not a sales rep
                who passes you down a chain.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={teamInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
            >
              {team.map((member) => (
                <motion.a
                  key={member.name}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="group relative glass-card p-8 text-center hover:border-emerald-500/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/[0.05] transition-all duration-500"
                >
                  {/* LinkedIn icon — appears on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" strokeWidth={1.75} />
                  </span>

                  <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden mb-6 ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-white dark:ring-offset-neutral-900 bg-gradient-to-br from-emerald-400/20 to-emerald-600/30">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                          {member.initials}
                        </span>
                      </div>
                    )}
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
                </motion.a>
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
                Credentialed on the platforms we build on
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
