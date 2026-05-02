import type { Metadata } from "next";
import ContactClient from "./ContactClient";

const CONTACT_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://x9elysium.com/contact",
  name: "Contact X9Elysium — Founder-Led Shopify Plus Consulting",
  description:
    "Start a conversation with X9Elysium. Senior founder reply within 24 hours. Audits, Plus migrations, custom apps, and unified commerce strategy for Canadian and US retailers.",
  publisher: { "@id": "https://x9elysium.com/#organization" },
  mainEntity: { "@id": "https://x9elysium.com/#organization" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://x9elysium.com/" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "https://x9elysium.com/contact" },
    ],
  },
};

export const metadata: Metadata = {
  title: "Contact — Book a Shopify Plus Strategy Call",
  description:
    "Talk to a senior founder about your Shopify Plus roadmap. Audits, migrations, custom apps, and unified commerce strategy for Canadian and US retailers. 24-hour reply, no junior triage, no pitch decks.",
  alternates: { canonical: "https://x9elysium.com/contact" },
  openGraph: {
    title: "Contact — Book a Shopify Plus Strategy Call | X9Elysium",
    description:
      "Talk to a senior founder about your Shopify Plus roadmap. 24-hour reply, no junior triage, no pitch decks.",
    url: "https://x9elysium.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Book a Shopify Plus Strategy Call | X9Elysium",
    description:
      "Talk to a senior founder about your Shopify Plus roadmap. 24-hour reply, no junior triage.",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_LD) }}
      />
      <ContactClient />
    </>
  );
}
