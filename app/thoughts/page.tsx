import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import { ChevronRight, Sparkles, MessageCircle } from "lucide-react";
import { getThoughts } from "./lib";

const URL = "https://x9elysium.com/thoughts";

export const metadata: Metadata = {
  title: "Thoughts · X9Elysium",
  description:
    "Field notes from X9Elysium. Short, opinionated takes on Shopify Plus, founder-led consulting, and unified commerce. Open thread — anyone can comment.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Thoughts · X9Elysium",
    description:
      "Short, opinionated takes on Shopify Plus, founder-led consulting, and unified commerce. Open thread.",
    type: "website",
    url: URL,
    siteName: "X9Elysium",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thoughts · X9Elysium",
    description:
      "Short, opinionated takes on Shopify Plus, founder-led consulting, and unified commerce.",
  },
};

export default function ThoughtsPage() {
  const thoughts = getThoughts();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${URL}#collection`,
    url: URL,
    name: "Thoughts · X9Elysium",
    description:
      "Short, opinionated field notes from X9Elysium on Shopify Plus, founder-led consulting, and unified commerce.",
    isPartOf: { "@id": "https://x9elysium.com/#website" },
    mainEntity: thoughts.slice(0, 30).map((t, i) => ({
      "@type": "SocialMediaPosting",
      "@id": `${URL}#${t.id}`,
      position: i + 1,
      headline: t.text.slice(0, 110),
      articleBody: t.text,
      author: { "@id": "https://x9elysium.com/about#darshan" },
      url: `${URL}#${t.id}`,
      inLanguage: "en-CA",
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://x9elysium.com" },
      { "@type": "ListItem", position: 2, name: "Thoughts", item: URL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation />
      <main id="main-content">
        <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
          </div>

          <div className="section-container max-w-3xl">
            <Link
              href="/"
              className="text-label-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors uppercase tracking-[0.12em] inline-flex items-center gap-1"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Home
            </Link>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mt-6 mb-5">
              <Sparkles className="w-3 h-3" />
              Open Thread
            </div>
            <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
              Thoughts.
            </h1>
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-5 max-w-2xl leading-relaxed">
              Short, operator-true notes on Shopify Plus, founder-led consulting, and the messy edges
              of unified commerce. No signup. Anyone can comment. Specific beats clever.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-3">
              {thoughts.length} thought{thoughts.length === 1 ? "" : "s"} · also posted to{" "}
              <a
                href="https://x.com/x9elysium"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                x.com/x9elysium
              </a>
            </p>
          </div>
        </section>

        <section className="section-light !pt-6 !pb-24">
          <div className="section-container max-w-3xl space-y-8">
            {thoughts.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                Queue is empty. New notes ship to{" "}
                <code className="text-xs">data/x-thoughts.md</code>.
              </p>
            ) : (
              thoughts.map((t) => (
                <article
                  key={t.id}
                  id={t.id}
                  className="rounded-2xl border border-neutral-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 sm:p-7"
                >
                  <p className="text-[1.05rem] leading-[1.65] text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                    {t.text}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-500">
                    <a
                      href={`#${t.id}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      #{t.id}
                    </a>
                    <span>·</span>
                    <a
                      href={`#${t.id}-replies`}
                      className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      reply
                    </a>
                    <span>·</span>
                    <span>{t.length} chars</span>
                  </div>
                  <div id={`${t.id}-replies`} className="mt-6">
                    <Comments
                      threadId={`thoughts/${t.id}`}
                      title="Replies"
                      prompt="Open thread. Reply with a counter, a war story, or a question."
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
