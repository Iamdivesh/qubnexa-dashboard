"""Push scraped leads into agency.json dashboard DB."""

import sys
import json
import uuid
import re
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"
SCRAPE_PATH = PROJECT_ROOT / "lib" / "agency" / "scrapers" / "last_scrape.json"

def clean_phone(text: str) -> str:
    """Extract a real phone number, excluding review counts."""
    if not text:
        return ""
    # Remove rating+count patterns like "4.8(1,091)"
    cleaned = re.sub(r'\d+\.\d+\(\d[\d,]*\)', '', text)
    # Get all digit groups
    digits = re.findall(r'[\+]?[\d][\d\s\-()]{5,}', cleaned)
    for d in digits:
        digits_only = re.sub(r'[^0-9+]', '', d)
        # Phone numbers usually have 7-15 digits
        if 7 <= len(digits_only) <= 15 and len(digits_only) >= 7:
            return d.strip()
    return ""

def push_from_scrape_file():
    if not SCRAPE_PATH.exists():
        print("No last_scrape.json found. Run scraper first.")
        return 0
    with open(SCRAPE_PATH) as f:
        scrape = json.load(f)
    leads_data = scrape.get("leads", {})
    all_businesses = leads_data.get("all_businesses", {})
    summary = leads_data.get("summary", {})
    query = scrape.get("query", "unknown")
    sources = scrape.get("sources", ["unknown"])
    now = datetime.now(timezone.utc).isoformat()

    all_leads = []
    for source, businesses in all_businesses.items():
        for biz in businesses:
            biz["source"] = source
            biz["sources"] = [source]
            all_leads.append(biz)

    if not all_leads:
        print("No leads in scrape data.")
        return 0

    if DB_PATH.exists():
        with open(DB_PATH) as f:
            db = json.load(f)
    else:
        db = {"leads": [], "scrape_runs": []}

    existing = {l["business_name"].lower().strip() for l in db.get("leads", [])}
    pushed = 0

    for lead in all_leads:
        name = (lead.get("business_name") or "").strip()
        if not name:
            continue
        if name.lower() in existing:
            continue

        raw_phone = lead.get("phone", "")
        clean = clean_phone(raw_phone) if raw_phone else ""

        row = {
            "id": str(uuid.uuid4()),
            "business_name": name,
            "address": lead.get("address", ""),
            "phone": clean,
            "rating": lead.get("rating", 0),
            "review_count": lead.get("review_count", 0),
            "website": lead.get("website", ""),
            "website_status": lead.get("website_status", "no_website"),
            "category": lead.get("category", ""),
            "google_maps_url": lead.get("google_maps_url", ""),
            "source": ",".join(sources),
            "sources": ",".join(sources),
            "overall_score": lead.get("overall_score", lead.get("lead_score", 0)),
            "outreach_status": "new",
            "scraped_at": now,
            "created_at": now,
            "updated_at": now,
            "last_seen": now,
        }
        db["leads"].append(row)
        existing.add(name.lower())
        pushed += 1
        print(f"  Pushed: {name} | score={row['overall_score']} | reviews={row['review_count']} | phone={row['phone']}")

    db["scrape_runs"].append({
        "id": f"scrape_{now}",
        "source": ",".join(sources),
        "query": query,
        "status": "done",
        "leads_found": pushed,
        "qualified_found": pushed,
        "started_at": summary.get("scraped_at", now),
        "finished_at": now,
        "created_at": now,
    })

    with open(DB_PATH, "w") as f:
        json.dump(db, f, indent=2)
    total = len(db["leads"])
    print(f"\nPushed: {pushed} | Total in DB: {total}")
    return pushed

if __name__ == "__main__":
    count = push_from_scrape_file()
    sys.exit(0 if count > 0 else 1)
