"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { fadeUp, sectionTransition } from "../../lib/animations";
import { formatPostDate } from "../../lib/blog-types";
import type { Post } from "../../lib/blog-types";

interface BlogCardProps {
  post: Post;
  variant?: "default" | "featured";
}

export default function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const { frontmatter, slug, readingTime } = post;
  const isFeatured = variant === "featured";

  return (
    <motion.article
      variants={fadeUp}
      transition={sectionTransition}
      className={`group relative ${
        isFeatured ? "lg:col-span-2" : ""
      }`}
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className="glass-card overflow-hidden h-full flex flex-col hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] hover:-translate-y-1 transition-all duration-500">
          <div
            className={`relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${
              isFeatured ? "aspect-[16/9]" : "aspect-[3/2]"
            }`}
          >
            {frontmatter.heroImage && (
              <Image
                src={frontmatter.heroImage}
                alt={frontmatter.heroImageAlt || frontmatter.title}
                fill
                sizes={isFeatured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-label-sm uppercase tracking-[0.1em]">
                {frontmatter.category}
              </span>
            </div>
          </div>

          <div className={`flex flex-col flex-1 ${isFeatured ? "p-8 lg:p-10" : "p-6 lg:p-8"}`}>
            <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-500 text-label-sm uppercase tracking-[0.1em] mb-4">
              <span>{formatPostDate(frontmatter.publishedAt)}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-700" />
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} min
              </span>
            </div>

            <h3
              className={`font-semibold text-neutral-900 dark:text-white tracking-tight text-balance group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 ${
                isFeatured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {frontmatter.title}
            </h3>

            {frontmatter.description && (
              <p
                className={`text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3 ${
                  isFeatured ? "text-body-lg line-clamp-3" : "text-body-sm line-clamp-2"
                }`}
              >
                {frontmatter.description}
              </p>
            )}

            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="text-neutral-700 dark:text-neutral-300 text-body-sm font-medium">
                {frontmatter.author.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-label-sm uppercase tracking-[0.12em]">
                Read
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
