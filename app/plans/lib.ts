import fs from "node:fs";
import path from "node:path";

const ALLOWLIST_PATH = path.join(process.cwd(), "docs/plans-allowlist.json");

export interface PlanEntry {
  slug: string;
  title: string;
  source: string;
}

interface AllowlistFile {
  plans: PlanEntry[];
}

let cached: PlanEntry[] | null = null;

export function getAllPlans(): PlanEntry[] {
  if (cached) return cached;
  if (!fs.existsSync(ALLOWLIST_PATH)) {
    cached = [];
    return cached;
  }
  const raw = fs.readFileSync(ALLOWLIST_PATH, "utf8");
  const parsed = JSON.parse(raw) as AllowlistFile;
  cached = Array.isArray(parsed?.plans) ? parsed.plans : [];
  return cached;
}

export function getPlanMeta(slug: string): PlanEntry | null {
  return getAllPlans().find((p) => p.slug === slug) ?? null;
}
