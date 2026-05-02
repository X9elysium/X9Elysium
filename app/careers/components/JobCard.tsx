"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { fadeUp, sectionTransition } from "../../lib/animations";
import type { Job } from "../../lib/careers";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={sectionTransition}
      layout
    >
      <Link
        href={`/careers/${job.slug}`}
        className="group block p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {job.department}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/[0.06]">
                {job.type}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 max-w-2xl">
              {job.shortDescription}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {job.experience}
              </span>
              {job.salaryRange && (
                <span className="hidden sm:inline-flex items-center text-neutral-700 dark:text-neutral-300 font-medium">
                  {job.salaryRange}
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
              View role
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
