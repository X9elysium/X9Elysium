"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Boxes,
  Factory,
  Warehouse,
  Calculator,
  ShoppingCart,
  Users,
  Truck,
  ScanBarcode,
  ArrowRight,
  Check,
  ChevronRight,
  Layers,
  Plug,
  Database,
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

const modules = [
  {
    icon: ShoppingCart,
    title: "Odoo eCommerce & Website",
    description:
      "A storefront tied to live inventory, pricing, and customer records. No middleware, no sync lag, no double entry — the website reads from the same database that runs the business.",
    deliverables: [
      "Theme + page builder customization",
      "B2B portal with negotiated pricing",
      "Live inventory & pricing rules",
    ],
  },
  {
    icon: Warehouse,
    title: "Inventory & Warehouse",
    description:
      "Multi-warehouse, multi-location stock with serial / lot tracking, putaway and removal strategies, barcode-driven receiving, and replenishment rules that actually trigger on time.",
    deliverables: [
      "Multi-warehouse + transfer rules",
      "Barcode receiving & putaway",
      "Min/max + reordering automation",
    ],
  },
  {
    icon: Factory,
    title: "Manufacturing (MRP)",
    description:
      "BOMs, work orders, routings, and shop-floor tablets. Built for brands that produce in-house — kitting, sub-assemblies, batch production, and quality checks before stock goes live.",
    deliverables: [
      "BOMs, routings, work centers",
      "Shop-floor + quality control",
      "MRP scheduling + capacity planning",
    ],
  },
  {
    icon: Calculator,
    title: "Accounting & Finance",
    description:
      "Multi-currency, multi-company general ledger with bank feeds, automated reconciliation, and CRA-ready tax reporting for Canadian operators. No more QuickBooks duct tape.",
    deliverables: [
      "Multi-entity GL + consolidation",
      "Bank reconciliation automation",
      "Canadian / US tax compliance",
    ],
  },
  {
    icon: Truck,
    title: "Purchase & Procurement",
    description:
      "Vendor catalogs, purchase agreements, requisition flows, and three-way matching. Lead times feed straight into MRP so production scheduling is grounded in supply reality.",
    deliverables: [
      "Vendor pricelists + agreements",
      "RFQ + approval workflows",
      "Three-way invoice matching",
    ],
  },
  {
    icon: Users,
    title: "CRM & Sales",
    description:
      "Pipelines, quotation builder, e-sign, and subscription billing — all linked to the same customer record the warehouse and finance teams see. One source of truth, end to end.",
    deliverables: [
      "Pipeline + lead automation",
      "Quote → order → invoice flow",
      "Subscriptions + recurring billing",
    ],
  },
  {
    icon: ScanBarcode,
    title: "POS & Retail",
    description:
      "In-store POS that shares inventory, customers, and pricing with the website and back office. Cash control, gift cards, loyalty, and offline-resilient sessions for retail floors.",
    deliverables: [
      "Unified POS + eCommerce stock",
      "Loyalty + gift cards + promos",
      "Offline-mode store sessions",
    ],
  },
  {
    icon: Boxes,
    title: "Custom Modules & Integrations",
    description:
      "When the standard module isn't enough, we build the missing piece — custom modules in Python + XML, plus connectors to Shopify, Stripe, Klaviyo, ShipStation, NetSuite, and more.",
    deliverables: [
      "Custom Python / XML modules",
      "REST + XML-RPC integrations",
      "Migration from QuickBooks / Sage / NetSuite",
    ],
  },
];

const phases = [
  {
    number: "01",
    title: "Discover & Map",
    duration: "Wk 1–2",
    description:
      "Process mapping across sales, fulfillment, manufacturing, and finance. We document the way the business actually runs — not the tidy version on the org chart — so the Odoo build matches reality.",
  },
  {
    number: "02",
    title: "Configure & Customize",
    duration: "Wk 2–8",
    description:
      "Module-by-module configuration with weekly stakeholder demos. Custom modules built in Python + XML where standard Odoo falls short. Data model decisions logged and reviewed.",
  },
  {
    number: "03",
    title: "Migrate & Train",
    duration: "Wk 6–10",
    description:
      "Data migration from QuickBooks, Sage, NetSuite, or spreadsheets. Role-based training for ops, finance, and warehouse teams. Cutover dress rehearsal in staging before go-live.",
  },
  {
    number: "04",
    title: "Go-Live & Support",
    duration: "Ongoing",
    description:
      "Cutover weekend with founder coverage. 30-day hypercare, then ongoing optimization — module rollouts, custom dev, version upgrades. We stay in the trenches as the business scales.",
  },
];

const stack = {
  "Odoo Editions": ["Odoo Enterprise", "Odoo Community", "Odoo.sh", "Self-Hosted"],
  Languages: ["Python", "XML", "JavaScript (OWL)", "PostgreSQL", "QWeb"],
  Integrations: [
    "Shopify",
    "Stripe",
    "Klaviyo",
    "ShipStation",
    "NetSuite",
    "QuickBooks",
    "EasyPost",
    "Avalara",
  ],
};

const fits = [
  {
    title: "Manufacturers & Producers",
    description:
      "Brands that make their own product — apparel, food & beverage, cosmetics, hardware. Odoo MRP turns shop-floor chaos into structured BOMs, work orders, and capacity plans.",
  },
  {
    title: "Multi-Channel Retailers",
    description:
      "Operators running DTC + wholesale + retail on duct-taped systems. Odoo unifies stock, pricing, and customers across every channel — including a Shopify storefront connected via API if the front-end stays on Shopify.",
  },
  {
    title: "Distributors & Wholesalers",
    description:
      "B2B operators with vendor agreements, customer-specific pricing, and three-way matching. Odoo Purchase + Sales + Inventory replaces the typical Sage / QuickBooks / spreadsheet stack outright.",
  },
];

const engagements = [
  {
    title: "Discovery & Process Map",
    tagline: "Two-week engagement",
    description:
      "A focused mapping of your current ops, finance, and fulfillment flows — followed by a costed Odoo implementation roadmap. Fixed fee, no commitment to build.",
    features: [
      "Cross-team process workshops",
      "Module fit + gap analysis",
      "Costed implementation roadmap",
      "60-min findings debrief",
    ],
    cta: "Book Discovery",
    featured: false,
  },
  {
    title: "Full Implementation",
    tagline: "End-to-end build",
    description:
      "A complete Odoo implementation — configuration, custom modules, data migration, training, and cutover. Founder-delivered, weekly demos, written change log.",
    features: [
      "Module config + custom dev",
      "Data migration + cutover",
      "Role-based team training",
      "30-day post-launch hypercare",
    ],
    cta: "Start a Build",
    featured: true,
  },
  {
    title: "Odoo Support Retainer",
    tagline: "Ongoing partnership",
    description:
      "Your dedicated Odoo team for new modules, version upgrades, custom development, and operations support. Monthly retainer with priority SLA.",
    features: [
      "Custom module development",
      "Version upgrade management",
      "Priority SLA (< 4hr response)",
      "Quarterly business reviews",
    ],
    cta: "Become a Partner",
    featured: false,
  },
];

export default function OdooClient() {
  const heroRef = useRef(null);
  const fitsRef = useRef(null);
  const modulesRef = useRef(null);
  const phaseRef = useRef(null);
  const stackRef = useRef(null);
  const engageRef = useRef(null);

  const fitsInView = useInView(fitsRef, { once: true, margin: "-100px" });
  const modulesInView = useInView(modulesRef, { once: true, margin: "-100px" });
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
                Odoo ERP + Commerce — End-to-End
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpBlur}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-display font-light text-neutral-900 dark:text-white max-w-4xl text-balance tracking-tight"
            >
              When the back office is the bottleneck,
              <br />
              <span className="text-gradient-emerald">you don&apos;t need a new storefront — you need Odoo.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mt-8 leading-relaxed"
            >
              We implement Odoo end-to-end for manufacturers, distributors, and
              multi-channel retailers — eCommerce, inventory, manufacturing, accounting,
              POS, and CRM on one database. Founder-delivered. No reseller markup. No
              offshore build teams.
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

        {/* ── Who Odoo fits ── */}
        <section className="section-light" ref={fitsRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={fitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Who Odoo Fits</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Three operator profiles where Odoo wins outright
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Odoo is the right call when commerce, operations, and finance need to live
                in one database. If the bottleneck is the back office — not the storefront
                — Shopify alone won&apos;t fix it.
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

        {/* ── Modules ── */}
        <section className="section-dark" ref={modulesRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={modulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">What We Build</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Eight modules. One database. Zero duct tape.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We implement the Odoo modules your business actually needs — not a
                pre-packaged bundle — and build the custom pieces in Python + XML when
                standard Odoo falls short.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={modulesInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {modules.map((m) => (
                <motion.div
                  key={m.title}
                  variants={fadeUp}
                  transition={sectionTransition}
                  className="group relative glass-card p-6 lg:p-7 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.04] hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.04] flex items-center justify-center mb-5 group-hover:from-emerald-500/15 group-hover:to-emerald-500/[0.06] transition-all duration-500">
                    <m.icon className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2.5 tracking-tight">
                    {m.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm mb-5">
                    {m.description}
                  </p>
                  <ul className="flex flex-col gap-2 mt-auto">
                    {m.deliverables.map((d) => (
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

        {/* ── Implementation phases ── */}
        <section className="section-light" ref={phaseRef}>
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={phaseInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="mb-16 sm:mb-20"
            >
              <span className="section-label">Implementation Path</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                A four-phase implementation built around your operations, not Odoo&apos;s defaults
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Most failed Odoo implementations fail at discovery. We start by mapping
                the way the business actually runs — then configure Odoo to that, not the
                other way around.
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
              <span className="section-label">Editions & Integrations</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
                Edition-agnostic. Integration-ready.
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                We work across Enterprise, Community, Odoo.sh, and self-hosted — and ship
                the integrations most operators actually need on day one.
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
                <Layers className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Edition-agnostic
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Enterprise where the modules earn their keep, Community where they
                  don&apos;t. We&apos;ll tell you which fits — not upsell you.
                </p>
              </div>
              <div className="glass-card p-6">
                <Plug className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Shopify ↔ Odoo bridge
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Keep Shopify on the front-end, run Odoo as the operational backbone.
                  Inventory, customers, and orders sync near-real-time.
                </p>
              </div>
              <div className="glass-card p-6">
                <Database className="w-5 h-5 text-emerald-500 mb-4" strokeWidth={1.5} />
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Migration-ready
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Migrations from QuickBooks, Sage, NetSuite, SAP B1, and spreadsheet-
                  driven ops. Data integrity audited before cutover.
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
                Three ways to start
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-body-lg max-w-2xl mt-6 leading-relaxed">
                Map the path before you commit to a build. Most clients start with the
                Discovery engagement and graduate into a full implementation.
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
