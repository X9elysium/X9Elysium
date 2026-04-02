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
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-black text-white">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
