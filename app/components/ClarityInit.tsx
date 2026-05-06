"use client";

import { useEffect } from "react";
import { clarity, buildSessionContext } from "../lib/clarity";

const FRIENDLY_PREFIX = "x9-anon";

export default function ClarityInit() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (!projectId) return;

    clarity.init(projectId);

    const ctx = buildSessionContext();
    const friendly = `${FRIENDLY_PREFIX}-${ctx.vid.slice(-6)}`;
    clarity.identify(ctx.vid, undefined, undefined, friendly);

    clarity.tags({
      visitor_type: ctx.isReturning ? "returning" : "new",
      session_count: ctx.sessionCount,
      days_since_first: ctx.daysSinceFirstSeen ?? 0,
      entry_path: ctx.entryPath,
      referrer_domain: ctx.referrerDomain ?? "direct",
      traffic_source: ctx.trafficSource,
      viewport: ctx.viewport,
      theme: ctx.theme,
      language: ctx.language,
      tz_offset: ctx.tzOffset,
      dpr: ctx.dpr,
      connection: ctx.connection ?? "unknown",
      prefers_reduced_motion: ctx.prefersReducedMotion,
      ...ctx.utm,
      ...ctx.clickIds,
    });

    if (ctx.isReturning) clarity.event("returning_visitor");
    if (Object.keys(ctx.utm).length > 0) clarity.event("utm_visit");
    if (Object.keys(ctx.clickIds).length > 0) clarity.event("paid_click");
    if (ctx.trafficSource === "ai") {
      clarity.event("ai_referral");
      clarity.upgrade("ai_referral");
    }
  }, []);

  return null;
}
