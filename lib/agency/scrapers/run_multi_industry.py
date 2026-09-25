#!/usr/bin/env python3
"""
Multi-Industry Scraper Runner for QubNexa Agency
Runs the corrected scraper across multiple Houston industries sequentially.
Deduplicates across industries. Pushes all results to agency.json.
"""

import sys
import time
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"
SCRAPER_DIR = PROJECT_ROOT / "lib" / "agency" / "scrapers"

# Add scraper dir to path for import
sys.path.insert(0, str(SCRAPER_DIR))

if __name__ == "__main__":
    # Import the scraper module
    import corrected_scraper as cs

    print("=" * 60)
    print("QubNexa — Multi-Industry Scraper")
    print("=" * 60)

    # Industries to scrape
    INDUSTRIES = [
        ("dentists in Houston, TX", 50, 3.5, 20),
        ("chiropractors in Houston, TX", 50, 3.5, 20),
        ("medspa in Houston, TX", 50, 3.5, 20),
    ]

    all_qualified_across = []
    all_biz_across = []
    scrape_runs = []

    for i, (query, max_res, min_rat, min_rev) in enumerate(INDUSTRIES):
        print(f"\n{'='*60}")
        print(f"Industry {i+1}/{len(INDUSTRIES)}: {query}")
        print(f"{'='*60}")

        result = cs.scrape_with_gbp_click(
            query=query,
            max_results=max_res,
            min_rating=min_rat,
            min_reviews=min_rev,
            do_gbp_click=False,  # GBP click is slow; skip in multi-mode
        )

        qualified = result["qualified"]
        businesses = result["all"]

        print(f"\n  Got {len(qualified)} qualified, {len(businesses)} total")

        # Score ALL businesses
        for biz in businesses:
            biz["lead_score"] = cs.calculate_lead_score(biz)
            biz["outreach_status"] = "new"
            biz["scraped_at"] = datetime.utcnow().isoformat() + "Z"
            biz["id"] = str(uuid.uuid4())

        # Push to dashboard
        pushed = cs.push_to_dashboard(qualified, query=query)
        all_qualified_across.extend(qualified)
        all_biz_across.extend(businesses)

        # Record scrape run
        now = datetime.now(timezone.utc).isoformat()
        scrape_runs.append({
            "id": f"scrape_multi_{i+1}_{now}",
            "source": "google",
            "query": query,
            "status": "done",
            "leads_found": pushed,
            "qualified_found": len(qualified),
            "started_at": now,
            "finished_at": datetime.now(timezone.utc).isoformat(),
            "created_at": now,
        })

        print(f"  Pushed {pushed} new leads for this industry")

    # Save scrape runs
    db = json.loads(DB_PATH.read_text()) if DB_PATH.exists() else {"leads": [], "scrape_runs": []}
    db["scrape_runs"].extend(scrape_runs)
    DB_PATH.write_text(json.dumps(db, indent=2))

    # Final summary
    print(f"\n{'='*60}")
    print("MULTI-INDUSTRY SUMMARY")
    print(f"{'='*60}")
    print(f"Industries scraped: {len(INDUSTRIES)}")
    print(f"Total qualified leads: {len(all_qualified_across)}")
    print(f"Total businesses found: {len(all_biz_across)}")
    print(f"Scrape runs recorded: {len(scrape_runs)}")

    # Deduplicate summary
    seen = {}
    for biz in all_qualified_across:
        key = biz.get("business_name", "").lower().strip()
        if key and key not in seen:
            seen[key] = biz
        elif key and biz.get("lead_score", 0) > seen[key].get("lead_score", 0):
            seen[key] = biz

    print(f"Unique leads (deduplicated): {len(seen)}")
    print(f"\nTop 10 by score:")
    sorted_unique = sorted(seen.values(), key=lambda x: x.get("lead_score", 0), reverse=True)
    for i, biz in enumerate(sorted_unique[:10], 1):
        print(f"  {i}. {biz['business_name'][:45]} | ⭐{biz['rating']} | {biz['review_count']} reviews | score={biz['lead_score']} | {biz.get('category','')}")
