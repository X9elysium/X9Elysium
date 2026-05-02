"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { smoothEase } from "../lib/animations";

const faqs = [
  {
    question: "What makes X9Elysium different from other Shopify agencies?",
    answer:
      "We build commerce infrastructure, not just websites. Our Elysium Method — Discover, Strategize, Implement, Optimize — is a structured framework that consistently delivers 40%+ revenue lifts. We stay embedded after launch because that's when most agencies disappear.",
  },
  {
    question: "What size retailers do you work with?",
    answer:
      "Our sweet spot is retailers doing $500K to $20M+ annually who are ready to invest in scalable infrastructure. Whether you're migrating platforms, optimizing a Shopify store, or building unified omnichannel — we're built for brands that have outgrown basic solutions.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Store audits take 2–3 weeks. Platform migrations run 6–12 weeks depending on complexity. Custom app builds are 4–8 weeks. Full unified commerce implementations span 8–16 weeks. You'll have a clear timeline from day one.",
  },
  {
    question: "What does working with you actually look like?",
    answer:
      "It starts with a free 30-minute strategy call. Then a discovery phase — we audit your setup and build a tailored proposal with roadmap, timelines, and pricing. No guesswork, no surprises.",
  },
  {
    question: "Do you work with businesses outside Canada?",
    answer:
      "Yes. We're headquartered in Mississauga with a presence in Calgary and Vancouver, but we work with retailers across North America. Most engagements are remote-first, so location is never a barrier.",
  },
  {
    question: "What Shopify certifications does your team hold?",
    answer:
      "We're a certified Shopify Partner with deep expertise in Shopify Plus, Hydrogen storefronts, checkout extensibility, and the full ecosystem — Klaviyo, Gorgias, ReCharge, ShipBob, and more.",
  },
  {
    question: "How do you measure success?",
    answer:
      "Every project starts with defined KPIs — revenue growth, conversion rate, load time, processing speed, or retention. We build dashboards so you can track results in real time, not just at the final presentation.",
  },
  {
    question: "We're not on Shopify yet — can you still help?",
    answer:
      "That's one of our specialties. We've migrated brands from WooCommerce, Magento, BigCommerce, and custom platforms — always with zero downtime, full data integrity, and a team that handles everything end to end.",
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
          <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6">
            Got questions? We have answers.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            The most common things retailers ask us before getting started.
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
              className="border-b border-neutral-200 dark:border-white/[0.06] last:border-0"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="text-neutral-900 dark:text-white font-medium text-base sm:text-lg pr-8 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
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
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-body-sm pb-6">
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
