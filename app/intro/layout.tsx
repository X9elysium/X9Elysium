import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "An Introduction — X9Elysium",
  description:
    "Meet the founders of X9Elysium — Darshan Patel and Adhvait Jadav. Two senior Shopify Plus builders, eight years each, GTA-based. No juniors, no offshore handoffs. Rooted in Vasudhaiva Kutumbakam.",
  alternates: { canonical: "/intro" },
  openGraph: {
    title: "An Introduction — X9Elysium",
    description:
      "Founder-led Shopify Plus consulting from the Greater Toronto Area. Two senior builders, eight years each, every brief delivered by the people you hire.",
    type: "profile",
    url: "https://x9elysium.com/intro",
    siteName: "X9Elysium",
  },
  twitter: {
    card: "summary_large_image",
    title: "An Introduction — X9Elysium",
    description:
      "Founder-led Shopify Plus consulting. Two senior builders, eight years each. No juniors, no handoffs.",
  },
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
