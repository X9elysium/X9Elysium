"use client";

import { useState } from "react";
import { Linkedin, Twitter, Link2, Check } from "lucide-react";

interface ShareBarProps {
  title: string;
  slug: string;
}

export default function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `https://x9elysium.com/blog/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const buttonClass =
    "w-11 h-11 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white flex items-center justify-center transition-all duration-300";

  return (
    <div className="flex flex-col gap-3 items-center">
      <span className="text-label-sm uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500 mb-1">
        Share
      </span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClass}
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className={buttonClass}
      >
        <Twitter className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={buttonClass}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
