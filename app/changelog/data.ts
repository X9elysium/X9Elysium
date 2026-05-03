export type ChangelogCategory =
  | "New page"
  | "New feature"
  | "Foundation"
  | "Marketing"
  | "Infrastructure"
  | "Improvement"
  | "Removed";

export type ChangelogEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: ChangelogCategory;
  title: string;
  description: string;
  href?: string;
  bullets?: string[];
};

export const CHANGELOG_CATEGORIES: ChangelogCategory[] = [
  "New page",
  "New feature",
  "Foundation",
  "Marketing",
  "Infrastructure",
  "Improvement",
  "Removed",
];

// Newest first. One entry per shipped change in the last week.
export const changelogEntries: ChangelogEntry[] = [
  {
    id: "lead-capture-docs",
    date: "2026-05-03",
    category: "Infrastructure",
    title: "Owned lead-capture pipeline documentation",
    description:
      "Published a four-doc operating manual for the new Cloudflare Worker that handles every contact-form lead — architecture, setup, ops, and a one-page README. Replaces the third-party form vendor with a transparent, $0/mo stack we can audit end to end.",
    bullets: [
      "Architecture doc: request lifecycle, layered spam defenses, failure modes, parked enhancements",
      "Setup recipe: Resend signup → DNS verification → wrangler secrets → optional Slack/KV/D1",
      "Operations runbook: wrangler tail, D1 query recipes, KV management, key rotation",
    ],
  },
  {
    id: "library-beneath",
    date: "2026-05-03",
    category: "Foundation",
    title: "“The Library Beneath” section on /foundation",
    description:
      "Added a new section between the Ten Rules and The Promise that names the two books most load-bearing in how X9Elysium operates: Naval Ravikant's Almanack and Peter Thiel's Zero to One. Two glass cards, an emerald pull quote in each, and a short list of what each book actually changed in the business.",
    href: "/foundation#texts",
  },
  {
    id: "x-automation",
    date: "2026-05-03",
    category: "New feature",
    title: "X.com posting automation + homepage tweets section",
    description:
      "Two cron jobs in GitHub Actions now run the X.com presence end to end. One posts the next thought from a queued list twice daily; the other syncs engagement metrics back into the dashboard every six hours. The homepage gained a 3-up Tweets section beneath testimonials that stays hidden until the first post lands.",
    bullets: [
      "Posts via X API v2 (OAuth 1.0a User Context); every post becomes a git commit for full audit trail",
      "Free-tier safe — handles missing impressions and rate limits gracefully",
      "Instagram explicitly excluded from the channel mix; X is the only social surface",
    ],
  },
  {
    id: "lead-capture-worker",
    date: "2026-05-03",
    category: "New feature",
    title: "Custom lead-capture Worker on Cloudflare",
    description:
      "Replaced Web3Forms with an owned /api/lead endpoint living in the same Cloudflare project that serves the static site. Layered spam defenses (origin allowlist → honeypot → dwell trap → optional KV rate limit → field validation), branded notification + auto-reply emails via Resend, and an optional D1 table for follow-up tracking.",
    bullets: [
      "Notification email is blocking — never silently swallow a lead",
      "Auto-reply written in the founder's voice, not a noreply@ template",
      "$0/mo expected at current volume across Workers + Resend + KV + D1 free tiers",
    ],
  },
  {
    id: "dashboard-sample-data",
    date: "2026-05-03",
    category: "Infrastructure",
    title: "Dashboard sample data + Tab 6 spec",
    description:
      "Added a header-only x-posts.csv plus a Tableau Tab 6 spec for the new X channel — KPI tiles, cadence timeline, engagement-rate trend, top-10 table, and a post-time heatmap — so the dashboard is wired before the channel produces real numbers.",
  },
  {
    id: "tree-of-life",
    date: "2026-05-03",
    category: "Foundation",
    title: "Tree-of-life mark on the credo section",
    description:
      "Cleaned a 784×1168 source illustration into a transparent-bg PNG (per-pixel brightness → alpha; bbox detection on green-dominant pixels; 3% padding; tiny Gaussian to soften JPG ringing) and placed it above the “Root Value” eyebrow on /foundation#credo. Visually grounds the canopy → trunk → roots metaphor against the existing radial glows.",
    href: "/foundation#credo",
  },
  {
    id: "drop-instagram-video",
    date: "2026-05-03",
    category: "Removed",
    title: "Removed Instagram autoplay video from homepage",
    description:
      "The 4.5MB hero clip and its <VideoShowcase> component are gone. The homepage now flows Hero → Services without an autoplay video competing with the hero copy.",
  },
  {
    id: "platform-pages",
    date: "2026-05-02",
    category: "New page",
    title: "Platform pages: Odoo + WooCommerce",
    description:
      "Two new platform pages position the deliberate secondary tracks alongside the Shopify Plus core. Odoo is framed for manufacturers, distributors, and multi-channel retailers; WooCommerce is framed for small clients and custom-logic operators. Each page has its own metadata, OfferCatalog + 5-question FAQPage JSON-LD, and explicit guidance on when Shopify is still the better call.",
    href: "/platforms/odoo",
    bullets: [
      "/platforms/odoo — eight modules, four-phase implementation path, edition-agnostic",
      "/platforms/woocommerce — eight capability areas, three engagement tiers",
      "Footer expanded to a 6-column grid with a new Platforms column",
    ],
  },
  {
    id: "vasudhaiva-kutumbakam",
    date: "2026-05-02",
    category: "Foundation",
    title: "Vasudhaiva Kutumbakam adopted as the root value",
    description:
      "A new #credo section on /foundation renders वसुधैव कुटुम्बकम् in Devanagari (via Noto Sans Devanagari), with transliteration, the English headline “The world is one family,” three explanatory paragraphs, and Maha Upanishad 6.71 attribution. The hero CTA hierarchy now leads with the credo; the About page mirrors a featured callout above the working principles.",
    href: "/foundation#credo",
    bullets: [
      "New Quotation JSON-LD node carries both Sanskrit + English text",
      "Organization JSON-LD now carries the Vasudhaiva Kutumbakam slogan",
      "llms.txt got a Core Credo block before Core Pages so AI engines pull the verse verbatim",
    ],
  },
  {
    id: "instagram-content-plan",
    date: "2026-05-02",
    category: "Marketing",
    title: "Instagram content plan + automation roadmap (research)",
    description:
      "Documented 10 ready-to-ship Instagram posts with image prompts locked to brand rails plus a three-tier automation path (manual → n8n → fully autonomous). Recommendation: ship Tier 1 first 30 days; kill the channel if zero qualified discovery calls land by end of Month 2. (Outcome: X.com chosen over Instagram a day later — see 2026-05-03.)",
  },
  {
    id: "marketing-reports",
    date: "2026-05-02",
    category: "Marketing",
    title: "6-month organic growth plan + third-party listings checklist",
    description:
      "Two strategy docs landed: a month-by-month plan with a weekly engine cadence and a conservative + aggressive revenue model; and a P0–P3 directory + ecosystem playbook for the third-party proof gap (Shopify Partner directory, Clutch, Google Business Profile, real LinkedIn company page).",
  },
  {
    id: "team-linkedin-hover",
    date: "2026-05-02",
    category: "Improvement",
    title: "Team cards: LinkedIn-on-hover treatment",
    description:
      "Both the homepage and About-page founder cards are now a single anchor to each LinkedIn profile, with a top-right LinkedIn icon pill that fades in on hover. Stock-photo placeholders deleted; initials avatars hold the spot until real photos drop in.",
  },
  {
    id: "email-cleanup",
    date: "2026-05-02",
    category: "Improvement",
    title: "Email migration + stale config cleanup",
    description:
      "Site-wide contact email moved to darshan@x9elysium.com. Removed Netlify- and Amplify-era cruft from configs and build scripts so the only deploy story is Cloudflare Workers (with a documented Hostinger FTP fallback).",
  },
  {
    id: "tawk-removal",
    date: "2026-05-02",
    category: "Removed",
    title: "Removed Tawk.to chatbot",
    description:
      "Lead intake now flows through Web3Forms (and shortly the new owned Worker) plus direct email only. Reason: async, intentional inbound is preferred over chat triage at this stage.",
  },
  {
    id: "og-static-png",
    date: "2026-05-02",
    category: "Improvement",
    title: "OG image switched from metadata-route to static PNG",
    description:
      "The dynamic `app/opengraph-image.tsx` route was producing inconsistent renders behind Cloudflare's static-asset model. Replaced with a deterministic static 1200×630 PNG asset for predictable social previews.",
  },
  {
    id: "about-rewrite",
    date: "2026-05-02",
    category: "Improvement",
    title: "About page founder-led rewrite",
    description:
      "Rewrote /about around the truth: GTA-based, founded 2021, only Darshan + Adhvait. Removed fabricated milestones, the third teammate, and aspirational certs. Added real LinkedIn-sourced bios with sameAs + Person JSON-LD so the founders are recognized as entities, not anonymous staff.",
    href: "/about",
  },
  {
    id: "pin-gated-journal",
    date: "2026-05-02",
    category: "New feature",
    title: "Pin-gated journal at /docs/journal",
    description:
      "Personal go-to-market journal lives at /docs/journal but ships as ciphertext only. AES-GCM + PBKDF2-SHA-256 with 100k iterations, default PIN overridable via JOURNAL_PIN at build time. Decryption happens in the browser after PIN entry — never linked from main nav, sitemap, or footer.",
  },
  {
    id: "public-docs-route",
    date: "2026-05-02",
    category: "New page",
    title: "Public /docs route with sidebar + on-page TOC",
    description:
      "Selected portions of the docs/ folder are now browseable at /docs with a left-rail folder tree and an on-page table of contents per page. Audits, marketing plans, and operating runbooks are readable; the journal stays encrypted.",
    href: "/docs",
  },
  {
    id: "local-docs-viewer",
    date: "2026-05-02",
    category: "New feature",
    title: "Local docs viewer (npm run docs)",
    description:
      "A Google-Drive-style browser of docs/ at http://localhost:4000/docs — folder tree, search, in-place markdown editing that saves to disk, create/delete, and print-to-PDF via the browser. Lives in scripts/docs-viewer/ and is excluded from the static export.",
  },
  {
    id: "cloudflare-wrangler",
    date: "2026-05-02",
    category: "Infrastructure",
    title: "Cloudflare Workers static-assets deploy",
    description:
      "Added wrangler.toml. Pushes to main now build via Cloudflare and ship `out/` as static assets through Workers, keeping the domain registered with Hostinger but moving the actual delivery to Cloudflare's edge. The Hostinger FTP recipe is documented as the manual fallback.",
  },
  {
    id: "deploy-zip",
    date: "2026-05-02",
    category: "Infrastructure",
    title: "`npm run deploy:zip` for any-host deploys",
    description:
      "Build + zip `out/` into x9elysium-static.zip for direct upload to any static host. Used as a manual fallback when CDN deploys are gated.",
  },
  {
    id: "static-export-seo",
    date: "2026-05-02",
    category: "Improvement",
    title: "Static export + Canada/US SEO + deferred third-party scripts",
    description:
      "next.config.js now emits a static export. Locale, hreflang, and contactPoint surfaces target Canada and the US deliberately. Third-party scripts (analytics, etc.) are deferred so they no longer block first paint.",
  },
  {
    id: "post-push-protocol",
    date: "2026-05-02",
    category: "Infrastructure",
    title: "Post-push deployment verification protocol",
    description:
      "A mandatory checklist in docs/deployments/post-push-checks.md — run after every push to main before reporting “done.” Hostinger and Cloudflare both cache HTML aggressively; this protocol catches broken builds the CDN would otherwise mask.",
  },
  {
    id: "blog-careers",
    date: "2026-05-02",
    category: "New page",
    title: "Blog + Careers (App Router)",
    description:
      "Migrated /blog to the App Router with an index, dynamic [slug] route (TOC, share, related posts, RSS), and BlogPosting JSON-LD. Careers page polished with per-role JobPosting JSON-LD and Breadcrumb on both surfaces.",
    href: "/blog",
  },
];
