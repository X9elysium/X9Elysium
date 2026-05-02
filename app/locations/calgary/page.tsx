import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import BlogCard from "../../blog/components/BlogCard";
import NewsletterCTA from "../../blog/components/NewsletterCTA";
import { getAllPosts } from "../../lib/blog";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopify Agency in Calgary | X9Elysium",
  description:
    "Shopify Plus and unified commerce consulting for Calgary and Alberta retailers — B2B Shopify, energy-sector DTC spinoffs, and migrations.",
  alternates: {
    canonical: "https://x9elysium.com/locations/calgary",
  },
  openGraph: {
    title: "Shopify Agency in Calgary | X9Elysium",
    description:
      "Shopify Plus consulting for Calgary and Alberta retailers — built for the no-PST advantage and Western Canadian DTC.",
    type: "website",
    url: "https://x9elysium.com/locations/calgary",
    siteName: "X9Elysium",
  },
};

export default function CalgaryLocationPage() {
  const posts = getAllPosts().filter(
    (p) => p.frontmatter.category === "Calgary"
  );

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://x9elysium.com/locations/calgary#localbusiness",
    name: "X9Elysium — Calgary",
    url: "https://x9elysium.com/locations/calgary",
    image: "https://x9elysium.com/images/x9-logo.png",
    parentOrganization: { "@id": "https://x9elysium.com/#organization" },
    description:
      "Shopify Plus consulting and unified commerce implementation for Calgary and Alberta retailers.",
    areaServed: [
      { "@type": "City", name: "Calgary" },
      { "@type": "City", name: "Cochrane" },
      { "@type": "City", name: "Airdrie" },
      { "@type": "City", name: "Okotoks" },
      { "@type": "City", name: "Edmonton" },
      { "@type": "AdministrativeArea", name: "Alberta" },
    ],
    serviceType: [
      "Shopify Plus implementation",
      "Platform migration to Shopify",
      "B2B Shopify",
      "Unified commerce strategy",
      "Energy-sector DTC consulting",
    ],
    priceRange: "$$$",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://x9elysium.com" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://x9elysium.com/locations" },
      { "@type": "ListItem", position: 3, name: "Calgary", item: "https://x9elysium.com/locations/calgary" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content">
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <div className="section-container">
            <div className="max-w-4xl">
              <span className="section-label">Calgary / Alberta</span>
              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
                Shopify consulting for{" "}
                <span className="text-gradient-emerald font-medium">
                  Calgary and Western Canada
                </span>
                .
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                We help Calgary retailers and energy-sector DTC spinoffs scale on Shopify Plus — with deep B2B experience, Alberta-aware tax setup, and unified commerce expertise. Cochrane to Okotoks, Calgary to Edmonton.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/contact" className="btn-accent group">
                  Book a Strategy Call
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/services" className="btn-outline">
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-warm">
          <div className="section-container">
            <div className="max-w-3xl mb-16">
              <span className="section-label">What we deliver</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Built for Albertan operators with Western Canadian unit economics.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Shopify Plus migrations",
                  body: "Magento, Woo, BigCommerce → Shopify Plus. Calgary rates run 15–20% below Toronto without compromising delivery quality.",
                },
                {
                  title: "B2B Shopify",
                  body: "Price lists, customer-specific catalogs, net terms, distributor portals. Strong fit for Calgary's resource-industry buyers.",
                },
                {
                  title: "Energy-sector DTC",
                  body: "Spinoffs taking industrial expertise into consumer markets. Performance fabrics, ruggedized hardware, specialty chemicals.",
                },
                {
                  title: "Alberta tax setup",
                  body: "GST-only configuration, multi-province PST handling for cross-Canada selling, US nexus tracking when you're ready.",
                },
                {
                  title: "Two-warehouse architecture",
                  body: "Calgary or Edmonton hub for the West, GTA hub for the East. Single Shopify Plus with location-aware allocation.",
                },
                {
                  title: "Unified commerce",
                  body: "Online + retail + B2B on Shopify Plus + POS + B2B. Single source of truth across every channel.",
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

        {posts.length > 0 && (
          <section className="section-dark">
            <div className="section-container">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                <div>
                  <span className="section-label">Calgary Insights</span>
                  <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                    Field notes from the Calgary market
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
