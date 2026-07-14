ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS admin_closed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS admin_closed_at TIMESTAMPTZ;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS admin_closed_by TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS admin_closed_by_id UUID;

ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_round INTEGER NOT NULL DEFAULT 0;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_total INTEGER NOT NULL DEFAULT 1;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_requested BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_requested_at TIMESTAMPTZ;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_requested_by TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS revision_requested_by_id UUID;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS inspector_feedback TEXT;

ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_extent TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_root_cause TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_correction TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_preventive TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_impact TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_file_url TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_file_name TEXT;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_submitted_at TIMESTAMPTZ;
ALTER TABLE cars_corrections ADD COLUMN IF NOT EXISTS original_submitted_by TEXT;

CREATE TABLE IF NOT EXISTS cars_app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT,
  updated_by_id UUID
);
