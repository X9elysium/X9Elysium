import type { Metadata } from "next";
import SanctuaryClient from "./SanctuaryClient";

export const metadata: Metadata = {
  title: "Sanctuary — The alone space",
  description:
    "A quiet space. Generative ambient drones, synthesized rain and forest, and a small library of cloud-hosted calm tracks. No tracking, no chat, no chrome — just somewhere to think. Rooted in the credo Vasudhaiva Kutumbakam.",
  alternates: { canonical: "https://x9elysium.com/sanctuary" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sanctuary — the alone space",
    description:
      "Generative ambient and cloud-hosted calm music. Built into x9elysium.com as somewhere to think.",
    url: "https://x9elysium.com/sanctuary",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sanctuary — the alone space | X9Elysium",
    description:
      "Generative ambient and cloud-hosted calm music. Somewhere to think.",
  },
};

const sanctuaryJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://x9elysium.com/sanctuary#webpage",
      url: "https://x9elysium.com/sanctuary",
      name: "Sanctuary — the alone space",
      description:
        "Generative ambient drones, synthesized natural soundscapes, and a small cloud library of calm tracks. A quiet corner of x9elysium.com.",
      inLanguage: "en-CA",
      isPartOf: { "@id": "https://x9elysium.com/#website" },
      about: {
        "@type": "Thing",
        name: "Ambient music and meditative listening",
      },
    },
    {
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
          name: "Sanctuary",
          item: "https://x9elysium.com/sanctuary",
        },
      ],
    },
  ],
};

export default function SanctuaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sanctuaryJsonLd) }}
      />
      <SanctuaryClient />
    </>
  );
}
