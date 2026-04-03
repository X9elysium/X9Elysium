import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x9elysium.com"),
  title: "X9Elysium | Shopify Commerce Consulting",
  description:
    "Enterprise Shopify consulting. Store audits, custom integrations, platform migrations, and unified commerce strategy for ambitious retailers.",
  keywords: [
    "Shopify",
    "unified commerce",
    "ecommerce consulting",
    "Shopify Plus",
    "store optimization",
    "custom integrations",
    "platform migration",
    "X9Elysium",
  ],
  authors: [{ name: "X9Elysium" }],
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "X9Elysium | Shopify Commerce Consulting",
    description:
      "Enterprise Shopify consulting. Store audits, custom integrations, platform migrations, and unified commerce strategy for ambitious retailers.",
    type: "website",
    url: "https://x9elysium.com",
    siteName: "X9Elysium",
  },
  twitter: {
    card: "summary_large_image",
    title: "X9Elysium | Shopify Commerce Consulting",
    description:
      "Enterprise Shopify consulting. Store audits, custom integrations, platform migrations, and unified commerce strategy for ambitious retailers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://x9elysium.com/#organization",
        name: "X9Elysium",
        url: "https://x9elysium.com",
        logo: "https://x9elysium.com/images/x9-logo.png",
        description:
          "Enterprise Shopify consulting. Store audits, custom integrations, platform migrations, and unified commerce strategy for ambitious retailers.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-604-968-6952",
          contactType: "sales",
          email: "hello@x9elysium.com",
          areaServed: ["CA", "US"],
          availableLanguage: "English",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "28 Ann Street",
          addressLocality: "Mississauga",
          addressRegion: "ON",
          postalCode: "L5G 0E1",
          addressCountry: "CA",
        },
        sameAs: [
          "https://www.instagram.com/x9elysium/",
          "https://www.facebook.com/profile.php?id=100091230745202",
          "https://linkedin.com/company/x9elysium",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://x9elysium.com/#website",
        url: "https://x9elysium.com",
        name: "X9Elysium",
        publisher: { "@id": "https://x9elysium.com/#organization" },
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://x9elysium.com/#service",
        name: "X9Elysium Shopify Consulting",
        provider: { "@id": "https://x9elysium.com/#organization" },
        serviceType: [
          "Store Optimization & Audits",
          "Custom Apps & Integrations",
          "Platform Migrations",
          "Performance & Scaling",
          "Strategy Consulting",
          "Analytics & Reporting",
        ],
        areaServed: ["CA", "US"],
        url: "https://x9elysium.com",
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-black text-white">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
