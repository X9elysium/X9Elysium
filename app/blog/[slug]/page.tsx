import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import BlogHero from "../components/BlogHero";
import BlogContent from "../components/BlogContent";
import TableOfContents from "../components/TableOfContents";
import AuthorCard from "../components/AuthorCard";
import RelatedPosts from "../components/RelatedPosts";
import ShareBar from "../components/ShareBar";
import FAQBlock from "../components/FAQBlock";
import ReadingProgress from "../components/ReadingProgress";
import NewsletterCTA from "../components/NewsletterCTA";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "../../lib/blog";
import { extractToc } from "../../lib/mdx";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const url = `https://x9elysium.com/blog/${post.slug}`;
  const ogImage = post.frontmatter.heroImage
    ? `https://x9elysium.com${post.frontmatter.heroImage}`
    : "https://x9elysium.com/images/og-image.png";

  return {
    title: `${post.frontmatter.title} | X9Elysium`,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    authors: [{ name: post.frontmatter.author.name }],
    alternates: { canonical: url },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      url,
      siteName: "X9Elysium",
      publishedTime: post.frontmatter.publishedAt,
      modifiedTime: post.frontmatter.updatedAt,
      authors: [post.frontmatter.author.name],
      tags: post.frontmatter.tags,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const related = getRelatedPosts(post.slug, 3);

  const url = `https://x9elysium.com/blog/${post.slug}`;
  const ogImage = post.frontmatter.heroImage
    ? `https://x9elysium.com${post.frontmatter.heroImage}`
    : "https://x9elysium.com/images/og-image.png";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: ogImage,
    datePublished: post.frontmatter.publishedAt,
    dateModified: post.frontmatter.updatedAt,
    author: {
      "@type": "Person",
      name: post.frontmatter.author.name,
      url: post.frontmatter.author.url,
      sameAs: post.frontmatter.author.sameAs,
    },
    publisher: { "@id": "https://x9elysium.com/#organization" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.frontmatter.category,
    keywords: post.frontmatter.tags?.join(", "),
    wordCount: post.content.split(/\s+/).filter(Boolean).length,
    inLanguage: "en-CA",
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.frontmatter.title,
        item: url,
      },
    ],
  };

  const faqJsonLd = post.frontmatter.faqs && post.frontmatter.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.frontmatter.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ReadingProgress />
      <Navigation />
      <main id="main-content">
        <BlogHero
          frontmatter={post.frontmatter}
          readingTime={post.readingTime}
        />

        {/* Article body */}
        <article className="section-light !pt-8 !pb-16 sm:!pb-20">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-[64px_minmax(0,1fr)_240px] xl:grid-cols-[80px_minmax(0,1fr)_280px] gap-8 lg:gap-12">
              {/* Left rail: share */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <ShareBar
                    title={post.frontmatter.title}
                    slug={post.slug}
                  />
                </div>
              </aside>

              {/* Main content */}
              <div className="min-w-0">
                <BlogContent source={post.content} />

                <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-white/[0.06]">
                  <AuthorCard author={post.frontmatter.author} />
                </div>
              </div>

              {/* Right rail: TOC */}
              <aside className="hidden lg:block">
                <TableOfContents items={toc} />
              </aside>
            </div>
          </div>
        </article>

        {post.frontmatter.faqs && post.frontmatter.faqs.length > 0 && (
          <FAQBlock faqs={post.frontmatter.faqs} />
        )}

        <RelatedPosts posts={related} />

        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
