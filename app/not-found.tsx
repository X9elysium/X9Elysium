import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist on x9elysium.com. Browse services, our work, or get in touch.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://x9elysium.com/404" },
};

const destinations = [
  {
    href: "/services",
    title: "Services",
    blurb: "Audits, migrations, custom apps, headless, unified commerce.",
  },
  {
    href: "/work",
    title: "Our Work",
    blurb: "How we ship — anonymized for active engagements.",
  },
  {
    href: "/blog",
    title: "Insights",
    blurb: "Field notes from real Shopify Plus engagements.",
  },
  {
    href: "/contact",
    title: "Contact",
    blurb: "24-hour senior-founder reply. No junior triage.",
  },
];

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <div className="section-container pt-32 pb-20 sm:pt-40 sm:pb-28">
            <div className="max-w-3xl">
              <span className="section-label">404 — Not Found</span>
              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05] tracking-tight">
                That page isn&apos;t here.
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                The link is dead, the URL is mistyped, or we moved the page.
                Either way, here&apos;s where most people are headed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/" className="btn-accent">
                  <ArrowLeft className="w-4 h-4" />
                  Back to home
                </Link>
                <Link href="/contact" className="btn-outline">
                  Talk to a founder
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl">
              {destinations.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="group rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.04] p-6 hover:border-emerald-500/20 hover:bg-white dark:hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-500"
                >
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight mb-1.5 inline-flex items-center gap-2">
                    {d.title}
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {d.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
