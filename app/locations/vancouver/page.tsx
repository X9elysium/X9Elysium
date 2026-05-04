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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
