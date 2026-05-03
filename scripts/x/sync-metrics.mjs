import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getClient, HANDLE, TWEETS_ON_HOMEPAGE } from "./client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const POSTED_LOG = resolve(REPO_ROOT, "data/x-posted.json");
const HOMEPAGE_FEED = resolve(REPO_ROOT, "data/tweets.json");
const DASHBOARD_CSV = resolve(
  REPO_ROOT,
  "docs/admin-dashboard/sample-data/x-posts.csv"
);
const isDryRun = process.argv.includes("--dry-run");
const SYNC_WINDOW_DAYS = 90;

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function withinWindow(isoDate) {
  const ageMs = Date.now() - new Date(isoDate).getTime();
  return ageMs / (1000 * 60 * 60 * 24) <= SYNC_WINDOW_DAYS;
}

async function main() {
  const log = JSON.parse(await readFile(POSTED_LOG, "utf8"));
  if (!log.posts.length) {
    console.log("[x-sync] no posts logged yet — nothing to sync.");
    return;
  }

  const targets = log.posts.filter((p) => withinWindow(p.posted_at));
  console.log(`[x-sync] ${targets.length} posts within ${SYNC_WINDOW_DAYS}-day window.`);

  if (isDryRun) {
    console.log("[x-sync] --dry-run: skipping API calls. Targets:");
    targets.forEach((p) => console.log(`  - ${p.id}  ${p.posted_at}`));
    return;
  }

  const client = getClient();
  const ids = targets.map((p) => p.id);
  let lookup;
  try {
    lookup = await client.v2.tweets(ids, {
      "tweet.fields": ["public_metrics", "non_public_metrics", "created_at"],
    });
  } catch (err) {
    console.warn(
      "[x-sync] metrics lookup failed (likely Free tier read limits). Likes/RTs/replies still update best-effort:"
    );
    console.warn(err?.data ?? err?.message ?? err);
    lookup = { data: [] };
  }
  const metricsById = new Map((lookup.data ?? []).map((t) => [t.id, t]));

  const now = new Date().toISOString();
  let updatedCount = 0;
  for (const post of log.posts) {
    const live = metricsById.get(post.id);
    if (!live) continue;
    const pub = live.public_metrics ?? {};
    const np = live.non_public_metrics ?? {};
    post.metrics = {
      likes: pub.like_count ?? post.metrics.likes ?? 0,
      retweets: pub.retweet_count ?? post.metrics.retweets ?? 0,
      replies: pub.reply_count ?? post.metrics.replies ?? 0,
      bookmarks: pub.bookmark_count ?? post.metrics.bookmarks ?? 0,
      impressions: pub.impression_count ?? np.impression_count ?? post.metrics.impressions ?? null,
    };
    post.last_synced_at = now;
    updatedCount++;
  }
  console.log(`[x-sync] updated metrics on ${updatedCount} posts.`);

  await writeFile(POSTED_LOG, JSON.stringify(log, null, 2) + "\n", "utf8");

  const homepage = JSON.parse(await readFile(HOMEPAGE_FEED, "utf8"));
  homepage.synced_at = now;
  homepage.tweets = log.posts.slice(0, TWEETS_ON_HOMEPAGE).map((p) => ({
    id: p.id,
    text: p.text,
    posted_at: p.posted_at,
    url: p.url,
    metrics: p.metrics,
  }));
  await writeFile(HOMEPAGE_FEED, JSON.stringify(homepage, null, 2) + "\n", "utf8");

  const header = [
    "tweet_id",
    "posted_at",
    "text",
    "impressions",
    "likes",
    "retweets",
    "replies",
    "bookmarks",
    "engagement_rate",
    "url",
    "last_synced_at",
  ];
  const rows = log.posts.map((p) => {
    const m = p.metrics ?? {};
    const engagementBase = m.impressions || 0;
    const engagementCount = (m.likes || 0) + (m.retweets || 0) + (m.replies || 0);
    const engagementRate =
      engagementBase > 0 ? (engagementCount / engagementBase).toFixed(4) : "";
    return [
      p.id,
      p.posted_at,
      p.text,
      m.impressions ?? "",
      m.likes ?? 0,
      m.retweets ?? 0,
      m.replies ?? 0,
      m.bookmarks ?? 0,
      engagementRate,
      p.url,
      p.last_synced_at ?? "",
    ].map(csvEscape);
  });
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n") + "\n";
  await writeFile(DASHBOARD_CSV, csv, "utf8");
  console.log(`[x-sync] wrote ${DASHBOARD_CSV} (${rows.length} rows).`);
}

main().catch((err) => {
  console.error("[x-sync] FAILED");
  console.error(err?.data ?? err?.message ?? err);
  process.exit(1);
});
