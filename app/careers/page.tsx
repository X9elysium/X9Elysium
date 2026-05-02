import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CTABanner from "../components/CTABanner";
import CareersFilter from "./components/CareersFilter";
import {
  getAllJobs,
  getDepartments,
  getLocations,
} from "../lib/careers";

export const metadata: Metadata = {
  title:
    "Careers | X9Elysium — Build the Future of Canadian Commerce With Us",
  description:
    "Join X9Elysium — a Shopify unified commerce consultancy serving Toronto, Calgary, Vancouver, and brands across Canada. Remote-first, senior-led, outcomes-driven.",
  alternates: {
    canonical: "https://x9elysium.com/careers",
  },
  openGraph: {
    title: "Careers at X9Elysium",
    description:
      "Build the future of Canadian commerce. Remote-first, senior-led roles across engineering, design, marketing, and operations.",
    type: "website",
    url: "https://x9elysium.com/careers",
    siteName: "X9Elysium",
  },
};

const principles = [
  {
    title: "Senior by default",
    body: "We don't have a junior layer that gets thrown at clients. Every team member runs their own work and is trusted to make decisions in front of founders and CMOs.",
  },
  {
    title: "Outcomes over hours",
    body: "We measure success in revenue moved, conversions gained, and costs saved. Not utilization. Not ticket count. Bring results, not face-time.",
  },
  {
    title: "Remote, written, async",
    body: "We're a Canada-wide remote team that operates by clear briefs, recorded Looms, and crisp documents — so your time zone, school run, or quiet morning belong to you.",
  },
  {
    title: "Equity in the upside",
    body: "When the work compounds for the client, it compounds for the team too. Profit sharing tied directly to the projects you ship.",
  },
];

const valueAdds = [
  {
    label: "Real ownership",
    body: "You own a discipline, not a ticket queue. Architects own architecture. Designers own design. CSMs own the room.",
  },
  {
    label: "Direct client access",
    body: "Every hire works with founders and CMOs from day one. No account-manager firewall, no five-person stand-ups about a one-line change.",
  },
  {
    label: "Premium client roster",
    body: "We work with Shopify Plus retailers, multi-location DTC brands, and operators replatforming from Magento and SFCC. Real budgets. Real stakes.",
  },
  {
    label: "Senior mentorship",
    body: "Founders are still in the code, in the deck, and on the call. Career growth happens in pairing sessions, not annual reviews.",
  },
];

export default function CareersPage() {
  const jobs = getAllJobs();
  const departments = getDepartments();
  const locations = getLocations();

  const jsonLd = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.shortDescription,
    datePosted: job.postedAt,
    employmentType:
      job.type === "Full-time"
        ? "FULL_TIME"
        : job.type === "Part-time"
        ? "PART_TIME"
        : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "X9Elysium",
      sameAs: "https://x9elysium.com",
      logo: "https://x9elysium.com/images/x9-logo.png",
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Canada",
    },
    url: `https://x9elysium.com/careers/${job.slug}`,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://x9elysium.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Careers",
        item: "https://x9elysium.com/careers",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <a
        href="#open-roles"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to open roles
      </a>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <div className="section-container">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
                  We&apos;re hiring — Remote across Canada
                </span>
              </div>

              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05]">
                Build the future of{" "}
                <span className="text-gradient-emerald font-medium">
                  Canadian commerce
                </span>{" "}
                with us.
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed">
                X9Elysium is a senior, remote-first Shopify unified commerce
                consultancy serving brands in Toronto, Calgary, Vancouver, and
                across Canada. We hire experienced operators who want real
                ownership, direct client access, and the upside that comes with
                doing genuinely great work.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <Link href="#open-roles" className="btn-accent">
                  See open roles
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-outline">
                  About X9Elysium
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About X9Elysium */}
        <section className="section-light">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <span className="section-label">About X9Elysium</span>
                <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                  We&apos;re a Shopify consultancy built by operators.
                </h2>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  X9Elysium was founded in Vancouver in 2022 by people who had
                  spent years inside growing e-commerce brands — managing
                  platforms, fighting integrations, and watching agencies
                  deliver beautiful things that didn&apos;t actually move the
                  numbers.
                </p>
                <p>
                  Today, we&apos;re a Shopify and Shopify Plus partner serving
                  retailers and DTC brands across Canada from offices in
                  Mississauga, Calgary, and Vancouver — and a remote team
                  scattered between. We&apos;ve managed over $12M in client GMV,
                  shipped 50+ projects, and kept 98% of our clients beyond their
                  first engagement.
                </p>
                <p>
                  We&apos;re intentionally small and senior. The work is hard,
                  the standards are high, and the upside is real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What we offer / value add */}
        <section className="section-dark">
          <div className="section-container">
            <div className="mb-14 sm:mb-16 max-w-3xl">
              <span className="section-label">Why X9Elysium</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                What you get working here
              </h2>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed">
                We&apos;ve been on the other side of bad agency life — utilization
                targets, six-person stand-ups, juniors fronting senior work. We
                built X9Elysium to be the opposite.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {valueAdds.map((v) => (
                <div
                  key={v.label}
                  className="glass-card p-7 lg:p-8 hover:border-emerald-500/15 transition-all duration-500"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">
                    {v.label}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="section-warm">
          <div className="section-container">
            <div className="mb-14 sm:mb-16 max-w-3xl">
              <span className="section-label">How We Work</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Four principles that shape every hire
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200/60 dark:bg-white/[0.06] rounded-2xl overflow-hidden">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="bg-neutral-50 dark:bg-neutral-950 p-8 lg:p-10"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section id="open-roles" className="section-light">
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <span className="section-label">Open Roles</span>
              <h2 className="text-h2-display text-neutral-900 dark:text-white text-balance">
                Find your role
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
                All roles below are remote, Canada-wide. Filter by department or
                location to narrow your search.
              </p>
            </div>

            <CareersFilter
              jobs={jobs}
              departments={departments}
              locations={locations}
            />
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
