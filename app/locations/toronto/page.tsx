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
  title: "Shopify Plus Agency in Toronto | X9Elysium",
  description:
    "Shopify Plus consulting and unified commerce for Greater Toronto Area retailers — store audits, custom apps, platform migrations, and ongoing optimization.",
  alternates: {
    canonical: "https://x9elysium.com/locations/toronto",
  },
  openGraph: {
    title: "Shopify Plus Agency in Toronto | X9Elysium",
    description:
      "Shopify Plus consulting for GTA retailers — audits, custom apps, migrations, and unified commerce.",
    type: "website",
    url: "https://x9elysium.com/locations/toronto",
    siteName: "X9Elysium",
  },
};

export default function TorontoLocationPage() {
  const posts = getAllPosts().filter(
    (p) => p.frontmatter.category === "GTA"
  );

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://x9elysium.com/locations/toronto#localbusiness",
    name: "X9Elysium — Toronto",
    url: "https://x9elysium.com/locations/toronto",
    image: "https://x9elysium.com/images/x9-logo.png",
    parentOrganization: { "@id": "https://x9elysium.com/#organization" },
    description:
      "Shopify Plus consulting and unified commerce implementation for Greater Toronto Area retailers.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "28 Ann Street",
      addressLocality: "Mississauga",
      addressRegion: "ON",
      postalCode: "L5G 0E1",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Toronto" },
      { "@type": "City", name: "Mississauga" },
      { "@type": "City", name: "Brampton" },
      { "@type": "City", name: "Markham" },
      { "@type": "City", name: "Vaughan" },
      { "@type": "City", name: "Hamilton" },
      { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
    ],
    serviceType: [
      "Shopify Plus implementation",
      "Platform migration to Shopify",
      "Custom Shopify apps",
      "Unified commerce strategy",
      "Conversion rate optimization",
    ],
    priceRange: "$$$",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://x9elysium.com" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://x9elysium.com/locations" },
      { "@type": "ListItem", position: 3, name: "Toronto", item: "https://x9elysium.com/locations/toronto" },
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
              <span className="section-label">Toronto / Greater Toronto Area</span>
              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
                Shopify Plus consulting for{" "}
                <span className="text-gradient-emerald font-medium">
                  Toronto and the GTA
                </span>
                .
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                We work with retailers across Toronto, Mississauga, Brampton, Markham, Vaughan, and Hamilton — building Shopify Plus implementations, custom apps, and platform migrations that scale.
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

        {/* What we do for GTA brands */}
        <section className="section-warm">
          <div className="section-container">
            <div className="max-w-3xl mb-16">
              <span className="section-label">What we deliver</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Built for GTA retailers scaling past their first ceiling.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Shopify Plus migrations",
                  body: "Magento, WooCommerce, BigCommerce → Shopify Plus. Twelve to eighteen weeks, zero downtime, SEO preserved.",
                },
                {
                  title: "Custom apps & integrations",
                  body: "ERP, OMS, 3PL, loyalty, subscriptions. Shopify Flow workflows or full custom apps when native won't do.",
                },
                {
                  title: "Conversion rate optimization",
                  body: "Quantitative CRO programs that move blended conversion by 15–35% over a 90-day sprint.",
                },
                {
                  title: "Unified commerce",
                  body: "Online + retail + B2B on a single source of truth. Shopify Plus + POS + B2B configured for the GTA market.",
                },
                {
                  title: "Performance engineering",
                  body: "Core Web Vitals at parity or better than the platform you're leaving. INP under 200ms, LCP under 2.5s.",
                },
                {
                  title: "Strategic retainers",
                  body: "Embedded team running roadmap, A/B testing, and quarterly reviews. Most GTA brands recoup retainer fees in 90 days.",
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

        {/* GTA-specific blog content */}
        {posts.length > 0 && (
          <section className="section-dark">
            <div className="section-container">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                <div>
                  <span className="section-label">GTA Insights</span>
                  <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                    Field notes from the Toronto market
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
