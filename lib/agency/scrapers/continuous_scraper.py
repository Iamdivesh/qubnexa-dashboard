#!/usr/bin/env python3
"""
Continuous Lead Scraper for QubNexa Agency
Runs in background, looping through target industries in Houston, TX.
Pushes results to agency.json dashboard DB.

Usage: python lib/agency/scrapers/continuous_scraper.py
Stops with Ctrl+C.
"""

import sys
import json
import time
import uuid
import importlib
import importlib.util
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"

# Load scraper module
scraper_path = PROJECT_ROOT / "lib" / "agency" / "scrapers" / "multi_source_scraper.py"
spec = importlib.util.spec_from_file_location("scraper", scraper_path)
scraper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scraper)

# Target industries to scan repeatedly
QUERIES = [
    "dentists in Houston, TX",
    "chiropractors in Houston, TX",
    "medspa in Houston, TX",
    "dental clinics in Houston, TX",
    "cosmetic dentists in Houston, TX",
]

SOURCES = ["google"]
MAX_RESULTS = 40
MIN_RATING = 3.5
MIN_REVIEWS = 20
DO_GPP_DEEP = False  # Set True to get phone + details (slower)

# How long to wait between full cycles (minutes)
CYCLE_INTERVAL_MINUTES = 6

# How long to wait between individual scrapes (seconds)
BETWEEN_SCRAPES_SECONDS = 30

def clean_phone(raw: str) -> str:
    """Clean phone from scraper output."""
    if not raw:
        return ""
    # Remove review count patterns like "4.8(1,091)"
    cleaned = re.sub(r'\d+\.\d+\(\d[\d,]*\)', '', raw)
    # Keep only digits, +, -, (, ), spaces
    digits = re.sub(r'[^0-9+\-\(\) ]', '', cleaned).strip()
    # Must have at least 7 digits
    if len(re.sub(r'[^0-9]', '', digits)) < 7:
        return ""
    return digits

def push_to_dashboard(leads, query, source, scrapek_time):
    """Push scraped leads to agency.json."""
    if not DB_PATH.exists():
        db = {"leads": [], "scrape_runs": [], "automations_catalog": [],
              "outreach": [], "clients": [], "client_automations": [],
              "orchestrator_reports": [], "daily_metrics": []}
    else:
        db = json.loads(DB_PATH.read_text())

    existing_names = {l["business_name"].lower().strip() for l in db.get("leads", [])}
    existing_ids = {l.get("id", "") for l in db.get("leads", [])}

    pushed = 0
    now = datetime.now(timezone.utc).isoformat()

    for lead in leads:
        name = (lead.get("business_name") or "").strip()
        if not name:
            continue
        if name.lower() in existing_names:
            continue

        # Generate a stable-ish ID
        lead_id = str(uuid.uuid4())

        row = {
            "id": lead_id,
            "business_name": name,
            "address": lead.get("address", ""),
            "phone": clean_phone(lead.get("phone", "")),
            "rating": lead.get("rating", 0),
            "review_count": lead.get("review_count", 0),
            "website": lead.get("website", ""),
            "website_status": lead.get("website_status", "no_website"),
            "category": lead.get("category", ""),
            "google_maps_url": lead.get("google_maps_url", ""),
            "source": ",".join(SOURCES),
            "sources": ",".join(SOURCES),
            "overall_score": lead.get("overall_score", lead.get("lead_score", 0)),
            "outreach_status": "new",
            "scraped_at": scrapek_time,
            "created_at": now,
            "updated_at": now,
            "last_seen": now,
        }
        db["leads"].append(row)
        existing_names.add(name.lower())
        pushed += 1
        print(f"  Pushed: {name} | ⭐{row['rating']} | {row['review_count']} reviews | score={row['overall_score']}")

    # Record the scrape run
    db["scrape_runs"].append({
        "id": f"scrape_{now}",
        "source": ",".join(SOURCES),
        "query": query,
        "status": "done",
        "leads_found": pushed,
        "qualified_found": pushed,
        "started_at": scrapek_time,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "created_at": now,
    })

    DB_PATH.write_text(json.dumps(db, indent=2))
    return pushed

def run_continuous():
    print("=" * 60)
    print("QubNexa Agency — Continuous Lead Scraper")
    print("=" * 60)
    print(f"Target industries: {len(QUERIES)}")
    print(f"Cycle interval: {CYCLE_INTERVAL_MINUTES} minutes")
    print(f"Between scrapes: {BETWEEN_SCRAPES_SECONDS} seconds")
    print(f"Sources: {SOURCES}")
    print(f"Max results per query: {MAX_RESULTS}")
    print(f"GBP deep-dive: {DO_GPP_DEEP}")
    print("=" * 60)
    print("Starting first cycle...\n")

    cycle = 0
    try:
        while True:
            cycle += 1
            print(f"\n{'='*60}")
            print(f"CYCLE {cycle} — {datetime.now(timezone.utc).isoformat()}")
            print(f"{'='*60}")

            total_pushed = 0
            cycle_time = datetime.now(timezone.utc).isoformat()

            for query in QUERIES:
                print(f"\nScraping: {query}")
                print("-" * 40)

                results = scraper.run_multi_source_scraper(
                    query=query,
                    sources=SOURCES,
                    max_results=MAX_RESULTS,
                    min_rating=MIN_RATING,
                    min_reviews=MIN_REVIEWS,
                    do_gbpp_deep_dive=DO_GPP_DEEP,
                    gbp_deep_dive_delay=1.0,
                )

                all_biz = results.get("all_businesses", {})
                businesses = all_biz.get(SOURCES[0], [])
                qualified = results.get("leads", [])

                print(f"  Found: {len(businesses)} businesses, {len(qualified)} qualified")

                if qualified:
                    pushed = push_to_dashboard(qualified, query, SOURCES[0], cycle_time)
                    total_pushed += pushed
                elif businesses:
                    # Still push all businesses (they have scores now)
                    pushed = push_to_dashboard(businesses, query, SOURCES[0], cycle_time)
                    total_pushed += pushed

                print(f"  Pushed: {pushed} new leads")

                # Wait between scrapes
                if query != QUERIES[-1]:
                    print(f"\n  Waiting {BETWEEN_SCRAPES_SECONDS}s before next scrape...")
                    time.sleep(BETWEEN_SCRAPES_SECONDS)

            print(f"\n{'='*60}")
            print(f"CYCLE {cycle} COMPLETE")
            print(f"Total pushed this cycle: {total_pushed}")
            db = json.loads(DB_PATH.read_text()) if DB_PATH.exists() else {"leads": []}
            print(f"Total leads in DB: {len(db.get('leads', []))}")
            print(f"{'='*60}")

            # Wait before next cycle
            print(f"\nWaiting {CYCLE_INTERVAL_MINUTES} minutes before next cycle...")
            for i in range(CYCLE_INTERVAL_MINUTES * 60):
                time.sleep(1)
                if i % 60 == 0:
                    print(f"  {CYCLE_INTERVAL_MINUTES * 60 - i}s remaining...")

    except KeyboardInterrupt:
        print(f"\n\nStopped after {cycle} cycles.")
        print(f"Total leads in DB: {json.loads(DB_PATH.read_text()).get('leads', []).__len__()}")

if __name__ == "__main__":
    import re
    run_continuous()
