import type { Metadata } from "next";
import WorkClient from "./WorkClient";

const BREADCRUMB_LD = {
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
      name: "Work",
      item: "https://x9elysium.com/work",
    },
  ],
};

export const metadata: Metadata = {
  title: "Shopify Plus Case Studies — Migrations, Custom Apps, Unified Commerce",
  description:
    "How X9Elysium scopes the work — platform migrations, custom apps, headless Hydrogen builds, and unified commerce. 30+ Shopify and Shopify Plus stores shipped, every engagement founder-delivered. Named references on request, with client permission.",
  alternates: { canonical: "https://x9elysium.com/work" },
  openGraph: {
    title: "Shopify Plus Case Studies — Migrations, Custom Apps, Unified Commerce | X9Elysium",
    description:
      "Selected Shopify Plus case studies: migrations, custom apps, headless, and unified commerce. 30+ stores. Founder-led delivery.",
    url: "https://x9elysium.com/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Plus Case Studies | X9Elysium",
    description:
      "Selected Shopify Plus case studies: migrations, custom apps, headless, and unified commerce.",
  },
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
      />
      <WorkClient />
    </>
  );
}
