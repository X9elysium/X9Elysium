export type Department =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Operations"
  | "Strategy";

export type Location = "Remote — Canada";

export type EmploymentType = "Full-time" | "Contract" | "Part-time";

export interface Job {
  slug: string;
  title: string;
  department: Department;
  location: Location;
  type: EmploymentType;
  experience: string;
  salaryRange?: string;
  shortDescription: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  whatYouGet: string[];
  postedAt: string;
}

export const jobs: Job[] = [
  {
    slug: "senior-shopify-developer",
    title: "Senior Shopify Developer",
    department: "Engineering",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "4+ years",
    salaryRange: "CA$95,000 – CA$130,000",
    shortDescription:
      "Lead complex Shopify and Shopify Plus builds end-to-end — from theme architecture to custom apps and headless storefronts.",
    about:
      "We're looking for a Senior Shopify Developer who has shipped real revenue-generating commerce, not just demo sites. You'll own technical delivery on engagements ranging from Shopify Plus replatforms to Hydrogen headless builds, working directly with our founders and the client's leadership — no middle layers, no ticket queues.",
    responsibilities: [
      "Architect and build custom Shopify and Shopify Plus storefronts using Liquid, Hydrogen, and the Storefront API.",
      "Lead replatforming projects from Magento, BigCommerce, and Salesforce Commerce Cloud onto Shopify Plus.",
      "Build and maintain custom apps using Remix, Node.js, and the Shopify Admin API.",
      "Own performance — Core Web Vitals, INP, time-to-checkout — and drive measurable improvements on every site you ship.",
      "Mentor mid-level engineers through code reviews, pairing sessions, and technical RFCs.",
      "Work directly with clients to translate commercial goals into clean technical scope.",
    ],
    requirements: [
      "4+ years of professional Shopify development experience, including at least one full Shopify Plus build.",
      "Deep fluency in Liquid, modern JavaScript/TypeScript, React, and the Shopify GraphQL APIs.",
      "Experience with checkout extensibility, Shopify Functions, and Hydrogen or other headless frameworks.",
      "Comfort with Git-based workflows, theme automation tooling (Shopify CLI, dawn), and CI/CD.",
      "Strong written communication — you can explain a tradeoff to a non-technical founder without oversimplifying.",
    ],
    niceToHave: [
      "Experience integrating Klaviyo, Recharge, Yotpo, Gorgias, or similar best-in-class commerce stack.",
      "Background in DTC, fashion, beauty, or multi-location retail.",
      "Open-source contributions or public Shopify dev presence.",
    ],
    whatYouGet: [
      "Fully remote, Canada-wide — work from anywhere with stable internet.",
      "Direct client exposure — your work shapes the brief, not the other way around.",
      "Meaningful equity-style profit sharing on the projects you lead.",
      "A budget for training, conferences, and Shopify Unite-equivalent events.",
      "Modern hardware refresh every two years and a home-office stipend.",
    ],
    postedAt: "2026-04-22",
  },
  {
    slug: "shopify-plus-solutions-architect",
    title: "Shopify Plus Solutions Architect",
    department: "Engineering",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "6+ years",
    salaryRange: "CA$130,000 – CA$165,000",
    shortDescription:
      "Own the technical strategy for our largest Shopify Plus accounts — from architecture diagrams to delivery sign-off.",
    about:
      "Solutions Architects at X9Elysium are senior technologists who can sit in a room with a CTO, sketch the integration map for a $50M+ retailer on a whiteboard, and then go ship the first PR. You'll lead pre-sales conversations, scope migrations, and stay involved through delivery to make sure the architecture survives contact with reality.",
    responsibilities: [
      "Lead architecture and discovery on enterprise Shopify Plus engagements — replatforms, B2B builds, OMS / ERP integrations.",
      "Translate commercial requirements into platform decisions: Plus vs. headless, Functions vs. apps, native vs. middleware.",
      "Author RFCs, integration diagrams, and scope-of-work documents that engineering can ship from.",
      "Partner with Shopify enterprise reps and ecosystem partners (Klaviyo, Akeneo, Celigo, Boomi) on multi-vendor deliveries.",
      "Run technical due diligence audits for clients evaluating Shopify Plus or considering replatforming away.",
    ],
    requirements: [
      "6+ years building or architecting commerce platforms, with at least 3 years on Shopify Plus.",
      "Hands-on experience with at least one major migration (Magento → Plus, SFCC → Plus, or similar).",
      "Strong grasp of B2B commerce, multi-currency, multi-store, and complex tax / fulfillment topologies.",
      "Confidence presenting to executives — you're the technical voice in the room when the deal closes.",
    ],
    niceToHave: [
      "Hydrogen, Oxygen, or other headless production experience.",
      "Background as a former Shopify employee, Shopify Partner lead engineer, or in-house ecom platform owner.",
    ],
    whatYouGet: [
      "Fully remote across Canada with quarterly in-person team offsites.",
      "Equity-style profit sharing on the accounts you architect.",
      "Direct line to founders and the most interesting engineering problems we have.",
      "Conference + certification budget, including Shopify Editions content events.",
    ],
    postedAt: "2026-04-15",
  },
  {
    slug: "ux-ui-designer-commerce",
    title: "UX / UI Designer — Commerce",
    department: "Design",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "3+ years",
    salaryRange: "CA$80,000 – CA$110,000",
    shortDescription:
      "Design Shopify and headless storefronts that convert — owning research, wireframes, UI, and the handoff to engineering.",
    about:
      "We don't make pretty things that don't work. As our Commerce UX/UI Designer, you'll lead design from research through to high-fidelity Figma handoff for Shopify Plus and Hydrogen storefronts. You'll be measured on conversion uplift, AOV, and how cleanly your work ships — not on awards.",
    responsibilities: [
      "Lead UX research, journey mapping, and competitive analysis for new Shopify projects.",
      "Design wireframes, prototypes, and pixel-perfect Figma UI for storefronts, PDPs, checkouts, and account pages.",
      "Run conversion-rate audits using GA4, Hotjar / Microsoft Clarity, and on-site survey data.",
      "Collaborate with engineering to ensure designs survive implementation — including motion specs, edge cases, and responsive behaviour.",
      "Build and maintain a design system that scales across 30+ active client accounts.",
    ],
    requirements: [
      "3+ years designing for e-commerce or DTC brands, ideally with Shopify exposure.",
      "Portfolio showing measurable conversion or revenue impact on at least two projects.",
      "Mastery of Figma, including auto-layout, components, and design tokens.",
      "Comfort partnering with developers on a daily basis — including reading basic Liquid / React.",
    ],
    niceToHave: [
      "Motion design, micro-interaction, or Lottie experience.",
      "Direct work on Shopify Plus, Hydrogen, or headless commerce launches.",
    ],
    whatYouGet: [
      "Fully remote across Canada — work where you do your best thinking.",
      "Real ownership: you'll be our second design hire, shaping how design ships across the studio.",
      "Hardware, software, and Figma plugin budget — whatever you need.",
      "Profit sharing tied to client outcomes, not just utilization.",
    ],
    postedAt: "2026-04-08",
  },
  {
    slug: "performance-marketing-manager",
    title: "Performance Marketing Manager",
    department: "Marketing",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "4+ years",
    salaryRange: "CA$85,000 – CA$115,000",
    shortDescription:
      "Plan, run, and scale paid acquisition for our DTC clients across Meta, Google, and TikTok — with full P&L responsibility.",
    about:
      "Performance Marketing at X9Elysium is not button-pushing. You'll own strategy, media plans, and creative briefs for DTC and retail clients spending anywhere from $20K to $500K per month. We win when our clients win — so this role is judged on MER, CAC payback, and contribution margin, not impressions.",
    responsibilities: [
      "Build and execute paid acquisition strategies across Meta, Google Ads, TikTok, and emerging channels.",
      "Own the full media P&L for assigned client accounts — budgets, MER targets, and weekly reporting cadence.",
      "Partner with our creative team to brief, test, and iterate on ad creative at speed.",
      "Set up and audit conversion tracking — GA4, server-side Pixel, CAPI, TikTok Events API.",
      "Present strategy and results directly to client founders and CMOs.",
    ],
    requirements: [
      "4+ years managing $1M+ in annual paid spend, ideally across two or more channels.",
      "Strong analytical foundation — you can read a cohort report and a CAC payback chart without help.",
      "Hands-on experience with GA4, Triple Whale or Northbeam, and one major attribution platform.",
      "Excellent written reporting — clients should look forward to your weekly emails.",
    ],
    niceToHave: [
      "Experience scaling DTC brands from $1M to $10M+ ARR.",
      "Background owning lifecycle (Klaviyo, Postscript) alongside paid.",
    ],
    whatYouGet: [
      "Remote across Canada with a clear bonus structure tied to client retention and growth.",
      "Direct client ownership — no being shielded behind an account manager.",
      "Tooling stack covered: Triple Whale, Motion, Foreplay, Klaviyo sandbox, and more.",
      "Quarterly team offsites in Toronto, Calgary, or Vancouver.",
    ],
    postedAt: "2026-03-30",
  },
  {
    slug: "client-success-manager",
    title: "Client Success Manager",
    department: "Operations",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "3+ years",
    salaryRange: "CA$75,000 – CA$95,000",
    shortDescription:
      "Be the trusted strategic partner to our retainer clients — from kickoff to renewal — and the operational glue across our delivery team.",
    about:
      "Client Success at X9Elysium is half consultant, half operator. You'll be the primary relationship for a portfolio of 6–10 retainer clients, run weekly syncs, build roadmaps with founders, and orchestrate delivery internally. The bar is high: we measure CSMs on NPS, retention, and account growth — not ticket throughput.",
    responsibilities: [
      "Own a portfolio of retainer clients from onboarding through renewal.",
      "Run weekly client syncs, monthly business reviews, and quarterly strategic planning sessions.",
      "Translate client priorities into clean briefs for our engineering, design, and marketing teams.",
      "Track and report on every commercial metric that matters — site uptime, conversion, AOV, pipeline.",
      "Spot expansion opportunities and partner with our founders to scope and close them.",
    ],
    requirements: [
      "3+ years in client services, account management, or strategy at a digital agency or SaaS company.",
      "E-commerce literacy — you can speak fluently about conversion, AOV, MER, and Shopify roadmap items.",
      "Excellent written communication and document craftsmanship (recap emails, decks, MBR reports).",
      "Comfort being the calm in the room when a client account hits turbulence.",
    ],
    whatYouGet: [
      "Fully remote across Canada with bi-annual team offsites.",
      "Clear, transparent commission on retention and account expansion.",
      "Senior-level autonomy — you own your book.",
      "Direct mentorship from our founding team.",
    ],
    postedAt: "2026-03-21",
  },
  {
    slug: "junior-shopify-developer",
    title: "Junior Shopify Developer",
    department: "Engineering",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "1+ year",
    salaryRange: "CA$60,000 – CA$78,000",
    shortDescription:
      "Ship Shopify themes, integrations, and small custom apps with mentorship from senior engineers — the fastest way into serious commerce work.",
    about:
      "Most agencies hide juniors from clients. We don't. You'll work on real client projects from day one, paired with a senior engineer who will review every PR and run weekly career-growth syncs with you. The expectation is steep — and so is the support.",
    responsibilities: [
      "Build and customize Shopify themes using Liquid, Tailwind, and modern JavaScript.",
      "Implement third-party integrations (Klaviyo, Recharge, Yotpo) following our internal patterns.",
      "Fix bugs and performance regressions surfaced from production monitoring.",
      "Write and maintain technical documentation as you ship.",
      "Pair regularly with senior engineers and join client calls when relevant.",
    ],
    requirements: [
      "1+ year of professional or freelance Shopify development experience.",
      "Solid grasp of Liquid, HTML, CSS, and JavaScript fundamentals.",
      "Familiarity with Git workflows and at least one component library or CSS framework (Tailwind preferred).",
      "Hunger to learn — we will throw real problems at you, and we expect you to grow into them.",
    ],
    niceToHave: [
      "Bootcamp, CS degree, or self-taught with public projects to point at.",
      "Exposure to React, Hydrogen, or Shopify Functions.",
    ],
    whatYouGet: [
      "A structured 90-day onboarding plan with weekly mentorship.",
      "Fully remote across Canada with hardware provided.",
      "Path to Mid-level promotion within 18 months — clearly documented.",
      "Education budget for courses, books, and a Shopify Partner Academy track.",
    ],
    postedAt: "2026-04-29",
  },
];

export function getAllJobs(): Job[] {
  return [...jobs].sort(
    (a, b) =>
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}

export function getDepartments(): { department: Department; count: number }[] {
  const map = new Map<Department, number>();
  for (const job of jobs) {
    map.set(job.department, (map.get(job.department) || 0) + 1);
  }
  return Array.from(map.entries()).map(([department, count]) => ({
    department,
    count,
  }));
}

export function getLocations(): { location: Location; count: number }[] {
  const map = new Map<Location, number>();
  for (const job of jobs) {
    map.set(job.location, (map.get(job.location) || 0) + 1);
  }
  return Array.from(map.entries()).map(([location, count]) => ({
    location,
    count,
  }));
}
