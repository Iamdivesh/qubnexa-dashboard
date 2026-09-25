#!/usr/bin/env python3
"""
Quick test: run the multi-source scraper with test mode.
"""

import sys
sys.path.insert(0, ".")

from lib.agency.scrapers.multi_source_scraper import run_multi_source_scraper

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "dentists in Houston, TX"
    sources = sys.argv[2].split(",") if len(sys.argv) > 2 else ["google", "gbpp_deep"]
    max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 50

    leads = run_multi_source_scraper(
        query=query,
        sources=sources,
        max_results=max_results,
        do_gbpp_deep_dive=True,
        gbp_deep_dive_delay=1.0,
    )

    print(f"Query: {query}")
    print(f"Sources: {sources}")
    print(f"Total leads found: {len(leads)}")
    qualified = [l for l in leads if l.get("overall_score", 0) >= 50]
    print(f"Qualified (score >= 50): {len(qualified)}")
    if leads:
        top = max(leads, key=lambda l: l.get("overall_score", 0))
        print(f"Top: {top['business_name']} - score {top.get('overall_score')} - status {top.get('website_status')}")
        print(f"Keys: {sorted(top.keys())}")
