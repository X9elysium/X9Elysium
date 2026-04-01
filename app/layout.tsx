import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "X9Elysium — Shopify Unified Commerce Consulting",
  description:
    "Scale your Shopify store with expert unified commerce solutions. Audits, custom integrations, migrations, and growth strategies for ambitious retailers.",
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
  openGraph: {
    title: "X9Elysium — Shopify Unified Commerce Consulting",
    description:
      "Scale your Shopify store with expert unified commerce solutions.",
    type: "website",
    url: "https://x9elysium.com",
    siteName: "X9Elysium",
  },
  twitter: {
    card: "summary_large_image",
    title: "X9Elysium — Shopify Unified Commerce Consulting",
    description:
      "Scale your Shopify store with expert unified commerce solutions.",
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
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
