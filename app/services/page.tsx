import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "X9Elysium Shopify Plus Services",
  url: "https://x9elysium.com/services",
  provider: { "@id": "https://x9elysium.com/#organization" },
  itemListElement: [
    {
      "@type": "Service",
      name: "Shopify Store Audits",
      serviceType: "Ecommerce store audit",
      description:
        "Founder-delivered 50-point technical and UX audit covering performance, conversion flow, tech-stack health, and revenue leaks. Deliverables: prioritized roadmap, written action plan, 60-minute findings debrief.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Custom Shopify Apps & Integrations",
      serviceType: "Custom application development",
      description:
        "Purpose-built Shopify apps and ERP/PIM/OMS connectors. Built and maintained by the same two founders who scope the brief.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Platform Migrations to Shopify Plus",
      serviceType: "Ecommerce platform migration",
      description:
        "Migrations from Magento, WooCommerce, BigCommerce, Salesforce Commerce Cloud, and legacy custom builds. Zero-downtime cutover plan, full data integrity, theme & feature parity audit.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Performance & Headless Architecture",
      serviceType: "Ecommerce performance engineering",
      description:
        "Core Web Vitals optimization, Hydrogen/Oxygen headless storefronts, edge delivery, and load-tested architecture for peak retail traffic.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Unified Commerce Strategy",
      serviceType: "Commerce strategy consulting",
      description:
        "Roadmap and execution support for retailers consolidating online, retail, and wholesale on Shopify Plus + POS + B2B.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Analytics & Conversion Optimization",
      serviceType: "Analytics and CRO",
      description:
        "Custom GA4 / Klaviyo dashboards, cross-channel attribution, A/B testing program, and monthly performance reviews.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
  ],
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a Shopify Plus consulting engagement cost in Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most X9Elysium projects fall between CAD $25k and $150k depending on scope. A focused store audit is a fixed-fee engagement, custom app builds and Plus migrations are scoped per project, and ongoing retainers are quoted monthly based on cadence and complexity.",
      },
    },
    {
      "@type": "Question",
      name: "Who actually does the work on each engagement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both founders — Darshan Patel and Adhvait Jadav — work hands-on every engagement. Eight years of Shopify and full-stack experience each. No juniors, no offshore handoffs, no account managers between you and the people building.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a Shopify Plus migration typically take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From kickoff to launch, most migrations land in 8–14 weeks. Discovery and architecture take 2–3 weeks, build and data migration 4–8 weeks, QA and zero-downtime cutover 2–3 weeks. Catalogues over 100k SKUs, complex ERP sync, or B2B + DTC consolidation push toward the upper end.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with retailers under $1M ARR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we partner with retailers from roughly $500k ARR through $20M+ ARR. Earlier-stage brands typically start with a Discovery Audit or a defined project (theme build, integration, performance pass). Plus retainers fit best for $5M+ retailers with consistent roadmap demand.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms do you migrate from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most often Magento 2, BigCommerce, WooCommerce, and Salesforce Commerce Cloud. We also handle legacy custom builds (Node, PHP, Rails) and Wix/Squarespace consolidations into Shopify or Shopify Plus.",
      },
    },
    {
      "@type": "Question",
      name: "Are you a certified Shopify Partner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. X9Elysium is a Shopify Partner with hands-on experience across Shopify Plus, Hydrogen/Oxygen, checkout extensibility, and certified integrations with Klaviyo, Gorgias, ReCharge, and Yotpo.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Shopify Plus Services — Audits, Migrations, Custom Apps",
  description:
    "Founder-led Shopify Plus services for Canadian and US retailers: store audits, platform migrations, custom apps, headless storefronts, unified commerce strategy, and CRO. Six disciplines, two senior founders, 30+ stores shipped.",
  alternates: { canonical: "https://x9elysium.com/services" },
  openGraph: {
    title: "Shopify Plus Services — Audits, Migrations, Custom Apps | X9Elysium",
    description:
      "Founder-led Shopify Plus services: audits, migrations, custom apps, headless, unified commerce, and CRO. Two senior founders. 30+ stores shipped. 95% retention.",
    url: "https://x9elysium.com/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Plus Services — Audits, Migrations, Custom Apps | X9Elysium",
    description:
      "Founder-led Shopify Plus services: audits, migrations, custom apps, headless, unified commerce, and CRO.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <ServicesClient />
    </>
  );
}
