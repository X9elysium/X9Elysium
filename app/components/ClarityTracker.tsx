"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { clarity } from "../lib/clarity";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
const TIME_MILESTONES = [15, 30, 60, 120, 300] as const;

const DEEP_ENGAGEMENT_TIME_S = 60;
const DEEP_ENGAGEMENT_SCROLL = 75;

type Hit = { x: number; y: number; t: number };
const RAGE_WINDOW_MS = 1000;
const RAGE_RADIUS_PX = 50;
const RAGE_MIN_HITS = 3;

function isInteractive(el: Element | null): boolean {
  if (!el) return false;
  let cur: Element | null = el;
  for (let i = 0; i < 5 && cur; i++) {
    const tag = cur.tagName;
    if (
      tag === "A" ||
      tag === "BUTTON" ||
      tag === "INPUT" ||
      tag === "SELECT" ||
      tag === "TEXTAREA" ||
      tag === "LABEL" ||
      tag === "SUMMARY" ||
      cur.getAttribute("role") === "button" ||
      cur.hasAttribute("data-track-cta") ||
      (cur as HTMLElement).onclick != null
    ) {
      return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

function nearestTrackedAncestor(el: Element | null): HTMLElement | null {
  let cur: Element | null = el;
  for (let i = 0; i < 8 && cur; i++) {
    if (cur instanceof HTMLElement && cur.dataset.trackCta) return cur;
    cur = cur.parentElement;
  }
  return null;
}

export default function ClarityTracker() {
  const pathname = usePathname();

  // Per-page lifecycle refs
  const pageStartRef = useRef<number>(Date.now());
  const scrollHitsRef = useRef<Set<number>>(new Set());
  const timeHitsRef = useRef<Set<number>>(new Set());
  const deepFiredRef = useRef<boolean>(false);
  const exitFiredRef = useRef<boolean>(false);
  const recentClicksRef = useRef<Hit[]>([]);

  // ─── Page change tracking ────────────────────────────────────────────────
  useEffect(() => {
    if (!pathname) return;

    pageStartRef.current = Date.now();
    scrollHitsRef.current = new Set();
    timeHitsRef.current = new Set();
    deepFiredRef.current = false;
    exitFiredRef.current = false;

    clarity.tag("current_path", pathname);
    clarity.event("page_view");

    // Section-level tags (helps filter inside Clarity dashboard)
    const section = pathname.split("/")[1] || "home";
    clarity.tag("section", section || "home");

    if (pathname === "/contact") clarity.event("contact_page_view");
    if (pathname === "/chat") clarity.event("chat_page_view");
    if (pathname.startsWith("/services")) clarity.event("services_view");
    if (pathname.startsWith("/work")) clarity.event("work_view");
    if (pathname.startsWith("/locations/")) clarity.event("location_view");
    if (pathname.startsWith("/careers")) clarity.event("careers_view");
    if (pathname.startsWith("/blog")) clarity.event("blog_view");
    if (pathname.startsWith("/docs")) clarity.event("docs_view");
    if (pathname.startsWith("/about")) clarity.event("about_view");
    if (pathname.startsWith("/foundation")) clarity.event("foundation_view");
    if (pathname.startsWith("/platforms")) clarity.event("platform_compare_view");

    // Path-based reference tag (last 5 paths)
    try {
      const seenKey = "x9_clarity_paths";
      const prev = JSON.parse(localStorage.getItem(seenKey) || "[]");
      const next = Array.from(new Set([pathname, ...prev])).slice(0, 5);
      localStorage.setItem(seenKey, JSON.stringify(next));
      clarity.tag("recent_paths", next);
      if (prev.length === 0) clarity.tag("first_path", pathname);
    } catch {
      // ignore
    }
  }, [pathname]);

  // ─── Global listeners (mounted once) ────────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const now = Date.now();

      // Rage click detection
      const hits = recentClicksRef.current;
      hits.push({ x: e.clientX, y: e.clientY, t: now });
      while (hits.length > 0 && now - hits[0].t > RAGE_WINDOW_MS) hits.shift();
      const cluster = hits.filter(
        (h) =>
          Math.hypot(h.x - e.clientX, h.y - e.clientY) <= RAGE_RADIUS_PX
      );
      if (cluster.length >= RAGE_MIN_HITS) {
        clarity.event("rage_click");
        clarity.upgrade("rage_click");
        recentClicksRef.current = [];
      }

      // Dead click — click on non-interactive area (heuristic)
      if (!isInteractive(target)) {
        clarity.event("dead_click");
      }

      // Tracked CTA via data-track-cta attribute
      const tracked = nearestTrackedAncestor(target);
      if (tracked) {
        const label = tracked.dataset.trackCta || "unknown";
        const location = tracked.dataset.trackLocation || pathname || "unknown";
        clarity.event(`cta_${label}`);
        clarity.tag("last_cta", label);
        clarity.tag("last_cta_location", location);
      }

      // Anchor classification
      const anchor = (target as HTMLElement | null)?.closest?.("a") as
        | HTMLAnchorElement
        | null;
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        if (href.startsWith("mailto:")) {
          clarity.event("mailto_click");
          clarity.upgrade("mailto_click");
        } else if (href.startsWith("tel:")) {
          clarity.event("tel_click");
          clarity.upgrade("tel_click");
        } else if (anchor.target === "_blank" || /^https?:\/\//.test(href)) {
          try {
            const u = new URL(href, window.location.href);
            if (u.hostname && u.hostname !== window.location.hostname) {
              clarity.event("external_link_click");
              clarity.tag("last_external", u.hostname);
            }
          } catch {
            // ignore
          }
        }
      }
    };

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight;
      if (total <= window.innerHeight) return;
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      for (const m of SCROLL_MILESTONES) {
        if (pct >= m && !scrollHitsRef.current.has(m)) {
          scrollHitsRef.current.add(m);
          clarity.event(`scroll_${m}`);
        }
      }
      maybeFireDeepEngagement();
    };

    const maybeFireDeepEngagement = () => {
      if (deepFiredRef.current) return;
      const elapsedS = (Date.now() - pageStartRef.current) / 1000;
      if (
        elapsedS >= DEEP_ENGAGEMENT_TIME_S &&
        scrollHitsRef.current.has(DEEP_ENGAGEMENT_SCROLL)
      ) {
        deepFiredRef.current = true;
        clarity.event("deep_engagement");
        clarity.upgrade("deep_engagement");
      }
    };

    const timeInterval = setInterval(() => {
      const elapsedS = Math.floor((Date.now() - pageStartRef.current) / 1000);
      for (const m of TIME_MILESTONES) {
        if (elapsedS >= m && !timeHitsRef.current.has(m)) {
          timeHitsRef.current.add(m);
          clarity.event(`time_${m}s`);
        }
      }
      maybeFireDeepEngagement();
    }, 5000);

    const onMouseLeave = (e: MouseEvent) => {
      if (exitFiredRef.current) return;
      if (e.clientY <= 0 && e.relatedTarget == null) {
        exitFiredRef.current = true;
        clarity.event("exit_intent");
        clarity.upgrade("exit_intent");
      }
    };

    const onCopy = () => {
      const sel = window.getSelection?.()?.toString() ?? "";
      if (sel.length === 0) return;
      clarity.event("copy_text");
      clarity.tag(
        "last_copy_size",
        sel.length < 50 ? "short" : sel.length < 250 ? "medium" : "long"
      );
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        clarity.event("tab_hidden");
      } else {
        clarity.event("tab_visible");
      }
    };

    const onPrint = () => clarity.event("print_attempt");

    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const k = e.key.toLowerCase();
      if (k === "p") clarity.event("shortcut_print");
      else if (k === "f") clarity.event("shortcut_find");
      else if (k === "s") clarity.event("shortcut_save");
    };

    const onResize = () => {
      const w = window.innerWidth;
      const vp = w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
      clarity.tag("viewport", vp);
    };

    const onOnline = () => clarity.event("network_online");
    const onOffline = () => clarity.event("network_offline");

    const onError = () => clarity.event("js_error");
    const onRejection = () => clarity.event("promise_rejection");

    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("copy", onCopy);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeprint", onPrint);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // Initial scroll fire (in case page loads scrolled)
    onScroll();

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener("click", onClick, { capture: true } as never);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeprint", onPrint);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [pathname]);

  return null;
}
