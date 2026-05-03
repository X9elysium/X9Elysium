"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Repeat2, Heart } from "lucide-react";
import tweetsData from "@/data/tweets.json";
import {
  staggerContainer,
  fadeUp,
  sectionTransition,
  smoothEase,
} from "../lib/animations";

type TweetMetrics = {
  likes?: number | null;
  retweets?: number | null;
  replies?: number | null;
  bookmarks?: number | null;
  impressions?: number | null;
};

type Tweet = {
  id: string;
  text: string;
  posted_at: string;
  url: string;
  metrics?: TweetMetrics;
};

const tweets = (tweetsData.tweets ?? []) as Tweet[];
const handle = tweetsData.handle ?? "x9elysium";
const profileUrl = tweetsData.profile_url ?? `https://x.com/${handle}`;

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) {
    const hours = Math.max(1, Math.floor(ms / (1000 * 60 * 60)));
    return hours === 1 ? "1h ago" : `${hours}h ago`;
  }
  if (days < 30) return days === 1 ? "1d ago" : `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1mo ago" : `${months}mo ago`;
}

function formatCount(n?: number | null): string {
  if (!n || n < 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function Tweets() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  if (tweets.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-24 sm:py-32 overflow-hidden"
      aria-labelledby="tweets-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-2xl mb-14"
          transition={sectionTransition}
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-medium">
              <span className="w-8 h-px bg-emerald-400/60" />
              From the feed
            </span>
          </motion.div>
          <motion.h2
            id="tweets-heading"
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-5"
          >
            Working notes,{" "}
            <span className="text-gradient-emerald">posted live</span>.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-neutral-400 leading-relaxed"
          >
            Two operator-true thoughts a day on Shopify Plus, replatforming
            economics, and the math of founder-led consulting. No threads, no
            engagement bait.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {tweets.map((t, i) => (
            <motion.a
              key={t.id}
              variants={fadeUp}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between glass-card p-6 hover:border-emerald-500/30 transition-colors duration-300"
              transition={{ duration: 0.5, ease: smoothEase, delay: i * 0.04 }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-semibold text-sm">
                    X9
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-white">
                      X9Elysium
                    </div>
                    <div className="text-xs text-neutral-500">
                      @{handle} · {formatRelative(t.posted_at)}
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  aria-hidden="true"
                />
              </div>

              <p className="text-[15px] leading-relaxed text-neutral-200 whitespace-pre-line mb-6 flex-1">
                {t.text}
              </p>

              <div className="flex items-center gap-5 text-xs text-neutral-500 pt-4 border-t border-white/[0.05]">
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {formatCount(t.metrics?.replies)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Repeat2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {formatCount(t.metrics?.retweets)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                  {formatCount(t.metrics?.likes)}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline group"
          >
            Follow on X
            <ArrowUpRight className="w-4 h-4 ml-1.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
