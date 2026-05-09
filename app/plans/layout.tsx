import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Plans · X9Elysium",
  description: "Private editable plan viewer. Discoverable by URL only.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <div className="pt-[72px] lg:pt-[80px]">
        <main className="section-container py-6 lg:py-10">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
