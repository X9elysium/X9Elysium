"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

const team = [
  {
    name: "Darshan Patel",
    role: "Founder & Operations",
    bio: "Drives strategy and client partnerships. Obsessed with building commerce infrastructure that actually moves the revenue needle.",
    image: "/images/about/team/01.jpg",
  },
  {
    name: "Adhvait Jadav",
    role: "Product Lead",
    bio: "Shapes product vision and user experience. Turns complex commerce workflows into clean, intuitive solutions retailers love.",
    image: "/images/about/team/02.jpg",
  },
  {
    name: "Sam Okaster",
    role: "Engineering Lead",
    bio: "Architects the technical foundation. Specializes in Shopify Plus custom storefronts, checkout extensibility, and performance at scale.",
    image: "/images/about/team/03.jpg",
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
          <h2 className="text-h2-display text-white mb-6">
            The people behind the platform
          </h2>
          <p className="text-neutral-400 text-body-lg max-w-2xl mx-auto leading-relaxed">
            A small, senior team that embeds with your business — not a rotating
            cast of junior contractors.
          </p>
        </motion.div>

        {/* Team Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              transition={sectionTransition}
              className="glass-card p-8 text-center group hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/[0.03] transition-all duration-500"
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-emerald-500/20 ring-offset-4 ring-offset-neutral-900 bg-neutral-800">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-white tracking-tight mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-emerald-400 mb-4">
                {member.role}
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
