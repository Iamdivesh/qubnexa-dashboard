#!/usr/bin/env python3
"""
Corrected Google Maps Scraper + GBP Detail Page Extractor
Fixed selectors based on actual DOM analysis.
"""

import sys
import time
import json
import uuid
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"

from playwright.sync_api import sync_playwright

# ============================================================================
# DATA EXTRACTION — Search Card (corrected selectors)
def extract_search_card(card) -> Optional[dict]:
    """Extract business data from a Google Maps search result card.

    Handles both parent-container cards and anchor-level cards (where card IS the a.hfpxzc).
    Based on actual DOM analysis:
    - Name: a.hfpxzc aria-label, or card own aria-label if card IS the anchor
    - Rating/reviews: card_text "X.X(YYYY)" pattern (most reliable), fallback to W4Efsd spans
    - Category: div.W4Efsd > div.W4Efsd span:nth-child(1) > span
    - Address: last meaningful span in third W4Efsd div, or regex from card text
    - GBP URL: a.hfpxzc href
    - Website: a.bm892c aria-label
    """
    result = {
        "business_name": "",
        "rating": 0.0,
        "review_count": 0,
        "category": "",
        "address": "",
        "google_maps_url": "",
        "website": "",
        "website_status": "no_website",
        "phone": "",
        "hours": "",
        "raw_card_text": "",
    }

    # --- Name ---
    # Card may be a parent container OR the anchor (a.hfpxzc) itself.
    # If card IS the anchor, card.query_selector("a.hfpxzc") returns None (self-query).
    name = ""
    name_elem = card.query_selector("a.hfpxzc")
    if name_elem:
        name = (name_elem.get_attribute("aria-label") or "").strip()
    elif hasattr(card, "evaluate"):
        try:
            tag = card.evaluate("el => el.tagName")
            if tag and tag.upper() == "A":
                name = (card.get_attribute("aria-label") or "").strip()
        except Exception:
            pass
    if not name or "Google" in name or "Maps" in name:
        return None
    result["business_name"] = name

    # Determine content_card: if card IS the anchor, use parent for full content.
    content_card = card
    if hasattr(card, "evaluate"):
        try:
            tag = card.evaluate("el => el.tagName")
            if tag and tag.upper() == "A":
                # Anchor: find closest W4Efsd ancestor for DOM queries
                content_card = card.evaluate("el => el.closest('div.W4Efsd')") or card
        except Exception:
            pass

    # --- Rating + Review Count ---
    # PRIMARY: parse from card text. Google Maps renders review counts as "4.8(1,091)"
    # inline in the card text. This works across ALL rendering variants.
    rating = 0.0
    review_count = 0
    try:
        card_text = content_card.inner_text()
        result["raw_card_text"] = card_text[:500]
    except Exception:
        card_text = ""

    # Try "X.X(YYYY)" pattern first
    m = re.search(r'(\d+\.\d+)\s*\(\s*(\d[\d,]*)\s*\)', card_text)
    if m:
        try:
            rating = float(m.group(1))
            review_count = int(m.group(2).replace(",", ""))
        except ValueError:
            pass

    # Fallback: find a standalone decimal rating
    if rating == 0.0:
        m2 = re.search(r'(?<![\d\)\s])\s*(\d+\.\d{1,2})(?=\s|\n|\)|$)', card_text)
        if m2:
            try:
                rating = float(m2.group(1))
            except ValueError:
                pass

    # Fallback: W4Efsd span.e4rVHe (contains "4.8(1,091)" text)
    if rating == 0.0 or review_count == 0:
        try:
            w4 = content_card.query_selector("div.W4Efsd span.e4rVHe")
        except Exception:
            w4 = None
        if w4:
            try:
                txt = w4.inner_text().strip()
            except Exception:
                txt = ""
            m3 = re.search(r'(\d+\.\d+)\s*\(\s*(\d[\d,]*)\s*\)', txt)
            if m3:
                try:
                    if rating == 0.0:
                        rating = float(m3.group(1))
                    if review_count == 0:
                        review_count = int(m3.group(2).replace(",", ""))
                except ValueError:
                    pass
            elif re.match(r'\d+\.\d+', txt):
                if rating == 0.0:
                    try:
                        rating = float(txt)
                    except ValueError:
                        pass

    # Fallback: MW4etd span (rating only)
    if rating == 0.0:
        try:
            mw = content_card.query_selector("div.W4Efsd span.MW4etd")
        except Exception:
            mw = None
        if mw:
            try:
                rating = float(mw.inner_text().strip())
            except ValueError:
                pass

    # Fallback: UY7F9 span (review count only)
    if review_count == 0:
        try:
            uy = content_card.query_selector("div.W4Efsd span.UY7F9")
        except Exception:
            uy = None
        if uy:
            try:
                ct = uy.inner_text().strip().replace("(", "").replace(")", "").replace(",", "")
                review_count = int(ct)
            except (ValueError, TypeError):
                pass

    result["rating"] = rating
    result["review_count"] = review_count

    # --- Category + Address ---
    try:
        w4efsd_divs = content_card.query_selector_all("div.W4Efsd")
    except Exception:
        w4efsd_divs = []

    if len(w4efsd_divs) >= 2:
        cat_div = w4efsd_divs[1]
        try:
            cat_spans = cat_div.query_selector_all("span")
        except Exception:
            cat_spans = []
        if cat_spans:
            try:
                cat_text = cat_spans[0].inner_text().strip()
            except Exception:
                cat_text = ""
            if cat_text and not cat_text.startswith("·") and cat_text != "":
                result["category"] = cat_text

    # Address: regex from card text (covers all variants)
    if not result["address"]:
        addr_m = re.search(
            r'(\d+\s+[A-Z][a-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|'
            r'Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct|'
            r'Circle|Cir)[^\n,;]*)', card_text
        )
        if addr_m:
            result["address"] = addr_m.group(1).strip()

    # Address: last meaningful span in third W4Efsd div
    if not result["address"] and len(w4efsd_divs) >= 3:
        addr_div = w4efsd_divs[2]
        try:
            addr_spans = addr_div.query_selector_all("span")
        except Exception:
            addr_spans = []
        if addr_spans:
            for span in reversed(addr_spans):
                try:
                    text = span.inner_text().strip()
                except Exception:
                    text = ""
                if (text and not text.startswith("·") and text != ""
                        and "Opens" not in text and "Closed" not in text):
                    result["address"] = text
                    break

    # Address: second W4Efsd div as fallback
    if not result["address"] and len(w4efsd_divs) >= 2:
        addr_div = w4efsd_divs[1]
        try:
            addr_spans = addr_div.query_selector_all("span")
        except Exception:
            addr_spans = []
        if addr_spans:
            for span in reversed(addr_spans):
                try:
                    text = span.inner_text().strip()
                except Exception:
                    text = ""
                if (text and not text.startswith("·") and text != ""
                        and "Opens" not in text and "Closed" not in text):
                    result["address"] = text
                    break

    # --- GBP URL ---
    try:
        gbp_link = content_card.query_selector("a.hfpxzc")
    except Exception:
        gbp_link = None
    if gbp_link:
        href = gbp_link.get_attribute("href") or ""
        if href.startswith("http") and (
            "maps.google.com" in href or "maps.app.goo.gl" in href
        ):
            result["google_maps_url"] = href

    # --- Website ---
    try:
        visit_elem = content_card.query_selector("a.bm892c")
    except Exception:
        visit_elem = None
    if visit_elem:
        try:
            aria_label = visit_elem.get_attribute("aria-label") or ""
        except Exception:
            aria_label = ""
        url_match = re.search(
            r'(https?://[^\s·]+|[a-z0-9-]+\.[a-z]{2,})', aria_label
        )
        if url_match:
            result["website"] = url_match.group(1)
            result["website_status"] = "ok_website"
        else:
            result["website_status"] = "bad_website"
    else:
        result["website_status"] = "no_website"

    return result


# ============================================================================
# DATA EXTRACTION - GBP Detail Page
# ============================================================================

def extract_gbp_detail(page, gbp_url):
    """Click into a GBP detail page and extract full details."""
    result = {
        "phone": "",
        "website": "",
        "full_address": "",
        "hours": "",
        "reviews": [],
        "review_count": 0,
        "review_avg": 0.0,
        "photo_count": 0,
        "service_options": [],
        "attributes": [],
        "about": "",
        "gbp_engagement_score": 0,
    }

    try:
        page.goto(gbp_url, timeout=30000, wait_until="domcontentloaded")
        time.sleep(2)
    except Exception as e:
        result["about"] = f"Navigation error: {e}"
        return result

    # Phone
    try:
        for sel in ['div[class*="yLp0Kb"] a[href^="tel:"]', 'span[class*="adppluni"] a[aria-label*="call"]', 'a[href^="tel:"]', 'div[class*="NWlQo"] a[href^="tel:"]']:
            try:
                pe = page.query_selector(sel)
                if pe:
                    aria = pe.get_attribute("aria-label") or ""
                    if "call" in aria.lower() or "phone" in aria.lower():
                        ph = aria
                    else:
                        ph = pe.inner_text() or ""
                    ph_m = re.search(r'[\d\s\-\+\(\)]{7,}', ph)
                    if ph_m:
                        result["phone"] = ph_m.group(0).strip()
                        break
            except Exception:
                pass
        if not result["phone"]:
            pt = page.inner_text()
            pl = re.findall(r'Phone[\s:]*([\d\-\+\(\)\s]{7,})', pt)
            if pl:
                result["phone"] = pl[0].strip()
    except Exception:
        pass

    # Website
    try:
        welems = page.query_selector_all('a[class*="hYr4cd"], a[href*="http"][href*="maps.google.com"], div[class*="x7GiWc"] a[href^="http"], div[class*="x7GiWc"] a[aria-label*="Website"]')
        for we in welems[:3]:
            try:
                href = we.get_attribute("href") or ""
                al = we.get_attribute("aria-label") or ""
                if href and href != "#":
                    result["website"] = href
                    break
                um = re.search(r'(https?://[^\s]+)', al)
                if um:
                    result["website"] = um.group(1)
                    break
            except Exception:
                pass
    except Exception:
        pass

    # Full address
    try:
        addr_elems = page.query_selector_all('div[class*="fxhuln"], address, div[class*="CsD6Ee"] span, div[class*="x7GiWc"] div:nth-child(2)')
        for ae in addr_elems[:3]:
            try:
                txt = ae.inner_text().strip()
                if len(txt) > 5:
                    result["full_address"] = txt[:200]
                    break
            except Exception:
                pass
    except Exception:
        pass

    # Hours
    try:
        for he in page.query_selector_all('div[class*="UY7F9"] span, div[class*="NWlQo"], div[class*="yi0A3d"]')[:3]:
            try:
                txt = he.inner_text().strip()
                if txt and len(txt) > 3:
                    result["hours"] = txt[:100]
                    break
            except Exception:
                pass
    except Exception:
        pass

    # Review count from page
    try:
        pt = page.inner_text()
        for pat in [r'(\d[\d,]+)\s*(?:[Rr]eviews?|reviews?)', r'(\d[\d,]+)\s*(?:[Rr]eviews?|reviews?)[^.]']:
            m = re.search(pat, pt)
            if m:
                try:
                    result["review_count"] = int(m.group(1).replace(",", ""))
                    break
                except ValueError:
                    pass
    except Exception:
        pass

    # Individual reviews (up to 25)
    try:
        for re_elem in page.query_selector_all('div[class*="review"], div[class*="d1rvyi"], div[class*="d1VuK"], div[class*="reviewBody"]')[:25]:
            try:
                txt = re_elem.inner_text().strip()
                if txt and len(txt) > 10:
                    lines = txt.split('\n')
                    longest = max(lines, key=len) if lines else txt
                    if len(longest) > 15:
                        result["reviews"].append(longest[:300])
            except Exception:
                pass
    except Exception:
        pass

    # Photo count
    try:
        for pe in page.query_selector_all('div[class*="S1QDvd"], div[class*="photo-count"], span[class*="photo"], div[class*="x7GiWc"] span:last-child')[:3]:
            try:
                txt = pe.inner_text().strip()
                ph_m = re.search(r'(\d[\d,]*)', txt)
                if ph_m:
                    result["photo_count"] = int(ph_m.group(1).replace(",", ""))
                    break
            except Exception:
                pass
    except Exception:
        pass

    # Service options
    try:
        seen = set()
        for elem in page.query_selector_all('div[class*="QO6LTe"], div[class*="service"], div[class*="W4Efsd"] span:not([class*="google-symbols"])')[:20]:
            try:
                txt = elem.inner_text().strip()
                if txt and len(txt) > 2 and len(txt) < 100:
                    if txt.lower() not in seen and txt.lower() not in ['open','closed','directions','website','call','message','share','\u00b7','click to see']:
                        seen.add(txt.lower())
                        result["service_options"].append(txt)
            except Exception:
                pass
    except Exception:
        pass

    # Attributes
    try:
        for elem in page.query_selector_all('div[class*="h9RwJc"], span[class*="QvzQ8d"], div[class*="attribute"] span')[:15]:
            try:
                txt = elem.inner_text().strip()
                if txt and len(txt) > 3 and len(txt) < 80 and txt not in result["attributes"]:
                    result["attributes"].append(txt)
            except Exception:
                pass
    except Exception:
        pass

    # About
    try:
        for ae in page.query_selector_all('div[class*="about"], div[class*="W5zEO"], div[class*="yi0A3d"], div[class*="fxhuln"] + div')[:3]:
            try:
                txt = ae.inner_text().strip()
                if len(txt) > 30:
                    result["about"] = txt[:500]
                    break
            except Exception:
                pass
    except Exception:
        pass

    # Engagement score
    eng = 0
    rc = result["review_count"]
    if rc >= 500: eng += 25
    elif rc >= 200: eng += 20
    elif rc >= 100: eng += 15
    elif rc >= 50: eng += 10
    elif rc >= 20: eng += 5
    if result["phone"]: eng += 10
    if result["website"]: eng += 5
    if result["photo_count"] >= 20: eng += 10
    elif result["photo_count"] >= 5: eng += 5
    if result["hours"]: eng += 3
    if result["about"] and len(result["about"]) > 50: eng += 3
    result["gbp_engagement_score"] = min(eng, 50)

    return result


# ============================================================================
# LEAD SCORING
# ============================================================================

def calculate_lead_score(business: dict) -> int:
    score = 0
    rating = business.get("rating") or 0
    if rating >= 4.7: score += 20
    elif rating >= 4.5: score += 18
    elif rating >= 4.0: score += 14
    elif rating >= 3.5: score += 8

    reviews = business.get("review_count") or 0
    if reviews >= 300: score += 25
    elif reviews >= 200: score += 22
    elif reviews >= 100: score += 18
    elif reviews >= 50: score += 14
    elif reviews >= 20: score += 10

    ws = business.get("website_status") or "no_website"
    if ws == "no_website": score += 25
    elif ws == "bad_website": score += 20
    elif ws == "weak_website": score += 12
    else: score += 3

    if business.get("phone"): score += 10
    gbp_eng = business.get("gbp_engagement_score") or 0
    score += gbp_eng
    return min(score, 100)


# ============================================================================
# MAIN: scrape search cards + click into qualified leads for full details
# ============================================================================

def scrape_with_gbp_click(query: str, max_results: int = 50,
                           min_rating: float = 3.5, min_reviews: int = 20,
                           do_gbp_click: bool = True, gbp_click_delay: float = 1.0):
    """
    Scrape Google Maps search cards, then click into qualified leads
    to get full details (phone, website, hours, etc.).
    """
    qualified = []
    all_businesses = []

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
            # --- Step 1: Search ---
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            print(f"Navigating to: {search_url}")
            page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
            time.sleep(3)

            # Scroll to load results
            last_height = page.evaluate("document.body.scrollHeight")
            for _ in range(20):
                page.mouse.wheel(0, 5000)
                time.sleep(1.2)
                new_height = page.evaluate("document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            print("Extracting search cards...")
            cards = page.query_selector_all(
                'div[jsaction*="hovercard"], div[role="article"], '\
                '[data-item-id], a.hfpxzc'
            )
            # Filter to actual business cards — only use card-level selectors,
            # never a.hfpxzc (some cards ARE the anchor, so query_selector("a.hfpxzc") on them returns None)
            business_cards = []
            for c in cards:
                is_card = False
                # Check if this element has card-like structure via any child anchor
                child_anchor = c.query_selector("a.hfpxzc")
                if child_anchor:
                    name = (child_anchor.get_attribute("aria-label") or "").strip()
                    if name and "Google" not in name and "Maps" not in name:
                        is_card = True
                if not is_card and hasattr(c, "inner_text"):
                    txt = c.inner_text()
                    if "Sponsored" not in txt and "Google" not in txt:
                        if any(term in txt.lower() for term in ["dentist", "doctor", "dr ", "clinic", "spa", "office", "studio"]):
                            is_card = True
                if is_card:
                    business_cards.append(c)
            
            print(f"Found {len(business_cards)} business cards")

            for i, card in enumerate(business_cards[:max_results * 2]):
                try:
                    business = extract_search_card(card)
                    if not business:
                        continue

                    all_businesses.append(business)

                    # Score ALL businesses (not just qualified)
                    score = calculate_lead_score(business)
                    business["lead_score"] = score
                    business["outreach_status"] = "new"
                    business["scraped_at"] = datetime.utcnow().isoformat() + "Z"
                    business["id"] = str(uuid.uuid4())

                    # Check if qualified
                    if (business["rating"] >= min_rating
                            and business["review_count"] >= min_reviews
                            and business["website_status"] in ("no_website", "bad_website")):

                        qualified.append(business)
                        print(f"  QUALIFIED (pre-GBP): {business['business_name'][:50]} — "
                              f"⭐{business['rating']} ({business['review_count']} reviews), "
                              f"score={score}")

                except Exception as e:
                    print(f"  Card {i} error: {e}")
                    continue

                time.sleep(0.1)

            # --- Pass 2: GBP detail click for qualified leads ---
            if do_gbp_click and qualified:
                print(f"\nPass 2: GBP detail click for {len(qualified)} qualified leads...")

                for idx, business in enumerate(qualified):
                    gbp_url = business.get("google_maps_url", "")
                    if not gbp_url:
                        continue

                    print(f"  [{idx+1}/{len(qualified)}] Clicking into: {business['business_name'][:50]}...")
                    try:
                        page.goto(gbp_url, timeout=30000, wait_until="domcontentloaded")
                        time.sleep(gbp_click_delay + 2)

                        detail = extract_gbp_detail(page, gbp_url)
                        business.update(detail)

                        new_score = calculate_lead_score(business)
                        business["lead_score"] = new_score

                        print(f"    → phone={business.get('phone') or 'no'} | "
                              f"website={business.get('website') or 'none'} | "
                              f"score={new_score}")

                    except Exception as e:
                        print(f"    Error: {e}")

                    time.sleep(0.5)

        except Exception as e:
            print(f"Error during scrape: {e}")

        finally:
            browser.close()

    print(f"\nResults: {len(qualified)} qualified from {len(all_businesses)} businesses")
    return {"qualified": qualified, "all": all_businesses}


# ============================================================================
# PUSH TO DASHBOARD
# ============================================================================

def push_to_dashboard(leads, query="unknown"):
    """Push leads to agency.json."""
    if not DB_PATH.exists():
        db = {"leads": [], "scrape_runs": [], "automations_catalog": [],
              "outreach": [], "clients": [], "client_automations": [],
              "orchestrator_reports": [], "daily_metrics": []}
    else:
        db = json.loads(DB_PATH.read_text())

    # Dedup by composite key: business_name + address (avoid dupes with different suffixes)
    existing = set()
    for l in db.get("leads", []):
        key = f'{l.get("business_name","").lower().strip()}|{l.get("address","").lower().strip()}'
        existing.add(key)

    pushed = 0
    now = datetime.now(timezone.utc).isoformat()

    for lead in leads:
        name = (lead.get("business_name") or "").strip()
        if not name:
            continue

        addr = lead.get("address", "") or lead.get("full_address", "")
        key = f'{name.lower()}|{addr.lower().strip()}'

        row = {
            "id": lead.get("id", str(uuid.uuid4())),
            "business_name": name,
            "address": lead.get("full_address") or lead.get("address", ""),
            "phone": lead.get("phone", ""),
            "rating": lead.get("rating", 0),
            "review_count": lead.get("review_count", 0),
            "website": lead.get("website", ""),
            "website_status": lead.get("website_status", "no_website"),
            "category": lead.get("category", ""),
            "google_maps_url": lead.get("google_maps_url", ""),
            "source": "google",
            "sources": "google",
            "overall_score": lead.get("lead_score", 0),
            "outreach_status": "new",
            "scraped_at": lead.get("scraped_at", now),
            "created_at": now,
            "updated_at": now,
            "last_seen": now,
            "gbp_phone": lead.get("phone", ""),
            "gbp_address": lead.get("full_address", ""),
            "gbp_website": lead.get("website", ""),
            "gbp_hours": lead.get("hours", ""),
            "gbp_reviews": lead.get("reviews", []),
            "gbp_photos": lead.get("photo_count"),
            "gbp_services": lead.get("service_options", []),
            "gbp_attributes": lead.get("attributes", []),
            "gbp_about": lead.get("about", ""),
            "city": "",
            "state": "",
            "map_pin": lead.get("google_maps_url", ""),
            "toll_free": False,
        }

        # Extract city/state from address
        addr = row["address"]
        if addr:
            # Address format from search card: "6010 Washington Ave Ste d"
            # Full address from GBP detail: "6010 Washington Ave Ste d, Houston, TX 77004"
            parts = addr.split(",")
            if len(parts) >= 2:
                city_state = parts[-1].strip()
                m = re.match(r'(.+),\s*([A-Z]{2})\s*\d*', city_state)
                if m:
                    row["city"] = m.group(1).strip()
                    row["state"] = m.group(2).strip()
                else:
                    row["city"] = city_state
            elif len(parts) == 1:
                # Just street address — try to infer from query
                row["city"] = parts[0].strip()

        # Toll-free check
        phone = row["phone"]
        if phone:
            row["toll_free"] = bool(re.search(r'(?:800|888|877|866|855|844|833)', phone))
        db["leads"].append(row)
        existing.add(key)
        pushed += 1
        print(f"  Pushed: {name} | ⭐{row['rating']} | {row['review_count']} reviews | "
              f"score={row['overall_score']} | phone={row['phone'] or 'no'} | "
              f"website={row['website'] or 'none'}")

    db["scrape_runs"].append({
        "id": f"scrape_{now}",
        "source": "google",
        "query": query,
        "status": "done",
        "leads_found": pushed,
        "qualified_found": pushed,
        "started_at": now,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "created_at": now,
    })

    DB_PATH.write_text(json.dumps(db, indent=2))
    print(f"\nTotal pushed: {pushed} | Total in DB: {len(db['leads'])}")
    return pushed


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", default="dentists in Houston, TX")
    parser.add_argument("--max-results", type=int, default=50)
    parser.add_argument("--min-rating", type=float, default=3.5)
    parser.add_argument("--min-reviews", type=int, default=20)
    parser.add_argument("--no-gbp-click", action="store_true", default=False)
    args = parser.parse_args()

    print("=" * 60)
    print(f"Google Maps Scraper + GBP Detail Click")
    print(f"Query: {args.query}")
    print(f"Max results: {args.max_results}")
    print(f"Filters: rating >= {args.min_rating}, reviews >= {args.min_reviews}")
    print(f"GBP detail click: {'YES' if not args.no_gbp_click else 'NO'}")
    print("=" * 60)

    result = scrape_with_gbp_click(
        query=args.query,
        max_results=args.max_results,
        min_rating=args.min_rating,
        min_reviews=args.min_reviews,
        do_gbp_click=not args.no_gbp_click,
    )

    if result["qualified"]:
        push_to_dashboard(result["qualified"], query=args.query)
        print(f"\nDone. {len(result['qualified'])} leads pushed to dashboard.")
    else:
        print("\nNo qualified leads found.")
