"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

type Member = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  image?: string;
  linkedin: string;
};

const team: Member[] = [
  {
    name: "Darshan Patel",
    role: "Founder & Full-Stack Lead",
    bio: "Drives strategy, architecture, and client delivery. Eight years across Shopify, custom apps, and headless storefronts on React, Next.js, Node, GCP, and AWS.",
    initials: "DP",
    linkedin: "https://www.linkedin.com/in/dpatel99/",
  },
  {
    name: "Adhvait Jadav",
    role: "Full-Stack Lead",
    bio: "Owns delivery on Hydrogen storefronts, custom apps, and back-end integrations. Currently inside Shopify Support — gives X9Elysium an insider's view of merchant pain.",
    initials: "AJ",
    linkedin: "https://www.linkedin.com/in/adhvaitjadav/",
  },
];

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          <span className="section-label">Our Team</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white mb-6">
            Two senior builders. No layers in between.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            You work directly with the people writing the code and making the
            calls — not a rotating cast of junior contractors.
          </p>
        </motion.div>

        {/* Team Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
        >
          {team.map((member) => (
            <motion.a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              variants={fadeUp}
              transition={sectionTransition}
              className="group relative glass-card p-8 text-center hover:border-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/[0.05] transition-all duration-500"
            >
              {/* LinkedIn icon — appears on hover */}
              <span
                aria-hidden="true"
                className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.75} />
              </span>

              {/* Avatar — image with initials fallback */}
              <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-neutral-50 dark:ring-offset-neutral-900 bg-gradient-to-br from-emerald-400/20 to-emerald-600/30">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                      {member.initials}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-emerald-500 dark:text-emerald-400 mb-4">
                {member.role}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {member.bio}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
