"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Code2,
  Palette,
  Plug,
  Zap,
  ShieldCheck,
  Settings,
  Server,
  FileCode,
  ArrowRight,
  Check,
  ChevronRight,
  GitBranch,
  Lock,
  Gauge,
} from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import CTABanner from "../../components/CTABanner";
import { BookingButton } from "../../components/BookingButton";
import {
  fadeUp,
  fadeUpBlur,
  fadeIn,
  staggerContainer,
  heroStagger,
  smoothEase,
  sectionTransition,
} from "../../lib/animations";

const capabilities = [
  {
    icon: Code2,
    title: "Custom Plugin Development",
    description:
      "Bespoke WooCommerce plugins in PHP — booking flows, custom checkout logic, ERP/CRM bridges, subscription tweaks, and the long tail of business logic that doesn't fit a marketplace plugin.",
    deliverables: [
      "Custom PHP plugin development",
      "WooCommerce hooks + filters",
      "Composer-managed dependencies",
    ],
  },
  {
    icon: Palette,
    title: "Theme & Storefront Builds",
    description:
      "Custom child themes on top of Storefront, Astra, GeneratePress, or fully bespoke. Block-editor + FSE patterns for content teams that want to ship without a developer in the loop.",
    deliverables: [
      "Custom child theme builds",
      "Block / FSE pattern library",
      "Page-builder hand-off (Elementor, Bricks)",
    ],
  },
  {
    icon: Plug,
    title: "Integrations & API Work",
    description:
      "Connectors for ERP, accounting, fulfillment, marketing, and PIM. WooCommerce REST + WP REST API, plus webhook + queue patterns for high-volume sync without timing out cron.",
    deliverables: [
      "REST API + webhook integrations",
      "ERP / accounting / 3PL connectors",
      "Queue-backed background jobs",
    ],
  },
  {
    icon: Zap,
    title: "Performance & Caching",
    description:
      "Object caching, full-page cache rules tuned to WooCommerce, query profiling, and CDN strategy. Slow Woo stores are almost always fixable — we just have to find what's blocking the request.",
    deliverables: [
      "Query profiling + index review",
      "Object + page cache strategy",
      "CDN + image optimization",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security & Hardening",
    description:
      "WordPress + WooCommerce hardening — patch hygiene, plugin audit, file-permission lockdown, brute-force defense, PCI-friendly checkout flow, and audited admin access.",
    deliverables: [
      "Plugin + dependency audit",
      "Hardening + WAF configuration",
      "PCI-friendly checkout review",
    ],
  },
  {
    icon: Settings,
    title: "Migrations & Replatforms",
    description:
      "Migrations from Squarespace, Wix, Magento, or legacy Woo builds — and out of Woo to Shopify when the back office is the actual bottleneck. We make the call honestly, not by the hour.",
    deliverables: [
      "Data + content + media migration",
      "URL + redirect strategy",
      "Zero-downtime cutover plan",
    ],
  },
  {
    icon: Server,
    title: "Hosting & DevOps",
    description:
      "Managed cloud setups on Cloudways, Kinsta, WP Engine, or self-hosted on a VPS. Git-driven deploys, staging environments, and monitoring that actually pages someone when checkout breaks.",
    deliverables: [
      "Managed hosting selection + setup",
      "Git deploy + staging env",
      "Uptime + checkout monitoring",
    ],
  },
  {
    icon: FileCode,
    title: "Headless WooCommerce",
    description:
      "Next.js or Astro front-ends on top of the WooCommerce + WordPress backend via the Store API. For brands that want Shopify-like front-end speed without leaving the WP ecosystem.",
    deliverables: [
      "Next.js / Astro storefront",
      "Store API + GraphQL bridge",
      "ISR + edge caching strategy",
    ],
  },
];

const phases = [
  {
    number: "01",
    title: "Scope",
    duration: "Wk 1",
    description:
      "Lightweight discovery — current stack, plugin audit, performance baseline, and a written scope with fixed price. Small clients shouldn't be priced into a six-week discovery.",
  },
  {
    number: "02",
    title: "Build",
    duration: "Wk 1–6",
    description:
      "Build in Git on a staging environment. Code reviewed, plugins kept lean, custom logic in a single site-specific plugin so the next developer can read it in an hour.",
  },
  {
    number: "03",
    title: "Launch",
    duration: "Wk 5–7",
    description:
      "QA pass, redirect map, DNS cutover, and post-launch smoke test. We monitor checkout for 72 hours after go-live and triage anything that surfaces.",
  },
  {
    number: "04",
    title: "Support",
    duration: "Optional",
    description:
      "Optional monthly retainer for plugin updates, security patches, performance tuning, and small feature work. Or a clean handoff with documentation if your team takes it from here.",
  },
];

const stack = {
  Core: ["WordPress", "WooCommerce", "PHP 8.x", "MySQL / MariaDB"],
  "Frontend / Headless": ["Next.js", "Astro", "Block Editor (FSE)", "Tailwind CSS", "Alpine.js"],
  Hosting: ["Cloudways", "Kinsta", "WP Engine", "DigitalOcean", "Cloudflare"],
  Integrations: [
    "Stripe",
    "PayPal",
    "Klaviyo",
    "Mailchimp",
    "ShipStation",
    "Zapier",
    "QuickBooks",
    "Xero",
  ],
};

const fits = [
  {
    title: "Founders & Small Brands",
    description:
      "Stores between $0 and $1M ARR where the priority is full ownership, low monthly cost, and the freedom to customize anything. Woo + a managed host beats the platform tax — when it's done well.",
  },
  {
    title: "Content-Led Commerce",
    description:
      "Brands where editorial, blog, and SEO matter as much as the cart. WordPress is still the strongest content surface on the web; Woo bolts the storefront onto that strength.",
  },
  {
    title: "Custom-Logic Operators",
    description:
      "Booking platforms, marketplaces, regulated products, B2B catalogs, configurators — anywhere the standard Shopify checkout doesn't bend the way the business needs. PHP gives us full control.",
  },
];

const engagements = [
  {
    title: "Quick Build",
    tagline: "Fixed scope, 2–4 weeks",
    description:
      "A small, focused engagement — theme build, store launch, plugin development, or migration in. Fixed price, fixed timeline, zero scope creep.",
    features: [
      "Discovery + fixed scope",
      "Theme or plugin delivery",
      "QA + launch checklist",
      "30-day bug-fix window",
    ],
    cta: "Start a Quick Build",
    featured: false,
  },
  {
    title: "Custom Build",
    tagline: "Bespoke development",
    description:
      "A bigger custom WooCommerce build — multi-vendor, headless front-end, complex integrations, or a full migration with redirect strategy and content backfill.",
    features: [
      "Custom plugin + theme dev",
      "Integrations + headless front-end",
      "Full migration + redirects",
      "60-day post-launch support",
    ],
    cta: "Plan a Custom Build",
    featured: true,
  },
  {
    title: "Care Plan",
    tagline: "Monthly retainer",
    description:
      "Ongoing monthly support — security patches, plugin updates, performance tuning, backups, and a small block of dev hours for feature work and changes.",
    features: [
      "Plugin + WP core updates",
      "Security + uptime monitoring",
      "Monthly dev hours block",
      "Quarterly performance review",
    ],
    cta: "Become a Care Client",
    featured: false,
  },
];

export default function WooCommerceClient() {
  const heroRef = useRef(null);
  const fitsRef = useRef(null);
  const capRef = useRef(null);
  const phaseRef = useRef(null);
  const stackRef = useRef(null);
  const engageRef = useRef(null);

  const fitsInView = useInView(fitsRef, { once: true, margin: "-100px" });
  const capInView = useInView(capRef, { once: true, margin: "-100px" });
  const phaseInView = useInView(phaseRef, { once: true, margin: "-100px" });
  const stackInView = useInView(stackRef, { once: true, margin: "-100px" });
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
                WooCommerce — Custom-Built, Founder-Led
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              Open-source flexibility.
              <br />
              <span className="text-gradient-emerald">Custom development. Full ownership.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              For founders, small brands, and operators who need WooCommerce done
              right — custom plugins, theme builds, performance tuning, headless
              front-ends, and migrations. No platform tax, no marketplace plugin
              sprawl, no junior devs.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-col sm:flex-row items-start gap-4 mt-12"
            >
              <BookingButton variant="accent" />
              <Link href="/contact" className="btn-outline">
                Talk to a Founder
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

        {/* ── Who Woo fits ── */}
        <section className="section-light" ref={fitsRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={fitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Who WooCommerce Fits</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                The right call when ownership and customization beat platform convenience
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We&apos;re a Shopify Plus shop first — we&apos;ll tell you when Shopify is
                the better call. But for the operators below, WooCommerce is the right
                tool, and most agencies won&apos;t build it well.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={fitsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {fits.map((fit) => (
                <motion.div
                  key={fit.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="bg-neutral-50 dark:bg-white/[0.04] rounded-xl border border-neutral-200/60 dark:border-white/[0.06] p-8 hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-500"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {fit.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-body-sm">
                    {fit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section className="section-dark" ref={capRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={capInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">What We Build</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Eight focus areas. One craft team. Real PHP.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We don&apos;t stack 40 marketplace plugins and call it a build. We write
                custom code, audit dependencies, and leave a codebase the next developer
                can read.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={capInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {capabilities.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="group relative glass-card p-6 lg:p-7 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.04] hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.04] flex items-center justify-center mb-5 group-hover:from-emerald-500/15 group-hover:to-emerald-500/[0.06] transition-all duration-500">
                    <c.icon className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2.5 tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm mb-5">
                    {c.description}
                  </p>
                  <ul className="flex flex-col gap-2 mt-auto">
                    {c.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Phases ── */}
        <section className="section-light" ref={phaseRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={phaseInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">How We Build</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                A four-phase process scaled for small teams
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Most Woo agencies overcharge small clients for the privilege of a slow,
                six-week discovery. Our process is leaner — fixed price, fixed scope,
                Git-driven, and shipped on schedule.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={phaseInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {phases.map((step, i) => (
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
                  {i < phases.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-emerald-500/20 z-10" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Stack ── */}
        <section className="section-dark" ref={stackRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={stackInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Our Stack</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Lean stack. Sensible defaults.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We pick boring tools that survive five years of iteration. The fewer
                moving parts on a small client&apos;s site, the lower their bill — every
                month, forever.
              </p>
            </motion.div>

            <div className="flex flex-col gap-10">
              {Object.entries(stack).map(([category, items], rowIdx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={stackInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: rowIdx * 0.12, ease: smoothEase }}
                >
                  <p className="text-label text-neutral-500 dark:text-neutral-500 uppercase tracking-[0.12em] mb-4 text-xs">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06] rounded-full hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stackInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="glass-card p-6">
                <GitBranch className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Git, not WP-FTP
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Every change reviewed in a pull request. Composer-managed plugins.
                  Database + media handled separately. The next developer can pick this
                  up cold.
                </p>
              </div>
              <div className="glass-card p-6">
                <Lock className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  PCI-friendly checkout
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Stripe Elements + WooPayments for SAQ-A scope. We never write code that
                  touches a raw card number — and we tell clients exactly which checkout
                  patterns introduce PCI scope.
                </p>
              </div>
              <div className="glass-card p-6">
                <Gauge className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Honest performance
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Slow Woo is almost always fixable — and almost always caused by a
                  plugin. We profile queries, audit autoload data, and tune cache rules
                  per template before we ever recommend a hosting upgrade.
                </p>
              </div>
            </motion.div>
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
                Three engagement shapes — small, custom, or ongoing
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We deliberately keep a small-client lane open. WooCommerce work doesn&apos;t
                always need a six-figure budget — sometimes it just needs a senior
                developer for two focused weeks.
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
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300"
                      >
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
