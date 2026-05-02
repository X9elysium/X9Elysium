/* eslint-disable no-console */
// Local-only docs viewer. Run with: npm run docs
// Serves docs/ as a Google Drive-like UI at http://localhost:4000/docs
// Not deployed — sits outside the static export. Journal stays private.

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { marked } = require("marked");

const ROOT = path.resolve(__dirname, "..", "..");
const DOCS_DIR = path.join(ROOT, "docs");
const UI_DIR = path.join(__dirname, "ui");
const PORT = Number(process.env.DOCS_PORT) || 4000;

marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error("Path traversal blocked");
  }
  return resolved;
}

function buildTree(dir, rel = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const abs = path.join(dir, e.name);
    const relPath = path.posix.join(rel, e.name);
    if (e.isDirectory()) {
      nodes.push({ type: "dir", name: e.name, path: relPath, children: buildTree(abs, relPath) });
    } else if (e.isFile()) {
      const stat = fs.statSync(abs);
      nodes.push({
        type: "file",
        name: e.name,
        path: relPath,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        ext: path.extname(e.name).slice(1).toLowerCase(),
      });
    }
  }
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return nodes;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function sendJSON(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json" });
}

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, "Not found");
    send(res, 200, data, { "Content-Type": contentType });
  });
}

const MIME = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  ico: "image/x-icon",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || "/";

  try {
    // API: folder tree
    if (pathname === "/api/tree" && req.method === "GET") {
      return sendJSON(res, 200, { root: "docs", children: buildTree(DOCS_DIR) });
    }

    // API: read file
    if (pathname === "/api/file" && req.method === "GET") {
      const rel = String(parsed.query.path || "");
      const abs = safeJoin(DOCS_DIR, rel);
      if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
        return sendJSON(res, 404, { error: "File not found" });
      }
      const ext = path.extname(abs).slice(1).toLowerCase();
      if (["md", "txt", "json", "yml", "yaml"].includes(ext) || !ext) {
        const content = fs.readFileSync(abs, "utf8");
        const html = ext === "md" ? marked.parse(content) : null;
        return sendJSON(res, 200, { path: rel, ext, content, html });
      }
      // Binary — stream as base64 url
      if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
        const buf = fs.readFileSync(abs);
        const mime = MIME[ext] || "application/octet-stream";
        return sendJSON(res, 200, {
          path: rel,
          ext,
          binary: true,
          dataUrl: `data:${mime};base64,${buf.toString("base64")}`,
        });
      }
      return sendJSON(res, 415, { error: "Unsupported file type", ext });
    }

    // API: save file
    if (pathname === "/api/file" && req.method === "PUT") {
      const rel = String(parsed.query.path || "");
      const abs = safeJoin(DOCS_DIR, rel);
      const ext = path.extname(abs).slice(1).toLowerCase();
      if (!["md", "txt", "json", "yml", "yaml"].includes(ext)) {
        return sendJSON(res, 400, { error: "Only text files are editable" });
      }
      const body = await readBody(req);
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: "Invalid JSON" });
      }
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, parsedBody.content ?? "", "utf8");
      const html = ext === "md" ? marked.parse(parsedBody.content ?? "") : null;
      return sendJSON(res, 200, { ok: true, html });
    }

    // API: create file or folder
    if (pathname === "/api/create" && req.method === "POST") {
      const body = await readBody(req);
      const { type, path: rel } = JSON.parse(body || "{}");
      const abs = safeJoin(DOCS_DIR, rel || "");
      if (type === "dir") {
        fs.mkdirSync(abs, { recursive: true });
      } else if (type === "file") {
        if (fs.existsSync(abs)) return sendJSON(res, 409, { error: "Already exists" });
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, "", "utf8");
      } else {
        return sendJSON(res, 400, { error: "type must be 'dir' or 'file'" });
      }
      return sendJSON(res, 200, { ok: true });
    }

    // API: delete file or folder
    if (pathname === "/api/delete" && req.method === "DELETE") {
      const rel = String(parsed.query.path || "");
      const abs = safeJoin(DOCS_DIR, rel);
      if (!fs.existsSync(abs)) return sendJSON(res, 404, { error: "Not found" });
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) fs.rmSync(abs, { recursive: true });
      else fs.unlinkSync(abs);
      return sendJSON(res, 200, { ok: true });
    }

    // API: rename
    if (pathname === "/api/rename" && req.method === "POST") {
      const body = await readBody(req);
      const { from, to } = JSON.parse(body || "{}");
      const fromAbs = safeJoin(DOCS_DIR, from);
      const toAbs = safeJoin(DOCS_DIR, to);
      if (!fs.existsSync(fromAbs)) return sendJSON(res, 404, { error: "Source not found" });
      fs.mkdirSync(path.dirname(toAbs), { recursive: true });
      fs.renameSync(fromAbs, toAbs);
      return sendJSON(res, 200, { ok: true });
    }

    // Redirect / to /docs
    if (pathname === "/") {
      res.writeHead(302, { Location: "/docs" });
      return res.end();
    }

    // Serve UI for /docs and any /docs/* (SPA-style)
    if (pathname === "/docs" || pathname.startsWith("/docs/")) {
      return sendFile(res, path.join(UI_DIR, "index.html"), MIME.html);
    }

    // Serve static UI assets
    if (pathname.startsWith("/ui/")) {
      const rel = pathname.replace(/^\/ui\//, "");
      const abs = safeJoin(UI_DIR, rel);
      const ext = path.extname(abs).slice(1).toLowerCase();
      const mime = MIME[ext] || "application/octet-stream";
      return sendFile(res, abs, mime);
    }

    send(res, 404, "Not found");
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: err.message || "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`\nDocs viewer ready: http://localhost:${PORT}/docs`);
  console.log(`Serving: ${DOCS_DIR}`);
  console.log("Press Ctrl+C to stop.\n");
});
