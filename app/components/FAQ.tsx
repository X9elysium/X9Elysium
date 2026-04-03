"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { smoothEase } from "../lib/animations";

const faqs = [
  {
    question: "How is X9Elysium different from other Shopify agencies?",
    answer:
      "Most agencies build websites — we architect unified commerce infrastructure. Our Elysium Method is a four-phase framework (Discover, Strategize, Implement, Optimize) that consistently delivers 40%+ revenue lifts. We embed with your team long-term rather than handing off deliverables and disappearing.",
  },
  {
    question: "What size businesses do you work with?",
    answer:
      "We work best with retailers doing $500K to $20M+ in annual revenue who are ready to invest in scalable commerce infrastructure. Whether you're migrating from a legacy platform, optimizing an existing Shopify store, or building a unified omnichannel setup — our services are built for brands that have outgrown basic solutions.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Store audits and optimization roadmaps take 2-3 weeks. Platform migrations typically run 6-12 weeks depending on complexity. Custom app development varies from 4-8 weeks. Full unified commerce implementations can span 8-16 weeks. We always provide a detailed timeline during our discovery phase.",
  },
  {
    question: "What does the engagement process look like?",
    answer:
      "It starts with a free 30-minute strategy call where we learn about your business and current setup. From there, we conduct a discovery phase to audit your existing infrastructure, then present a tailored proposal with a clear roadmap, timelines, and deliverables. No surprises — you know exactly what you're getting.",
  },
  {
    question: "Do you work with businesses outside Canada?",
    answer:
      "Absolutely. While we're headquartered in Mississauga with offices in Calgary and Vancouver, we work with retailers across North America. Shopify is a global platform, and our expertise translates across markets. We've delivered projects for brands in the US and Canada.",
  },
  {
    question: "What Shopify certifications does your team hold?",
    answer:
      "We're a certified Shopify Partner with deep expertise across Shopify Plus, checkout extensibility, custom storefronts (Hydrogen), and the full Shopify ecosystem including Klaviyo, Gorgias, ReCharge, and ShipBob integrations. Our team stays current with every platform update.",
  },
  {
    question: "How do you measure success?",
    answer:
      "Every engagement starts with clearly defined KPIs — revenue growth, conversion rate, page load time, order processing speed, or customer retention, depending on the project. We set up custom analytics dashboards so you can track results in real time. Our 98% client retention rate speaks to the outcomes we deliver.",
  },
  {
    question: "What if we're not on Shopify yet?",
    answer:
      "That's one of our specialties. We've migrated retailers from WooCommerce, Magento, BigCommerce, and custom platforms to Shopify and Shopify Plus — with zero downtime. We handle everything: data migration, design, integrations, and team training so the transition is seamless.",
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-dark" ref={ref}>
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="section-label">Common Questions</span>
          <h2 className="text-h2-display text-white mb-6">
            Everything you need to know
          </h2>
          <p className="text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            Answers to the questions we hear most from retailers evaluating
            their next commerce partner.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/[0.06] last:border-0"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="text-white font-medium text-base sm:text-lg pr-8 group-hover:text-emerald-400 transition-colors duration-300">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: smoothEase }}
                    className="overflow-hidden"
                  >
                    <p className="text-neutral-400 leading-relaxed text-body-sm pb-6">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
