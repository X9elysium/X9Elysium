"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Search,
  Code2,
  ArrowRightLeft,
  Gauge,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Check,
  ChevronRight,
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

const services = [
  {
    icon: Search,
    title: "Store Optimization & Audits",
    description:
      "A thorough review of your store's performance, UX, conversion flow, and tech health. We surface what's costing you revenue and hand you a clear roadmap to fix it.",
    deliverables: [
      "50-point technical & UX audit",
      "Prioritized revenue roadmap",
      "90-minute findings debrief",
    ],
  },
  {
    icon: Code2,
    title: "Custom Apps & Integrations",
    description:
      "Purpose-built Shopify apps and seamless integrations connecting your ERP, PIM, OMS, and fulfillment stack — one ecosystem, zero duct tape.",
    deliverables: [
      "Custom Shopify app development",
      "ERP/OMS/PIM connector builds",
      "API documentation & handoff",
    ],
  },
  {
    icon: ArrowRightLeft,
    title: "Platform Migrations",
    description:
      "Moving from WooCommerce, Magento, or a legacy build to Shopify or Shopify Plus — zero downtime, full data integrity, and a smoother launch than you thought possible.",
    deliverables: [
      "Full data migration (products, orders, customers)",
      "Theme & feature parity audit",
      "Zero-downtime cutover plan",
    ],
  },
  {
    icon: Gauge,
    title: "Performance & Scaling",
    description:
      "Faster storefronts, resilient infrastructure, and architecture that handles peak traffic without breaking a sweat. Built for the long run.",
    deliverables: [
      "Core Web Vitals optimisation",
      "Headless / Hydrogen architecture",
      "Load testing & CDN strategy",
    ],
  },
  {
    icon: Lightbulb,
    title: "Strategy Consulting",
    description:
      "A unified view of your online, retail, and wholesale channels — aligned around real business goals. We help you cut through the noise and execute with precision.",
    deliverables: [
      "Omnichannel commerce roadmap",
      "Tech-stack selection & scoring",
      "Stakeholder workshop facilitation",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Custom dashboards that surface the metrics that matter. Revenue, retention, order velocity — tracked in real time, across every channel.",
    deliverables: [
      "Custom GA4 / Klaviyo dashboards",
      "Cross-channel attribution model",
      "Monthly performance review cadence",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    duration: "Wk 1–2",
    description:
      "Deep audit of your tech stack, customer journey, and revenue leaks. Stakeholder sessions to align on goals and constraints.",
  },
  {
    number: "02",
    title: "Strategize",
    duration: "Wk 2–3",
    description:
      "Architecture decisions, prioritised roadmap, and risk review. You get a clear, costed scope before a single line of code is written.",
  },
  {
    number: "03",
    title: "Implement",
    duration: "Wk 3–10",
    description:
      "Agile sprints with weekly demos. Staging environment, QA gates, and your team looped in at every milestone.",
  },
  {
    number: "04",
    title: "Optimize",
    duration: "Ongoing",
    description:
      "Post-launch monitoring, A/B testing, and continuous iteration. We stay in the trenches with you as you scale.",
  },
];

const techStack = {
  Platforms: ["Shopify", "Shopify Plus", "Hydrogen (Headless)", "Oxygen", "Shopify POS"],
  Frontend: ["React", "Next.js", "Remix", "Tailwind CSS", "TypeScript"],
  Integrations: ["Klaviyo", "Gorgias", "ReCharge", "Yotpo", "ShipBob", "NetSuite", "Contentful", "Sanity"],
};

const engagements = [
  {
    title: "Discovery Audit",
    tagline: "One-time engagement",
    description: "A comprehensive audit of your current store — identifying every revenue leak, UX gap, and tech debt item.",
    features: [
      "50-point store audit",
      "Prioritised revenue roadmap",
      "60-min findings debrief",
      "Written action plan",
    ],
    cta: "Book an Audit",
    featured: false,
  },
  {
    title: "Project Engagement",
    tagline: "Fixed-scope build",
    description: "A defined project — migration, custom app, or full redesign — delivered on time, with QA sign-off and handover docs.",
    features: [
      "Full scoped delivery",
      "Weekly sprint demos",
      "30-day post-launch support",
      "QA sign-off & documentation",
    ],
    cta: "Start a Project",
    featured: true,
  },
  {
    title: "Retained Partner",
    tagline: "Ongoing monthly",
    description: "Your dedicated Shopify team — embedded in your roadmap, shipping weekly, and available when it matters most.",
    features: [
      "Dedicated dev & strategy team",
      "Weekly sprint cadence",
      "Priority SLA (< 4hr response)",
      "Quarterly business reviews",
    ],
    cta: "Become a Partner",
    featured: false,
  },
];

export default function ServicesPage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const techRef = useRef(null);
  const engageRef = useRef(null);

  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const techInView = useInView(techRef, { once: true, margin: "-100px" });
  const engageInView = useInView(engageRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-black"
        >
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
                End-to-End Shopify Commerce
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              We architect the systems
              <br />
              <span className="text-gradient-emerald">ambitious retailers scale on.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              Six integrated disciplines. One team. Whether you need a rapid audit, a
              platform migration, or a full headless build — we have the expertise to
              take you from where you are to where you need to be.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-col sm:flex-row items-start gap-4 mt-12"
            >
              <Link href="/contact" className="btn-accent">
                Book a Strategy Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/work" className="btn-outline">
                View Our Work
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
          >
            <div className="w-6 h-10 rounded-full border border-neutral-300 dark:border-white/20 flex justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-neutral-400 dark:bg-white/40" />
            </div>
          </motion.div>
        </section>

        {/* ── Services Grid ── */}
        <section className="section-light" ref={servicesRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">What We Do</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Six disciplines, one integrated team
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We partner with retailers at every stage — from your first audit to a
                fully unified commerce operation.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={servicesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
            >
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="group relative bg-neutral-50 dark:bg-white/[0.04] rounded-xl border border-neutral-200/60 dark:border-white/[0.06] p-8 lg:p-10
                    hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.04]
                    hover:-translate-y-1 transition-all duration-500 ease-out"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.04] flex items-center justify-center mb-6 group-hover:from-emerald-500/15 group-hover:to-emerald-500/[0.06] transition-all duration-500">
                    <service.icon className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-body-sm mb-6">
                    {service.description}
                  </p>
                  <ul className="flex flex-col gap-2 mt-auto">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="section-dark" ref={processRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={processInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Our Process</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                The Elysium Method
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Every engagement follows a proven four-phase framework built to
                reduce risk, accelerate delivery, and compound results over time.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={processInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  transition={{ ...sectionTransition, delay: i * 0.1 }}
                  className="relative glass-card p-8 hover:border-emerald-500/15 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-4xl font-light text-emerald-500/30 leading-none select-none">
                      {step.number}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-emerald-500/20 z-10" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="section-light" ref={techRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={techInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Our Stack</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Best-in-class tools for every layer
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We work with the leading platforms, frameworks, and integrations in
                modern commerce — and we know which combination is right for your stage.
              </p>
            </motion.div>

            <div className="flex flex-col gap-10">
              {Object.entries(techStack).map(([category, items], rowIdx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={techInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: rowIdx * 0.12, ease: smoothEase }}
                >
                  <p className="text-label text-neutral-500 dark:text-neutral-500 uppercase tracking-[0.12em] mb-4 text-xs">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300
                          bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]
                          rounded-full hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400
                          transition-all duration-300 cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Engagement Models ── */}
        <section className="section-warm" ref={engageRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={engageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">How We Engage</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Pick the right model for your stage
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Whether you need a fast pulse-check or a long-term partner, there&apos;s
                an engagement model built for your situation.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={engageInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {engagements.map((eng) => (
                <motion.div
                  key={eng.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className={`relative rounded-2xl p-8 lg:p-10 flex flex-col transition-all duration-500 ${
                    eng.featured
                      ? "bg-white dark:bg-neutral-900 border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/[0.06] hover:-translate-y-1"
                      : "glass-card hover:border-emerald-500/15 hover:-translate-y-1"
                  }`}
                >
                  {eng.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-emerald-500 text-white text-[11px] font-semibold uppercase tracking-wider rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {eng.tagline}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {eng.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8">
                    {eng.description}
                  </p>

                  <ul className="flex flex-col gap-3 mb-10 flex-grow">
                    {eng.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={eng.featured ? "btn-accent" : "btn-outline"}
                  >
                    {eng.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
