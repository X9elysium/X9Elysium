"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, smoothEase } from "../../lib/animations";
import BlogCard from "./BlogCard";
import type { Post } from "../../lib/blog";

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (posts.length === 0) return null;

  return (
    <section className="section-warm" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mb-12 sm:mb-16"
        >
          <span className="section-label">Continue Reading</span>
          <h2 className="text-h2-display text-neutral-900 dark:text-white max-w-2xl text-balance">
            Related insights
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
