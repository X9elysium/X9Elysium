import type { Metadata } from "next";
import ChangelogClient from "./ChangelogClient";
import { changelogEntries } from "./data";

export const metadata: Metadata = {
  title: "Changelog — Every Change to X9Elysium, in the Open",
  description:
    "Every meaningful change shipped to X9Elysium — new pages, new features, infrastructure, marketing surfaces, and the things removed because they didn't earn their place. Updated continuously.",
  keywords: [
    "X9Elysium changelog",
    "X9Elysium release notes",
    "X9Elysium updates",
    "Shopify agency changelog",
    "X9Elysium product updates",
    "X9Elysium ship log",
  ],
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Changelog — X9Elysium",
    description:
      "Every meaningful change to X9Elysium, in the open. New pages, new features, infrastructure, and what we removed.",
    type: "website",
    url: "https://x9elysium.com/changelog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog — X9Elysium",
    description:
      "Every meaningful change to X9Elysium, in the open. Updated continuously.",
  },
};

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://x9elysium.com/changelog#page",
  url: "https://x9elysium.com/changelog",
  name: "X9Elysium Changelog",
  description:
    "Every meaningful change shipped to X9Elysium — new pages, new features, infrastructure, marketing surfaces, and removals.",
  isPartOf: { "@id": "https://x9elysium.com/#website" },
  publisher: { "@id": "https://x9elysium.com/#organization" },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: changelogEntries.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: changelogEntries.slice(0, 25).map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: entry.title,
        description: entry.description,
        datePublished: entry.date,
        url: entry.href
          ? `https://x9elysium.com${entry.href}`
          : `https://x9elysium.com/changelog#${entry.id}`,
        about: entry.category,
      },
    })),
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://x9elysium.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Changelog",
      item: "https://x9elysium.com/changelog",
    },
  ],
};

export default function ChangelogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ChangelogClient />
    </>
  );
}
