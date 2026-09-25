# N8N Workflow: Multi-Source Lead Ingestion Pipeline

## Architecture

```
Multi-Source Scraper (Python/Playwright)
    → Outputs JSON (file or webhook)
    → N8N Webhook receives
    → N8N processes (validate, deduplicate, enrich, score)
    → N8N stores in database
    → Dashboard reads from database
```

## Setup: N8N Webhook

Create a webhook node in n8n:
- **Method:** POST
- **Path:** `/webhook/multi-source-leads`
- **Authentication:** API key header or basic auth (recommended)
- **Response:** Immediately acknowledge, process async

## N8N Workflow Nodes (in order)

### Node 1: Webhook (Trigger)
- **Name:** `Multi-Source Leads Webhook`
- **WSGID:** `multi-source-leads`
- **Method:** POST
- **Path:** `/webhook/multi-source-leads`
- **Response to Webhook:** Immediately
- **Authentication:** Basic Auth or API Key header

### Node 2: Split Out (if receiving multiple leads)
- **Name:** `Split Leads`
- **Type:** Item Lists → Split Out
- **Field:** `leads` (if webhook sends `{"leads": [...], "summary": {...}}`)
- **Purpose:** Handle batch of leads from single webhook call

### Node 3: Filter (Validate Each Lead)
- **Name:** `Validate Lead`
- **Type:** IF node
- **Conditions (all must pass):**
  - `business_name` exists and length >= 2
  - `rating` is number >= 0
  - `review_count` is number >= 0
  - `address` OR `phone` exists
- **Output:** True → continue processing; False → discard or log

### Node 4: Code Node (Deduplicate & Merge)
- **Name:** `Deduplicate & Merge Leads`
- **Type:** Code (JavaScript)
- **Logic:**
  - Maintain a simple dedup cache (by business_name + address hash)
  - If lead is new: add to cache, pass through
  - If lead exists: merge sources, take higher score, update last_seen
  - Output deduplicated leads for storage

```javascript
const leads = items.map(item => item.json);

const deduped = [];
const seen = new Map();

for (const lead of leads) {
    const key = `${lead.business_name}|${lead.address || ''}`.toLowerCase().trim();
    
    if (seen.has(key)) {
        const existing = seen.get(key);
        if (!existing.sources.includes(lead.source)) {
            existing.sources.push(lead.source);
        }
        existing.overall_score = Math.max(existing.overall_score || 0, lead.lead_score || 0);
        existing.last_seen = new Date().toISOString();
    } else {
        seen.set(key, {
            ...lead,
            sources: [lead.source],
            overall_score: lead.lead_score || 0,
            last_seen: new Date().toISOString(),
        });
        deduped.push(seen.get(key));
    }
}

return deduped.map(lead => ({ json: lead }));
```

### Node 5: Code Node (Final Scoring & Enrichment)
- **Name:** `Final Score & Enrich`
- **Type:** Code (JavaScript)
- **Logic:**
  - Recalculate final score if needed (combining multi-source data)
  - Add: `created_at`, `updated_at`, `last_seen`
  - Set `outreach_status` to "new"
  - Add `notes` field
  - Add `qualifies_for` list (which products this lead fits)

```javascript
const leads = items.map(item => {
    const lead = item.json;
    
    if (!lead.overall_score || lead.overall_score === 0) {
        let score = 0;
        
        if (lead.rating >= 4.7) score += 20;
        else if (lead.rating >= 4.5) score += 18;
        else if (lead.rating >= 4.0) score += 14;
        else if (lead.rating >= 3.5) score += 8;
        
        if (lead.review_count >= 300) score += 25;
        else if (lead.review_count >= 200) score += 22;
        else if (lead.review_count >= 100) score += 18;
        else if (lead.review_count >= 50) score += 14;
        else if (lead.review_count >= 20) score += 10;
        
        if (lead.website_status === 'no_website') score += 25;
        else if (lead.website_status === 'bad_website') score += 20;
        else if (lead.website_status === 'weak_website') score += 12;
        else score += 3;
        
        if (lead.phone) score += 10;
        
        if (lead.gbp_engagement_score) {
            score += Math.min(lead.gbp_engagement_score, 20);
        }
        
        lead.overall_score = Math.min(score, 100);
    }
    
    lead.created_at = new Date().toISOString();
    lead.updated_at = new Date().toISOString();
    lead.last_seen = new Date().toISOString();
    lead.outreach_status = 'new';
    lead.notes = '';
    
    lead.qualifies_for = [];
    if (lead.website_status === 'no_website' || lead.website_status === 'bad_website') {
        lead.qualifies_for.push('website_build');
    }
    if (lead.review_count >= 20) {
        lead.qualifies_for.push('reputation_management');
    }
    if (lead.phone || lead.review_count >= 10) {
        lead.qualifies_for.push('lead_pipeline_automation');
    }
    
    return { json: lead };
});
```

### Node 6: Database (Store Lead)
- **Name:** `Store Lead`
- **Type:** PostgreSQL / SQLite / MySQL
- **Operation:** Insert or Update (upsert)
- **Table:** `leads`

### Node 7: Filter High-Score Leads (Alert)
- **Name:** `Filter High-Score Leads`
- **Type:** IF node
- **Condition:** `overall_score` >= 70

### Node 8: Telegram Alert
- **Name:** `Send Lead Alert`
- **Type:** Telegram / Email / Slack
- **Message:** New qualified lead alert with score, rating, reviews, website status

### Node 9: Respond to Webhook
- **Name:** `Respond to Webhook`
- **Response Code:** 200
- **Body:** `{"status":"ok","leads_received":N,"high_score_leads":N}`

## Database Schema (Enhanced)

```sql
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
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_seen TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(outreach_status);
```

## Running the Pipeline

### Manual (foreground test run):
```bash
cd /d/QubNexa/qubnexa_website
python lib/agency/scrapers/multi_source_scraper.py \
  --query "dentists in Houston, TX" \
  --sources google bing yelp gbpp_deep \
  --max-results 200 \
  --webhook http://localhost:5678/webhook/multi-source-leads \
  --gbpp-deep-dive \
  --gbpp-delay 2.0 \
  --output leads_output.json
```

### Background (cron, every 6 hours):
```bash
0 */6 * * * cd /d/QubNexa/qubnexa_website && \
  python lib/agency/scrapers/multi_source_scraper.py \
  --query "dentists in Houston, TX" \
  --sources google bing yelp gbpp_deep \
  --max-results 200 \
  --webhook http://localhost:5678/webhook/multi-source-leads \
  --gbpp-deep-dive \
  >> /var/log/qubnexa-scraper.log 2>&1
```

### Docker (persistent):
```bash
docker build -f Dockerfile.scraper -t qubnexa/scraper .
docker run -d --name qubnexa-scraper --network host -v $(pwd)/lib/agency/scrapers:/app qubnexa/scraper \
  python multi_source_scraper.py --query "dentists in Houston, TX" --sources google bing yelp gbpp_deep --max-results 200 --webhook http://localhost:5678/webhook/multi-source-leads --gbpp-deep-dive
```

## Dashboard Integration

The dashboard already reads from the same DB. Once n8n stores leads:
- **Lead Pipeline panel** — shows all leads, filterable by score/source/stage/website_status/category
- Filter for outreach: `overall_score >= 70 AND outreach_status = 'new'`, sort by score desc
- **System Health panel** — shows count of high-score leads, latest scrape summary

## Testing
1. Start n8n with webhook workflow
2. Run: `python lib/agency/scrapers/multi_source_scraper.py --query "dentists in Houston, TX" --sources google gbpp_deep --max-results 50 --webhook http://localhost:5678/webhook/multi-source-leads`
3. Check n8n execution log, database, refresh dashboard
