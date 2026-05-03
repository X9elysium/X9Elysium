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
