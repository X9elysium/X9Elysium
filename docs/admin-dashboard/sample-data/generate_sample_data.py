"""
Generate synthetic-but-realistic sample data for the X9Elysium Tableau admin dashboard.

Run from this folder:
    python3 generate_sample_data.py

Outputs 7 CSVs in the same directory. Deterministic (seeded), so re-running
produces identical data. Edit RANGE_START / RANGE_END to shift the time window.
"""

import csv
import random
from datetime import date, timedelta
from pathlib import Path

random.seed(20260502)

HERE = Path(__file__).parent
RANGE_END = date(2026, 5, 1)
RANGE_START = RANGE_END - timedelta(days=180)  # ~6 months

# ---------------------------------------------------------------------------
# Shared dimension data
# ---------------------------------------------------------------------------

FIRST_NAMES = [
    "Sarah", "Michael", "Priya", "James", "Emma", "David", "Olivia", "Daniel",
    "Sophia", "Marcus", "Aisha", "Liam", "Noah", "Ava", "Ethan", "Mia",
    "Lucas", "Isabella", "Mason", "Charlotte", "Logan", "Amelia", "Jackson",
    "Harper", "Aiden", "Evelyn", "Carter", "Abigail", "Sebastian", "Emily",
    "Henry", "Elizabeth", "Owen", "Sofia", "Wyatt", "Ella", "Grayson", "Madison",
    "Jack", "Scarlett", "Levi", "Victoria", "Julian", "Aria", "Ryan", "Grace",
    "Nathan", "Chloe", "Connor", "Camila",
]
LAST_NAMES = [
    "Chen", "Patel", "Singh", "Williams", "Brown", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
]
COMPANIES = [
    "Northwind Apparel", "Lumen Skincare", "Roastline Coffee", "Vesper Home",
    "Atlas Outdoors", "Ember & Oak", "Halcyon Wellness", "Tidewater Goods",
    "Maple Lane Beauty", "Harbour Collective", "Cedar Co.", "Steepwater Tea",
    "Verdant Pet", "Sundial Active", "Wildline Apparel", "Brassroot Footwear",
    "Northbloom", "Glasshouse Lighting", "Riverstone Bakery", "Fjord Apparel",
    "Coastline Surf", "Quill & Page", "Field Notes Coffee", "Boreal Provisions",
    "Pinecrest Outdoors", "Solace Linens", "Crown Heights Co.", "Bayfront Beauty",
    "Lakeshore Tea", "Driftwood Home",
]
INTAKE_TOPICS = [
    "Shopify Plus migration",
    "Headless build (Hydrogen)",
    "Replatform from BigCommerce",
    "Magento → Shopify Plus migration",
    "Site speed / Core Web Vitals",
    "B2B / wholesale on Shopify",
    "Subscription program (Recharge)",
    "International / multi-region (Markets)",
    "Custom Shopify Plus app",
    "Theme customization",
    "Odoo ERP integration",
    "WooCommerce → Shopify migration",
    "Performance audit",
    "Design refresh",
    "Checkout extensions",
]
SOURCES = [
    ("Organic Search", 0.40),
    ("LinkedIn", 0.18),
    ("Referral", 0.16),
    ("Direct", 0.12),
    ("Instagram", 0.06),
    ("Email", 0.04),
    ("Paid Search", 0.04),
]
LEAD_STATUSES = [
    ("New", 0.10),
    ("Qualified", 0.20),
    ("Discovery Booked", 0.18),
    ("Proposal Sent", 0.18),
    ("Negotiation", 0.10),
    ("Won", 0.12),
    ("Lost", 0.12),
]
LOST_REASONS = [
    "Budget", "Timing", "Chose competitor", "Ghosted",
    "Internal team will do it", "Not a fit", "No reply after proposal",
]
COUNTRIES = [
    ("Canada", 0.55),
    ("United States", 0.35),
    ("United Kingdom", 0.04),
    ("Australia", 0.03),
    ("India", 0.03),
]
ASSIGNEES = ["Darshan Patel", "Adhvait Patel"]
PROJECT_TYPES = [
    ("Shopify Plus Build", 5000, 95000),
    ("Replatform / Migration", 35000, 180000),
    ("Headless / Hydrogen", 60000, 220000),
    ("Performance Audit", 4000, 12000),
    ("Theme Customization", 6000, 28000),
    ("Custom App", 18000, 80000),
    ("Subscription Setup", 12000, 38000),
    ("B2B Setup", 25000, 85000),
    ("Odoo Implementation", 30000, 120000),
    ("WooCommerce Build", 8000, 35000),
    ("Retainer / Support", 4000, 9000),
]


def weighted_pick(pairs):
    options, weights = zip(*pairs)
    return random.choices(options, weights=weights, k=1)[0]


def daterange(start, end):
    cur = start
    while cur <= end:
        yield cur
        cur += timedelta(days=1)


def write_csv(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"Wrote {path.name} ({len(rows)} rows)")


# ---------------------------------------------------------------------------
# leads.csv
# ---------------------------------------------------------------------------

def gen_leads():
    rows = []
    lead_id = 1001
    days = (RANGE_END - RANGE_START).days
    for offset in range(days):
        d = RANGE_START + timedelta(days=offset)
        # ramp leads slightly over time (the engine is supposedly working)
        ramp = 0.6 + (offset / days) * 0.9
        # weekday boost
        wd_factor = 1.2 if d.weekday() < 5 else 0.4
        n = max(0, int(random.gauss(1.4 * ramp * wd_factor, 0.9)))
        for _ in range(n):
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            company = random.choice(COMPANIES)
            email_company = company.lower().replace(" & ", "and").replace(".", "").replace(" ", "")
            email = f"{first.lower()}.{last.lower()}@{email_company}.com"
            phone_used = random.random() < 0.35
            phone = f"+1-{random.randint(200,989)}-{random.randint(200,989)}-{random.randint(1000,9999)}" if phone_used else ""
            source = weighted_pick(SOURCES)
            country = weighted_pick(COUNTRIES)
            topic = random.choice(INTAKE_TOPICS)
            ptype, lo, hi = random.choice(PROJECT_TYPES)
            budget_min = random.choice([5000, 10000, 25000, 50000, 100000, 250000])
            budget_max = budget_min * random.choice([2, 3, 4])
            budget = f"${budget_min:,} - ${budget_max:,}"
            score = max(15, min(98, int(random.gauss(62, 18))))
            status = weighted_pick(LEAD_STATUSES)
            assignee = random.choice(ASSIGNEES)
            # first response time in hours
            resp_hours = max(0.2, round(random.gauss(6, 4), 1))
            first_resp_at = (d + timedelta(hours=resp_hours)).isoformat() + "T09:00:00"
            deal_value = ""
            won_lost = ""
            lost_reason = ""
            if status == "Won":
                deal_value = random.randint(lo, hi)
                won_lost = "Won"
            elif status == "Lost":
                deal_value = random.randint(lo, hi) if random.random() < 0.5 else 0
                won_lost = "Lost"
                lost_reason = random.choice(LOST_REASONS)
            elif status in ("Proposal Sent", "Negotiation"):
                deal_value = random.randint(lo, hi)
            notes_pool = [
                "Wants to launch before Q4 peak.",
                "Currently on Magento 2 — pain point is checkout speed.",
                "Has internal dev but needs strategy + Plus expertise.",
                "Budget approved; waiting on board sign-off.",
                "Referred by past client.",
                "Found us via the Magento migration guide.",
                "Prefers async communication; Slack-first.",
                "Migrating from BigCommerce; concerned about SEO loss.",
                "Subscription business; Recharge experience required.",
                "Multi-region rollout to US + UK + AU.",
                "Wants headless POC before committing.",
                "",
            ]
            notes = random.choice(notes_pool)
            rows.append([
                f"L-{lead_id}",
                d.isoformat() + "T" + f"{random.randint(8,19):02d}:{random.randint(0,59):02d}:00",
                f"{first} {last}",
                email,
                company,
                phone,
                country,
                source,
                topic,
                ptype,
                budget,
                status,
                score,
                assignee,
                first_resp_at,
                deal_value,
                won_lost,
                lost_reason,
                notes,
            ])
            lead_id += 1
    header = [
        "lead_id", "submitted_at", "name", "email", "company", "phone",
        "country", "source", "topic", "project_type", "budget_range",
        "status", "lead_score", "assigned_to", "first_response_at",
        "deal_value_usd", "won_lost", "lost_reason", "notes",
    ]
    write_csv(HERE / "leads.csv", header, rows)


# ---------------------------------------------------------------------------
# seo-rankings.csv (weekly snapshots)
# ---------------------------------------------------------------------------

KEYWORDS = [
    ("shopify plus consultant canada", "/", 480, 32, "commercial"),
    ("shopify plus agency toronto", "/locations/toronto", 320, 38, "commercial"),
    ("shopify plus partner toronto", "/locations/toronto", 210, 35, "commercial"),
    ("shopify plus migration", "/services", 1900, 55, "informational"),
    ("magento to shopify plus migration", "/blog/magento-to-shopify-plus", 720, 48, "informational"),
    ("bigcommerce vs shopify plus", "/blog/bigcommerce-vs-shopify-plus", 1100, 62, "comparison"),
    ("shopify hydrogen agency", "/services", 390, 41, "commercial"),
    ("shopify plus pricing", "/blog/shopify-plus-pricing", 5400, 71, "informational"),
    ("headless commerce shopify", "/services", 880, 58, "informational"),
    ("shopify plus vs shopify advanced", "/blog/plus-vs-advanced", 1300, 49, "comparison"),
    ("shopify b2b setup", "/services", 590, 44, "commercial"),
    ("shopify subscription app", "/blog/subscriptions", 2400, 65, "informational"),
    ("shopify checkout extensions", "/blog/checkout-extensions", 480, 39, "informational"),
    ("shopify markets multi-region", "/blog/markets-guide", 320, 36, "informational"),
    ("shopify plus consultant vancouver", "/locations/vancouver", 110, 28, "commercial"),
    ("shopify plus consultant calgary", "/locations/calgary", 90, 26, "commercial"),
    ("odoo shopify integration", "/platforms/odoo", 720, 42, "commercial"),
    ("woocommerce to shopify migration", "/blog/woo-to-shopify", 880, 47, "informational"),
    ("shopify site speed optimization", "/services", 480, 43, "commercial"),
    ("core web vitals shopify", "/blog/core-web-vitals-shopify", 390, 38, "informational"),
]


def gen_seo_rankings():
    rows = []
    weeks = (RANGE_END - RANGE_START).days // 7
    for kw, url, vol, diff, intent in KEYWORDS:
        # base position: harder kws start worse and improve over time
        start_pos = min(95, 30 + diff // 2 + random.randint(-4, 6))
        end_pos = max(2, start_pos - random.randint(8, 28))
        for w in range(weeks + 1):
            d = RANGE_START + timedelta(days=w * 7)
            progress = w / max(1, weeks)
            pos = start_pos + (end_pos - start_pos) * progress + random.gauss(0, 1.6)
            pos = max(1, min(100, round(pos, 1)))
            change = "" if w == 0 else round(rows[-1][3] - pos, 1)
            rows.append([
                d.isoformat(),
                kw,
                url,
                pos,
                vol,
                diff,
                "Google",
                "Canada" if random.random() < 0.6 else "United States",
                intent,
                change,
            ])
    header = [
        "date", "keyword", "page_url", "position", "search_volume",
        "difficulty", "search_engine", "country", "intent", "position_change",
    ]
    write_csv(HERE / "seo-rankings.csv", header, rows)


# ---------------------------------------------------------------------------
# seo-traffic.csv (daily organic sessions per top page)
# ---------------------------------------------------------------------------

PAGES = [
    ("/", "X9Elysium — Shopify Plus Consulting"),
    ("/services", "Services — Shopify Plus, Hydrogen, B2B"),
    ("/work", "Case Studies — X9Elysium"),
    ("/about", "About X9Elysium — Founder-led Shopify Plus Consulting"),
    ("/contact", "Contact X9Elysium"),
    ("/foundation", "Foundation — Vasudhaiva Kutumbakam"),
    ("/blog/magento-to-shopify-plus", "Magento → Shopify Plus Migration Guide"),
    ("/blog/bigcommerce-vs-shopify-plus", "BigCommerce vs Shopify Plus"),
    ("/blog/plus-vs-advanced", "Shopify Plus vs Shopify Advanced"),
    ("/blog/shopify-plus-pricing", "Shopify Plus Pricing in 2026"),
    ("/blog/subscriptions", "Subscriptions on Shopify — A Founder's Guide"),
    ("/blog/core-web-vitals-shopify", "Core Web Vitals for Shopify Stores"),
    ("/blog/checkout-extensions", "Shopify Checkout Extensions Explained"),
    ("/blog/markets-guide", "Shopify Markets — Multi-Region Setup"),
    ("/blog/woo-to-shopify", "WooCommerce → Shopify Migration"),
    ("/locations/toronto", "Shopify Plus Consultant Toronto"),
    ("/locations/calgary", "Shopify Plus Consultant Calgary"),
    ("/locations/vancouver", "Shopify Plus Consultant Vancouver"),
    ("/platforms/odoo", "Odoo Implementation Partner"),
    ("/platforms/woocommerce", "WooCommerce Development"),
]


def gen_seo_traffic():
    rows = []
    for d in daterange(RANGE_START, RANGE_END):
        progress = (d - RANGE_START).days / max(1, (RANGE_END - RANGE_START).days)
        ramp = 0.6 + progress * 1.6
        wd = 1.0 if d.weekday() < 5 else 0.55
        for path, title in PAGES:
            base = {
                "/": 60, "/services": 38, "/work": 22, "/about": 18, "/contact": 14,
                "/foundation": 8,
            }.get(path, 12)
            sessions = max(0, int(random.gauss(base * ramp * wd, base * 0.3)))
            if sessions == 0:
                continue
            users = max(1, int(sessions * random.uniform(0.78, 0.95)))
            bounce = round(random.uniform(0.32, 0.71), 3)
            avg_dur = round(random.uniform(28, 240), 1)
            conv = 0
            if path in ("/contact", "/services", "/work", "/"):
                conv = max(0, int(sessions * random.uniform(0.005, 0.045)))
            rows.append([
                d.isoformat(), path, title, sessions, users, bounce,
                avg_dur, conv, "Google",
            ])
    header = [
        "date", "page_url", "page_title", "organic_sessions", "organic_users",
        "bounce_rate", "avg_session_duration_sec", "conversions", "search_engine",
    ]
    write_csv(HERE / "seo-traffic.csv", header, rows)


# ---------------------------------------------------------------------------
# website-analytics.csv (daily site totals)
# ---------------------------------------------------------------------------

CHANNELS = ["Organic Search", "Direct", "Referral", "Social", "Email", "Paid Search"]
TOP_REFERRERS = ["google.com", "linkedin.com", "instagram.com", "github.com", "shopify.com"]


def gen_web_analytics():
    rows = []
    for d in daterange(RANGE_START, RANGE_END):
        progress = (d - RANGE_START).days / max(1, (RANGE_END - RANGE_START).days)
        ramp = 0.65 + progress * 1.7
        wd = 1.0 if d.weekday() < 5 else 0.5
        sessions = max(20, int(random.gauss(420 * ramp * wd, 80)))
        users = int(sessions * random.uniform(0.78, 0.93))
        new_users = int(users * random.uniform(0.55, 0.78))
        returning = users - new_users
        page_views = int(sessions * random.uniform(1.6, 3.4))
        bounce = round(random.uniform(0.35, 0.62), 3)
        avg_dur = round(random.uniform(42, 210), 1)
        conversions = max(0, int(sessions * random.uniform(0.004, 0.038)))
        conv_rate = round(conversions / sessions, 4) if sessions else 0
        top_ref = random.choice(TOP_REFERRERS)
        country = "Canada" if random.random() < 0.55 else random.choice(
            ["United States", "United Kingdom", "Australia", "India", "Germany"]
        )
        rows.append([
            d.isoformat(), sessions, users, new_users, returning,
            page_views, bounce, avg_dur, conversions, conv_rate,
            top_ref, country,
        ])
    header = [
        "date", "total_sessions", "total_users", "new_users", "returning_users",
        "page_views", "bounce_rate", "avg_session_duration_sec", "conversions",
        "conversion_rate", "top_referrer", "top_country",
    ]
    write_csv(HERE / "website-analytics.csv", header, rows)


# ---------------------------------------------------------------------------
# core-web-vitals.csv (weekly CWV per key URL)
# ---------------------------------------------------------------------------

CWV_URLS = [p for p, _ in PAGES[:10]]
DEVICES = ["mobile", "desktop"]


def gen_cwv():
    rows = []
    weeks = (RANGE_END - RANGE_START).days // 7
    for url in CWV_URLS:
        # baseline LCP improves over time (we keep optimizing)
        base_lcp = random.uniform(2400, 3800)
        for w in range(weeks + 1):
            d = RANGE_START + timedelta(days=w * 7)
            improvement = (w / max(1, weeks)) * random.uniform(400, 1100)
            for device in DEVICES:
                lcp = max(900, base_lcp - improvement + random.gauss(0, 180))
                if device == "desktop":
                    lcp *= 0.65
                inp = max(40, random.gauss(190 if device == "mobile" else 110, 35))
                cls = max(0.0, round(random.gauss(0.06, 0.04), 3))
                fcp = max(700, lcp - random.uniform(400, 1200))
                ttfb = max(150, fcp - random.uniform(300, 700))
                # green if LCP < 2500 and INP < 200 and CLS < 0.1
                score = (
                    "Good" if lcp < 2500 and inp < 200 and cls < 0.1 else
                    "Needs Improvement" if lcp < 4000 and inp < 500 and cls < 0.25 else
                    "Poor"
                )
                rows.append([
                    d.isoformat(), url, device,
                    round(lcp, 0), round(inp, 0), cls,
                    round(fcp, 0), round(ttfb, 0), score,
                ])
    header = [
        "date", "page_url", "device", "lcp_ms", "inp_ms", "cls",
        "fcp_ms", "ttfb_ms", "rating",
    ]
    write_csv(HERE / "core-web-vitals.csv", header, rows)


# ---------------------------------------------------------------------------
# tasks.csv
# ---------------------------------------------------------------------------

TASK_CATEGORIES = ["Build", "Design", "Audit", "Migration", "Bug Fix", "Strategy", "Content", "Sales", "Admin"]
TASK_PROJECTS = [
    "Northwind Apparel — Plus Migration",
    "Lumen Skincare — Subscription Setup",
    "Roastline — Site Speed",
    "Vesper Home — Headless POC",
    "Atlas Outdoors — B2B Portal",
    "Internal — Marketing Engine",
    "Internal — Site Improvements",
    "Brassroot — Theme Refresh",
    "Halcyon — Magento Migration",
    "Tidewater — Markets Rollout",
]
TASK_TITLES_BY_CATEGORY = {
    "Build": [
        "Implement product bundle metafields",
        "Build custom B2B checkout extension",
        "Wire up Recharge subscription tier",
        "Set up Markets for US + UK",
        "Hydrogen storefront cart sync",
    ],
    "Design": [
        "Design PDP variant selector",
        "Refresh homepage hero",
        "Mobile filters redesign",
        "Cart drawer iteration",
    ],
    "Audit": [
        "Core Web Vitals audit",
        "SEO audit + rewrite plan",
        "Accessibility (WCAG AA) pass",
        "GA4 event audit",
    ],
    "Migration": [
        "Catalog import dry run",
        "URL redirect map",
        "Customer + order import",
        "Theme parity QA",
    ],
    "Bug Fix": [
        "Checkout JS error in Safari",
        "Inventory sync race condition",
        "Klaviyo flow trigger missing",
        "Discount code stacking bug",
    ],
    "Strategy": [
        "Q3 roadmap workshop",
        "B2B pricing model review",
        "Subscription LTV model",
    ],
    "Content": [
        "Write Magento → Plus migration guide",
        "Blog: BigCommerce vs Plus",
        "Case study: Northwind",
        "LinkedIn post: site speed",
    ],
    "Sales": [
        "Send proposal to Lumen",
        "Discovery call — Atlas Outdoors",
        "Follow-up: Roastline (week 3)",
        "Quarterly review with Vesper",
    ],
    "Admin": [
        "Invoicing for April",
        "Reconcile Stripe payouts",
        "Update brand assets in Drive",
    ],
}
TASK_STATUSES = [
    ("Done", 0.45),
    ("In Progress", 0.20),
    ("Todo", 0.18),
    ("Blocked", 0.05),
    ("Backlog", 0.12),
]
TASK_PRIORITIES = [("High", 0.25), ("Medium", 0.55), ("Low", 0.20)]


def gen_tasks():
    rows = []
    task_id = 4001
    for _ in range(120):
        created = RANGE_START + timedelta(days=random.randint(0, (RANGE_END - RANGE_START).days))
        category = random.choice(TASK_CATEGORIES)
        title = random.choice(TASK_TITLES_BY_CATEGORY[category])
        project = random.choice(TASK_PROJECTS)
        client = project.split(" — ")[0] if "Internal" not in project else "Internal"
        assignee = random.choice(ASSIGNEES)
        status = weighted_pick(TASK_STATUSES)
        priority = weighted_pick(TASK_PRIORITIES)
        est_h = random.choice([1, 2, 3, 4, 6, 8, 12, 16, 24])
        due = created + timedelta(days=random.randint(2, 30))
        completed = ""
        actual_h = ""
        if status == "Done":
            done_offset = random.randint(0, max(1, (due - created).days + 5))
            completed_d = created + timedelta(days=done_offset)
            if completed_d > RANGE_END:
                completed_d = RANGE_END
            completed = completed_d.isoformat()
            actual_h = max(0.5, round(est_h * random.uniform(0.6, 1.6), 1))
        rows.append([
            f"T-{task_id}", title, project, client, assignee, status, priority,
            category, created.isoformat(), due.isoformat(), completed,
            est_h, actual_h,
        ])
        task_id += 1
    header = [
        "task_id", "title", "project", "client", "assignee", "status",
        "priority", "category", "created_at", "due_date", "completed_at",
        "estimated_hours", "actual_hours",
    ]
    write_csv(HERE / "tasks.csv", header, rows)


# ---------------------------------------------------------------------------
# campaigns.csv
# ---------------------------------------------------------------------------

CAMPAIGN_DEFS = [
    ("LinkedIn — Founder-led Q1", "LinkedIn", date(2026, 1, 6), date(2026, 3, 31), 4500),
    ("LinkedIn — Replatforming Series", "LinkedIn", date(2026, 2, 10), date(2026, 4, 30), 6000),
    ("Instagram — Plus vs BigCommerce", "Instagram", date(2026, 2, 1), date(2026, 4, 1), 0),
    ("Instagram — Founder Story Reels", "Instagram", date(2026, 3, 1), date(2026, 4, 30), 0),
    ("Google Ads — Toronto Local", "Google Ads", date(2025, 12, 1), date(2026, 4, 30), 3200),
    ("Google Ads — Migration Keywords", "Google Ads", date(2026, 1, 15), date(2026, 4, 30), 5000),
    ("Email — Magento Migration List", "Email", date(2026, 2, 14), date(2026, 3, 14), 0),
    ("Email — Q1 Newsletter", "Email", date(2026, 3, 1), date(2026, 3, 31), 0),
    ("Content — Pillar: Replatforming", "Organic Content", date(2026, 1, 1), date(2026, 4, 30), 0),
    ("Content — Pillar: Performance", "Organic Content", date(2026, 2, 1), date(2026, 4, 30), 0),
    ("Referral — Past Client Outreach", "Referral", date(2026, 1, 15), date(2026, 3, 31), 500),
    ("PR — Tier-1 Canadian Press", "PR", date(2026, 3, 1), date(2026, 5, 1), 1200),
]


def gen_campaigns():
    rows = []
    for cid, (name, channel, sd, ed, budget) in enumerate(CAMPAIGN_DEFS, 9001):
        impressions = int(random.uniform(8000, 220000)) if channel != "PR" else int(random.uniform(1500, 8000))
        clicks = int(impressions * random.uniform(0.008, 0.04))
        ctr = round(clicks / impressions, 4) if impressions else 0
        spend = budget if budget else 0
        leads = max(0, int(clicks * random.uniform(0.005, 0.05)))
        deals = max(0, int(leads * random.uniform(0.03, 0.18)))
        revenue = sum(random.randint(8000, 90000) for _ in range(deals))
        cpl = round(spend / leads, 2) if leads else 0
        roi = round((revenue - spend) / spend, 2) if spend else ""
        status = "Active" if ed >= RANGE_END else "Completed"
        rows.append([
            f"C-{cid}", name, channel, sd.isoformat(), ed.isoformat(),
            status, spend, impressions, clicks, ctr, leads, deals,
            revenue, cpl, roi,
        ])
    header = [
        "campaign_id", "campaign_name", "channel", "start_date", "end_date",
        "status", "spend_usd", "impressions", "clicks", "ctr",
        "leads_generated", "deals_closed", "revenue_usd", "cpl_usd", "roi",
    ]
    write_csv(HERE / "campaigns.csv", header, rows)


# ---------------------------------------------------------------------------
# invoices.csv
# ---------------------------------------------------------------------------

INVOICE_CLIENTS = [
    ("Northwind Apparel", "ap@northwind-apparel.com", "Plus Migration"),
    ("Lumen Skincare", "finance@lumen.co", "Subscription Setup"),
    ("Roastline Coffee", "ops@roastline.ca", "Site Speed Audit"),
    ("Vesper Home", "billing@vesperhome.com", "Headless POC"),
    ("Atlas Outdoors", "accounts@atlasoutdoors.us", "B2B Portal Build"),
    ("Brassroot Footwear", "ap@brassroot.com", "Theme Refresh"),
    ("Halcyon Wellness", "finance@halcyon.health", "Magento Migration"),
    ("Tidewater Goods", "billing@tidewater.co", "Markets Rollout — US/UK"),
    ("Maple Lane Beauty", "ap@maplelane.ca", "Subscription LTV Audit"),
    ("Cedar Co.", "finance@cedarco.ca", "Plus Build"),
    ("Steepwater Tea", "ops@steepwater.com", "Custom Bundle App"),
    ("Sundial Active", "ap@sundialactive.com", "Performance Retainer"),
    ("Wildline Apparel", "billing@wildline.co", "Replatform Discovery"),
    ("Glasshouse Lighting", "finance@glasshouse.us", "Checkout Extensions"),
    ("Riverstone Bakery", "ap@riverstonebakery.ca", "Theme Customization"),
    ("Boreal Provisions", "billing@boreal.ca", "Markets US Setup"),
    ("Pinecrest Outdoors", "ap@pinecrest.com", "Subscription Migration"),
    ("Solace Linens", "finance@solacelinens.com", "B2B Wholesale Build"),
]
PAYMENT_TERMS = ["Due on Receipt", "Net 15", "Net 30", "Net 30", "Net 30", "Net 60"]
PAYMENT_METHODS = ["Wise", "Stripe", "Bank Transfer", "Wise", "Bank Transfer"]
INVOICE_STATUSES = [
    ("Paid", 0.55),
    ("Sent", 0.18),
    ("Overdue", 0.10),
    ("Partial", 0.06),
    ("Draft", 0.07),
    ("Void", 0.04),
]


def gen_invoices():
    rows = []
    inv_num = 1
    days = (RANGE_END - RANGE_START).days
    # ~30 invoices across the period
    for _ in range(34):
        client, email, project = random.choice(INVOICE_CLIENTS)
        issue = RANGE_START + timedelta(days=random.randint(0, days))
        terms = random.choice(PAYMENT_TERMS)
        net_days = {"Due on Receipt": 0, "Net 15": 15, "Net 30": 30, "Net 60": 60}[terms]
        due = issue + timedelta(days=net_days)
        currency = random.choice(["USD", "USD", "USD", "CAD"])
        line_amount = random.choice([3500, 6000, 8500, 12000, 15000, 18000, 22000, 28000, 35000, 42000, 60000])
        tax_rate = 0.13 if currency == "CAD" else 0.0  # HST in Ontario
        tax = round(line_amount * tax_rate, 2)
        total = round(line_amount + tax, 2)
        status = weighted_pick(INVOICE_STATUSES)
        # if issued late and unpaid past due date, flip to Overdue
        if status == "Sent" and due < RANGE_END:
            if random.random() < 0.4:
                status = "Overdue"
        paid_date = ""
        paid_amount = ""
        method = ""
        if status == "Paid":
            paid_offset = random.randint(0, max(1, net_days + 10))
            paid_d = issue + timedelta(days=paid_offset)
            if paid_d > RANGE_END:
                paid_d = RANGE_END
            paid_date = paid_d.isoformat()
            paid_amount = total
            method = random.choice(PAYMENT_METHODS)
        elif status == "Partial":
            paid_amount = round(total * random.uniform(0.3, 0.7), 2)
            paid_offset = random.randint(0, max(1, net_days + 5))
            paid_date = (issue + timedelta(days=paid_offset)).isoformat()
            method = random.choice(PAYMENT_METHODS)
        rows.append([
            f"INV-2026-{inv_num:04d}",
            client, email, project,
            issue.isoformat(), due.isoformat(),
            terms, currency,
            line_amount, tax_rate, tax, total,
            status, paid_date, paid_amount, method,
            "",  # notes
        ])
        inv_num += 1
    rows.sort(key=lambda r: r[4])  # sort by issue_date
    # renumber after sort
    for i, r in enumerate(rows, 1):
        r[0] = f"INV-2026-{i:04d}"
    header = [
        "invoice_id", "client_name", "client_email", "project",
        "issue_date", "due_date", "payment_terms", "currency",
        "subtotal", "tax_rate", "tax_amount", "total",
        "status", "paid_date", "paid_amount", "payment_method",
        "notes",
    ]
    write_csv(HERE / "invoices.csv", header, rows)


# ---------------------------------------------------------------------------
# expenses.csv
# ---------------------------------------------------------------------------

EXPENSE_DEFS = [
    # (vendor, category, subcategory, base_amount_usd, recurring, billable_chance)
    ("Anthropic — Claude API", "Software/SaaS", "AI", 180, True, 0.0),
    ("Cloudflare", "Hosting", "Workers + DNS", 25, True, 0.0),
    ("Hostinger", "Hosting", "Domain + legacy", 10, True, 0.0),
    ("Tableau Cloud", "Software/SaaS", "Analytics", 90, True, 0.0),
    ("Figma", "Software/SaaS", "Design", 30, True, 0.0),
    ("Notion", "Software/SaaS", "Docs", 20, True, 0.0),
    ("LinkedIn Sales Navigator", "Marketing", "Outbound", 100, True, 0.0),
    ("Google Workspace", "Software/SaaS", "Email + Drive", 24, True, 0.0),
    ("Adobe Creative Cloud", "Software/SaaS", "Design", 60, True, 0.0),
    ("Wise", "Banking", "Transfer fees", 12, False, 0.0),
    ("Stripe", "Banking", "Processing fees", 45, False, 0.0),
    ("LinkedIn Premium", "Marketing", "Personal brand", 40, True, 0.0),
    ("Ahrefs", "Software/SaaS", "SEO", 199, True, 0.0),
    ("GitHub", "Software/SaaS", "Code hosting", 4, True, 0.0),
    ("Vercel", "Hosting", "Preview deploys", 20, True, 0.0),
    ("Loom", "Software/SaaS", "Video", 18, True, 0.0),
    ("Calendly", "Software/SaaS", "Scheduling", 12, True, 0.0),
    ("Air Canada", "Travel", "Client visit — Vancouver", 480, False, 0.5),
    ("WestJet", "Travel", "Client visit — Calgary", 410, False, 0.4),
    ("Marriott Toronto", "Travel", "Client meeting", 320, False, 0.3),
    ("Uber", "Travel", "Local", 35, False, 0.2),
    ("Starbucks — coffee meeting", "Meals", "Client coffee", 18, False, 0.0),
    ("Restaurant — client lunch", "Meals", "Client meal", 95, False, 0.0),
    ("Shopify Editions", "Education", "Conference", 0, False, 0.0),
    ("UnGagged Conference", "Education", "Conference", 1200, False, 0.0),
    ("Plus Partner Coaching", "Education", "Training", 350, False, 0.0),
    ("MacBook accessories", "Office", "Equipment", 220, False, 0.0),
    ("Co-working day pass", "Office", "Workspace", 35, False, 0.0),
    ("Contractor — Fatima R. (design)", "Contractor", "Design overflow", 1800, False, 1.0),
    ("Contractor — Daniel L. (Liquid)", "Contractor", "Build overflow", 2400, False, 1.0),
    ("Stock photography", "Marketing", "Imagery", 49, False, 0.0),
    ("Domain renewals", "Hosting", "Domains", 80, False, 0.0),
    ("Books — strategy / craft", "Education", "Books", 65, False, 0.0),
    ("Apple iCloud+", "Software/SaaS", "Storage", 10, True, 0.0),
    ("1Password", "Software/SaaS", "Security", 16, True, 0.0),
]
EXPENSE_PAYMENT_METHODS = ["Amex Business", "Visa Business", "Bank Transfer", "PayPal"]


def gen_expenses():
    rows = []
    exp_num = 1
    days = (RANGE_END - RANGE_START).days
    for vendor, cat, subcat, base, recurring, bill_chance in EXPENSE_DEFS:
        if recurring:
            # one charge per month
            cur = date(RANGE_START.year, RANGE_START.month, 1)
            while cur <= RANGE_END:
                if cur >= RANGE_START:
                    amt = round(base * random.uniform(0.95, 1.08), 2)
                    rows.append(_expense_row(exp_num, cur, vendor, cat, subcat, amt, recurring, bill_chance))
                    exp_num += 1
                # advance one month
                if cur.month == 12:
                    cur = date(cur.year + 1, 1, 1)
                else:
                    cur = date(cur.year, cur.month + 1, 1)
        else:
            # 1-3 random instances over the period
            n = random.randint(1, 3)
            for _ in range(n):
                d = RANGE_START + timedelta(days=random.randint(0, days))
                amt = round(base * random.uniform(0.85, 1.25), 2)
                if amt > 0:
                    rows.append(_expense_row(exp_num, d, vendor, cat, subcat, amt, recurring, bill_chance))
                    exp_num += 1
    rows.sort(key=lambda r: r[1])
    for i, r in enumerate(rows, 1):
        r[0] = f"EXP-{i:04d}"
    header = [
        "expense_id", "date", "vendor", "category", "subcategory",
        "amount_usd", "currency", "payment_method", "recurring",
        "billable_to_client", "client", "receipt_url", "notes",
    ]
    write_csv(HERE / "expenses.csv", header, rows)


def _expense_row(num, d, vendor, cat, subcat, amt, recurring, bill_chance):
    billable = "Yes" if random.random() < bill_chance else "No"
    client = ""
    if billable == "Yes":
        client = random.choice(INVOICE_CLIENTS)[0]
    pm = random.choice(EXPENSE_PAYMENT_METHODS)
    receipt = f"https://drive.google.com/file/d/sample-{random.randint(1000,9999)}/view"
    return [
        f"EXP-{num:04d}", d.isoformat(), vendor, cat, subcat,
        amt, "USD", pm, "Yes" if recurring else "No",
        billable, client, receipt, "",
    ]


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    gen_leads()
    gen_seo_rankings()
    gen_seo_traffic()
    gen_web_analytics()
    gen_cwv()
    gen_tasks()
    gen_campaigns()
    gen_invoices()
    gen_expenses()
    print("\nDone. 9 CSVs written to", HERE)
