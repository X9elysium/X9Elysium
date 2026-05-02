import type { Metadata } from "next";
import OdooClient from "./OdooClient";

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "X9Elysium Odoo Services",
  url: "https://x9elysium.com/platforms/odoo",
  provider: { "@id": "https://x9elysium.com/#organization" },
  itemListElement: [
    {
      "@type": "Service",
      name: "Odoo Implementation",
      serviceType: "ERP and eCommerce implementation",
      description:
        "End-to-end Odoo implementation across eCommerce, Inventory, Manufacturing (MRP), Accounting, Purchase, CRM, and POS. Founder-delivered, with Python/XML custom modules where standard Odoo falls short.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Odoo Custom Module Development",
      serviceType: "Custom application development",
      description:
        "Custom Odoo modules in Python and XML, plus REST and XML-RPC integrations to Shopify, Stripe, Klaviyo, ShipStation, NetSuite, and other operational systems.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Odoo Migration",
      serviceType: "ERP migration",
      description:
        "Data migrations to Odoo from QuickBooks, Sage, NetSuite, SAP Business One, and spreadsheet-driven operations. Zero-downtime cutover plan with data integrity audit.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Shopify ↔ Odoo Integration",
      serviceType: "Commerce-ERP integration",
      description:
        "Bidirectional integration between Shopify and Odoo so brands can keep their Shopify storefront while running Odoo as the operational backbone — inventory, customers, orders, and pricing in sync.",
      areaServed: ["Canada", "United States"],
      provider: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Odoo Support Retainer",
      serviceType: "Ongoing ERP support",
      description:
        "Monthly Odoo retainer covering custom module development, version upgrades, performance tuning, and operations support — priority SLA with founder coverage.",
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
      name: "Is X9Elysium an Odoo partner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "X9Elysium implements Odoo Enterprise, Community, and Odoo.sh as an independent implementation partner. We deliver end-to-end Odoo builds with founder-led discovery, Python/XML custom module development, data migration, training, and ongoing support — without reseller markup.",
      },
    },
    {
      "@type": "Question",
      name: "Should I run my storefront on Odoo eCommerce or on Shopify with Odoo as the back office?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the storefront's complexity. Brands with heavy DTC marketing motion, advanced merchandising, or international Markets typically keep Shopify on the front-end and run Odoo as the operational backbone via API. Brands where the storefront is simpler — or where B2B portals with negotiated pricing are the priority — often consolidate everything on Odoo. We map this trade-off in the Discovery engagement before any code is written.",
      },
    },
    {
      "@type": "Question",
      name: "How long does an Odoo implementation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most Odoo implementations land in 8–14 weeks: 1–2 weeks of discovery and process mapping, 4–8 weeks of configuration and custom module development, then 2–4 weeks of data migration, training, and cutover. Manufacturing-heavy implementations or multi-entity finance consolidations push toward the upper end.",
      },
    },
    {
      "@type": "Question",
      name: "Which Odoo modules do you implement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We implement the full operational core: eCommerce & Website, Inventory & Warehouse, Manufacturing (MRP), Accounting & Finance, Purchase & Procurement, CRM & Sales, POS & Retail, plus custom modules built in Python + XML for the gaps. We do not pre-bundle modules — every implementation is scoped to the operations it actually needs.",
      },
    },
    {
      "@type": "Question",
      name: "Can you migrate us off QuickBooks, Sage, or NetSuite to Odoo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Most of our Odoo migrations come from QuickBooks Online, Sage 50/100, NetSuite, SAP Business One, and spreadsheet-heavy operations. We audit data integrity before cutover, run a dress-rehearsal migration in staging, and execute the live cutover with founder coverage and a documented rollback plan.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Odoo Implementation & Development — Founder-Led ERP + Commerce",
  description:
    "Founder-led Odoo implementations for Canadian and US manufacturers, distributors, and multi-channel retailers. eCommerce, Inventory, MRP, Accounting, POS, and custom module development in Python + XML. No reseller markup.",
  alternates: { canonical: "https://x9elysium.com/platforms/odoo" },
  openGraph: {
    title: "Odoo Implementation & Development | X9Elysium",
    description:
      "Founder-led Odoo end-to-end: eCommerce, Inventory, MRP, Accounting, POS, and custom Python/XML modules. Migrations from QuickBooks, Sage, NetSuite. Shopify ↔ Odoo bridges.",
    url: "https://x9elysium.com/platforms/odoo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odoo Implementation & Development | X9Elysium",
    description:
      "Founder-led Odoo end-to-end: eCommerce, Inventory, MRP, Accounting, POS, and custom Python/XML modules.",
  },
};

export default function OdooPage() {
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
      <OdooClient />
    </>
  );
}
