export type Department =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Operations"
  | "Strategy"
  | "Sales";

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
  whyNotForYou?: string[];
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
      "Build and maintain a design system that scales across the active client portfolio.",
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
    slug: "head-of-sales-smb-shopify",
    title: "Head of Sales — SMB Shopify",
    department: "Sales",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "6+ years (2+ leading sales managers)",
    salaryRange: "CA$150,000 – CA$200,000 OTE + profit share",
    shortDescription:
      "Build the SMB go-to-market motion from scratch — pipeline, team, forecast, pricing — and own the number alongside the founders.",
    about:
      "X9Elysium has been founder-sold since 2022. 30+ shipped engagements, no outbound team, and a referral pipeline that has carried us this far. You'll be the first leadership hire in this function — designing the SMB sales motion from scratch, hiring the AEs and Sales Manager who report to you, and owning the number alongside the founders. We're not looking for a quota-carrier with a manager title. We want an operator who has built a sales engine for a services or commerce-platform business serving SMB merchants ($500K – $10M GMV) and can do it again here.",
    responsibilities: [
      "Own the SMB pipeline target — generation, conversion, average deal size, and forecast accuracy.",
      "Design the playbook end-to-end: ICP, discovery, scoping, proposal, close. Codify what's in the founders' heads.",
      "Hire and lead the team: 2–4 Account Executives plus a Sales Manager within 12 months.",
      "Build the outbound motion — source-list strategy, sequencing, attribution, suppression discipline.",
      "Set commercial pricing with the founders — retainer floors, project pricing, discount discipline.",
      "Run the weekly forecast cadence: pipeline review, board-ready commit, quarterly capacity planning.",
      "Partner with delivery so every signed deal is one we can ship without melting the team.",
    ],
    requirements: [
      "6+ years selling services, software, or platforms to SMB ecommerce — Shopify, BigCommerce, Klaviyo, Recharge, or adjacent.",
      "2+ years leading sales managers or running a 3+ rep org with a documented pipeline methodology.",
      "A track record of building $0 → $3M+ ARR or net-new bookings in a services or platform-adjacent business.",
      "Founder-comfort — sit across from a Plus operator, debate migration ROI, disagree with a CFO without losing the room.",
      "Excellent written craft: forecasts, account plans, post-mortems, and exec recaps are part of the job, not delegated.",
    ],
    niceToHave: [
      "Prior Shopify Partner ecosystem experience (agency, app, or Shopify enterprise team).",
      "Operated as a player-coach — happy to take the founder calls when the team needs cover.",
      "Built or rebuilt a CRM (HubSpot or Pipedrive preferred) and tied it to delivery handoff cleanly.",
    ],
    whyNotForYou: [
      "You want to inherit a fully built playbook. We have notes, not a system — you're the person who builds it.",
      "You want a corporate brand to lean on. We're founder-led; the wedge is \"no juniors, no handoffs\", not pedigree.",
      "You expect a BDR team handing you SQLs in week one. The first quarter is you, the founders, and a list.",
      "You want to skip past SMB right away. The wedge stays $500K – $10M GMV until we've earned the right to move up.",
    ],
    whatYouGet: [
      "Founders-direct: report to Darshan and Adhvait, no shadow leadership layer.",
      "Real upside — base, uncapped variable, and profit-share on the book of business you build.",
      "First-hire authority: you pick the AEs, you pick the Sales Manager, you pick the stack.",
      "Remote-first across Canada with quarterly in-person founder + leadership offsites.",
      "Education + conference budget (Shopify Editions, Pavilion, Sales Hacker, Winning by Design).",
    ],
    postedAt: "2026-05-04",
  },
  {
    slug: "sales-manager-smb-ecommerce",
    title: "Sales Manager — SMB Ecommerce",
    department: "Sales",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "4+ years (2+ in sales management)",
    salaryRange: "CA$110,000 – CA$140,000 OTE",
    shortDescription:
      "Lead a tight AE team selling Shopify implementations, replatforms, and retainers to SMB merchants across Canada.",
    about:
      "We're hiring a Sales Manager who has actually managed AEs — not the strongest closer with a \"manager\" title. You'll own a team of 2–4 Account Executives who sell Shopify and Shopify Plus engagements to SMB ecommerce operators ($500K – $10M GMV). The role is half coaching, half operating: you'll run the pipeline cadence, sit on first-call demos when needed, and make sure every commit number is one we can defend in front of the founders.",
    responsibilities: [
      "Manage 2–4 AEs day-to-day: 1:1s, pipeline reviews, deal coaching, and ramp plans.",
      "Own the team's commit and best-case forecast every week — accuracy beats optimism here.",
      "Run discovery and scoping calls alongside AEs on deals above CA$50K project value.",
      "Coach AEs on the founder-led wedge — \"no juniors fronting senior work\" — and keep the message from drifting.",
      "Hold the line on discounts. Protect retainer floors. Walk misfit deals before they hit delivery.",
      "Partner with delivery (engineering, design, CSM) to keep handoff clean and post-sale expectations grounded.",
      "Write the weekly pipeline narrative — what moved, what slipped, what we changed.",
    ],
    requirements: [
      "4+ years in B2B sales, with 2+ managing a team of AEs in services, agency, or commerce-SaaS.",
      "Documented experience selling into SMB ecommerce — Shopify, BigCommerce, Klaviyo, Recharge, or comparable.",
      "Comfort with CRM forecasts (HubSpot or Pipedrive) and a clear, defensible deal-stage methodology.",
      "Strong written communication — pipeline reviews, deal reviews, and coaching notes happen in writing.",
      "Senior demeanour — sit on a call with a $5M DTC founder and a CFO and run the room.",
    ],
    niceToHave: [
      "Background as an AE or AM at a Shopify Plus partner agency.",
      "Hands-on with sales engagement tools (Apollo, Outreach, Smartlead, Instantly).",
    ],
    whyNotForYou: [
      "You want to manage a team of 8+. The plan is 2–4 AEs in year one — focused, not sprawling.",
      "You expect Salesforce + Outreach + Gong + Clari from day one. We're on HubSpot + Apollo + Smartlead until volume forces an upgrade.",
      "You don't enjoy being a player-coach. You'll be on real calls; this isn't a managed-from-a-dashboard job.",
      "You manage by activity metrics — calls dialed, emails sent. We measure pipeline quality, conversion, and team retention.",
    ],
    whatYouGet: [
      "Direct line to the Head of Sales and founders — no BDR-of-the-month culture.",
      "Real ownership: you manage the AEs, set the cadence, and run the room on Mondays.",
      "Variable comp tied to team attainment AND retention — both halves of the equation.",
      "Remote-first across Canada with full hardware + tooling budget.",
      "Path to Director-level promotion as the team scales.",
    ],
    postedAt: "2026-05-04",
  },
  {
    slug: "account-executive-smb-shopify",
    title: "Account Executive — SMB Shopify",
    department: "Sales",
    location: "Remote — Canada",
    type: "Full-time",
    experience: "2+ years (selling to SMB ecommerce)",
    salaryRange: "CA$80,000 – CA$110,000 OTE (CA$50K base + uncapped variable)",
    shortDescription:
      "Close Shopify implementation, replatform, and retainer deals with SMB founders — outbound + warm inbound, 30–90 day cycles.",
    about:
      "An AE at X9Elysium does not get fed leads from a BDR you'll never meet. You'll be on the first call, the discovery call, the scoping call, and the close call — supported directly by the founders, the Head of Sales, and the engineering and design team that ships the work. Our average deal is CA$25K – $150K with a $500K – $10M GMV merchant, often replatforming from Magento or WooCommerce, occasionally graduating to Shopify Plus. If you've sold consulting, services, or commerce platforms to SMB founders before, you'll recognize the motion.",
    responsibilities: [
      "Own a quota of 4–6 closed-won engagements per quarter at CA$25K – $150K average deal value.",
      "Run discovery, scoping, and proposal calls directly with SMB founders, ecom managers, and ops leads.",
      "Build pipeline with a 40 / 40 / 20 mix — outbound, inbound from web + Partner directory, ecosystem referral.",
      "Translate technical scope into commercial proposals with our solutions architect and delivery team.",
      "Maintain a clean CRM — accurate next steps, dollar amounts, close dates. We forecast off your numbers.",
      "Co-own the handoff to delivery — every signed SOW comes with a brief engineering and design can ship from.",
      "Feed product-marketing the language merchants actually use — what's working, what's missing on the site.",
    ],
    requirements: [
      "2+ years in a closing role at a B2B services, agency, or commerce-SaaS company selling into SMB ecommerce.",
      "Demonstrated track record hitting quota for at least four consecutive quarters.",
      "Working knowledge of Shopify or a comparable platform — speak credibly to conversion, AOV, MER, replatforming.",
      "Excellent written craft: discovery recaps, proposals, and follow-up emails should be sharp and short.",
      "Comfort being the senior-most person in the deal until scope-of-work — no AM safety net.",
      "2+ years in a leadership capacity broadly defined: managed a book, mentored a BDR, ran your own pipeline, or led a sales pod.",
    ],
    niceToHave: [
      "Experience selling Shopify Plus engagements specifically.",
      "Background as a Shopify merchant, in-house ecom manager, or agency strategist before moving to sales.",
      "Multilingual (FR-CA particularly useful — we serve Quebec merchants).",
    ],
    whyNotForYou: [
      "You want a BDR feeding you SQLs. Pipeline starts with you — outbound is 40% of the mix, not 0%.",
      "You want to specialise in one channel. We sell across replatforming, retainers, and custom builds — generalists win here.",
      "You sell on price. Our floors are CA$25K project / $8K retainer; below that we walk.",
      "You expect a junior-AE ramp track. This is a closer role from week six.",
    ],
    whatYouGet: [
      "Uncapped variable — the more you close, the more you make.",
      "Founders, architects, and designers on every important call. We sell as a team.",
      "Real warm inbound from the website, Shopify Partner directory, and Clutch profile.",
      "Remote-first across Canada with full SDR-tool, CRM, and hardware budget.",
      "Direct mentorship from the Head of Sales and founders — quarterly career-growth syncs in writing.",
    ],
    postedAt: "2026-05-04",
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
