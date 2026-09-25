#!/usr/bin/env python3
"""
Run multi-source scraper for all 3 Houston industries and push results to dashboard.
Run with: python run_all_industries.py
"""

import sys
import json
import uuid
import importlib
import importlib.util
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"

# Load scraper module directly
scraper_path = PROJECT_ROOT / "lib" / "agency" / "scrapers" / "multi_source_scraper.py"
spec = importlib.util.spec_from_file_location("scraper", scraper_path)
scraper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scraper)

INDUSTRIES = [
    ("dentists in Houston, TX", "google", 50),
    ("chiropractors in Houston, TX", "google", 50),
    ("medspa in Houston, TX", "google", 50),
]

def clean_phone(text):
    import re
    if not text:
        return ""
    cleaned = re.sub(r'\(?\d{1,3}(?:,\d{3})*\)', '', text).strip()
    if not cleaned or len(re.sub(r'[^0-9+]', '', cleaned)) < 7:
        return ""
    return cleaned

def push_to_dashboard(leads, query, sources):
    if DB_PATH.exists():
        db = json.loads(DB_PATH.read_text())
    else:
        db = {"leads": [], "scrape_runs": []}

    existing = {l["business_name"].lower().strip() for l in db.get("leads", [])}
    pushed = 0
    now = datetime.now(timezone.utc).isoformat()

    for lead in leads:
        name = (lead.get("business_name") or "").strip()
        if not name or name.lower() in existing:
            continue

        row = {
            "id": str(uuid.uuid4()),
            "business_name": name,
            "address": lead.get("address", ""),
            "phone": clean_phone(lead.get("phone", "")),
            "rating": lead.get("rating", 0),
            "review_count": lead.get("review_count", 0),
            "website": lead.get("website", ""),
            "website_status": lead.get("website_status", "no_website"),
            "category": lead.get("category", ""),
            "google_maps_url": lead.get("google_maps_url", ""),
            "source": ",".join(sources),
            "sources": ",".join(sources),
            "overall_score": lead.get("lead_score", lead.get("overall_score", 0)),
            "outreach_status": "new",
            "scraped_at": now,
            "created_at": now,
            "updated_at": now,
            "last_seen": now,
        }
        db["leads"].append(row)
        existing.add(name.lower())
        pushed += 1
        print(f"  Pushed: {name} | ⭐{row['rating']} | {row['review_count']} reviews | score={row['overall_score']} | phone={row['phone']}")

    db["scrape_runs"].append({
        "id": f"scrape_{now}",
        "source": ",".join(sources),
        "query": query,
        "status": "done",
        "leads_found": pushed,
        "qualified_found": pushed,
        "started_at": now,
        "finished_at": now,
        "created_at": now,
    })

    DB_PATH.write_text(json.dumps(db, indent=2))
    print(f"  -> Total in DB: {len(db['leads'])}")
    return pushed

if __name__ == "__main__":
    print("=" * 60)
    print("QubNexa Agency — Multi-Industry Scraper")
    print("Running: dentists, chiropractors, medspas in Houston, TX")
    print("=" * 60)

    total_pushed = 0
    all_qualified = []

    for query, source, max_results in INDUSTRIES:
        print(f"\n{'='*60}")
        print(f"Scraping: {query}")
        print(f"{'='*60}")
        result = scraper.run_multi_source_scraper(
            query=query,
            sources=[source],
            max_results=max_results,
            do_gbpp_deep_dive=False,
        )
        qualified = result.get("leads", [])
        all_biz = result.get("all_businesses", {}).get(source, [])
        print(f"\n  Found {len(all_biz)} businesses, {len(qualified)} qualified")
        total_pushed += push_to_dashboard(qualified, query, [source])
        all_qualified.extend(qualified)

    print(f"\n{'='*60}")
    print(f"Done. Total leads pushed: {total_pushed}")
    print(f"Total in DB: {json.loads(DB_PATH.read_text()).get('leads', []).__len__()}")
    print(f"{'='*60}")
