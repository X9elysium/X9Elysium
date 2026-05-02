"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { fadeUp, fadeUpBlur, heroStagger, smoothEase } from "../../lib/animations";
import { formatPostDate } from "../../lib/blog-types";
import type { PostFrontmatter } from "../../lib/blog-types";

interface BlogHeroProps {
  frontmatter: PostFrontmatter;
  readingTime: number;
}

export default function BlogHero({ frontmatter, readingTime }: BlogHeroProps) {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-white to-white dark:from-neutral-950 dark:via-black dark:to-black" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-700/[0.04] rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className="section-container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroStagger}
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: smoothEase }}>
            <Link
              href="/blog"
              className="text-label-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors uppercase tracking-[0.12em]"
            >
              ← Back to Blog
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex flex-wrap items-center gap-3 mt-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-label-sm uppercase tracking-[0.1em]">
              <Tag className="w-3 h-3" />
              {frontmatter.category}
            </span>
            {frontmatter.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-neutral-200/60 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 text-label-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            variants={fadeUpBlur}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-display-sm font-light text-neutral-900 dark:text-white text-balance mt-6 leading-[1.05]"
          >
            {frontmatter.title}
          </motion.h1>

          {frontmatter.description && (
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-body-lg text-neutral-600 dark:text-neutral-400 mt-6 max-w-2xl leading-relaxed"
            >
              {frontmatter.description}
            </motion.p>
          )}

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-neutral-500 dark:text-neutral-500 text-body-sm"
          >
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {frontmatter.author.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatPostDate(frontmatter.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
            {frontmatter.updatedAt &&
              frontmatter.updatedAt !== frontmatter.publishedAt && (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Updated {formatPostDate(frontmatter.updatedAt)}
                </span>
              )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
