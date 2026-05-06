import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import BlogCard from "../../blog/components/BlogCard";
import NewsletterCTA from "../../blog/components/NewsletterCTA";
import { BookingButton } from "../../components/BookingButton";
import { getAllPosts } from "../../lib/blog";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopify Plus Agency in Vancouver | X9Elysium",
  description:
    "Shopify Plus consulting and unified commerce for Vancouver and BC retailers — store audits, custom apps, platform migrations, and ongoing optimization across the Lower Mainland.",
  alternates: {
    canonical: "https://x9elysium.com/locations/vancouver",
  },
  openGraph: {
    title: "Shopify Plus Agency in Vancouver | X9Elysium",
    description:
      "Shopify Plus consulting for Vancouver and BC retailers — audits, custom apps, migrations, and unified commerce across the Lower Mainland.",
    type: "website",
    url: "https://x9elysium.com/locations/vancouver",
    siteName: "X9Elysium",
  },
};

export default function VancouverLocationPage() {
  const posts = getAllPosts().filter(
    (p) => p.frontmatter.category === "Vancouver"
  );

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://x9elysium.com/locations/vancouver#localbusiness",
    name: "X9Elysium — Vancouver",
    url: "https://x9elysium.com/locations/vancouver",
    image: "https://x9elysium.com/images/x9-logo.png",
    parentOrganization: { "@id": "https://x9elysium.com/#organization" },
    description:
      "Shopify Plus consulting and unified commerce implementation for Vancouver and British Columbia retailers.",
    areaServed: [
      { "@type": "City", name: "Vancouver" },
      { "@type": "City", name: "Burnaby" },
      { "@type": "City", name: "Richmond" },
      { "@type": "City", name: "Surrey" },
      { "@type": "City", name: "North Vancouver" },
      { "@type": "City", name: "Victoria" },
      { "@type": "AdministrativeArea", name: "British Columbia" },
      { "@type": "AdministrativeArea", name: "Lower Mainland" },
    ],
    serviceType: [
      "Shopify Plus implementation",
      "Platform migration to Shopify",
      "Custom Shopify apps",
      "Headless commerce / Hydrogen",
      "Unified commerce strategy",
      "Pacific-Rim cross-border ecommerce",
    ],
    priceRange: "$$$",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://x9elysium.com" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://x9elysium.com/locations" },
      { "@type": "ListItem", position: 3, name: "Vancouver", item: "https://x9elysium.com/locations/vancouver" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://x9elysium.com/locations/vancouver#faq",
    inLanguage: "en-CA",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does Shopify Plus consulting cost in Vancouver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most X9Elysium engagements with BC retailers fall between CAD $25,000 and $150,000. Vancouver-area pricing runs at parity with the boutique-Plus market on the West Coast — neither the lowest nor the highest in the Lower Mainland. Discovery Audits are fixed-fee, Plus migrations are scoped per project, and retainers are quoted monthly.",
        },
      },
      {
        "@type": "Question",
        name: "How does BC tax setup work on Shopify?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "British Columbia charges 5% GST + 7% PST on most goods, with category-specific PST exemptions, and a 10% PST rate on alcohol. Storefronts also need to handle BC's recycling fees (EHF) on electronics and the new packaging EPR program. We configure the full tax + EHF matrix and bake EPR readiness into the checkout from day one.",
        },
      },
      {
        "@type": "Question",
        name: "Does X9Elysium support cross-border and Pacific-Rim ecommerce?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. BC retailers commonly need USD pricing and Markets storefronts for the US west coast plus duties calculation and CN/JP/KR shipping integrations for APAC pull. We build cross-border setups on Shopify Markets with Avalara or Zonos for duties and DHL / FedEx / EMS connectors for international fulfilment.",
        },
      },
      {
        "@type": "Question",
        name: "Can you support headless / Hydrogen builds for Vancouver DTC brands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Vancouver's design-led DTC brands are a strong fit for Hydrogen + Oxygen + Sanity / Contentful, edge-cached for Lower Mainland and US-west traffic. We ship headless storefronts with Core Web Vitals at parity or better than the platform you're leaving.",
        },
      },
      {
        "@type": "Question",
        name: "How does X9Elysium run BC engagements from the GTA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hybrid. Most build work happens remotely on async Loom + Linear with one weekly live review. On-site visits are available for kickoff, mid-project review, and launch in Vancouver. Same senior-founder delivery as a Toronto or Calgary brief — same fixed scope, same fixed price.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Navigation />
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <div className="section-container">
            <div className="max-w-4xl">
              <span className="section-label">Vancouver / British Columbia</span>
              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
                Shopify Plus consulting for{" "}
                <span className="text-gradient-emerald font-medium">
                  Vancouver and British Columbia
                </span>
                .
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                We work with retailers across Vancouver, Burnaby, Richmond, Surrey, North Vancouver, and Victoria — building Shopify Plus implementations, headless storefronts, and Pacific-Rim-aware integrations for brands that scale across BC and into the US west coast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <BookingButton variant="accent" />
                <Link href="/services" className="btn-outline">
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What we do for BC brands */}
        <section className="section-warm">
          <div className="section-container">
            <div className="max-w-3xl mb-16">
              <span className="section-label">What we deliver</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Built for BC operators with Pacific-Rim unit economics.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Shopify Plus migrations",
                  body: "Magento, WooCommerce, BigCommerce → Shopify Plus. Twelve to eighteen weeks, zero downtime, SEO preserved across BC and US-west traffic.",
                },
                {
                  title: "Headless / Hydrogen storefronts",
                  body: "Vancouver's design-led DTC brands ship faster on Hydrogen. Shopify Oxygen + Sanity / Contentful, edge-cached for Lower Mainland and US-west.",
                },
                {
                  title: "Cross-border & Pacific-Rim",
                  body: "USD pricing, Markets storefronts, duties calculation, and CN/JP/KR shipping integrations for brands with strong US-west and APAC pull.",
                },
                {
                  title: "BC tax & compliance",
                  body: "GST + PST configuration, PST-exempt categories, recycling fees (EHF), and packaging EPR readiness baked into the checkout from day one.",
                },
                {
                  title: "Unified commerce",
                  body: "Online + retail + B2B on Shopify Plus + POS + B2B. One source of truth across Gastown flagship, Richmond warehouse, and the storefront.",
                },
                {
                  title: "Performance engineering",
                  body: "Core Web Vitals at parity or better. INP under 200ms, LCP under 2.5s, edge-served for BC + US-west on Cloudflare or Shopify Oxygen.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card p-8 lg:p-10 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] hover:-translate-y-1 transition-all duration-500"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How we work with BC brands remotely + on-site */}
        <section className="section-dark">
          <div className="section-container">
            <div className="max-w-3xl mb-12">
              <span className="section-label">How the engagement runs</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Senior-founder delivery, GTA-based, BC-aware.
              </h2>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed">
                Our HQ is in the Greater Toronto Area, and we run BC engagements as a hybrid — most of the build happens remotely on async Loom + Linear, with on-site visits for kickoff, mid-project reviews, and launch. Same senior-founder delivery as a Toronto or Calgary brief; same fixed scope, same fixed price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "1 — Discovery",
                  body: "Kick-off video call, full audit of your current platform, a written scope and proposal back inside one week.",
                },
                {
                  title: "2 — Build",
                  body: "Async-first delivery on Linear + Loom + Slack, with one weekly live review. Optional on-site week in Vancouver at mid-project.",
                },
                {
                  title: "3 — Launch + retainer",
                  body: "On-site or remote launch, then a 90-day post-launch retainer with weekly check-ins. CRO, performance, and roadmap reviews on a quarterly cadence.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card p-8 lg:p-10 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] hover:-translate-y-1 transition-all duration-500"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BC-specific blog content */}
        {posts.length > 0 && (
          <section className="section-dark">
            <div className="section-container">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                <div>
                  <span className="section-label">Vancouver Insights</span>
                  <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                    Field notes from the Vancouver market
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-2 text-label-sm uppercase tracking-[0.12em]"
                >
                  All Insights
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {posts.slice(0, 6).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
