#!/usr/bin/env python3
"""
Google Maps + Bing + Yelp Scraper with GBP Deep-Dive for QubNexa Agency

Multi-source lead scraper:
- Google Maps: Business listings with reviews
- Bing Places: Alternative source for business listings
- Yelp: Review platform with business data
- GBP Deep-Dive: Visit each qualified business's full GBP page for richer data

Outputs JSON for n8n to consume via webhook or file.

Usage:
    python multi_source_scraper.py --query "dentists in Houston, TX" --sources google,bing,yelp,gbpp deep --max-results 200
    python multi_source_scraper.py --query "dentists in Houston, TX" --sources google,gbpp_deep --max-results 200 --webhook http://localhost:5678/webhook/google-maps-leads
"""

import argparse
import json
import sys
import time
import re
import os
from datetime import datetime
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from typing import Optional


# ============================
# Utility Functions
# ============================

def parse_rating(text: str) -> float:
    if not text:
        return 0.0
    match = re.search(r"(\d+\.?\d*)", text)
    return float(match.group(1)) if match else 0.0


def parse_count(text: str) -> int:
    if not text:
        return 0
    # Try to find a parenthesized number like (1,091) first
    m = re.search(r'\((\d[\d,]*)\)', text)
    if m:
        return int(m.group(1).replace(',', ''))
    # Handle comma-separated numbers like "1,091"
    m = re.search(r'(\d[\d,]{2,})', text)
    if m:
        return int(m.group(1).replace(',', ''))
    match = re.search(r'(\d+)', text)
    return int(match.group(1)) if match else 0


def extract_url(href: str) -> Optional[str]:
    if not href:
        return None
    if "gmp" in href or "maps" in href or "goo.gl" in href:
        return None
    match = re.search(r"https?://[^\s\"<>]+", href)
    return match.group(0) if match else None


def classify_website(url: Optional[str], page_content: str = "") -> str:
    if not url:
        return "no_website"
    # Check for known bad patterns
    if any(x in url.lower() for x in ["parking", "for-sale", "for sale", "realestate", "real estate"]):
        return "bad_website"
    # Would add HTTP fetch here in production to check if site loads
    return "ok_website"


def generate_candidate_domains(business_name: str, city: str = "") -> list[str]:
    """Generate candidate domain names from business name."""
    name = business_name.lower().replace(" ", "").replace(",", "").replace(".", "")
    candidates = [
        f"{name}.com",
        f"{name}.net",
        f"{name}.biz",
    ]
    if city:
        city_clean = city.lower().replace(" ", "").replace(",", "")
        candidates.extend([
            f"{city_clean}-{name}.com",
            f"{city_clean}{name}.com",
            f"{name}{city_clean}.com",
        ])
    return candidates


def calculate_lead_score(business: dict) -> int:
    """
    Calculate lead score (0-100) based on business attributes.
    """
    score = 0

    # Rating (0-20)
    rating = business.get("rating", 0)
    if rating >= 4.7:
        score += 20
    elif rating >= 4.5:
        score += 18
    elif rating >= 4.0:
        score += 14
    elif rating >= 3.5:
        score += 8

    # Review count (0-25)
    reviews = business.get("review_count", 0)
    if reviews >= 300:
        score += 25
    elif reviews >= 200:
        score += 22
    elif reviews >= 100:
        score += 18
    elif reviews >= 50:
        score += 14
    elif reviews >= 20:
        score += 10

    # Website status (0-25)
    website_status = business.get("website_status", "no_website")
    if website_status == "no_website":
        score += 25
    elif website_status == "bad_website":
        score += 20
    elif website_status == "weak_website":
        score += 12
    else:
        score += 3

    # Phone presence (0-10)
    if business.get("phone"):
        score += 10

    # GBP engagement signals (0-20) - from GBP deep-dive
    gbp_engagement = business.get("gbp_engagement_score", 0)
    score += gbp_engagement

    return min(score, 100)


# ============================
# Google Maps Scraper
# ============================

def scrape_google_maps(
    query: str,
    max_results: int = 200,
    min_rating: float = 3.5,
    min_reviews: int = 20,
    do_gbpp_deep_dive: bool = False,
    gbp_deep_dive_delay: float = 2.0,
    output_file: Optional[str] = None,
    webhook_url: Optional[str] = None,
):
    """
    Scrape Google Maps for businesses matching the query.
    Optionally do GBP deep-dive on qualified leads.
    """
    qualified_leads = []
    all_businesses = []

    print(f"\n{'='*60}")
    print(f"SOURCE: Google Maps")
    print(f"Query: '{query}'")
    print(f"Filters: rating >= {min_rating}, reviews >= {min_reviews}")
    print(f"Max results: {max_results}")
    if do_gbpp_deep_dive:
        print(f"GBP Deep-Dive: ENABLED (delay={gbp_deep_dive_delay}s)")
    print(f"{'='*60}")

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
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        try:
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            print(f"  Navigating to Google Maps: {search_url}")
            page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            # Check for CAPTCHA/block page
            if "sorry" in page.content().lower() or "captcha" in page.content().lower():
                print("  WARNING: Google may have blocked automated access. Try using a different approach or API.")
                # Continue anyway, may still get some results

            # Scroll to load results
            print("  Scrolling to load business results...")
            last_height = page.evaluate("document.body.scrollHeight")
            scroll_count = 0

            while scroll_count < 25:
                page.mouse.wheel(0, 5000)
                time.sleep(1.5)
                scroll_count += 1

                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

                # Check loaded count periodically
                if scroll_count % 5 == 0:
                    cards = page.query_selector_all('div[jsaction*="hovercard"]')
                    if len(cards) >= max_results:
                        break

            print(f"  Scroll complete ({scroll_count} scrolls). Extracting...")

            # Extract business cards
            cards = page.query_selector_all('div[jsaction*="hovercard"]')

            # If that selector fails, try alternatives
            if not cards:
                cards = page.query_selector_all('div[class*="Nv2Mi"]')
            if not cards:
                cards = page.query_selector_all('[data-result-name="0"]')
            if not cards:
                cards = page.query_selector_all('div[role="article"]')

            print(f"  Found {len(cards)} business cards")

            for i, card in enumerate(cards[:max_results * 2]):
                try:
                    # Business name — the <a> itself has aria-label, also try inner spans
                    name = ""
                    name_elem = card.query_selector("a.hfpxzc")
                    if name_elem:
                        name = (name_elem.get_attribute("aria-label") or "").strip()
                    if not name:
                        name_elem2 = card.query_selector('div.qBF1Pd.fontHeadlineSmall span span')
                        if name_elem2:
                            name = name_elem2.inner_text().strip()
                    if not name or len(name) < 2:
                        continue
                    if "Google" in name or "Maps" in name:
                        continue

                    # Rating + review count are often combined: "4.8(1,091)"
                    rating = 0.0
                    review_count = 0
                    rating_elem = card.query_selector('span[aria-label*="stars"]')
                    if rating_elem:
                        rating_text = rating_elem.get_attribute("aria-label") or ""
                        rating = parse_rating(rating_text)
                    if rating == 0.0:
                        rating_span = card.query_selector('span.MW4etd')
                        if rating_span:
                            rating = parse_rating(rating_span.inner_text())

                    # Review count: parse from the combined "X.X(YYYY)" text pattern
                    review_count = 0
                    card_text = card.inner_text()
                    # Find "X.X(YYYY)" pattern like "4.8(1,091)" — this is the most reliable source
                    m = re.search(r'(\d+\.\d+)\((\d[\d,]*)\)', card_text)
                    if m:
                        review_count = parse_count(m.group(2))
                    if review_count == 0:
                        # Fallback: try aria-label on review element
                        reviews_elem = card.query_selector('span[aria-label*="review"]')
                        if reviews_elem:
                            reviews_text = reviews_elem.get_attribute("aria-label") or reviews_elem.inner_text()
                            review_count = parse_count(reviews_text)

                    # Website — look for href in any link inside the card
                    website = ""
                    website_status = "no_website"
                    links = card.query_selector_all("a[href]")
                    for link in links:
                        href = link.get_attribute("href") or ""
                        ext_url = extract_url(href)
                        if ext_url and "maps.google.com" not in ext_url and "google.com/maps" not in ext_url:
                            website = ext_url
                            website_status = classify_website(website)
                            break

                    # Clean phone: only use if we have a real phone element, otherwise empty
                    # Google Maps search cards don't show phone — it's on the detail page
                    phone = ""
                    phone_elem = card.query_selector('span[class*="hfk2a"], span[data-phone-number], div[class*="Yr594"] span')
                    if phone_elem:
                        phone = phone_elem.inner_text().strip()
                        # Clean: remove anything that looks like a review count
                        phone = re.sub(r'\(?\d{1,3}(?:,\d{3})*\)', '', phone).strip()
                        if not phone or len(re.sub(r'[^0-9+]', '', phone)) < 7:
                            phone = ""

                    # Address — look for span inside div.W4Efsd that's not category/rating
                    address = ""
                    addr_divs = card.query_selector_all('div.W4Efsd')
                    for div in addr_divs:
                        text = div.inner_text()
                        if "·" in text and any(c in text for c in ["St", "Ave", "Rd", "Blvd", "Dr", "Ln", "Way", "Hwy", "Pl", "Ct", "Ste"]):
                            address = text.split("·")[-1].strip()
                            break
                    if not address:
                        addr_elem = card.query_selector('div[aria-label*="address"], div[data-address]')
                        if addr_elem:
                            address = addr_elem.inner_text().strip()

                    # Category — span inside W4Efsd that's not address/rating
                    category = ""
                    cat_spans = card.query_selector_all('div.W4Efsd span span')
                    for span in cat_spans:
                        txt = span.inner_text().strip()
                        if txt and len(txt) > 1 and "·" not in txt and not txt[0].isdigit():
                            category = txt
                            break

                    # GBP URL (for deep-dive)
                    gbp_url = None
                    link_elem = card.query_selector('a[href*="maps.google.com"]')
                    if link_elem:
                        gbp_url = link_elem.get_attribute("href")

                    # Skip if no meaningful data
                    if not name or not address and not phone:
                        continue

                    business = {
                        "business_name": name,
                        "address": address,
                        "phone": phone,
                        "rating": rating,
                        "review_count": review_count,
                        "website": website,
                        "website_status": website_status,
                        "category": category,
                        "google_maps_url": gbp_url or page.url,
                        "source": "google_maps",
                        "scraped_at": datetime.utcnow().isoformat() + "Z",
                        "raw_data": {
                            "card_html": card.inner_html()[:2000] if card else "",
                        }
                    }

                    all_businesses.append(business)

                    # Check qualification — phone not required from search cards (on detail page only)
                    qualified = (
                        rating >= min_rating
                        and review_count >= min_reviews
                        and website_status in ("no_website", "bad_website")
                    )
                    if qualified:
                        qualified_leads.append(business)
                        score = calculate_lead_score(business)
                        business["lead_score"] = score
                        business["outreach_status"] = "new"
                        print(
                            f"  QUALIFIED: {name[:50]} — "
                            f"⭐{rating} ({review_count} reviews), "
                            f"website={'none' if not website else website_status}, "
                            f"score={score}"
                        )
                    else:
                        # Still calculate score for all businesses (not just qualified)
                        score = calculate_lead_score(business)
                        business["lead_score"] = score
                        business["outreach_status"] = "new"

                    # GBP Deep-Dive on qualified leads
                    if do_gbpp_deep_dive and business in qualified_leads:
                        gbp_data = do_gbp_deep_dive(page, card, business, gbp_deep_dive_delay)
                        business.update(gbp_data)
                        business["lead_score"] = calculate_lead_score(business)

                except Exception as e:
                    continue

                time.sleep(0.05)

        except Exception as e:
            print(f"Error during Google Maps scrape: {e}")
        finally:
            browser.close()

    print(f"\n  Google Maps complete: {len(qualified_leads)} qualified leads from {len(all_businesses)} businesses")
    return qualified_leads, all_businesses


def do_gbp_deep_dive(page, card, business: dict, delay: float) -> dict:
    """
    Visit the business's full GBP page and extract deeper engagement data.
    Returns additional fields to add to the business record.
    """
    additional = {
        "gbp_reviews_count": business.get("review_count", 0),
        "gbp_rating": business.get("rating", 0),
        "gbp_photo_count": 0,
        "gbp_post_count": 0,
        "gbp_review_response_rate": None,
        "gbp_has_qa": False,
        "gbp_hours": "",
        "gbp_services": [],
        "gbp_engagement_score": 0,
    }

    # Try to get the GBP page URL from the card
    gbp_link_elem = card.query_selector('a[href*="maps.google.com"]')
    gbp_url = gbp_link_elem.get_attribute("href") if gbp_link_elem else None

    if not gbp_url:
        return additional

    try:
        # Navigate to GBP page
        # Extract the place ID or use the URL directly
        page.goto(gbp_url, timeout=15000, wait_until="domcontentloaded")
        time.sleep(delay)

        # Extract photo count
        photo_elem = page.query_selector('div[aria-label*="photos"]')
        if photo_elem:
            photo_text = photo_elem.get_attribute("aria-label") or photo_elem.inner_text()
            additional["gbp_photo_count"] = parse_count(photo_text)

        # Extract post count
        post_elem = page.query_selector('div[aria-label*="posts"]')
        if post_elem:
            post_text = post_elem.get_attribute("aria-label") or post_elem.inner_text()
            additional["gbp_post_count"] = parse_count(post_text)

        # Extract hours
        hours_elem = page.query_selector('div[aria-label*="hours"]')
        if hours_elem:
            additional["gbp_hours"] = hours_elem.inner_text()[:200]

        # Check for Q&A
        qa_elem = page.query_selector('div[aria-label*="Questions"]')
        additional["gbp_has_qa"] = bool(qa_elem)

        # Calculate engagement score from GBP data
        engagement = 0
        if additional["gbp_photo_count"] > 50:
            engagement += 8
        elif additional["gbp_photo_count"] > 20:
            engagement += 5
        elif additional["gbp_photo_count"] > 0:
            engagement += 2

        if additional["gbp_post_count"] > 10:
            engagement += 8
        elif additional["gbp_post_count"] > 3:
            engagement += 5
        elif additional["gbp_post_count"] > 0:
            engagement += 2

        # Review response rate (simplified: if reviews exist and business appears active)
        if business.get("review_count", 0) > 50:
            engagement += 5

        if qa_elem:
            engagement += 3

        additional["gbp_engagement_score"] = min(engagement, 20)

        print(f"    GBP Deep-Dive: photos={additional['gbp_photo_count']}, posts={additional['gbp_post_count']}, engagement_score={additional['gbp_engagement_score']}")

    except Exception as e:
        print(f"    GBP Deep-Dive failed for {business.get('business_name', 'unknown')}: {e}")

    return additional


# ============================
# Bing Places Scraper
# ============================

def scrape_bing_places(
    query: str,
    max_results: int = 100,
    min_rating: float = 3.5,
    min_reviews: int = 20,
):
    """
    Scrape Bing Maps for businesses matching the query.
    Bing is less aggressive against scraping than Google.
    """
    qualified_leads = []
    all_businesses = []

    print(f"\n{'='*60}")
    print(f"SOURCE: Bing Places")
    print(f"Query: '{query}'")
    print(f"{'='*60}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        )
        page = context.new_page()

        try:
            search_url = f"https://www.bing.com/maps/search/{query.replace(' ', '+')}"
            print(f"  Navigating to Bing Maps: {search_url}")
            page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            # Scroll to load results
            last_height = page.evaluate("document.body.scrollHeight")
            for _ in range(10):
                page.mouse.wheel(0, 3000)
                time.sleep(1.0)
                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            # Extract business cards from Bing
            cards = page.query_selector_all('div[class*="SearchCard"]')
            if not cards:
                cards = page.query_selector_all('div[class*="SearchResult"]')
            if not cards:
                cards = page.query_selector_all('li[class*="SearchItem"]')

            print(f"  Found {len(cards)} business cards on Bing")

            for card in cards[:max_results]:
                try:
                    name_elem = (
                        card.query_selector('a[class*="title"]')
                        or card.query_selector('h3')
                        or card.query_selector('[class*="businessName"]')
                    )
                    name = name_elem.inner_text().strip() if name_elem else ""
                    if not name or len(name) < 2:
                        continue

                    # Rating
                    rating_elem = card.query_selector('[aria-label*="star"]')
                    rating_text = rating_elem.get_attribute("aria-label") if rating_elem else ""
                    rating = parse_rating(rating_text)

                    # Reviews
                    reviews_elem = card.query_selector('[aria-label*="reviews"]')
                    reviews_text = reviews_elem.get_attribute("aria-label") if reviews_elem else ""
                    review_count = parse_count(reviews_text)

                    # Website
                    website_elem = card.query_selector('a[href*="http"]')
                    website_href = website_elem.get_attribute("href") if website_elem else ""
                    website = extract_url(website_href)
                    website_status = classify_website(website)

                    # Phone
                    phone_elem = card.query_selector('[class*="phone"]')
                    phone = phone_elem.inner_text().strip() if phone_elem else ""

                    # Address
                    addr_elem = card.query_selector('[class*="address"]')
                    address = addr_elem.inner_text().strip() if addr_elem else ""

                    # Category
                    cat_elem = card.query_selector('[class*="category"]')
                    category = cat_elem.inner_text().strip() if cat_elem else ""

                    if not name or not address and not phone:
                        continue

                    business = {
                        "business_name": name,
                        "address": address,
                        "phone": phone,
                        "rating": rating,
                        "review_count": review_count,
                        "website": website,
                        "website_status": website_status,
                        "category": category,
                        "google_maps_url": f"https://www.bing.com/maps/search/{query.replace(' ', '+')}",
                        "source": "bing",
                        "scraped_at": datetime.utcnow().isoformat() + "Z",
                    }

                    all_businesses.append(business)

                    if (
                        rating >= min_rating
                        and review_count >= min_reviews
                        and website_status in ("no_website", "bad_website")
                        and phone
                    ):
                        score = calculate_lead_score(business)
                        business["lead_score"] = score
                        business["outreach_status"] = "new"
                        qualified_leads.append(business)
                        print(f"  ✓ BING QUALIFIED: {name[:50]} — ⭐{rating} ({review_count} reviews)")

                except Exception:
                    continue

                time.sleep(0.05)

        except Exception as e:
            print(f"Error during Bing scrape: {e}")
        finally:
            browser.close()

    print(f"\n  Bing complete: {len(qualified_leads)} qualified leads from {len(all_businesses)} businesses")
    return qualified_leads, all_businesses


# ============================
# Yelp Scraper
# ============================

def scrape_yelp(
    query: str,
    max_results: int = 100,
    min_rating: float = 3.5,
    min_reviews: int = 20,
):
    """
    Scrape Yelp for businesses matching the query.
    Yelp has rich review data and is a strong lead source.
    """
    qualified_leads = []
    all_businesses = []

    print(f"\n{'='*60}")
    print(f"SOURCE: Yelp")
    print(f"Query: '{query}'")
    print(f"{'='*60}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/17.0 Safari/605.1.15"
            )
        )
        page = context.new_page()

        try:
            # Yelp search URL
            search_url = f"https://www.yelp.com/search?find_desc={query.split(' in ')[0]}&find_loc={query.split(' in ')[-1] if ' in ' in query else query}"
            print(f"  Navigating to Yelp: {search_url}")
            page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            # Scroll to load
            last_height = page.evaluate("document.body.scrollHeight")
            for _ in range(8):
                page.mouse.wheel(0, 3000)
                time.sleep(1.5)
                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            # Yelp business cards
            cards = page.query_selector_all('[class*="searchResult"]')
            if not cards:
                cards = page.query_selector_all('[class*="media-cover"]')
            if not cards:
                cards = page.query_selector_all('div[class*="biz-listing"]')

            print(f"  Found {len(cards)} business cards on Yelp")

            for card in cards[:max_results]:
                try:
                    # Name
                    name_elem = (
                        card.query_selector('a[class*="biz-name"]')
                        or card.query_selector('h3')
                        or card.query_selector('[class*="businessName"]')
                    )
                    name = name_elem.inner_text().strip() if name_elem else ""
                    if not name or len(name) < 2:
                        continue

                    # Rating (Yelp uses stars)
                    rating_elem = (
                        card.query_selector('[class*="rating"]')
                        or card.query_selector('[class*="stars"]')
                    )
                    rating_text = rating_elem.get_attribute("aria-label") if rating_elem else ""
                    if not rating_text:
                        rating_text = rating_elem.inner_text() if rating_elem else ""
                    rating = parse_rating(rating_text)

                    # Review count
                    reviews_elem = (
                        card.query_selector('[class*="reviewCount"]')
                        or card.query_selector('[class*="review-count"]')
                        or card.query_selector('[class*="review-count"]')
                    )
                    reviews_text = reviews_elem.get_attribute("aria-label") if reviews_elem else ""
                    if not reviews_text:
                        reviews_text = reviews_elem.inner_text() if reviews_elem else ""
                    review_count = parse_count(reviews_text)

                    # Website
                    website_elem = (
                        card.query_selector('a[class*="biz-website"]')
                        or card.query_selector('a[href*="http"]')
                    )
                    website_href = website_elem.get_attribute("href") if website_elem else ""
                    website = extract_url(website_href)
                    website_status = classify_website(website)

                    # Phone
                    phone_elem = card.query_selector('[class*="biz-phone"]')
                    phone = phone_elem.inner_text().strip() if phone_elem else ""

                    # Address
                    addr_elem = (
                        card.query_selector('[class*="address"]')
                        or card.query_selector('[class*="biz-address"]')
                    )
                    address = addr_elem.inner_text().strip() if addr_elem else ""

                    # Category
                    cat_elem = (
                        card.query_selector('[class*="category"]')
                        or card.query_selector('[class*="biz-categories"]')
                    )
                    category = cat_elem.inner_text().strip() if cat_elem else ""

                    if not name or not address and not phone:
                        continue

                    business = {
                        "business_name": name,
                        "address": address,
                        "phone": phone,
                        "rating": rating,
                        "review_count": review_count,
                        "website": website,
                        "website_status": website_status,
                        "category": category,
                        "google_maps_url": f"https://www.yelp.com/search?find_desc={query.split(' in ')[0] if ' in ' in query else query}",
                        "source": "yelp",
                        "scraped_at": datetime.utcnow().isoformat() + "Z",
                    }

                    all_businesses.append(business)

                    if (
                        rating >= min_rating
                        and review_count >= min_reviews
                        and website_status in ("no_website", "bad_website")
                        and phone
                    ):
                        score = calculate_lead_score(business)
                        business["lead_score"] = score
                        business["outreach_status"] = "new"
                        qualified_leads.append(business)
                        print(f"  ✓ YELP QUALIFIED: {name[:50]} — ⭐{rating} ({review_count} reviews)")

                except Exception:
                    continue

                time.sleep(0.05)

        except Exception as e:
            print(f"Error during Yelp scrape: {e}")
        finally:
            browser.close()

    print(f"\n  Yelp complete: {len(qualified_leads)} qualified leads from {len(all_businesses)} businesses")
    return qualified_leads, all_businesses


# ============================
# Main Orchestrator
# ============================

def run_multi_source_scraper(
    query: str,
    sources: list[str] = None,
    max_results: int = 200,
    min_rating: float = 3.5,
    min_reviews: int = 20,
    output_file: Optional[str] = None,
    webhook_url: Optional[str] = None,
    do_gbpp_deep_dive: bool = False,
    gbp_deep_dive_delay: float = 2.0,
):
    """
    Run multi-source scraper for a given query.

    Sources: 'google', 'bing', 'yelp', 'gbpp_deep'
    """
    if sources is None:
        sources = ["google"]

    all_qualified = {}
    all_businesses = {}

    # Google Maps
    if "google" in sources:
        g_qualified, g_all = scrape_google_maps(
            query=query,
            max_results=max_results,
            min_rating=min_rating,
            min_reviews=min_reviews,
            do_gbpp_deep_dive=do_gbpp_deep_dive,
            gbp_deep_dive_delay=gbp_deep_dive_delay,
        )
        all_qualified["google"] = g_qualified
        all_businesses["google"] = g_all

    # Bing Places
    if "bing" in sources:
        b_qualified, b_all = scrape_bing_places(
            query=query,
            max_results=max_results,
            min_rating=min_rating,
            min_reviews=min_reviews,
        )
        all_qualified["bing"] = b_qualified
        all_businesses["bing"] = b_all

    # Yelp
    if "yelp" in sources:
        y_qualified, y_all = scrape_yelp(
            query=query,
            max_results=max_results,
            min_rating=min_rating,
            min_reviews=min_reviews,
        )
        all_qualified["yelp"] = y_qualified
        all_businesses["yelp"] = y_all

    # Merge and deduplicate
    merged_qualified = []
    seen_names = set()

    for source, leads in all_qualified.items():
        for lead in leads:
            key = lead.get("business_name", "").lower().strip()
            if key and key not in seen_names:
                seen_names.add(key)
                lead["sources"] = [source]
                lead["overall_score"] = lead.get("lead_score", 0)
                merged_qualified.append(lead)
            elif key:
                # Update existing lead with additional source
                for existing in merged_qualified:
                    if existing.get("business_name", "").lower().strip() == key:
                        if source not in existing.get("sources", []):
                            existing.setdefault("sources", []).append(source)
                        # Take higher score
                        existing["overall_score"] = max(
                            existing.get("overall_score", 0),
                            lead.get("lead_score", 0)
                        )
                        break

    # Sort by overall score
    merged_qualified.sort(key=lambda x: x.get("overall_score", 0), reverse=True)

    # Add summary
    summary = {
        "query": query,
        "sources_used": sources,
        "total_qualified": len(merged_qualified),
        "by_source": {
            source: len(leads) for source, leads in all_qualified.items()
        },
        "scraped_at": datetime.utcnow().isoformat() + "Z",
    }

    result = {
        "summary": summary,
        "leads": merged_qualified,
        "all_businesses": {
            source: businesses for source, businesses in all_businesses.items()
        },
    }

    # Output
    if output_file:
        with open(output_file, "w") as f:
            json.dump(result, f, indent=2)
        print(f"\nResults saved to: {output_file}")

    if webhook_url:
        print(f"\nSending {len(merged_qualified)} leads to webhook: {webhook_url}")
        # TODO: Implement HTTP POST to webhook

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Multi-source lead scraper: Google Maps + Bing + Yelp with GBP deep-dive"
    )
    parser.add_argument("--query", required=True, help="Search query (e.g., 'dentists in Houston, TX')")
    parser.add_argument("--sources", "-s", nargs="+", default=["google"],
                        choices=["google", "bing", "yelp", "gbpp_deep"],
                        help="Data sources to scrape (default: google)")
    parser.add_argument("--max-results", type=int, default=200, help="Max businesses per source")
    parser.add_argument("--min-rating", type=float, default=3.5, help="Minimum rating to qualify")
    parser.add_argument("--min-reviews", type=int, default=20, help="Minimum review count to qualify")
    parser.add_argument("--output", "-o", help="Output JSON file path")
    parser.add_argument("--webhook", "-w", help="Webhook URL to send results to")
    parser.add_argument("--gbpp-deep-dive", action="store_true", help="Enable GBP deep-dive on Google Maps leads")
    parser.add_argument("--gbpp-delay", type=float, default=2.0, help="Delay between GBP page visits (seconds)")

    args = parser.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Playwright not installed!")
        print("Install with: pip install playwright && playwright install chromium")
        sys.exit(1)

    # Build source list
    sources = args.sources
    if "gbpp_deep" in sources:
        sources.remove("gbpp_deep")
        sources.append("google")  # GBP deep-dive is an add-on to Google
        if "google" not in sources:
            sources.insert(0, "google")

    print(f"\n{'='*60}")
    print(f"QUBNEXA MULTI-SOURCE SCRAPER")
    print(f"{'='*60}")
    print(f"Query: {args.query}")
    print(f"Sources: {sources}")
    if do_gbpp_deep_dive := args.gbpp_deep_dive:
        print(f"GBP Deep-Dive: ENABLED (delay={args.gbpp_delay}s)")
    print(f"Output: {args.output or 'stdout/console'}")
    print(f"Webhook: {args.webhook or 'none'}")
    print(f"{'='*60}\n")

    result = run_multi_source_scraper(
        query=args.query,
        sources=sources,
        max_results=args.max_results,
        min_rating=args.min_rating,
        min_reviews=args.min_reviews,
        output_file=args.output,
        webhook_url=args.webhook,
        do_gbpp_deep_dive=args.gbpp_deep_dive,
        gbp_deep_dive_delay=args.gbpp_delay,
    )

    # Print summary
    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)
    print(f"Total qualified leads: {result['summary']['total_qualified']}")
    print(f"By source:")
    for source, count in result["summary"]["by_source"].items():
        print(f"  {source}: {count}")

    if result["leads"]:
        print(f"\nTop 10 qualified leads:")
        for i, lead in enumerate(result["leads"][:10], 1):
            sources = ", ".join(lead.get("sources", []))
            print(
                f"  {i}. {lead['business_name'][:50]}"
                f" [Score: {lead.get('overall_score', 'N/A')} | "
                f"⭐{lead.get('rating', 'N/A')} | "
                f"Revs: {lead.get('review_count', 'N/A')} | "
                f"Website: {lead.get('website_status', 'N/A')} | "
                f"Sources: {sources}]"
            )
    else:
        print("\nNo qualified leads found. Try lowering filters or trying different query.")

    return result


if __name__ == "__main__":
    main()
