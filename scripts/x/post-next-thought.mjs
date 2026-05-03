import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getClient, HANDLE, TWEETS_ON_HOMEPAGE } from "./client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const QUEUE = resolve(REPO_ROOT, "data/x-thoughts.md");
const POSTED_LOG = resolve(REPO_ROOT, "data/x-posted.json");
const HOMEPAGE_FEED = resolve(REPO_ROOT, "data/tweets.json");
const MAX_LEN = 280;
const isDryRun = process.argv.includes("--dry-run");

function splitQueue(raw) {
  const lines = raw.split("\n");
  const blocks = [];
  let current = [];
  for (const line of lines) {
    if (line.trim() === "---") {
      blocks.push(current.join("\n"));
      current = [];
    } else {
      current.push(line);
    }
  }
  blocks.push(current.join("\n"));
  return blocks;
}

function isThoughtBlock(block) {
  const text = stripComments(block).trim();
  return text.length > 0;
}

function stripComments(block) {
  return block.replace(/<!--[\s\S]*?-->/g, "");
}

async function main() {
  const queueRaw = await readFile(QUEUE, "utf8");
  const blocks = splitQueue(queueRaw);

  const nextIdx = blocks.findIndex(isThoughtBlock);
  if (nextIdx === -1) {
    console.log("[x-post] queue is empty — exiting cleanly. Nothing to post.");
    return;
  }

  const nextBlock = blocks[nextIdx];
  const text = stripComments(nextBlock).trim();

  if (text.length > MAX_LEN) {
    console.error(
      `[x-post] queued thought is ${text.length} chars (max ${MAX_LEN}). Refusing to post.\n---\n${text}\n---`
    );
    process.exit(1);
  }

  console.log(`[x-post] next thought (${text.length} chars):`);
  console.log("---");
  console.log(text);
  console.log("---");

  if (isDryRun) {
    console.log("[x-post] --dry-run: skipping post + queue mutation. Exiting.");
    return;
  }

  const client = getClient();
  const { data } = await client.v2.tweet(text);
  const tweetId = data.id;
  const postedAt = new Date().toISOString();
  const url = `https://x.com/${HANDLE}/status/${tweetId}`;
  console.log(`[x-post] posted: ${url}`);

  const newBlocks = [...blocks];
  newBlocks.splice(nextIdx, 1);
  let rewritten = newBlocks.join("\n---\n").replace(/\n{3,}/g, "\n\n");
  if (!rewritten.endsWith("\n")) rewritten += "\n";
  await writeFile(QUEUE, rewritten, "utf8");
  console.log(`[x-post] queue: removed top thought, ${countThoughts(rewritten)} remaining.`);

  const postedLog = JSON.parse(await readFile(POSTED_LOG, "utf8"));
  postedLog.posts.unshift({
    id: tweetId,
    text,
    posted_at: postedAt,
    url,
    metrics: { likes: 0, retweets: 0, replies: 0, bookmarks: 0, impressions: null },
    last_synced_at: null,
  });
  await writeFile(POSTED_LOG, JSON.stringify(postedLog, null, 2) + "\n", "utf8");

  const homepage = JSON.parse(await readFile(HOMEPAGE_FEED, "utf8"));
  homepage.synced_at = postedAt;
  homepage.tweets = postedLog.posts.slice(0, TWEETS_ON_HOMEPAGE).map((p) => ({
    id: p.id,
    text: p.text,
    posted_at: p.posted_at,
    url: p.url,
    metrics: p.metrics,
  }));
  await writeFile(HOMEPAGE_FEED, JSON.stringify(homepage, null, 2) + "\n", "utf8");

  console.log("[x-post] wrote x-posted.json + tweets.json. Done.");
}

function countThoughts(raw) {
  return splitQueue(raw).filter(isThoughtBlock).length;
}

main().catch((err) => {
  console.error("[x-post] FAILED");
  console.error(err?.data ?? err?.message ?? err);
  process.exit(1);
});
