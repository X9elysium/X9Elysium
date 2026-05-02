// Docs viewer client. Vanilla JS, no build step.
"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const els = {
  tree: $("#tree"),
  search: $("#search"),
  crumbs: $("#crumbs"),
  actions: $("#actions"),
  viewer: $("#viewer"),
  editor: $("#editor"),
  editorText: $("#editorText"),
  editorPreview: $("#editorPreview"),
  welcome: $("#welcome"),
  welcomeStats: $("#welcomeStats"),
  editBtn: $("#editBtn"),
  saveBtn: $("#saveBtn"),
  cancelBtn: $("#cancelBtn"),
  printBtn: $("#printBtn"),
  downloadBtn: $("#downloadBtn"),
  deleteBtn: $("#deleteBtn"),
  newFile: $("#newFile"),
  newFolder: $("#newFolder"),
  toast: $("#toast"),
};

const state = {
  tree: null,
  current: null, // { path, ext, content, html, binary?, dataUrl? }
  editing: false,
  fileCount: 0,
  dirCount: 0,
  byteCount: 0,
};

// ---------- API ----------
async function api(pathname, opts = {}) {
  const res = await fetch(pathname, opts);
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = (data && data.error) || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ---------- Toast ----------
let toastTimer;
function toast(msg, kind = "") {
  els.toast.hidden = false;
  els.toast.className = "toast" + (kind ? " " + kind : "");
  els.toast.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, 2200);
}

// ---------- Icons ----------
const icons = {
  folder:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  doc:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  chev:
    '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
};

// ---------- Tree rendering ----------
function renderTree(nodes, container, depth = 0) {
  for (const node of nodes) {
    const wrap = document.createElement("div");
    wrap.className = "tree-node " + (node.type === "dir" ? "dir" : "file");
    wrap.dataset.path = node.path;

    const row = document.createElement("div");
    row.className = `tree-row ${node.type}`;
    if (node.type === "file") row.classList.add(node.ext || "");
    row.title = node.path;

    const chev = document.createElement("span");
    chev.className = "chev";
    chev.innerHTML = icons.chev;

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.innerHTML = node.type === "dir" ? icons.folder : icons.doc;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = node.name;

    row.append(chev, icon, name);
    wrap.append(row);

    if (node.type === "dir") {
      const children = document.createElement("div");
      children.className = "tree-children";
      wrap.append(children);
      renderTree(node.children || [], children, depth + 1);
      // Auto-open top level
      if (depth === 0) {
        wrap.classList.add("open");
        row.classList.add("open");
      }
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = wrap.classList.toggle("open");
        row.classList.toggle("open", open);
      });
    } else {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        openFile(node.path);
      });
    }

    container.append(wrap);
  }
}

function countTree(nodes) {
  for (const n of nodes) {
    if (n.type === "dir") {
      state.dirCount++;
      countTree(n.children || []);
    } else {
      state.fileCount++;
      state.byteCount += n.size || 0;
    }
  }
}

async function loadTree() {
  state.fileCount = 0;
  state.dirCount = 0;
  state.byteCount = 0;
  const data = await api("/api/tree");
  state.tree = data.children;
  countTree(state.tree);
  els.tree.innerHTML = "";
  renderTree(state.tree, els.tree, 0);
  renderStats();
}

function renderStats() {
  const kb = (state.byteCount / 1024).toFixed(1);
  els.welcomeStats.innerHTML = `
    <span class="stat"><strong>${state.fileCount}</strong>files</span>
    <span class="stat"><strong>${state.dirCount}</strong>folders</span>
    <span class="stat"><strong>${kb} KB</strong>total</span>
  `;
}

// ---------- Search ----------
function applySearch(query) {
  const q = query.trim().toLowerCase();
  $$(".tree-node", els.tree).forEach((node) => {
    const p = (node.dataset.path || "").toLowerCase();
    if (!q) {
      node.style.display = "";
      return;
    }
    const match = p.includes(q);
    node.style.display = match || hasMatchingChild(node, q) ? "" : "none";
    if (match || hasMatchingChild(node, q)) {
      // open ancestors so matches are visible
      let parent = node.parentElement;
      while (parent && parent.classList.contains("tree-children")) {
        const grand = parent.parentElement;
        if (grand) {
          grand.classList.add("open");
          $(".tree-row", grand)?.classList.add("open");
        }
        parent = grand?.parentElement;
      }
    }
  });
}

function hasMatchingChild(node, q) {
  return $$(".tree-node", node).some((c) => (c.dataset.path || "").toLowerCase().includes(q));
}

// ---------- File loading ----------
async function openFile(relPath) {
  try {
    const data = await api("/api/file?path=" + encodeURIComponent(relPath));
    state.current = data;
    state.editing = false;
    renderCrumbs(relPath);
    highlightActive(relPath);
    renderFile();
    history.replaceState(null, "", "/docs/" + encodeURI(relPath));
  } catch (err) {
    toast(err.message, "error");
  }
}

function highlightActive(relPath) {
  $$(".tree-row.active", els.tree).forEach((r) => r.classList.remove("active"));
  const node = $$(`.tree-node[data-path="${cssEscape(relPath)}"]`, els.tree)[0];
  if (node) {
    $(".tree-row", node)?.classList.add("active");
  }
}

function cssEscape(s) {
  return s.replace(/(["\\])/g, "\\$1");
}

function renderCrumbs(relPath) {
  const parts = relPath.split("/");
  els.crumbs.innerHTML = "";
  const root = document.createElement("span");
  root.className = "crumb";
  root.textContent = "docs";
  els.crumbs.append(root);
  parts.forEach((p, i) => {
    const sep = document.createElement("span");
    sep.className = "sep";
    sep.textContent = "/";
    const c = document.createElement("span");
    c.className = "crumb" + (i === parts.length - 1 ? " last" : "");
    c.textContent = p;
    els.crumbs.append(sep, c);
  });
}

function renderFile() {
  const c = state.current;
  if (!c) {
    els.welcome.hidden = false;
    els.viewer.hidden = true;
    els.editor.hidden = true;
    els.actions.hidden = true;
    return;
  }
  els.welcome.hidden = true;
  els.actions.hidden = false;
  // Editable text formats
  const editable = ["md", "txt", "json", "yml", "yaml"].includes(c.ext);
  els.editBtn.hidden = !editable || state.editing;
  els.saveBtn.hidden = !state.editing;
  els.cancelBtn.hidden = !state.editing;
  els.printBtn.hidden = c.binary || c.ext !== "md";
  els.downloadBtn.hidden = false;
  els.deleteBtn.hidden = false;

  if (state.editing) {
    els.viewer.hidden = true;
    els.editor.hidden = false;
    els.editorText.value = c.content || "";
    updateEditorPreview();
    els.editorText.focus();
  } else {
    els.editor.hidden = true;
    els.viewer.hidden = false;
    if (c.binary && c.dataUrl) {
      els.viewer.innerHTML = `<img src="${c.dataUrl}" alt="${escapeHTML(c.path)}" />`;
    } else if (c.ext === "md") {
      els.viewer.innerHTML = c.html || "";
    } else if (["txt", "json", "yml", "yaml"].includes(c.ext) || !c.ext) {
      els.viewer.innerHTML = `<pre><code>${escapeHTML(c.content || "")}</code></pre>`;
    } else {
      els.viewer.innerHTML = `<p>Preview not available for .${c.ext} — use Download.</p>`;
    }
    els.viewer.scrollTop = 0;
  }
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

// ---------- Editor live preview (md only) ----------
let previewTimer;
function updateEditorPreview() {
  if (state.current?.ext !== "md") {
    els.editorPreview.innerHTML = "<p style='color:var(--text-3)'>Live preview only for markdown.</p>";
    return;
  }
  clearTimeout(previewTimer);
  previewTimer = setTimeout(async () => {
    try {
      // Use marked from server: send a tiny preview request via the /api/file PUT? No — keep client light.
      // Best: ship marked browser build OR re-fetch the rendered HTML on save. For live preview, do a basic local pass.
      els.editorPreview.innerHTML = miniMarked(els.editorText.value);
    } catch (err) {
      els.editorPreview.innerHTML = "<p>Preview error</p>";
    }
  }, 120);
}

// Minimal markdown-ish preview (for live editing). Server still does the real render on save.
function miniMarked(src) {
  let s = escapeHTML(src);
  s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  s = s.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  s = s.replace(/^# (.*)$/gm, "<h1>$1</h1>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/^\- (.*)$/gm, "<li>$1</li>");
  s = s.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\n\n/g, "</p><p>");
  return "<p>" + s + "</p>";
}

// ---------- Actions ----------
els.editBtn?.addEventListener("click", () => {
  state.editing = true;
  renderFile();
});

els.cancelBtn?.addEventListener("click", () => {
  state.editing = false;
  renderFile();
});

els.saveBtn?.addEventListener("click", async () => {
  if (!state.current) return;
  try {
    const result = await api("/api/file?path=" + encodeURIComponent(state.current.path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: els.editorText.value }),
    });
    state.current.content = els.editorText.value;
    if (result.html != null) state.current.html = result.html;
    state.editing = false;
    toast("Saved", "success");
    renderFile();
    loadTree();
  } catch (err) {
    toast(err.message, "error");
  }
});

els.editorText?.addEventListener("input", updateEditorPreview);

els.printBtn?.addEventListener("click", () => {
  if (state.editing) {
    state.editing = false;
    renderFile();
    setTimeout(() => window.print(), 150);
  } else {
    window.print();
  }
});

els.downloadBtn?.addEventListener("click", () => {
  if (!state.current) return;
  const c = state.current;
  let blob;
  let name = c.path.split("/").pop() || "file";
  if (c.binary && c.dataUrl) {
    const a = document.createElement("a");
    a.href = c.dataUrl;
    a.download = name;
    a.click();
    return;
  }
  blob = new Blob([c.content || ""], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
});

els.deleteBtn?.addEventListener("click", async () => {
  if (!state.current) return;
  const ok = confirm(`Delete ${state.current.path}? This cannot be undone.`);
  if (!ok) return;
  try {
    await api("/api/delete?path=" + encodeURIComponent(state.current.path), {
      method: "DELETE",
    });
    state.current = null;
    state.editing = false;
    history.replaceState(null, "", "/docs");
    els.crumbs.innerHTML = '<span class="crumb-empty">Select a file</span>';
    renderFile();
    toast("Deleted", "success");
    loadTree();
  } catch (err) {
    toast(err.message, "error");
  }
});

els.newFile?.addEventListener("click", async () => {
  const name = prompt("New markdown file path (relative to docs/, e.g. journal/2026/april.md):");
  if (!name) return;
  const safe = name.replace(/^\/+/, "");
  const final = /\.[a-z0-9]+$/i.test(safe) ? safe : safe + ".md";
  try {
    await api("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "file", path: final }),
    });
    toast("Created", "success");
    await loadTree();
    openFile(final);
  } catch (err) {
    toast(err.message, "error");
  }
});

els.newFolder?.addEventListener("click", async () => {
  const name = prompt("New folder path (relative to docs/, e.g. audits/2026):");
  if (!name) return;
  try {
    await api("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "dir", path: name.replace(/^\/+/, "") }),
    });
    toast("Folder created", "success");
    loadTree();
  } catch (err) {
    toast(err.message, "error");
  }
});

els.search?.addEventListener("input", (e) => applySearch(e.target.value));

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    if (state.editing) {
      e.preventDefault();
      els.saveBtn?.click();
    }
  }
  if (e.key === "Escape" && state.editing) {
    els.cancelBtn?.click();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "p" && state.current?.ext === "md") {
    // Let browser handle print, but make sure we're in viewer mode for clean output
    if (state.editing) {
      e.preventDefault();
      state.editing = false;
      renderFile();
      setTimeout(() => window.print(), 150);
    }
  }
});

// ---------- Boot ----------
(async function init() {
  try {
    await loadTree();
    // Deep link: /docs/<path>
    const m = location.pathname.match(/^\/docs\/(.+)$/);
    if (m) {
      const decoded = decodeURI(m[1]);
      openFile(decoded);
    }
  } catch (err) {
    console.error(err);
    toast("Failed to load docs tree: " + err.message, "error");
  }
})();
