"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { smoothEase } from "../lib/animations";

const techPartners = [
  {
    name: "Shopify",
    logo: (
      <svg viewBox="0 0 109 40" className="h-8 sm:h-10" fill="currentColor">
        <path d="M25.86 8.94c-.04-.33-.32-.51-.55-.53-.23-.02-4.83-.1-4.83-.1s-3.2-3.18-3.56-3.54c-.36-.36-1.05-.25-1.32-.17-.04.01-.71.22-1.89.58-.29-.87-.74-1.93-1.46-2.97C10.83.83 9.21.01 7.87.01 7.73.01 7.6.02 7.46.03 7.38-.06 7.3-.15 7.2-.23 5.97-1.28 4.42-.88 3.18.63 1.68 2.5.53 5.38.03 7.53c-.72.22-1.24.38-1.3.4-.88.28-.91.31-1.02 1.14C-.37 9.72 0 28.59 0 28.59l19.48 3.65L25.86 8.94zM16.97 5.29l-2.88.89c0-.04 0-.08 0-.12 0-1.28-.18-2.31-.47-3.13l2.05.34c.11.01.18.09.2.18.04.15.09.42.11.76.04.4.03.87-.01 1.08zM13.42 2.16c.33.79.55 1.91.55 3.46 0 .11 0 .2-.01.3l-3.77 1.17c.73-2.76 2.09-4.17 3.23-4.93zM7.97 1.07c.15 0 .3.02.45.07-1.6.75-3.32 2.65-4.05 6.43l-2.99.93C2.18 5.32 4.3 1.07 7.97 1.07z" />
        <path d="M25.31 8.41c-.23-.02-4.83-.1-4.83-.1s-3.2-3.18-3.56-3.54c-.13-.13-.3-.2-.48-.22l-1.69 34.46 11.42-2.47S25.86 8.74 25.86 8.94c-.04-.33-.32-.51-.55-.53z" opacity=".5" />
        <path d="M12.52 14.71l-1.67 5.09s-.73-.39-1.63-.39c-1.32 0-1.39.83-1.39 1.04 0 1.14 2.97 1.58 2.97 4.26 0 2.11-1.34 3.47-3.14 3.47-2.17 0-3.27-1.35-3.27-1.35l.58-1.91s1.14.98 2.1.98c.63 0 .89-.49.89-.86 0-1.49-2.44-1.56-2.44-4.01 0-2.06 1.48-4.05 4.47-4.05 1.15 0 1.53.33 1.53.33z" />
        <path d="M38.34 20.96c-1.27-.68-1.91-1.27-1.91-2.07 0-1.02.89-1.67 2.28-1.67 1.62 0 3.06.67 3.06.67l1.13-3.47s-1.05-.81-4.12-.81c-4.28 0-7.24 2.45-7.24 5.89 0 1.95 1.38 3.44 3.22 4.5 1.48.86 2 1.46 2 2.35 0 .93-.75 1.67-2.14 1.67-2.07 0-4.02-1.07-4.02-1.07l-1.2 3.47s1.8 1.22 4.83 1.22c4.4 0 7.55-2.17 7.55-6.08-.01-2.11-1.58-3.59-3.44-4.6zM55.14 13.48c-2.17 0-3.87.98-5.18 2.49l-.07-.02 1.88-9.49h-4.88l-4.76 25.13h4.88l1.63-8.59c.63-3.22 2.31-5.2 3.87-5.2 1.11 0 1.54.75 1.54 1.83 0 .67-.07 1.51-.21 2.18l-1.85 9.78h4.88l1.91-10.1c.21-1.04.35-2.28.35-3.11 0-2.77-1.46-4.9-4.99-4.9zM68.71 13.48c-5.87 0-9.76 5.3-9.76 11.2 0 3.78 2.34 7.08 6.72 7.08 5.77 0 9.62-5.16 9.62-11.2.01-3.48-2.03-7.08-6.58-7.08zm-2.45 14.64c-1.67 0-2.38-1.43-2.38-3.22 0-2.84 1.46-7.83 4.15-7.83 1.74 0 2.28 1.49 2.28 2.94 0 3.11-1.48 8.11-4.05 8.11zM84.89 13.48c-3.29 0-5.16 2.9-5.16 2.9h-.07l.28-2.63h-4.32c-.22 1.8-.6 4.53-1.01 6.57l-3.41 18.02h4.88l1.37-7.29h.1s1.01.67 2.87.67c5.73 0 9.48-5.87 9.48-11.81 0-3.27-1.46-6.43-5.01-6.43zm-3.97 14.78c-1.01 0-1.6-.57-1.6-.57l.65-3.63c.56-2.97 2.1-4.95 3.73-4.95 1.43 0 1.88 1.34 1.88 2.63 0 3.18-2.1 6.52-4.66 6.52zM94.93 8.7c-1.56 0-2.8 1.25-2.8 2.84 0 1.45.93 2.45 2.31 2.45h.07c1.53 0 2.84-1.02 2.87-2.84 0-1.42-.96-2.45-2.45-2.45zM89.71 31.59h4.88l3.34-17.58h-4.92l-3.3 17.58zM108.18 13.98h-3.39l.16-.81c.28-1.57 1.22-2.97 2.8-2.97.84 0 1.51.24 1.51.24l.96-3.84s-.82-.42-2.59-.42c-1.69 0-3.38.48-4.67 1.58-1.62 1.38-2.38 3.36-2.77 5.36l-.14.72h-2.27l-.72 3.62h2.27l-2.59 13.96h4.88l2.59-13.96h3.36l.61-3.48z" />
      </svg>
    ),
  },
  {
    name: "Shopify Plus",
    logo: (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 109 40" className="h-8 sm:h-10" fill="currentColor">
          <path d="M25.86 8.94c-.04-.33-.32-.51-.55-.53-.23-.02-4.83-.1-4.83-.1s-3.2-3.18-3.56-3.54c-.36-.36-1.05-.25-1.32-.17-.04.01-.71.22-1.89.58-.29-.87-.74-1.93-1.46-2.97C10.83.83 9.21.01 7.87.01 7.73.01 7.6.02 7.46.03 7.38-.06 7.3-.15 7.2-.23 5.97-1.28 4.42-.88 3.18.63 1.68 2.5.53 5.38.03 7.53c-.72.22-1.24.38-1.3.4-.88.28-.91.31-1.02 1.14C-.37 9.72 0 28.59 0 28.59l19.48 3.65L25.86 8.94z" />
        </svg>
        <span className="text-sm font-bold tracking-tight">Plus</span>
      </div>
    ),
  },
  {
    name: "Klaviyo",
    logo: (
      <span className="text-xl sm:text-2xl font-bold tracking-tight">
        klaviyo
      </span>
    ),
  },
  {
    name: "Gorgias",
    logo: (
      <span className="text-xl sm:text-2xl font-bold tracking-tight">
        Gorgias
      </span>
    ),
  },
  {
    name: "ReCharge",
    logo: (
      <span className="text-xl sm:text-2xl font-bold tracking-tight">
        ReCharge
      </span>
    ),
  },
  {
    name: "ShipBob",
    logo: (
      <span className="text-xl sm:text-2xl font-bold tracking-tight">
        ShipBob
      </span>
    ),
  },
];

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-warm overflow-hidden" ref={ref}>
      <div className="section-container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center"
        >
          <span className="section-label text-center block">
            Technology Partners
          </span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white text-center max-w-2xl mx-auto">
            Certified across the Shopify ecosystem
          </h2>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges — color matches section-warm in light, neutral-900 in dark */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[#f7f5f2] dark:from-[#171717] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[#f7f5f2] dark:from-[#171717] to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 sm:gap-24"
        >
          {[
            ...techPartners,
            ...techPartners,
            ...techPartners,
            ...techPartners,
          ].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 px-4 py-6 text-neutral-900/25 dark:text-white/25 hover:text-neutral-900/70 dark:hover:text-white/70 transition-colors duration-500 cursor-default"
            >
              {partner.logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
