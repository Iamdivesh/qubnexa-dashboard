-- QubNexa Agency Dashboard — Enhanced Leads Schema
-- Supports multi-source scraping (Google Maps, Bing, Yelp, GBP Deep-Dive)
-- with enrichment fields and lead scoring

-- Skip the old schema and recreate with enhanced fields
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS outreach;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS client_automations;
DROP TABLE IF EXISTS automations_catalog;
DROP TABLE IF EXISTS orchestrator_reports;
DROP TABLE IF EXISTS daily_metrics;
DROP TABLE IF EXISTS scrape_runs;

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    website TEXT,
    website_status TEXT DEFAULT 'no_website',
    category TEXT,
    google_maps_url TEXT,
    source TEXT DEFAULT 'google_maps',
    sources TEXT DEFAULT '',
    lead_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    outreach_status TEXT DEFAULT 'new',
    qualifies_for TEXT DEFAULT '',
    notes TEXT,
    scraped_at TEXT,
    gbp_engagement_score INTEGER DEFAULT 0,
    gbp_review_response_rate INTEGER DEFAULT 0,
    gbp_photo_count INTEGER DEFAULT 0,
    gbp_post_count INTEGER DEFAULT 0,
    gbp_business_hours TEXT,
    gbp_services TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_seen TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(outreach_status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);

CREATE TABLE IF NOT EXISTS outreach (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    template TEXT,
    subject TEXT,
    body TEXT,
    sent_at TEXT,
    reply_detected INTEGER DEFAULT 0,
    reply_at TEXT,
    reply_text TEXT,
    call_booked INTEGER DEFAULT 0,
    call_at TEXT,
    status TEXT DEFAULT 'sent',
    next_followup_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    industry TEXT,
    region TEXT,
    deal_value INTEGER DEFAULT 0,
    mrr INTEGER DEFAULT 0,
    status TEXT DEFAULT 'trial',
    started_at TEXT,
    next_billing_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS client_automations (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    automation_name TEXT NOT NULL,
    status TEXT DEFAULT 'deploying',
    last_run TEXT,
    last_status TEXT,
    failure_count INTEGER DEFAULT 0,
    config TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS automations_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_industries TEXT,
    product_type TEXT,
    price_setup INTEGER,
    price_monthly INTEGER,
    sellable TEXT DEFAULT 'pending',
    demo_url TEXT,
    build_status TEXT DEFAULT 'idea',
    mrr_potential INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orchestrator_reports (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL UNIQUE,
    summary TEXT,
    needs_attention TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_metrics (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL UNIQUE,
    messages_sent INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    calls_booked INTEGER DEFAULT 0,
    new_leads INTEGER DEFAULT 0,
    new_clients INTEGER DEFAULT 0,
    mrr_close INTEGER DEFAULT 0,
    mrr_churn INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scrape_runs (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    query TEXT NOT NULL,
    region TEXT,
    industry TEXT,
    status TEXT DEFAULT 'queued',
    started_at TEXT,
    finished_at TEXT,
    leads_found INTEGER DEFAULT 0,
    qualified_found INTEGER DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
