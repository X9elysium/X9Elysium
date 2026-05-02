"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Globe,
  MapPin,
  CheckCircle,
  Clock,
  Users,
  Zap,
  ChevronDown,
  Layers,
} from "lucide-react";
import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { smoothEase } from "../lib/animations";

const revenueOptions = [
  "Under $500K",
  "$500K – $1M",
  "$1M – $5M",
  "$5M – $20M",
  "$20M+",
];

const platformOptions = [
  "Shopify",
  "Shopify Plus",
  "WooCommerce",
  "Magento",
  "BigCommerce",
  "Salesforce Commerce Cloud",
  "Custom / Other",
];

const serviceOptions = [
  "Store Audit & Optimization",
  "Custom App Development",
  "Platform Migration",
  "Performance & Scaling",
  "Strategy Consulting",
  "Analytics & Reporting",
  "Other",
];

const trustedLogos = [
  { name: "Shopify", src: "/images/brands/shopify.png" },
  { name: "WooCommerce", src: "/images/brands/woo_commerce.png" },
  { name: "React", src: "/images/brands/react.png" },
  { name: "WordPress", src: "/images/brands/wordpress.png" },
  { name: "Wix", src: "/images/brands/wix.png" },
];

const steps = [
  {
    icon: Clock,
    title: "We respond in 24 hours",
    description:
      "Your inquiry reaches a senior strategist — not a bot.",
  },
  {
    icon: Users,
    title: "Discovery call",
    description:
      "We learn your business, explore your setup, and map the opportunity.",
  },
  {
    icon: Zap,
    title: "Clear proposal",
    description:
      "A roadmap with timelines, deliverables, and pricing. No surprises.",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    revenue: "",
    platform: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
          subject: `New inquiry from ${formState.firstName} ${formState.lastName}${formState.company ? ` — ${formState.company}` : ""}`,
          from_name: `${formState.firstName} ${formState.lastName}`,
          ...formState,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        setFormState({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          website: "",
          revenue: "",
          platform: "",
          service: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] rounded-xl px-4 py-3.5 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-white/[0.06] transition-all duration-300";
  const selectClasses =
    "w-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] rounded-xl px-4 py-3.5 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-white/[0.06] transition-all duration-300 appearance-none";
  const labelClasses = "block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-2";

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative bg-white dark:bg-black pt-[160px] sm:pt-[180px] pb-20 sm:pb-28 overflow-hidden">
          {/* Gradient mesh */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smoothEase }}
            className="section-container relative z-10 text-center"
          >
            <span className="section-label inline-block">
              Let&apos;s Build Together
            </span>
            <h1 className="text-display font-light text-neutral-900 dark:text-white tracking-tight">
              Let&apos;s talk
              <br />
              <span className="text-gradient-emerald">commerce.</span>
            </h1>
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-8 leading-relaxed">
              Tell us about your business and what you&apos;re trying to achieve.
              No pitch decks. No jargon. Just a straight conversation about where
              you&apos;re headed.
            </p>
          </motion.div>
        </section>

        {/* Trusted By */}
        <section className="bg-neutral-50 dark:bg-black border-y border-neutral-200 dark:border-white/[0.06] py-8 overflow-hidden">
          <div className="section-container">
            <p className="text-center text-label-sm text-neutral-500 mb-6">
              Technologies We Work With
            </p>
          </div>
          <div className="flex items-center justify-center gap-12 sm:gap-20 px-8 flex-wrap">
            {trustedLogos.map((logo) => (
              <div
                key={logo.name}
                className="relative h-8 w-20 sm:w-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-white dark:bg-black py-20 sm:py-28 lg:py-32">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
                className="lg:col-span-7"
              >
                {status === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-light text-neutral-900 dark:text-white mb-4 tracking-tight">
                      You&apos;re in good hands.
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-md leading-relaxed">
                      A senior strategist will review your inquiry and reach out
                      within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-10 text-emerald-500 text-sm font-medium hover:text-emerald-600 dark:hover:text-white transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white mb-2 tracking-tight">
                      Tell us about your project
                    </h2>
                    <p className="text-neutral-500 text-sm mb-10">
                      Fields marked with{" "}
                      <span className="text-emerald-500">*</span> are required.
                      Everything else is optional.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className={labelClasses}>
                            First Name{" "}
                            <span className="text-emerald-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formState.firstName}
                            onChange={handleChange}
                            placeholder="Jane"
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className={labelClasses}>
                            Last Name{" "}
                            <span className="text-emerald-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formState.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="email" className={labelClasses}>
                            Business Email{" "}
                            <span className="text-emerald-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="jane@company.com"
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className={labelClasses}>
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formState.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* Company + Website */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="company" className={labelClasses}>
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formState.company}
                            onChange={handleChange}
                            placeholder="Acme Inc."
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label htmlFor="website" className={labelClasses}>
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formState.website}
                            onChange={handleChange}
                            placeholder="https://yourstore.com"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      {/* Dropdowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="relative">
                          <label htmlFor="revenue" className={labelClasses}>
                            Annual Revenue
                          </label>
                          <select
                            id="revenue"
                            name="revenue"
                            value={formState.revenue}
                            onChange={handleChange}
                            className={selectClasses}
                          >
                            <option value="" className="bg-white dark:bg-neutral-950">
                              Select
                            </option>
                            {revenueOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-neutral-950"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 bottom-4 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label htmlFor="platform" className={labelClasses}>
                            Current Platform
                          </label>
                          <select
                            id="platform"
                            name="platform"
                            value={formState.platform}
                            onChange={handleChange}
                            className={selectClasses}
                          >
                            <option value="" className="bg-white dark:bg-neutral-950">
                              Select
                            </option>
                            {platformOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-neutral-950"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 bottom-4 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label htmlFor="service" className={labelClasses}>
                            Service Needed
                          </label>
                          <select
                            id="service"
                            name="service"
                            value={formState.service}
                            onChange={handleChange}
                            className={selectClasses}
                          >
                            <option value="" className="bg-white dark:bg-neutral-950">
                              Select
                            </option>
                            {serviceOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-neutral-950"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 bottom-4 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className={labelClasses}>
                          Tell us about your needs{" "}
                          <span className="text-emerald-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="What are you looking to achieve? Any deadlines or specific challenges?"
                          className={`${inputClasses} resize-none`}
                        />
                      </div>

                      {/* Error */}
                      {status === "error" && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                          <p className="text-red-500 dark:text-red-400 text-sm">
                            Something went wrong. Please try again or email us
                            at{" "}
                            <a
                              href="mailto:darshan@x9elysium.com"
                              className="underline"
                            >
                              darshan@x9elysium.com
                            </a>
                          </p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn-accent w-full sm:w-auto"
                      >
                        {status === "sending"
                          ? "Sending..."
                          : "Talk to Our Team"}
                        {status !== "sending" && (
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
                className="lg:col-span-5 lg:pl-8"
              >
                {/* Contact Info Card */}
                <div className="glass-card p-8 mb-8 hover:border-neutral-300 dark:hover:border-white/[0.1] transition-all duration-500">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">
                    Get in touch directly
                  </h3>
                  <div className="space-y-5">
                    <a
                      href="mailto:darshan@x9elysium.com"
                      className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-white/[0.04] border border-neutral-300 dark:border-white/[0.06] flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900 dark:text-white">Email</p>
                        <p className="text-sm">darshan@x9elysium.com</p>
                      </div>
                    </a>
                    <a
                      href="https://x9elysium.com"
                      className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-white/[0.04] border border-neutral-300 dark:border-white/[0.06] flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900 dark:text-white">Website</p>
                        <p className="text-sm">x9elysium.com</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
                      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-white/[0.04] border border-neutral-300 dark:border-white/[0.06] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900 dark:text-white">Locations</p>
                        <p className="text-sm">
                          HQ: 28 Ann St, Mississauga, ON
                        </p>
                        <p className="text-sm text-neutral-500">
                          Calgary &bull; Vancouver
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing scales with project */}
                <div className="glass-card p-8 mb-8 hover:border-neutral-300 dark:hover:border-white/[0.1] transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                        Value scales with the project
                      </h3>
                      <p className="text-xs text-emerald-500 mt-1 uppercase tracking-wider">
                        No off-the-shelf rate card
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    We price by scope, complexity, and the upside the work
                    creates — not by hours billed. A focused audit, a custom
                    integration, and a full Plus migration each carry very
                    different stakes. Tell us what you&apos;re trying to move,
                    and we&apos;ll come back with a proposal sized to it.
                  </p>
                </div>

                {/* Process Steps */}
                <div className="glass-card p-8 hover:border-neutral-300 dark:hover:border-white/[0.1] transition-all duration-500">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">
                    What happens next?
                  </h3>
                  <div className="space-y-6 relative">
                    {/* Connector line */}
                    <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/10 to-transparent" />
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center relative z-10">
                          <step.icon className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                            {step.title}
                          </p>
                          <p className="text-sm text-neutral-500 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-neutral-50 to-emerald-100/30 dark:from-emerald-950/80 dark:via-neutral-950 dark:to-emerald-900/30" />
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.1] rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

          <div className="section-container text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <h2 className="text-display-sm text-neutral-900 dark:text-white mb-6 text-balance">
                Prefer to write?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Drop us a line with a few details about your store and what
                you&apos;re trying to move. We&apos;ll come back with thoughts
                — and a proposal sized to the project.
              </p>
              <a
                href="mailto:darshan@x9elysium.com"
                className="btn-primary"
              >
                Email Us Directly
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
