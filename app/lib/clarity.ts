"use client";

import Clarity from "@microsoft/clarity";

type Primitive = string | number | boolean;
type ConsentV2 = {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
};

const isClient = () => typeof window !== "undefined";

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export const clarity = {
  init(projectId: string) {
    if (!isClient() || !projectId) return;
    safe(() => Clarity.init(projectId));
  },

  identify(
    customId: string,
    sessionId?: string,
    pageId?: string,
    friendlyName?: string
  ) {
    if (!isClient() || !customId) return;
    safe(() => Clarity.identify(customId, sessionId, pageId, friendlyName));
  },

  tag(key: string, value: Primitive | string[]) {
    if (!isClient() || !key) return;
    const v = Array.isArray(value) ? value : String(value);
    safe(() => Clarity.setTag(key, v));
  },

  tags(map: Record<string, Primitive | string[] | undefined | null>) {
    if (!isClient()) return;
    for (const [k, v] of Object.entries(map)) {
      if (v === undefined || v === null || v === "") continue;
      this.tag(k, v as Primitive | string[]);
    }
  },

  event(name: string) {
    if (!isClient() || !name) return;
    safe(() => Clarity.event(name));
  },

  upgrade(reason: string) {
    if (!isClient() || !reason) return;
    safe(() => Clarity.upgrade(reason));
  },

  consent(opts?: ConsentV2) {
    if (!isClient()) return;
    safe(() =>
      opts ? Clarity.consentV2(opts) : Clarity.consentV2()
    );
  },
};

// ─── Visitor identity helpers ────────────────────────────────────────────────

const VISITOR_KEY = "x9_clarity_vid";
const SESSION_COUNT_KEY = "x9_clarity_sc";
const FIRST_SEEN_KEY = "x9_clarity_first";

export function getOrCreateVisitorId(): string {
  if (!isClient()) return "ssr";
  let vid = safe(() => localStorage.getItem(VISITOR_KEY)) ?? null;
  if (!vid) {
    const rand =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    vid = `v_${rand}`;
    safe(() => localStorage.setItem(VISITOR_KEY, vid as string));
    safe(() => localStorage.setItem(FIRST_SEEN_KEY, String(Date.now())));
  }
  return vid;
}

export function bumpSessionCount(): number {
  if (!isClient()) return 1;
  const prev = Number(safe(() => localStorage.getItem(SESSION_COUNT_KEY)) ?? 0);
  const next = prev + 1;
  safe(() => localStorage.setItem(SESSION_COUNT_KEY, String(next)));
  return next;
}

export function getFirstSeen(): number | null {
  if (!isClient()) return null;
  const v = safe(() => localStorage.getItem(FIRST_SEEN_KEY));
  return v ? Number(v) : null;
}

// ─── Session context (UTMs, referrer, device) ────────────────────────────────

export type SessionContext = {
  vid: string;
  sessionCount: number;
  isReturning: boolean;
  daysSinceFirstSeen: number | null;
  entryPath: string;
  referrerDomain: string | null;
  trafficSource:
    | "direct"
    | "organic"
    | "social"
    | "paid"
    | "referral"
    | "ai"
    | "internal";
  utm: Record<string, string>;
  clickIds: Record<string, string>;
  viewport: "mobile" | "tablet" | "desktop";
  theme: "dark" | "light";
  language: string;
  tzOffset: number;
  dpr: number;
  connection: string | null;
  prefersReducedMotion: boolean;
};

const SOCIAL_DOMAINS = [
  "x.com",
  "twitter.com",
  "t.co",
  "linkedin.com",
  "lnkd.in",
  "facebook.com",
  "instagram.com",
  "reddit.com",
  "youtube.com",
  "tiktok.com",
  "pinterest.com",
];
const SEARCH_DOMAINS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "yahoo.com",
  "ecosia.org",
  "yandex.",
  "baidu.com",
  "brave.com",
];
const AI_DOMAINS = [
  "chat.openai.com",
  "chatgpt.com",
  "perplexity.ai",
  "claude.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
  "you.com",
];

function classifyTrafficSource(
  referrer: string,
  utm: Record<string, string>,
  clickIds: Record<string, string>
): SessionContext["trafficSource"] {
  if (clickIds.gclid || clickIds.fbclid || clickIds.li_fat_id) return "paid";
  if (utm.utm_medium) {
    const m = utm.utm_medium.toLowerCase();
    if (["cpc", "ppc", "paid", "ads", "display"].some((x) => m.includes(x)))
      return "paid";
    if (["social", "smm"].some((x) => m.includes(x))) return "social";
    if (["email", "newsletter"].some((x) => m.includes(x))) return "referral";
    if (["organic", "seo"].some((x) => m.includes(x))) return "organic";
  }
  if (!referrer) return "direct";
  const host = referrer.toLowerCase();
  if (host.includes("x9elysium.com")) return "internal";
  if (AI_DOMAINS.some((d) => host.includes(d))) return "ai";
  if (SEARCH_DOMAINS.some((d) => host.includes(d))) return "organic";
  if (SOCIAL_DOMAINS.some((d) => host.includes(d))) return "social";
  return "referral";
}

export function buildSessionContext(): SessionContext {
  const vid = getOrCreateVisitorId();
  const sessionCount = bumpSessionCount();
  const firstSeen = getFirstSeen();
  const daysSinceFirstSeen = firstSeen
    ? Math.floor((Date.now() - firstSeen) / (1000 * 60 * 60 * 24))
    : null;

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const utm: Record<string, string> = {};
  for (const k of utmKeys) {
    const v = params.get(k);
    if (v) utm[k] = v;
  }
  const clickIdKeys = ["gclid", "fbclid", "li_fat_id", "msclkid", "ttclid"];
  const clickIds: Record<string, string> = {};
  for (const k of clickIdKeys) {
    const v = params.get(k);
    if (v) clickIds[k] = v;
  }

  let referrerDomain: string | null = null;
  if (document.referrer) {
    try {
      referrerDomain = new URL(document.referrer).hostname;
    } catch {
      referrerDomain = null;
    }
  }

  const trafficSource = classifyTrafficSource(
    referrerDomain ?? "",
    utm,
    clickIds
  );

  const w = window.innerWidth;
  const viewport: SessionContext["viewport"] =
    w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";

  const theme: SessionContext["theme"] =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const conn =
    (navigator as unknown as { connection?: { effectiveType?: string } })
      .connection?.effectiveType ?? null;

  return {
    vid,
    sessionCount,
    isReturning: sessionCount > 1,
    daysSinceFirstSeen,
    entryPath: url.pathname,
    referrerDomain,
    trafficSource,
    utm,
    clickIds,
    viewport,
    theme,
    language: navigator.language || "unknown",
    tzOffset: -new Date().getTimezoneOffset() / 60,
    dpr: window.devicePixelRatio || 1,
    connection: conn,
    prefersReducedMotion:
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  };
}
