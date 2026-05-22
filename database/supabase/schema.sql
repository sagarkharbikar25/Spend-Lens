-- Run in Supabase SQL editor (Day 1 setup)

CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  input JSONB NOT NULL,
  result JSONB NOT NULL,
  ai_summary TEXT,
  is_high_value BOOLEAN GENERATED ALWAYS AS ((result->>'totalMonthlySavings')::numeric > 500) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audits_slug ON audits(slug);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_is_high_value ON audits(is_high_value) WHERE is_high_value = true;

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id),
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size INT,
  honeypot TEXT,
  source TEXT DEFAULT 'audit_gate',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- RLS: enable and add policies for anon insert (configure in Supabase dashboard)
