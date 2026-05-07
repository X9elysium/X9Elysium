import type { Metadata } from "next";
import SupremeClient from "./SupremeClient";

export const metadata: Metadata = {
  title: "Supreme — the lab",
  description:
    "Not a service. The R&D vehicle for what X9Elysium will sell in 2027 and beyond — AI-native commerce surfaces, generative interfaces, agentic workflows. Hidden until worth showing.",
  alternates: { canonical: "https://x9elysium.com/supreme" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: "Supreme — the lab",
    description: "the R&D vehicle. hidden until worth showing.",
    url: "https://x9elysium.com/supreme",
    type: "website",
  },
};

export default function SupremePage() {
  return <SupremeClient />;
}
