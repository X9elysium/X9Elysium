import type { Metadata } from "next";
import FoundationClient from "./FoundationClient";
import { pillarsData, rulesData } from "./data";

export const metadata: Metadata = {
  title: "The Foundation — X9Elysium's Values, Pillars & Operating Rules",
  description:
    "The X9Elysium foundation: our Why, the 5 pillars that guide every Shopify Plus engagement, and the 10 operating rules that keep us trustworthy. Built for ambitious North American retailers who want commerce infrastructure that scales for decades.",
  keywords: [
    "X9Elysium values",
    "X9Elysium foundation",
    "X9Elysium why",
    "Shopify agency principles",
    "Shopify consulting philosophy",
    "Shopify Plus partner values",
    "ethical Shopify agency",
    "long-term Shopify partner",
    "ambitious retailers",
    "commerce infrastructure",
    "retailer growth philosophy",
    "unified commerce values",
    "DTC growth partner principles",
    "B2B Shopify consulting values",
    "agency operating principles",
    "responsible ecommerce agency",
  ],
  alternates: { canonical: "/foundation" },
  openGraph: {
    title: "The Foundation — X9Elysium",
    description:
      "Why we exist. What we stand for. How we operate. Five pillars, ten rules, one promise to ambitious retailers.",
    type: "article",
    url: "https://x9elysium.com/foundation",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Foundation — X9Elysium",
    description:
      "Why we exist. What we stand for. How we operate. Five pillars, ten rules.",
  },
};

const foundationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Article", "AboutPage"],
      "@id": "https://x9elysium.com/foundation#article",
      headline: "The Foundation — X9Elysium's Values, Pillars & Operating Rules",
      description:
        "The Why behind X9Elysium, the five pillars that guide every Shopify Plus engagement, and the ten operating rules we will not break.",
      mainEntityOfPage: "https://x9elysium.com/foundation",
      url: "https://x9elysium.com/foundation",
      datePublished: "2026-05-02",
      dateModified: "2026-05-02",
      inLanguage: "en-CA",
      author: { "@id": "https://x9elysium.com/#organization" },
      publisher: { "@id": "https://x9elysium.com/#organization" },
      about: { "@id": "https://x9elysium.com/#organization" },
      hasPart: [
        { "@id": "https://x9elysium.com/foundation#pillars" },
        { "@id": "https://x9elysium.com/foundation#rules" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://x9elysium.com/foundation#pillars",
      name: "The Five Pillars of X9Elysium",
      description:
        "Five non-negotiable values that guide every X9Elysium Shopify Plus engagement, hire, and client decision.",
      numberOfItems: pillarsData.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: pillarsData.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        description: `${p.aphorism} ${p.body}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": "https://x9elysium.com/foundation#rules",
      name: "The Ten Operating Rules of X9Elysium",
      description:
        "Ten operating principles X9Elysium will not break — the behavioural standard for every project, every client, every decision.",
      numberOfItems: rulesData.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: rulesData.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.title,
        description: r.body,
      })),
    },
  ],
};

export default function FoundationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(foundationJsonLd) }}
      />
      <FoundationClient />
    </>
  );
}
