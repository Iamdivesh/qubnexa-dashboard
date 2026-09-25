#!/usr/bin/env python3
"""
Google Maps Scraper for QubNexa Agency
Finds businesses with good reviews but no/bad website.
Outputs JSON for n8n to consume via webhook or file.

Usage:
    python google_maps_scraper.py --query "dentists in Houston, TX" --max-results 200
    python google_maps_scraper.py --query "dentists in Houston, TX" --max-results 200 --output leads.json
    python google_maps_scraper.py --query "dentists in Houston, TX" --max-results 200 --webhook http://localhost:5678/webhook/google-maps-leads
"""

import argparse
import json
import sys
import time
import re
import os
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout


def parse_rating(text: str) -> float:
    """Extract numeric rating from Google Maps rating text."""
    if not text:
        return 0.0
    match = re.search(r"(\d+\.?\d*)", text)
    return float(match.group(1)) if match else 0.0


def parse_count(text: str) -> int:
    """Extract numeric count from text like '87 reviews' or '(87)'."""
    if not text:
        return 0
    match = re.search(r"(\d+)", text)
    return int(match.group(1)) if match else 0


def extract_url(href: str) -> str | None:
    """Extract clean URL from Google Maps link."""
    if not href:
        return None
    # Google Maps internal links - try to extract or mark as no website
    if "gmp" in href or "maps" in href:
        return None  # Business has no external website listed
    match = re.search(r"https?://[^\s]+", href)
    return match.group(0) if match else href


def classify_website(url: str | None, page_content: str = "") -> str:
    """
    Classify website status.
    Returns: 'no_website', 'bad_website', 'ok_website'
    """
    if not url:
        return "no_website"
    # Basic checks - in production, fetch and analyze
    if "parking" in url.lower() or "for-sale" in url.lower() or "realestate" in url.lower():
        return "bad_website"
    return "ok_website"


def scrape_google_maps(
    query: str,
    max_results: int = 200,
    min_rating: float = 3.5,
    min_reviews: int = 20,
    output_file: str | None = None,
    webhook_url: str | None = None,
    delay_range: tuple = (3, 8),
):
    """
    Scrape Google Maps for businesses matching the query.
    Filters for businesses with good reviews but no/bad website.
    """
    qualified_leads = []
    all_businesses = []

    print(f"Scraping Google Maps: '{query}'")
    print(f"Filters: rating >= {min_rating}, reviews >= {min_reviews}")
    print(f"Max results to collect: {max_results}")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        )
        page = context.new_page()

        try:
            # Navigate to Google Maps search
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            print(f"Navigating to: {search_url}")
            page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            # Scroll to load more results
            print("Scrolling to load results...")
            scroll_count = 0
            last_height = page.evaluate("document.body.scrollHeight")

            while scroll_count < 20:
                page.mouse.wheel(0, 4000)
                time.sleep(1.5)
                scroll_count += 1

                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

                # Check if we've loaded enough
                current_results = page.query_selector_all(
                    'div[jsaction*="hovercard"]'
                ) or page.query_selector_all(
                    'div[class*="Nv2Mi"]'
                ) or page.query_selector_all(
                    '[data-result-name="0"]'
                )

                if len(current_results) >= max_results:
                    break

            print(f"Scroll complete. Extracting business cards...")

            # Try multiple selectors for business cards
            selectors = [
                'div[jsaction*="hovercard"]',
                'div[class*="Nv2Mi"]',
                '[data-result-name="0"]',
                'div[role="article"]',
            ]

            cards = []
            for selector in selectors:
                cards = page.query_selector_all(selector)
                if cards:
                    break

            if not cards:
                # Fallback: get all visible elements and filter
                cards = page.query_selector_all("div")

            print(f"Found {len(cards)} potential business cards")

            for i, card in enumerate(cards[:max_results * 2]):  # Buffer for filtering
                try:
                    # Extract business name
                    name_elem = (
                        card.query_selector('div[class*="dbg0pd"]')
                        or card.query_selector('div[aria-label]')
                        or card.query_selector('h3')
                    )
                    name = name_elem.inner_text().strip() if name_elem else ""

                    if not name or len(name) < 2:
                        continue

                    # Skip Google-owned elements
                    if "Google" in name or "Maps" in name:
                        continue

                    # Extract rating
                    rating_elem = (
                        card.query_selector('span[aria-label*="star"]')
                        or card.query_selector('[aria-label*="rating"]')
                    )
                    rating_text = rating_elem.get_attribute("aria-label") if rating_elem else ""
                    rating = parse_rating(rating_text)

                    # Extract review count
                    reviews_elem = (
                        card.query_selector('span[aria-label*="reviews"]')
                        or card.query_selector('[aria-label*="reviews"]')
                    )
                    reviews_text = reviews_elem.get_attribute("aria-label") if reviews_elem else ""
                    review_count = parse_count(reviews_text)

                    # Extract website
                    website_elem = card.query_selector('a[href]')
                    website_href = website_elem.get_attribute("href") if website_elem else ""
                    website = extract_url(website_href)
                    website_status = classify_website(website)

                    # Extract phone
                    phone_elem = (
                        card.query_selector('span[class*="hfk2a"]')
                        or card.query_selector('[data-phone-number]')
                    )
                    phone = phone_elem.inner_text().strip() if phone_elem else ""

                    # Extract address
                    addr_elem = (
                        card.query_selector('div[class*="W4Efs"]')
                        or card.query_selector('div[class*="IFCend"]')
                    )
                    address = addr_elem.inner_text().strip() if addr_elem else ""

                    # Extract category
                    cat_elem = (
                        card.query_selector('span[class*="bsI8"]')
                        or card.query_selector('button[class*="q얽"]')
                    )
                    category = cat_elem.inner_text().strip() if cat_elem else ""

                    # Skip if no meaningful data
                    if not name or not address:
                        continue

                    # Build business record
                    business = {
                        "business_name": name,
                        "address": address,
                        "phone": phone,
                        "rating": rating,
                        "review_count": review_count,
                        "website": website,
                        "website_status": website_status,
                        "category": category,
                        "google_maps_url": page.url,
                        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                        "lead_source": "google_maps",
                    }

                    all_businesses.append(business)

                    # Check if qualifies (good reviews, no/bad website)
                    if (
                        rating >= min_rating
                        and review_count >= min_reviews
                        and website_status in ("no_website", "bad_website")
                        and phone
                    ):
                        # Calculate lead score
                        score = calculate_lead_score(business)
                        business["lead_score"] = score
                        business["outreach_status"] = "new"
                        qualified_leads.append(business)
                        print(
                            f"  ✓ QUALIFIED: {name} — "
                            f"rating={rating}, reviews={review_count}, "
                            f"website={website_status}, score={score}"
                        )

                except Exception as e:
                    print(f"  Error extracting card {i}: {e}")
                    continue

                # Small delay between extractions
                time.sleep(0.1)

        except Exception as e:
            print(f"Error during scraping: {e}")
        finally:
            browser.close()

    print(f"\nScrape complete:")
    print(f"  Total businesses found: {len(all_businesses)}")
    print(f"  Qualified leads (good reviews, no/bad website): {len(qualified_leads)}")

    # Output results
    if output_file:
        with open(output_file, "w") as f:
            json.dump(qualified_leads, f, indent=2)
        print(f"Results saved to: {output_file}")

    if webhook_url:
        print(f"Sending {len(qualified_leads)} leads to webhook: {webhook_url}")
        # In production, make HTTP POST to webhook
        # For now, just log
        # requests.post(webhook_url, json=qualified_leads)

    return qualified_leads, all_businesses


def calculate_lead_score(business: dict) -> int:
    """
    Calculate lead score (0-100) based on business attributes.
    Higher score = better lead for our services.
    """
    score = 0

    # Rating (0-20 points)
    rating = business.get("rating", 0)
    if rating >= 4.5:
        score += 20
    elif rating >= 4.0:
        score += 15
    elif rating >= 3.5:
        score += 10

    # Review count (0-25 points)
    reviews = business.get("review_count", 0)
    if reviews >= 200:
        score += 25
    elif reviews >= 100:
        score += 20
    elif reviews >= 50:
        score += 15
    elif reviews >= 20:
        score += 10

    # Website status (0-25 points)
    website_status = business.get("website_status", "no_website")
    if website_status == "no_website":
        score += 25  # No website = biggest gap
    elif website_status == "bad_website":
        score += 20  # Bad website = needs help
    else:
        score += 5  # Has website, less urgent

    # Phone presence (0-15 points)
    if business.get("phone"):
        score += 15  # Reachable

    # Category bonus (0-15 points)
    category = business.get("category", "").lower()
    high_value_categories = ["dentist", "dental", "clinic", "medical", "hospital"]
    if any(cat in category for cat in high_value_categories):
        score += 15  # Healthcare = high value

    return min(score, 100)


def main():
    parser = argparse.ArgumentParser(description="Google Maps Scraper for QubNexa Agency")
    parser.add_argument("--query", required=True, help="Search query (e.g., 'dentists in Houston, TX')")
    parser.add_argument("--max-results", type=int, default=200, help="Max businesses to collect")
    parser.add_argument("--min-rating", type=float, default=3.5, help="Minimum rating to qualify")
    parser.add_argument("--min-reviews", type=int, default=20, help="Minimum review count to qualify")
    parser.add_argument("--output", "-o", help="Output JSON file path")
    parser.add_argument("--webhook", "-w", help="Webhook URL to send results to")
    parser.add_argument("--delay-min", type=int, default=3, help="Minimum delay between actions (seconds)")
    parser.add_argument("--delay-max", type=int, default=8, help="Maximum delay between actions (seconds)")

    args = parser.parse_args()

    # Validate Playwright is installed
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Playwright not installed!")
        print("Install with: pip install playwright")
        print("Then: playwright install chromium")
        sys.exit(1)

    qualified, all_businesses = scrape_google_maps(
        query=args.query,
        max_results=args.max_results,
        min_rating=args.min_rating,
        min_reviews=args.min_reviews,
        output_file=args.output,
        webhook_url=args.webhook,
        delay_range=(args.delay_min, args.delay_max),
    )

    # Print summary
    print("\n" + "=" * 60)
    print("SCRAPE SUMMARY")
    print("=" * 60)
    print(f"Query: {args.query}")
    print(f"Qualified leads: {len(qualified)}")
    print(f"Total businesses: {len(all_businesses)}")

    if qualified:
        print("\nTop 5 qualified leads:")
        sorted_leads = sorted(qualified, key=lambda x: x.get("lead_score", 0), reverse=True)
        for i, lead in enumerate(sorted_leads[:5], 1):
            print(
                f"  {i}. {lead['business_name']} — "
                f"Score: {lead.get('lead_score', 'N/A')}, "
                f"Rating: {lead.get('rating', 'N/A')}, "
                f"Reviews: {lead.get('review_count', 'N/A')}, "
                f"Website: {lead.get('website_status', 'N/A')}"
            )


if __name__ == "__main__":
    main()
