import type { Metadata } from "next";
import WooCommerceClient from "./WooCommerceClient";

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "X9Elysium WooCommerce Services",
  url: "https://x9elysium.com/platforms/woocommerce",
  provider: { "@id": "https://x9elysium.com/#organization" },
  itemListElement: [
    {
      "@type": "Service",
      name: "WooCommerce Custom Plugin Development",
      serviceType: "Custom application development",
      description:
        "Bespoke WooCommerce plugins in PHP — booking flows, custom checkout logic, ERP/CRM bridges, subscription tweaks, and the long tail of business logic that doesn't fit a marketplace plugin.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "WooCommerce Theme & Storefront Builds",
      serviceType: "Storefront design and development",
      description:
        "Custom WooCommerce child themes and bespoke storefronts. Full Site Editing patterns, block-editor integrations, and page-builder hand-off for content teams.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "WooCommerce Migrations",
      serviceType: "Ecommerce platform migration",
      description:
        "Migrations into WooCommerce from Squarespace, Wix, Magento, and legacy custom builds — and migrations out of WooCommerce to Shopify when the back office is the actual bottleneck.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Headless WooCommerce",
      serviceType: "Headless storefront development",
      description:
        "Next.js or Astro front-ends on top of the WooCommerce + WordPress backend via the Store API and GraphQL — Shopify-class front-end speed without leaving the WordPress ecosystem.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "WooCommerce Care Plan",
      serviceType: "WordPress and WooCommerce maintenance",
      description:
        "Monthly WooCommerce retainer covering plugin and core updates, security hardening, performance tuning, uptime monitoring, and a dedicated block of dev hours each month.",
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
      name: "Should I use WooCommerce or Shopify for a small store?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shopify wins on convenience: hosting, security patches, PCI scope, and checkout reliability are handled for you. WooCommerce wins on ownership, customization, and total cost of ownership at small scale — especially when content + commerce live on the same domain. As a rule of thumb: if monthly platform fees matter and you want full code-level control, WooCommerce. If you'd rather pay for the platform and skip the maintenance burden, Shopify.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build custom WooCommerce plugins?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Custom plugin development is one of our core WooCommerce offerings — booking flows, custom checkout logic, ERP/CRM bridges, subscription tweaks, B2B catalogs, multi-vendor logic, and any business rule that doesn't map cleanly to a marketplace plugin. We write standards-compliant PHP using WooCommerce hooks and filters, with composer-managed dependencies.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a WooCommerce build cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Quick Build engagements (2–4 weeks of focused work — theme build, plugin development, or migration) typically run CAD $5k–$25k. Custom Builds (multi-vendor, headless front-ends, complex integrations) run CAD $25k–$80k. Care Plans for ongoing support start at CAD $1.5k/month. Every engagement is fixed-scope and fixed-price before any code is written.",
      },
    },
    {
      "@type": "Question",
      name: "Can you migrate me out of WooCommerce to Shopify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — and we'll be honest about whether you should. We're a Shopify Plus shop first, so we have no incentive to keep you on Woo if it's the wrong tool. We've migrated brands both directions; the right call depends on your storefront complexity, plugin debt, monthly cost ceiling, and how much custom logic lives in the existing build.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build headless WooCommerce storefronts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build Next.js and Astro front-ends on top of the WooCommerce + WordPress backend using the Store API and GraphQL — the goal is Shopify-class storefront speed without leaving the WordPress ecosystem. ISR + edge caching for product and category pages, real-time cart and checkout against the Store API.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "WooCommerce Development — Custom Plugins, Themes & Headless Builds",
  description:
    "Founder-led WooCommerce development for small brands and custom-logic operators. Bespoke plugins, theme builds, performance tuning, headless front-ends, and migrations — without marketplace-plugin sprawl.",
  alternates: { canonical: "https://x9elysium.com/platforms/woocommerce" },
  openGraph: {
    title: "WooCommerce Development & Custom Plugins | X9Elysium",
    description:
      "Founder-led WooCommerce: custom PHP plugins, themes, performance, headless Next.js front-ends, and migrations. Built for ownership, not platform tax.",
    url: "https://x9elysium.com/platforms/woocommerce",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WooCommerce Development & Custom Plugins | X9Elysium",
    description:
      "Custom WooCommerce plugins, theme builds, performance tuning, headless front-ends, and migrations.",
  },
};

export default function WooCommercePage() {
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
      <WooCommerceClient />
    </>
  );
}
