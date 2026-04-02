"use client";

import { useState, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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
    title: "We respond within 24 hours",
    description:
      "Your inquiry lands with a senior strategist — not a chatbot.",
  },
  {
    icon: Users,
    title: "Discovery call",
    description:
      "We learn your business, audit your current setup, and identify opportunities.",
  },
  {
    icon: Zap,
    title: "Tailored proposal",
    description:
      "You receive a clear roadmap with timelines, deliverables, and pricing.",
  },
];

function useScrollReveal() {
  const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>;
  return ref;
}

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
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
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
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10b981]/50 focus:bg-white/[0.06] transition-all duration-300";
  const selectClasses =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-[#10b981]/50 focus:bg-white/[0.06] transition-all duration-300 appearance-none";
  const labelClasses = "block text-[13px] font-medium text-zinc-300 mb-2";

  return (
    <>
      <Navigation />
      <main>
        {/* ── Hero ── */}
        <section className="relative bg-black pt-[160px] sm:pt-[180px] pb-20 sm:pb-28 overflow-hidden">
          {/* Gradient mesh */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#000814] via-black to-black" />
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#10b981]/[0.06] rounded-full blur-[200px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#10b981]/[0.03] rounded-full blur-[150px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="section-container relative z-10 text-center"
          >
            <span className="inline-block text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#10b981] mb-6">
              Let&apos;s Build Together
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[1.05]">
              Ready to scale
              <br />
              <span className="text-[#10b981]">your commerce?</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mt-8 leading-relaxed">
              Tell us about your business and we&apos;ll show you exactly how to
              grow. No pitch decks, no fluff — just a clear plan.
            </p>
          </motion.div>
        </section>

        {/* ── Trusted By (Marquee-style) ── */}
        <section className="bg-black border-y border-white/[0.06] py-8 overflow-hidden">
          <div className="section-container">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 mb-6">
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

        {/* ── Form Section ── */}
        <section className="bg-black py-20 sm:py-[120px]">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-7"
              >
                {status === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-8">
                      <CheckCircle className="w-10 h-10 text-[#10b981]" />
                    </div>
                    <h2 className="text-4xl font-light text-white mb-4 tracking-tight">
                      We&apos;ve got it.
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                      A senior strategist will review your inquiry and reach out
                      within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-10 text-[#10b981] text-sm font-medium hover:text-white transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-light text-white mb-2 tracking-tight">
                      Tell us about your project
                    </h2>
                    <p className="text-zinc-500 text-sm mb-10">
                      Fields marked with{" "}
                      <span className="text-[#10b981]">*</span> are required.
                      Everything else is optional.
                    </p>
                    <form
                      name="contact"
                      method="POST"
                      data-netlify="true"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <input type="hidden" name="form-name" value="contact" />
                      {/* Name Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className={labelClasses}>
                            First Name{" "}
                            <span className="text-[#10b981]">*</span>
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
                            <span className="text-[#10b981]">*</span>
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
                            <span className="text-[#10b981]">*</span>
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
                        <div>
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
                            <option value="" className="bg-[#0a0a0a]">
                              Select
                            </option>
                            {revenueOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-[#0a0a0a]"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
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
                            <option value="" className="bg-[#0a0a0a]">
                              Select
                            </option>
                            {platformOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-[#0a0a0a]"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
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
                            <option value="" className="bg-[#0a0a0a]">
                              Select
                            </option>
                            {serviceOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-[#0a0a0a]"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className={labelClasses}>
                          Tell us about your needs{" "}
                          <span className="text-[#10b981]">*</span>
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
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                          <p className="text-red-400 text-sm">
                            Something went wrong. Please try again or email us at{" "}
                            <a
                              href="mailto:darshanpatel1902@gmail.com"
                              className="underline"
                            >
                              darshanpatel1902@gmail.com
                            </a>
                          </p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-[#10b981] text-white text-[0.875rem] font-bold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 hover:bg-[#059669] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                transition={{ duration: 0.7, delay: 0.25 }}
                className="lg:col-span-5 lg:pl-8"
              >
                {/* Contact Info Card */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mb-8">
                  <h3 className="text-lg font-medium text-white mb-6">
                    Get in touch directly
                  </h3>
                  <div className="space-y-5">
                    <a
                      href="mailto:darshanpatel1902@gmail.com"
                      className="flex items-center gap-4 text-zinc-400 hover:text-[#10b981] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-[#10b981]/30 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-white">Email</p>
                        <p className="text-sm">darshanpatel1902@gmail.com</p>
                      </div>
                    </a>
                    <a
                      href="tel:+16049686952"
                      className="flex items-center gap-4 text-zinc-400 hover:text-[#10b981] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-[#10b981]/30 transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-white">Phone</p>
                        <p className="text-sm">+1 (604) 968-6952</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 text-zinc-400">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-white">Locations</p>
                        <p className="text-sm">HQ: 28 Ann St, Mississauga, ON</p>
                        <p className="text-sm text-zinc-500">Calgary &bull; Vancouver</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Steps */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                  <h3 className="text-lg font-medium text-white mb-6">
                    What happens next?
                  </h3>
                  <div className="space-y-6">
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                          <step.icon className="w-4 h-4 text-[#10b981]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-1">
                            {step.title}
                          </p>
                          <p className="text-sm text-zinc-500 leading-relaxed">
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

        {/* ── Bottom CTA ── */}
        <section className="bg-[#10b981] py-16 sm:py-20">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-6 tracking-tight text-balance">
                Prefer a quick chat?
              </h2>
              <p className="text-white/80 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Book a 15-minute discovery call. No commitment — just a
                conversation about where your commerce is headed.
              </p>
              <a
                href="mailto:darshanpatel1902@gmail.com"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-black text-white text-[0.875rem] font-bold uppercase tracking-[1.5px] rounded-lg transition-all duration-300 hover:bg-[#151515] active:scale-[0.98]"
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
