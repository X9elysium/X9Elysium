"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { smoothEase } from "../../lib/animations";
import type { FAQItem } from "../../lib/blog";

interface FAQBlockProps {
  faqs: FAQItem[];
}

export default function FAQBlock({ faqs }: FAQBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="section-dark" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-12 sm:mb-16"
        >
          <span className="section-label">Frequently Asked</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
            Quick answers
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          className="max-w-3xl"
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
                  {faq.q}
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
                      {faq.a}
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
