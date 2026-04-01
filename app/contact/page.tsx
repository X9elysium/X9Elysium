"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
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

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative bg-black pt-[140px] sm:pt-[160px] pb-16 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#009eff]/[0.03] rounded-full blur-[150px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="section-container relative z-10 text-center"
          >
            <span className="section-label">Contact Us</span>
            <h1 className="text-display font-light text-white mt-6 text-balance">
              Ready to talk?
            </h1>
            <p className="text-lg sm:text-xl text-[#9b9b9b] max-w-2xl mx-auto mt-6 leading-relaxed">
              Discover how X9Elysium can help you build, optimize, and scale
              your Shopify commerce ecosystem.
            </p>
          </motion.div>
        </section>

        {/* Form + Sidebar */}
        <section className="bg-black py-16 sm:py-[100px]">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-2"
              >
                {status === "sent" ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CheckCircle className="w-16 h-16 text-[#009eff] mb-6" />
                    <h2 className="text-3xl font-light text-white mb-4">
                      Thank you!
                    </h2>
                    <p className="text-[#9b9b9b] text-lg max-w-md">
                      We&apos;ve received your message and will get back to you
                      within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="btn-accent mt-8"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          First Name <span className="text-[#009eff]">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formState.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Last Name <span className="text-[#009eff]">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formState.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Business Email{" "}
                          <span className="text-[#009eff]">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Company + Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formState.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Website URL
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formState.website}
                          onChange={handleChange}
                          placeholder="https://yourstore.com"
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Dropdowns Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="revenue"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Annual Revenue
                        </label>
                        <select
                          id="revenue"
                          name="revenue"
                          value={formState.revenue}
                          onChange={handleChange}
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors appearance-none"
                        >
                          <option value="" className="bg-[#151515]">
                            Select
                          </option>
                          {revenueOptions.map((opt) => (
                            <option
                              key={opt}
                              value={opt}
                              className="bg-[#151515]"
                            >
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="platform"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Current Platform
                        </label>
                        <select
                          id="platform"
                          name="platform"
                          value={formState.platform}
                          onChange={handleChange}
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors appearance-none"
                        >
                          <option value="" className="bg-[#151515]">
                            Select
                          </option>
                          {platformOptions.map((opt) => (
                            <option
                              key={opt}
                              value={opt}
                              className="bg-[#151515]"
                            >
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="service"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Service Needed
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formState.service}
                          onChange={handleChange}
                          className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors appearance-none"
                        >
                          <option value="" className="bg-[#151515]">
                            Select
                          </option>
                          {serviceOptions.map((opt) => (
                            <option
                              key={opt}
                              value={opt}
                              className="bg-[#151515]"
                            >
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-white mb-2"
                      >
                        Tell us about your needs{" "}
                        <span className="text-[#009eff]">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Describe your project, goals, and timeline..."
                        className="w-full bg-white/[0.06] border border-white/10 rounded-[4px] px-4 py-3.5 text-white placeholder:text-[#9b9b9b]/50 focus:outline-none focus:border-[#009eff] focus:ring-1 focus:ring-[#009eff] transition-colors resize-none"
                      />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <p className="text-red-400 text-sm">
                        Something went wrong. Please try again or email us
                        directly.
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-accent w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? "Sending..." : "Talk to Our Team"}
                      {status !== "sending" && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-10"
              >
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Get in touch
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:hello@X9Elysium.com"
                      className="flex items-center gap-3 text-[#9b9b9b] hover:text-[#009eff] transition-colors"
                    >
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">hello@X9Elysium.com</span>
                    </a>
                    <a
                      href="tel:+16049686952"
                      className="flex items-center gap-3 text-[#9b9b9b] hover:text-[#009eff] transition-colors"
                    >
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">+1 (604) 968-6952</span>
                    </a>
                    <div className="flex items-center gap-3 text-[#9b9b9b]">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">Vancouver, BC</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-10">
                  <h3 className="text-lg font-medium text-white mb-4">
                    What happens next?
                  </h3>
                  <ol className="space-y-4">
                    {[
                      "We review your inquiry within 24 hours",
                      "A strategist reaches out to schedule a discovery call",
                      "We present a tailored proposal and roadmap",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#009eff]/10 text-[#009eff] text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[#9b9b9b] leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="border-t border-white/10 pt-10">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Trusted by ambitious retailers
                  </h3>
                  <p className="text-sm text-[#9b9b9b] leading-relaxed">
                    From emerging DTC brands to enterprise retailers — we&apos;ve
                    helped businesses scale their Shopify commerce operations
                    across every channel.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
