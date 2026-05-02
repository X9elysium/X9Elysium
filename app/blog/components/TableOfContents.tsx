"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../../lib/mdx";

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <h4 className="text-label-sm uppercase tracking-[0.12em] text-emerald-500 mb-4">
        On this page
      </h4>
      <ul className="space-y-2 text-body-sm border-l border-neutral-200 dark:border-white/[0.06]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block pl-4 -ml-px border-l py-1 transition-all duration-300 ${
                item.level === 3 ? "ml-3" : ""
              } ${
                activeId === item.id
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "border-transparent text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
