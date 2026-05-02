import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import NewsletterCTA from "./components/NewsletterCTA";
import CategoryFilter from "./components/CategoryFilter";
import BlogCard from "./components/BlogCard";
import { getAllPosts, getCategories, getFeaturedPost } from "../lib/blog";

export const metadata: Metadata = {
  title: "Insights | X9Elysium — Shopify Strategy for Toronto, Calgary & Vancouver",
  description:
    "Field notes on Shopify Plus, unified commerce, and DTC strategy for Canadian retailers in the GTA, Calgary, and Vancouver. Updated 2026.",
  alternates: {
    canonical: "https://x9elysium.com/blog",
  },
  openGraph: {
    title: "Insights — X9Elysium Blog",
    description:
      "Shopify Plus, unified commerce, and DTC strategy for Canadian retailers in Toronto, Calgary, and Vancouver.",
    type: "website",
    url: "https://x9elysium.com/blog",
    siteName: "X9Elysium",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const featured = getFeaturedPost();
  const others = featured
    ? posts.filter((p) => p.slug !== featured.slug)
    : posts;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://x9elysium.com/blog#blog",
    url: "https://x9elysium.com/blog",
    name: "X9Elysium Insights",
    description:
      "Shopify Plus, unified commerce, and DTC strategy for Canadian retailers.",
    publisher: { "@id": "https://x9elysium.com/#organization" },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.frontmatter.title,
      url: `https://x9elysium.com/blog/${p.slug}`,
      datePublished: p.frontmatter.publishedAt,
      dateModified: p.frontmatter.updatedAt,
      author: { "@type": "Person", name: p.frontmatter.author.name },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://x9elysium.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://x9elysium.com/blog",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <div className="section-container">
            <div className="max-w-4xl">
              <span className="section-label">Insights</span>
              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
                Field notes on{" "}
                <span className="text-gradient-emerald font-medium">
                  Shopify, unified commerce, and DTC
                </span>{" "}
                for Canadian retailers.
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                Strategy and execution playbooks from the team at X9Elysium —
                serving brands in the Greater Toronto Area, Calgary, Vancouver,
                and across Canada.
              </p>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured && (
          <section className="pb-16 sm:pb-20">
            <div className="section-container">
              <div className="grid grid-cols-1 gap-6 lg:gap-8">
                <BlogCard post={featured} variant="featured" />
              </div>
            </div>
          </section>
        )}

        {/* All posts with category filter */}
        <section className="section-warm">
          <div className="section-container">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <span className="section-label">All Articles</span>
                <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                  Browse by region & topic
                </h2>
              </div>
            </div>

            <CategoryFilter posts={others} categories={categories} />
          </div>
        </section>

        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
