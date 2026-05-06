import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About X9Elysium — Founder-Led Shopify & Unified-Commerce Studio",
  description:
    "X9Elysium is a senior, founder-led Shopify and unified-commerce consultancy based in the Greater Toronto Area. Founded in 2021 by Darshan Patel and Adhvait Jadav — eight years of e-commerce experience each. Every brief is delivered by founders.",
  keywords: [
    "X9Elysium about",
    "X9Elysium founders",
    "Darshan Patel Shopify",
    "Adhvait Jadav Shopify",
    "Toronto Shopify agency",
    "GTA Shopify consultancy",
    "senior Shopify developers",
    "founder-led Shopify agency",
    "Shopify Plus partner Toronto",
    "headless Shopify Canada",
    "Hydrogen Shopify Toronto",
    "boutique Shopify studio",
    "small Shopify agency Canada",
    "DTC Shopify consultancy",
    "B2B Shopify partner",
    "unified commerce Canada",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About X9Elysium — Founder-Led Shopify Studio",
    description:
      "Two senior builders. Eight years each. One Shopify and unified-commerce studio in the Greater Toronto Area. No juniors, no offshore handoffs — every brief delivered by founders.",
    type: "profile",
    url: "https://x9elysium.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About X9Elysium",
    description:
      "Founder-led Shopify and unified-commerce studio in the GTA. Two senior builders, eight years each.",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://x9elysium.com/about#aboutpage",
      url: "https://x9elysium.com/about",
      name: "About X9Elysium",
      description:
        "Founder-led Shopify and unified-commerce consultancy based in the Greater Toronto Area, founded in 2021 by Darshan Patel and Adhvait Jadav.",
      inLanguage: "en-CA",
      mainEntity: { "@id": "https://x9elysium.com/#organization" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://x9elysium.com/about#faq",
      inLanguage: "en-CA",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who founded X9Elysium and when?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "X9Elysium was founded in 2021 by Darshan Patel and Adhvait Jadav. Both are senior full-stack developers with eight years of production e-commerce experience each across Shopify, Shopify Plus, Hydrogen, React, Next.js, and the broader Shopify ecosystem.",
          },
        },
        {
          "@type": "Question",
          name: "Where is X9Elysium based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "X9Elysium is headquartered in the Greater Toronto Area (Mississauga, Ontario) and serves retailers across Canada — Toronto, Calgary, Vancouver — and the United States.",
          },
        },
        {
          "@type": "Question",
          name: "Why no juniors and no offshore handoffs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The founder-led model is the wedge. Both founders work hands-on every engagement — discovery, architecture, and implementation. There are no account managers between the client and the people building, and no offshore teams the work gets handed to after the sales call.",
          },
        },
        {
          "@type": "Question",
          name: "What types of retailers does X9Elysium work with?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Retailers from roughly $500k ARR through $20M+ ARR. Earlier-stage brands typically start with a Discovery Audit or a fixed-scope project; Plus retainers fit best for $5M+ retailers with consistent roadmap demand.",
          },
        },
        {
          "@type": "Question",
          name: "What is the operating philosophy of X9Elysium?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "X9Elysium operates under a published methodology — five pillars (Ownership, Data, Knowledge Transfer, Transparency, Big Impact) and a written set of operating rules — rooted in the credo Vasudhaiva Kutumbakam, the world is one family. The full Foundation document lives at x9elysium.com/foundation.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://x9elysium.com/#organization",
      name: "X9Elysium",
      url: "https://x9elysium.com",
      foundingDate: "2021",
      areaServed: "CA",
      address: {
        "@type": "PostalAddress",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      founder: [
        { "@id": "https://x9elysium.com/about#darshan-patel" },
        { "@id": "https://x9elysium.com/about#adhvait-jadav" },
      ],
      employee: [
        { "@id": "https://x9elysium.com/about#darshan-patel" },
        { "@id": "https://x9elysium.com/about#adhvait-jadav" },
      ],
      hasCredential: [
        "Shopify Partner",
        "AWS Certified",
        "Google Ads Certified",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://x9elysium.com/about#darshan-patel",
      name: "Darshan Patel",
      jobTitle: "Founder & Full-Stack Lead",
      worksFor: { "@id": "https://x9elysium.com/#organization" },
      description:
        "Senior full-stack developer with eight years of production e-commerce experience across Shopify, React, Next.js, Node.js, GCP, and AWS. Founder of X9Elysium.",
      knowsAbout: [
        "Shopify",
        "Shopify Plus",
        "Hydrogen",
        "React",
        "Next.js",
        "Node.js",
        "Google Cloud Platform",
        "AWS",
        "Headless commerce",
        "Unified commerce",
      ],
      sameAs: ["https://www.linkedin.com/in/dpatel99/"],
    },
    {
      "@type": "Person",
      "@id": "https://x9elysium.com/about#adhvait-jadav",
      name: "Adhvait Jadav",
      jobTitle: "Full-Stack Lead",
      worksFor: { "@id": "https://x9elysium.com/#organization" },
      description:
        "Senior full-stack developer with eight years across Shopify, full-stack web development, and e-commerce platforms. Leads Hydrogen storefronts, custom apps, and back-end integrations at X9Elysium.",
      knowsAbout: [
        "Shopify",
        "React",
        "Next.js",
        "Node.js",
        "PHP",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Tailwind CSS",
      ],
      sameAs: ["https://www.linkedin.com/in/adhvaitjadav/"],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutClient />
    </>
  );
}
