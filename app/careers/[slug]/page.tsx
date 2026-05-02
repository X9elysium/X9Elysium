import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Mail,
  Check,
} from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { getAllJobs, getJobBySlug } from "../../lib/careers";

export async function generateStaticParams() {
  return getAllJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = getJobBySlug(params.slug);
  if (!job) return { title: "Role not found" };

  const url = `https://x9elysium.com/careers/${job.slug}`;
  return {
    title: `${job.title} | Careers at X9Elysium`,
    description: job.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${job.title} — X9Elysium`,
      description: job.shortDescription,
      type: "article",
      url,
      siteName: "X9Elysium",
    },
  };
}

export default function JobDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const job = getJobBySlug(params.slug);
  if (!job) notFound();

  const subjectLine = encodeURIComponent(
    `Application — ${job.title} (${job.location})`,
  );
  const mailto = `mailto:careers@x9elysium.com?subject=${subjectLine}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.about}\n\nResponsibilities: ${job.responsibilities.join(" ")}\n\nRequirements: ${job.requirements.join(" ")}`,
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
    industry: "E-commerce / Shopify Consulting",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[160px] pointer-events-none" />
          </div>

          <div className="section-container">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All open roles
            </Link>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/[0.06]">
                  {job.type}
                </span>
              </div>

              <h1 className="text-display-sm font-light text-neutral-900 dark:text-white text-balance leading-[1.05] tracking-tight">
                {job.title}
              </h1>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed">
                {job.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  {job.experience}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {job.type}
                </span>
                {job.salaryRange && (
                  <span className="inline-flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {job.salaryRange}
                  </span>
                )}
              </div>

              <div className="mt-10">
                <a href={mailto} className="btn-accent">
                  Apply for this role
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="pb-20 sm:pb-28">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <article className="lg:col-span-8 flex flex-col gap-12">
                <Block title="About the role">
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {job.about}
                  </p>
                </Block>

                <Block title="What you&rsquo;ll do">
                  <BulletList items={job.responsibilities} />
                </Block>

                <Block title="What we&rsquo;re looking for">
                  <BulletList items={job.requirements} />
                </Block>

                {job.niceToHave && job.niceToHave.length > 0 && (
                  <Block title="Nice to have">
                    <BulletList items={job.niceToHave} />
                  </Block>
                )}

                <Block title="What you get">
                  <BulletList items={job.whatYouGet} />
                </Block>

                {/* How to apply */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 lg:p-10">
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    Ready to apply?
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    Send us your CV, a short note on why this role caught your
                    eye, and any work you&apos;re proud of — links to live sites,
                    GitHub, decks, or case studies. No cover-letter theatre
                    needed.
                  </p>
                  <a
                    href={mailto}
                    className="inline-flex items-center gap-2 btn-accent"
                  >
                    <Mail className="w-4 h-4" />
                    careers@x9elysium.com
                  </a>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-28 flex flex-col gap-6">
                  <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500 mb-4">
                      Quick facts
                    </h3>
                    <dl className="flex flex-col gap-3 text-sm">
                      <FactRow label="Department" value={job.department} />
                      <FactRow label="Location" value={job.location} />
                      <FactRow label="Employment" value={job.type} />
                      <FactRow label="Experience" value={job.experience} />
                      {job.salaryRange && (
                        <FactRow
                          label="Salary range"
                          value={job.salaryRange}
                        />
                      )}
                      <FactRow
                        label="Posted"
                        value={new Date(job.postedAt).toLocaleDateString(
                          "en-CA",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      />
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500 mb-3">
                      About X9Elysium
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                      A senior, remote-first Shopify unified commerce
                      consultancy serving brands across Canada. Built by
                      operators, run on outcomes.
                    </p>
                    <Link
                      href="/about"
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1.5"
                    >
                      Learn more
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-2xl font-semibold text-neutral-900 dark:text-white mb-5 tracking-tight"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-white/[0.04] last:border-0 last:pb-0">
      <dt className="text-neutral-500 dark:text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-900 dark:text-white text-right">
        {value}
      </dd>
    </div>
  );
}
