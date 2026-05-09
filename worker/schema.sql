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

-- Private editable plan pages — `app/plans/<slug>` behind PIN gate.
-- Content seeds from a build-time `worker/plans-seed.json` baked from the allowlist
-- in `docs/plans-allowlist.json`; first save inserts the row and from then on D1 wins.
-- `etag` is a sha-256 of content used for optimistic concurrency on PUT.
CREATE TABLE IF NOT EXISTS plans (
  slug         TEXT    PRIMARY KEY,
  content      TEXT    NOT NULL,
  etag         TEXT    NOT NULL,
  updated_at   TEXT    NOT NULL,
  updated_by   TEXT
);

CREATE INDEX IF NOT EXISTS idx_plans_updated ON plans(updated_at DESC);
