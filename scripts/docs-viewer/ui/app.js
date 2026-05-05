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
  if (typeof ttsOnFileChange === "function") ttsOnFileChange();
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

// ============================================================
// AUDIO PLAYER (Medium-style TTS)
// Three providers: browser SpeechSynthesis (free, default), OpenAI TTS, ElevenLabs.
// Settings + presets persist in localStorage. Cloud requests are proxied through
// /api/tts so the API key sent from the browser is forwarded directly to the
// chosen provider — nothing else stores or logs it.
// ============================================================

const TTS_STORAGE_KEY = "x9_docs_tts_settings_v1";
const TTS_OPENAI_KEY = "x9_docs_tts_openai_key";
const TTS_ELEVEN_KEY = "x9_docs_tts_elevenlabs_key";

// ElevenLabs default-library voice IDs that ship with every account. These are
// stock voices that match the requested archetypes — not deepfake clones of
// real people. To use a licensed clone, edit the voice ID in settings.
const DEFAULT_PRESETS = [
  {
    id: "british",
    label: "British (default)",
    note: "Native OS voice — looks for UK accents",
    provider: "browser",
    voicePattern: "en-GB|UK|British|Daniel|Kate|Serena|Lily|Martha",
  },
  {
    id: "british-girl",
    label: "British (hot)",
    note: "ElevenLabs · Charlotte (sultry British female)",
    provider: "elevenlabs",
    voiceId: "XB0fDUnXU5powFXDhCwa",
    stability: 0.45,
    similarityBoost: 0.8,
  },
  {
    id: "naval",
    label: "Naval-style",
    note: "ElevenLabs · Brian (calm, contemplative male). Paste a licensed clone ID for the real thing.",
    provider: "elevenlabs",
    voiceId: "nPczCjzI2devNBz1zQrb",
    stability: 0.6,
    similarityBoost: 0.75,
  },
  {
    id: "elon",
    label: "Elon-style",
    note: "ElevenLabs · Adam (deep, measured male). Paste a licensed clone ID for the real thing.",
    provider: "elevenlabs",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    stability: 0.55,
    similarityBoost: 0.7,
  },
  {
    id: "openai-fable",
    label: "OpenAI · Fable (British)",
    note: "OpenAI tts-1, Fable voice (warm British)",
    provider: "openai",
    voiceId: "fable",
  },
];

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

const tts = {
  el: {
    player: $("#audioPlayer"),
    opener: $("#apOpener"),
    play: $("#apPlay"),
    iconPlay: $(".ap-icon-play", $("#apPlay")),
    iconPause: $(".ap-icon-pause", $("#apPlay")),
    iconSpin: $(".ap-icon-spin", $("#apPlay")),
    title: $("#apTitle"),
    progressBar: $("#apProgressBar"),
    progressFill: $("#apProgressFill"),
    progressBuffer: $("#apProgressBuffer"),
    timeCur: $("#apTimeCur"),
    timeTotal: $("#apTimeTotal"),
    voice: $("#apVoice"),
    speed: $("#apSpeed"),
    download: $("#apDownload"),
    settings: $("#apSettings"),
    close: $("#apClose"),
    audio: $("#apAudio"),
    modal: $("#settingsModal"),
    cfgOpenaiKey: $("#cfgOpenaiKey"),
    cfgElevenKey: $("#cfgElevenKey"),
    cfgPresets: $("#cfgPresets"),
    cfgAddPreset: $("#cfgAddPreset"),
    cfgSave: $("#cfgSave"),
    cfgStatus: $("#cfgStatus"),
  },
  state: {
    settings: null,
    chunks: [],
    chunkIdx: 0,
    objectUrls: [],
    cloudBlobs: [],
    estimatedDuration: 0,
    loading: false,
    playing: false,
    cancelled: false,
    browserUtterances: [],
    browserVoices: [],
  },
};

function loadTtsSettings() {
  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(TTS_STORAGE_KEY) || "null");
  } catch {}
  const settings = stored && stored.presets
    ? stored
    : { activePresetId: "british", presets: DEFAULT_PRESETS.slice(), speed: 1 };
  // Make sure built-in presets exist (so deletes-of-defaults can be reset by
  // re-adding through settings modal).
  if (!Array.isArray(settings.presets) || settings.presets.length === 0) {
    settings.presets = DEFAULT_PRESETS.slice();
  }
  if (!settings.presets.find((p) => p.id === settings.activePresetId)) {
    settings.activePresetId = settings.presets[0].id;
  }
  if (typeof settings.speed !== "number") settings.speed = 1;
  tts.state.settings = settings;
  return settings;
}

function saveTtsSettings() {
  localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(tts.state.settings));
}

function getApiKey(provider) {
  if (provider === "openai") return localStorage.getItem(TTS_OPENAI_KEY) || "";
  if (provider === "elevenlabs") return localStorage.getItem(TTS_ELEVEN_KEY) || "";
  return "";
}

function setApiKey(provider, val) {
  if (provider === "openai") localStorage.setItem(TTS_OPENAI_KEY, val || "");
  if (provider === "elevenlabs") localStorage.setItem(TTS_ELEVEN_KEY, val || "");
}

function activePreset() {
  const s = tts.state.settings;
  return s.presets.find((p) => p.id === s.activePresetId) || s.presets[0];
}

// ---------- Markdown → speakable text ----------
function markdownToSpeechText(md) {
  if (!md) return "";
  let s = md;
  // Strip frontmatter
  s = s.replace(/^---\n[\s\S]*?\n---\n/, "");
  // Strip fenced code blocks
  s = s.replace(/```[\s\S]*?```/g, "\n\n");
  // Strip inline code
  s = s.replace(/`([^`]*)`/g, "$1");
  // Images → drop entirely
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  // Links → text only
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  // Headings → keep text, drop hashes
  s = s.replace(/^#{1,6}\s+/gm, "");
  // Block-level markers
  s = s.replace(/^>\s?/gm, "");
  s = s.replace(/^[-*+]\s+/gm, "");
  s = s.replace(/^\d+\.\s+/gm, "");
  // Emphasis
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  s = s.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
  s = s.replace(/~~([^~]+)~~/g, "$1");
  // HTML tags
  s = s.replace(/<[^>]+>/g, "");
  // Collapse whitespace
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function chunkForCloud(text, maxLen = 3500) {
  const paras = text.split(/\n\n+/);
  const chunks = [];
  let cur = "";
  for (const para of paras) {
    if (para.length > maxLen) {
      // Hard split on sentences for very long paragraphs
      const sents = para.split(/(?<=[.!?])\s+/);
      for (const sent of sents) {
        if ((cur + " " + sent).length > maxLen && cur) {
          chunks.push(cur.trim());
          cur = sent;
        } else {
          cur = cur ? cur + " " + sent : sent;
        }
      }
      continue;
    }
    if ((cur + "\n\n" + para).length > maxLen && cur) {
      chunks.push(cur.trim());
      cur = para;
    } else {
      cur = cur ? cur + "\n\n" + para : para;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

function chunkForBrowser(text) {
  // Browser TTS reliably handles short utterances. Split on sentence boundary,
  // ~280 chars max per chunk. Chrome has a known bug where it stops after ~15s
  // on a single utterance, hence the small chunks.
  const sents = text
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const chunks = [];
  let cur = "";
  for (const sent of sents) {
    if ((cur + " " + sent).length > 280 && cur) {
      chunks.push(cur.trim());
      cur = sent;
    } else {
      cur = cur ? cur + " " + sent : sent;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

// ---------- Time helpers ----------
function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function estimateDurationSec(text, speed = 1) {
  // ~165 words/min average speaking rate (between fast tts-1 and slower neural).
  const words = text.trim().split(/\s+/).length;
  const wps = (165 / 60) * speed;
  return wps > 0 ? words / wps : 0;
}

// ---------- Player UI helpers ----------
function setPlayerVisible(show) {
  if (show) {
    tts.el.player.hidden = false;
    tts.el.opener.hidden = true;
  } else {
    tts.el.player.hidden = true;
    tts.el.opener.hidden = state.current?.ext === "md" ? false : true;
  }
}

function setPlayState(s) {
  // s ∈ "idle" | "loading" | "playing" | "paused"
  const { iconPlay, iconPause, iconSpin } = tts.el;
  iconPlay.hidden = true;
  iconPause.hidden = true;
  iconSpin.hidden = true;
  if (s === "loading") iconSpin.hidden = false;
  else if (s === "playing") iconPause.hidden = false;
  else iconPlay.hidden = false;
  tts.el.play.classList.toggle("loading", s === "loading");
  tts.el.play.classList.toggle("playing", s === "playing");
}

function renderVoicePicker() {
  const sel = tts.el.voice;
  sel.innerHTML = "";
  for (const p of tts.state.settings.presets) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.label;
    sel.append(opt);
  }
  sel.value = tts.state.settings.activePresetId;
}

function renderSpeedChip() {
  tts.el.speed.textContent = `${tts.state.settings.speed}×`;
}

function showOpenerForCurrent() {
  const ext = state.current?.ext;
  const isMd = ext === "md";
  if (!isMd || !state.current?.content) {
    tts.el.opener.hidden = true;
    tts.el.player.hidden = true;
    stopPlayback();
    return;
  }
  // If a player is already open, swap the title and stop current playback.
  if (!tts.el.player.hidden) {
    stopPlayback();
    tts.el.title.textContent = state.current.path.split("/").pop();
  } else {
    tts.el.opener.hidden = false;
  }
}

function setProgress(curSec, totalSec, bufferRatio = null) {
  const ratio = totalSec > 0 ? Math.min(1, curSec / totalSec) : 0;
  tts.el.progressFill.style.width = `${ratio * 100}%`;
  if (bufferRatio !== null) {
    tts.el.progressBuffer.style.width = `${Math.min(1, bufferRatio) * 100}%`;
  }
  tts.el.timeCur.textContent = fmtTime(curSec);
  tts.el.timeTotal.textContent = fmtTime(totalSec);
}

// ---------- Playback ----------
async function startPlayback() {
  if (!state.current || state.current.ext !== "md") return;
  stopPlayback(true);
  const preset = activePreset();
  const text = markdownToSpeechText(state.current.content || "");
  if (!text) {
    toast("Nothing to read", "error");
    return;
  }
  tts.el.player.hidden = false;
  tts.el.opener.hidden = true;
  tts.el.title.textContent = state.current.path.split("/").pop();

  if (preset.provider === "browser") {
    return playBrowser(text);
  }
  return playCloud(text, preset);
}

function stopPlayback(silent = false) {
  tts.state.cancelled = true;
  tts.state.playing = false;
  tts.state.loading = false;
  // Browser
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  tts.state.browserUtterances = [];
  // Cloud audio element
  const audio = tts.el.audio;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  // Free object URLs
  tts.state.objectUrls.forEach((u) => URL.revokeObjectURL(u));
  tts.state.objectUrls = [];
  tts.state.cloudBlobs = [];
  tts.state.chunks = [];
  tts.state.chunkIdx = 0;
  setProgress(0, 0, 0);
  if (!silent) setPlayState("idle");
}

// ---------- Browser TTS ----------
function loadBrowserVoices() {
  return new Promise((resolve) => {
    const got = window.speechSynthesis.getVoices();
    if (got && got.length) return resolve(got);
    // Some browsers populate voices async via event
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 600);
  });
}

function pickBrowserVoice(voices, pattern) {
  if (!voices || !voices.length) return null;
  if (pattern) {
    let re;
    try { re = new RegExp(pattern, "i"); } catch { re = null; }
    if (re) {
      const m = voices.find((v) => re.test(`${v.name} ${v.lang}`));
      if (m) return m;
    }
  }
  return voices.find((v) => /en[-_]GB|en[-_]UK/i.test(v.lang)) ||
    voices.find((v) => /en/i.test(v.lang)) ||
    voices[0];
}

async function playBrowser(text) {
  if (!("speechSynthesis" in window)) {
    toast("Browser doesn't support speech synthesis", "error");
    return;
  }
  setPlayState("loading");
  const voices = await loadBrowserVoices();
  const preset = activePreset();
  const voice = pickBrowserVoice(voices, preset.voicePattern);
  const chunks = chunkForBrowser(text);
  tts.state.chunks = chunks;
  tts.state.chunkIdx = 0;
  tts.state.cancelled = false;
  tts.el.download.hidden = true; // not supported for browser TTS

  const totalDur = estimateDurationSec(text, tts.state.settings.speed);
  tts.state.estimatedDuration = totalDur;
  setProgress(0, totalDur, 1);
  setPlayState("playing");
  tts.state.playing = true;

  const startTs = Date.now();
  let progressTimer = setInterval(() => {
    if (!tts.state.playing) return;
    const elapsed = (Date.now() - startTs) / 1000;
    setProgress(Math.min(elapsed, totalDur), totalDur, 1);
  }, 250);

  const speakChunk = (idx) => {
    if (tts.state.cancelled) {
      clearInterval(progressTimer);
      return;
    }
    if (idx >= chunks.length) {
      clearInterval(progressTimer);
      setProgress(totalDur, totalDur, 1);
      setPlayState("idle");
      tts.state.playing = false;
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[idx]);
    if (voice) u.voice = voice;
    u.rate = tts.state.settings.speed;
    u.pitch = 1;
    u.volume = 1;
    u.onend = () => speakChunk(idx + 1);
    u.onerror = (e) => {
      console.warn("TTS error", e);
      speakChunk(idx + 1);
    };
    tts.state.browserUtterances.push(u);
    window.speechSynthesis.speak(u);
  };
  speakChunk(0);
}

// ---------- Cloud TTS (OpenAI / ElevenLabs) ----------
async function playCloud(text, preset) {
  const apiKey = getApiKey(preset.provider);
  if (!apiKey) {
    setPlayState("idle");
    toast(`Add an ${preset.provider === "openai" ? "OpenAI" : "ElevenLabs"} API key in voice settings`, "error");
    openSettings();
    return;
  }

  const chunks = chunkForCloud(text);
  tts.state.chunks = chunks;
  tts.state.chunkIdx = 0;
  tts.state.cancelled = false;
  tts.state.cloudBlobs = new Array(chunks.length);
  tts.el.download.hidden = false;

  const estTotal = estimateDurationSec(text, tts.state.settings.speed);
  tts.state.estimatedDuration = estTotal;
  setProgress(0, estTotal, 0);
  setPlayState("loading");

  // Fetch the first chunk (block on it so we can start playing)
  let firstBlob;
  try {
    firstBlob = await fetchTtsChunk(chunks[0], preset, apiKey);
    if (tts.state.cancelled) return;
    tts.state.cloudBlobs[0] = firstBlob;
  } catch (e) {
    setPlayState("idle");
    toast("TTS failed: " + (e.message || "unknown"), "error");
    return;
  }

  // Kick off the rest in parallel (but don't await — they'll trickle in)
  for (let i = 1; i < chunks.length; i++) {
    fetchTtsChunk(chunks[i], preset, apiKey)
      .then((b) => {
        if (tts.state.cancelled) return;
        tts.state.cloudBlobs[i] = b;
        const ready = tts.state.cloudBlobs.filter(Boolean).length;
        setProgress(
          tts.el.audio.currentTime || 0,
          tts.el.audio.duration || estTotal,
          ready / chunks.length
        );
      })
      .catch((e) => console.warn("Chunk fetch failed", i, e));
  }

  setPlayState("playing");
  tts.state.playing = true;
  await playCloudFromIdx(0);
}

async function playCloudFromIdx(idx) {
  const audio = tts.el.audio;
  for (let i = idx; i < tts.state.chunks.length; i++) {
    if (tts.state.cancelled) return;
    tts.state.chunkIdx = i;
    // Wait until this chunk's blob is ready
    while (!tts.state.cloudBlobs[i] && !tts.state.cancelled) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (tts.state.cancelled) return;
    const blob = tts.state.cloudBlobs[i];
    const url = URL.createObjectURL(blob);
    tts.state.objectUrls.push(url);
    audio.src = url;
    // OpenAI applies speed in the API request, so don't compound via playbackRate.
    // ElevenLabs has no v1 speed param, so we adjust the playback rate locally.
    const preset = activePreset();
    audio.playbackRate = preset.provider === "openai" ? 1 : tts.state.settings.speed;
    try {
      await audio.play();
    } catch (e) {
      console.warn("audio.play failed", e);
      return;
    }
    await new Promise((resolve) => {
      const onEnd = () => {
        audio.removeEventListener("ended", onEnd);
        audio.removeEventListener("error", onEnd);
        resolve();
      };
      audio.addEventListener("ended", onEnd);
      audio.addEventListener("error", onEnd);
    });
  }
  if (!tts.state.cancelled) {
    setPlayState("idle");
    tts.state.playing = false;
    setProgress(tts.state.estimatedDuration, tts.state.estimatedDuration, 1);
  }
}

async function fetchTtsChunk(text, preset, apiKey) {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: preset.provider,
      text,
      voiceId: preset.voiceId || "fable",
      apiKey,
      model: preset.model,
      speed: preset.provider === "openai" ? tts.state.settings.speed : undefined,
      stability: preset.stability,
      similarityBoost: preset.similarityBoost,
    }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j.error || j.detail || "";
    } catch {}
    throw new Error(`${res.status} ${detail}`);
  }
  return await res.blob();
}

// ---------- Audio element wiring ----------
tts.el.audio?.addEventListener("timeupdate", () => {
  // Approximate full-doc progress: completed chunks + current chunk fraction
  const audio = tts.el.audio;
  const chunksDone = tts.state.chunkIdx;
  const total = tts.state.chunks.length || 1;
  const segFrac = audio.duration ? audio.currentTime / audio.duration : 0;
  const ratio = (chunksDone + segFrac) / total;
  const totalDur = tts.state.estimatedDuration || 1;
  setProgress(ratio * totalDur, totalDur);
});

// ---------- Bar buttons ----------
tts.el.play?.addEventListener("click", async () => {
  if (tts.state.loading) return;
  if (tts.state.playing) {
    // Pause
    if (window.speechSynthesis && tts.state.browserUtterances.length) {
      window.speechSynthesis.pause();
    } else {
      tts.el.audio.pause();
    }
    tts.state.playing = false;
    setPlayState("paused");
    return;
  }
  // Resume if paused mid-doc
  const audio = tts.el.audio;
  if (audio.src && !audio.ended && audio.currentTime > 0) {
    await audio.play().catch(() => {});
    tts.state.playing = true;
    setPlayState("playing");
    return;
  }
  if (window.speechSynthesis && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    tts.state.playing = true;
    setPlayState("playing");
    return;
  }
  startPlayback();
});

tts.el.voice?.addEventListener("change", (e) => {
  tts.state.settings.activePresetId = e.target.value;
  saveTtsSettings();
  if (tts.state.playing || tts.state.chunks.length) {
    stopPlayback();
    startPlayback();
  }
});

tts.el.speed?.addEventListener("click", () => {
  const cur = tts.state.settings.speed;
  const i = SPEEDS.indexOf(cur);
  const next = SPEEDS[(i + 1) % SPEEDS.length];
  tts.state.settings.speed = next;
  saveTtsSettings();
  renderSpeedChip();
  // Apply on the fly for ElevenLabs (which uses local rate). For OpenAI (which
  // bakes speed into the request) and browser TTS (which uses utterance.rate),
  // we need to regenerate the chunks at the new speed — restart playback.
  const preset = activePreset();
  if (preset.provider === "elevenlabs") {
    tts.el.audio.playbackRate = next;
  } else if (tts.state.playing || tts.state.browserUtterances.length || tts.el.audio.src) {
    stopPlayback();
    startPlayback();
  }
});

tts.el.close?.addEventListener("click", () => {
  stopPlayback();
  tts.el.player.hidden = true;
  if (state.current?.ext === "md") tts.el.opener.hidden = false;
});

tts.el.opener?.addEventListener("click", () => {
  startPlayback();
});

tts.el.download?.addEventListener("click", async () => {
  const preset = activePreset();
  if (preset.provider === "browser") {
    toast("Download is only available for cloud voices", "error");
    return;
  }
  const apiKey = getApiKey(preset.provider);
  if (!apiKey) {
    toast("Add an API key in voice settings first", "error");
    return openSettings();
  }
  // If chunks already buffered, stitch them; otherwise generate fresh.
  let blobs = tts.state.cloudBlobs.filter(Boolean);
  const expected = tts.state.chunks.length;
  if (!blobs.length || blobs.length !== expected) {
    toast("Generating audio…");
    const text = markdownToSpeechText(state.current?.content || "");
    const chunks = chunkForCloud(text);
    blobs = [];
    try {
      for (let i = 0; i < chunks.length; i++) {
        const b = await fetchTtsChunk(chunks[i], preset, apiKey);
        blobs.push(b);
      }
    } catch (e) {
      toast("Download failed: " + e.message, "error");
      return;
    }
  }
  const merged = new Blob(blobs, { type: "audio/mpeg" });
  const url = URL.createObjectURL(merged);
  const a = document.createElement("a");
  const base = (state.current?.path || "doc").split("/").pop().replace(/\.md$/, "");
  a.href = url;
  a.download = `${base}.mp3`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded", "success");
});

// ---------- Settings modal ----------
function openSettings() {
  tts.el.cfgOpenaiKey.value = getApiKey("openai");
  tts.el.cfgElevenKey.value = getApiKey("elevenlabs");
  renderPresetEditor();
  tts.el.cfgStatus.textContent = "";
  tts.el.modal.hidden = false;
}

function closeSettings() {
  tts.el.modal.hidden = true;
}

function renderPresetEditor() {
  const wrap = tts.el.cfgPresets;
  wrap.innerHTML = "";
  tts.state.settings.presets.forEach((p, idx) => {
    const card = document.createElement("div");
    card.className = "cfg-preset";
    card.innerHTML = `
      <div class="cfg-preset-row">
        <input class="cfg-preset-label" data-field="label" value="${escapeHTML(p.label || "")}" placeholder="Preset name" />
        <select class="cfg-preset-provider" data-field="provider">
          <option value="browser" ${p.provider === "browser" ? "selected" : ""}>Browser (free)</option>
          <option value="openai" ${p.provider === "openai" ? "selected" : ""}>OpenAI</option>
          <option value="elevenlabs" ${p.provider === "elevenlabs" ? "selected" : ""}>ElevenLabs</option>
        </select>
        <button class="cfg-preset-del" title="Delete preset">×</button>
      </div>
      <div class="cfg-preset-row cfg-preset-voice">
        <input class="cfg-preset-voiceid" data-field="voiceId" value="${escapeHTML(p.voiceId || "")}" placeholder="${p.provider === "browser" ? "Voice name pattern (e.g. Daniel|en-GB)" : p.provider === "openai" ? "Voice (alloy / echo / fable / onyx / nova / shimmer)" : "ElevenLabs voice ID"}" />
      </div>
      <div class="cfg-preset-note">${escapeHTML(p.note || "")}</div>
    `;
    // Wire fields
    const labelInput = card.querySelector('[data-field="label"]');
    const providerSel = card.querySelector('[data-field="provider"]');
    const voiceInput = card.querySelector('[data-field="voiceId"]');
    const delBtn = card.querySelector(".cfg-preset-del");

    labelInput.addEventListener("input", (e) => { p.label = e.target.value; });
    providerSel.addEventListener("change", (e) => {
      p.provider = e.target.value;
      // Toggle which field this represents
      if (p.provider === "browser") {
        p.voicePattern = p.voiceId || p.voicePattern || "";
        delete p.voiceId;
      } else {
        p.voiceId = p.voiceId || p.voicePattern || "";
        delete p.voicePattern;
      }
      renderPresetEditor();
    });
    voiceInput.addEventListener("input", (e) => {
      if (p.provider === "browser") p.voicePattern = e.target.value;
      else p.voiceId = e.target.value;
    });
    delBtn.addEventListener("click", () => {
      tts.state.settings.presets.splice(idx, 1);
      renderPresetEditor();
    });
    wrap.append(card);
  });
}

tts.el.cfgAddPreset?.addEventListener("click", () => {
  tts.state.settings.presets.push({
    id: `custom-${Date.now()}`,
    label: "Custom voice",
    provider: "elevenlabs",
    voiceId: "",
    note: "Paste an ElevenLabs voice ID",
  });
  renderPresetEditor();
});

tts.el.cfgSave?.addEventListener("click", () => {
  setApiKey("openai", tts.el.cfgOpenaiKey.value.trim());
  setApiKey("elevenlabs", tts.el.cfgElevenKey.value.trim());
  // Make sure activePresetId still points to something real
  if (!tts.state.settings.presets.find((p) => p.id === tts.state.settings.activePresetId)) {
    tts.state.settings.activePresetId = tts.state.settings.presets[0]?.id || "british";
  }
  saveTtsSettings();
  renderVoicePicker();
  closeSettings();
  toast("Voice settings saved", "success");
});

tts.el.settings?.addEventListener("click", openSettings);

// Close handlers (backdrop, X, cancel)
$$('[data-close]', tts.el.modal).forEach((b) => b.addEventListener("click", closeSettings));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !tts.el.modal.hidden) closeSettings();
});

// Progress-bar scrubbing (cloud only — browser TTS has no seek)
tts.el.progressBar?.addEventListener("click", (e) => {
  const audio = tts.el.audio;
  if (!audio.src || !audio.duration) return;
  const rect = tts.el.progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  // Naive: only seek within current chunk
  audio.currentTime = Math.max(0, Math.min(audio.duration, ratio * audio.duration));
});

function ttsOnFileChange() {
  if (state.current?.ext === "md" && !state.editing) {
    tts.el.opener.hidden = !tts.el.player.hidden; // hide opener if player is up
  } else {
    tts.el.opener.hidden = true;
    if (!tts.el.player.hidden) {
      stopPlayback();
      tts.el.player.hidden = true;
    }
  }
}

// Boot TTS state
loadTtsSettings();
renderVoicePicker();
renderSpeedChip();
setPlayState("idle");

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
