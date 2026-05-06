#!/usr/bin/env node
// IndexNow batch submit. Called from the Cloudflare deploy workflow after a
// successful push. Reads out/sitemap.xml and POSTs every URL to api.indexnow.org.
//
// Spec: https://www.indexnow.org/documentation
// Key already hosted at:
//   https://x9elysium.com/.well-known/indexnow-key.txt
//   https://x9elysium.com/22ff52dd50b59385439b192c6676d6df.txt
//
// Fails open: any non-2xx response is logged but does not exit non-zero — a
// failed ping should never block a deploy.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const HOST = "x9elysium.com";
const KEY = "22ff52dd50b59385439b192c6676d6df";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = resolve(process.cwd(), "out/sitemap.xml");
const ENDPOINT = "https://api.indexnow.org/indexnow";

const stripCdata = (s) => s.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();

async function readSitemapUrls() {
  let xml;
  try {
    xml = await readFile(SITEMAP_PATH, "utf8");
  } catch (err) {
    console.error(`indexnow: cannot read ${SITEMAP_PATH} — ${err.message}`);
    return [];
  }
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const url = stripCdata(m[1]);
    if (url.startsWith(`https://${HOST}`)) urls.push(url);
  }
  return Array.from(new Set(urls));
}

async function submit(urlList) {
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body: body.slice(0, 400) };
}

async function main() {
  const urls = await readSitemapUrls();
  if (urls.length === 0) {
    console.log("indexnow: no URLs found in sitemap, skipping.");
    return;
  }
  // IndexNow accepts up to 10,000 URLs per request — chunk anyway to be safe.
  const CHUNK = 1000;
  let total = 0;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const slice = urls.slice(i, i + CHUNK);
    const { ok, status, body } = await submit(slice);
    total += slice.length;
    console.log(`indexnow: ${ok ? "ok" : "fail"} (${status}) ${slice.length} urls${ok ? "" : ` — ${body}`}`);
  }
  console.log(`indexnow: submitted ${total} urls.`);
}

main().catch((err) => {
  console.error(`indexnow: ${err.message}`);
});
