"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "../../lib/animations";
import JobCard from "./JobCard";
import type { Job, Department, Location } from "../../lib/careers";

type DeptFilter = "All" | Department;
type LocFilter = "All" | Location;

interface CareersFilterProps {
  jobs: Job[];
  departments: { department: Department; count: number }[];
  locations: { location: Location; count: number }[];
}

export default function CareersFilter({
  jobs,
  departments,
  locations,
}: CareersFilterProps) {
  const [dept, setDept] = useState<DeptFilter>("All");
  const [loc, setLoc] = useState<LocFilter>("All");

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const deptMatch = dept === "All" || j.department === dept;
      const locMatch = loc === "All" || j.location === loc;
      return deptMatch && locMatch;
    });
  }, [jobs, dept, loc]);

  return (
    <>
      <div className="flex flex-col gap-5 mb-10">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500 mb-3">
            Department
          </span>
          <div className="flex flex-wrap gap-2">
            <Pill
              label="All Roles"
              count={jobs.length}
              active={dept === "All"}
              onClick={() => setDept("All")}
            />
            {departments.map(({ department, count }) => (
              <Pill
                key={department}
                label={department}
                count={count}
                active={dept === department}
                onClick={() => setDept(department)}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500 mb-3">
            Location
          </span>
          <div className="flex flex-wrap gap-2">
            <Pill
              label="All Locations"
              count={jobs.length}
              active={loc === "All"}
              onClick={() => setLoc("All")}
            />
            {locations.map(({ location, count }) => (
              <Pill
                key={location}
                label={location}
                count={count}
                active={loc === location}
                onClick={() => setLoc(location)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          Showing{" "}
          <span className="font-medium text-neutral-900 dark:text-white">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "open role" : "open roles"}
        </p>
        {(dept !== "All" || loc !== "All") && (
          <button
            onClick={() => {
              setDept("All");
              setLoc("All");
            }}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        key={`${dept}-${loc}`}
        className="flex flex-col gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-neutral-200 dark:border-white/[0.08]">
          <p className="text-neutral-500 dark:text-neutral-500 mb-2">
            No open roles match these filters.
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            We&apos;re always interested in great people though — drop us a
            line at{" "}
            <a
              href="mailto:darshan@x9elysium.com"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              darshan@x9elysium.com
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}

function Pill({
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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium uppercase tracking-[0.08em] border transition-all duration-300 ${
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
