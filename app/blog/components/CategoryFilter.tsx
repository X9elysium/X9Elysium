"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "../../lib/animations";
import BlogCard from "./BlogCard";
import type { Post, BlogCategory } from "../../lib/blog";

type FilterValue = "All" | BlogCategory;

interface CategoryFilterProps {
  posts: Post[];
  categories: { category: BlogCategory; count: number }[];
}

export default function CategoryFilter({ posts, categories }: CategoryFilterProps) {
  const [active, setActive] = useState<FilterValue>("All");

  const filtered =
    active === "All"
      ? posts
      : posts.filter((p) => p.frontmatter.category === active);

  const totalCount = posts.length;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-12">
        <FilterPill
          label="All"
          count={totalCount}
          active={active === "All"}
          onClick={() => setActive("All")}
        />
        {categories.map(({ category, count }) => (
          <FilterPill
            key={category}
            label={category}
            count={count}
            active={active === category}
            onClick={() => setActive(category)}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        key={active}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-500 dark:text-neutral-500 py-16">
          No posts in this category yet.
        </p>
      )}
    </>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-sm uppercase tracking-[0.1em] border transition-all duration-300 ${
        active
          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
          : "bg-transparent border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400"
      }`}
    >
      {label}
      <span
        className={`text-[10px] font-mono ${
          active ? "text-white/80" : "text-neutral-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
