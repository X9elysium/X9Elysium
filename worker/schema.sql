-- D1 schema for x9elysium lead capture.
-- Apply with:
--   npx wrangler d1 create x9elysium-leads
--   npx wrangler d1 execute x9elysium-leads --remote --file=worker/schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at   TEXT    NOT NULL,
  first_name    TEXT    NOT NULL,
  last_name     TEXT    NOT NULL,
  email         TEXT    NOT NULL,
  phone         TEXT,
  company       TEXT,
  website       TEXT,
  revenue       TEXT,
  platform      TEXT,
  service       TEXT,
  message       TEXT    NOT NULL,
  ip            TEXT,
  user_agent    TEXT,
  referer       TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_received_at ON leads(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email       ON leads(email);

-- Open comments. Anyone can post; spam filters live in worker/index.ts.
-- thread_id format: "blog/<slug>", "docs/<slug>", "thoughts/<id>".
-- approved=1 → public on the page; 0 → hidden until Darsh promotes via D1.
-- hidden=1 → soft-deleted (still in DB for forensics), never returned by GET.
CREATE TABLE IF NOT EXISTS comments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id    TEXT    NOT NULL,
  name         TEXT,
  message      TEXT    NOT NULL,
  ip           TEXT,
  user_agent   TEXT,
  referer      TEXT,
  created_at   TEXT    NOT NULL,
  approved     INTEGER NOT NULL DEFAULT 0,
  hidden       INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_thread ON comments(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_pending ON comments(approved, created_at DESC);
