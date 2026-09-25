#!/usr/bin/env python3
"""
Lead Enrichment Pipeline — lean version.
For each lead: WHOIS domains, fetch website (if any), generate email patterns,
check social URL patterns (Playwright-verify-able later).
Outputs enriched lead data to agency.json.
"""

import sys
import json
import re
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

# python-whois (installed)
import whois

# Try to import urllib — if missing, fetch_website will bail gracefully
try:
    import urllib.request
    HAS_URLLIB = True
except ImportError:
    HAS_URLLIB = False

PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DB_PATH = PROJECT_ROOT / "agency.json"

def generate_domains(name: str) -> list[str]:
    """Generate candidate domains from business name."""
    clean = name.lower()
    for s in [" inc", " llc", " ltd", " lp", " co", " group", " agency",
              " associates", " dentistry", " dental", " clinic", " clinics",
              " care", " medical", " health", " aesthetics", " medspa", " spa",
              " services", " solutions", " & ", " and "]:
        clean = clean.replace(s, "")
    clean = clean.replace("  ", " ").strip().replace(" ", "")
    base = clean[:60]  # sanity limit
    domains = []
    for tld in [".com", ".net", ".co", ".us"]:
        domains.append(f"{base}{tld}")
    # Also try with hyphens for multi-word names
    hyphenated = re.sub(r'[^a-z0-9]+', '-', clean)
    if hyphenated != base:
        domains.append(f"{hyphenated}.com")
    # Deduplicate
    return list(dict.fromkeys(domains))

def whois_domain(domain: str) -> dict:
    """WHOIS lookup for a domain. 5-second timeout."""
    info = {"domain": domain, "registered": False,
            "registrar": None, "creation_date": None,
            "email": None, "status": "unknown", "error": None}
    try:
        # python-whois v0.7.27+: use whois.whois(), not whois.query()
        # Wrap in socket timeout to avoid hanging on unreachable servers
        import socket
        old_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(5)
        try:
            w = whois.whois(domain)
        finally:
            socket.setdefaulttimeout(old_timeout)
        if w is None:
            info["error"] = "whois returned None"
            return info
        info["registered"] = True
        info["registrar"] = getattr(w, "registrar", None)
        raw_dates = getattr(w, "creation_date", None)
        if raw_dates:
            if not isinstance(raw_dates, list):
                raw_dates = [raw_dates]
            info["creation_date"] = str(raw_dates[0])[:19] if raw_dates else None
        # registrant emails
        reg_email = getattr(w, "registrant_email", None)
        admin_email = getattr(w, "admin_email", None)
        tech_email = getattr(w, "tech_email", None)
        emails = []
        for e in [reg_email, admin_email, tech_email]:
            if e:
                if isinstance(e, list):
                    emails.extend(e)
                else:
                    emails.append(e)
        if emails:
            for e in emails:
                if isinstance(e, str) and len(e) > 5 and "@" in e:
                    info["email"] = e
                    break
        info["status"] = getattr(w, "status", info.get("status", "unknown"))
    except Exception as e:
        err_text = str(e)
        if "No match for" in err_text or "not found" in err_text.lower() or "available" in err_text.lower():
            info["status"] = "available"
            info["error"] = None
        else:
            info["error"] = err_text
    return info



def fetch_website(url: str) -> dict:
    """Fetch a URL with urllib and extract emails, phones, title.
    Checks connectivity first — if urllib import failed or network is down,
    returns a not-fetched result without raising."""
    result = {"url": url, "fetched": False, "status": None,
              "title": "", "emails": [], "phones": [], "text": ""}
    if not HAS_URLLIB:
        result["error"] = "urllib not available"
        return result
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        with urllib.request.urlopen(req, timeout=5) as resp:
            result["status"] = resp.status
            html = resp.read().decode("utf-8", errors="ignore")
            result["fetched"] = True
            # title
            m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
            if m:
                result["title"] = m.group(1).strip()[:200]
            # emails
            result["emails"] = list(dict.fromkeys(
                re.findall(r'[\w.+-]+@[\w.-]+\.\w+', html)
            ))[:10]
            # phone numbers (US pattern)
            result["phones"] = list(dict.fromkeys(
                re.findall(r'(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', html)
            ))[:5]
            # visible text
            txt = re.sub(r'<[^>]+>', ' ', html)
            txt = re.sub(r'\s+', ' ', txt).strip()
            result["text"] = txt[:5000]
    except Exception as e:
        result["error"] = str(e)[:200]
    return result

def generate_email_patterns(name: str, domains: list[str]) -> list[str]:
    """Generate email address patterns for a business with no known email."""
    patterns = set()
    parts = name.lower().replace("-", " ").replace("&", " ").split()
    # Clean up common suffixes
    parts = [p for p in parts if p not in ("the", "a", "an", "of", "for", "and", "&", "inc", "llc", "ltd", "care", "health", "group")]
    if not parts:
        return []
    first = parts[0]
    last = parts[-1]

    domain_list = domains[:3] if domains else [f"{name.lower().replace(' ', '').replace('-', '')}.com"]

    for domain in domain_list:
        d = domain.replace("www.", "").split("/")[0].lower()
        for tld_part in [d, d.replace("www.", "")]:
            # Common patterns
            patterns.add(f"info@{tld_part}")
            patterns.add(f"contact@{tld_part}")
            patterns.add(f"hello@{tld_part}")
            patterns.add(f"office@{tld_part}")
            patterns.add(f"admin@{tld_part}")
            patterns.add(f"{first}@{tld_part}")
            patterns.add(f"{last}@{tld_part}")
            patterns.add(f"{first[0]}.{last}@{tld_part}")
            patterns.add(f"{first}.{last}@{tld_part}")
            patterns.add(f"{first}{last}@{tld_part}")
            if len(parts) >= 2:
                patterns.add(f"{parts[0]}.{parts[1]}@{tld_part}")
    return list(patterns)[:30]

def enrich_lead(lead: dict) -> dict:
    """Enrich a single lead."""
    name = lead.get("business_name", "")
    website = lead.get("website", "") or ""
    website_status = lead.get("website_status", "no_website")
    phone = lead.get("phone", "") or ""
    gbp_url = lead.get("google_maps_url", "") or ""

    enriched = dict(lead)
    enriched["enriched_at"] = datetime.now(timezone.utc).isoformat()
    enriched["enrichment"] = {}
    enriched["contact_methods"] = []
    enriched["email"] = lead.get("email", "")
    enriched["email_guess"] = lead.get("email_guess", "")

    # Generate candidate domains
    domains = generate_domains(name)
    enriched["enrichment"]["candidate_domains"] = domains[:8]

    # WHOIS on top 3 domains
    whois_results = []
    whois_email = None
    for d in domains[:2]:
        w = whois_domain(d)
        whois_results.append(w)
        if w.get("email"):
            whois_email = w["email"]
            enriched["enrichment"]["whois_email"] = whois_email
            enriched["email"] = whois_email
            break
    enriched["enrichment"]["whois"] = whois_results

    # Website fetch if website exists
    site_data = None
    if website and website.startswith(("http", "www")):
        site_data = fetch_website(website)
        enriched["enrichment"]["website_data"] = site_data
        if site_data.get("emails"):
            enriched["email"] = site_data["emails"][0]
            enriched["enrichment"]["website_email"] = site_data["emails"][0]
        if site_data.get("phones"):
            enriched["enrichment"]["website_phones"] = site_data["phones"]

    # Social media URL patterns (not verified — just patterns)
    social = {}
    base = name.lower().replace(" ", "-").replace("&", "and").replace("'", "")
    social["facebook"] = f"https://www.facebook.com/{base}"
    social["instagram"] = f"https://www.instagram.com/{base}"
    social["linkedin"] = f"https://www.linkedin.com/company/{base}"
    social["yelp"] = f"https://www.yelp.com/biz/{base}-houston-tx" if "houston" in str(lead.get("address", "")).lower() else f"https://www.yelp.com/biz/{base}"
    enriched["enrichment"]["social_urls"] = social

    # Email patterns for no-website businesses
    if not website or website_status == "no_website":
        patterns = generate_email_patterns(name, domains)
        enriched["enrichment"]["email_patterns"] = patterns[:20]
        enriched["email_guess"] = patterns[0] if patterns else ""
        enriched["enrichment"]["email_method"] = "pattern_guess"

    # If WHOIS found an email, prefer that
    if whois_email:
        enriched["email"] = whois_email
        enriched["enrichment"]["email_method"] = "whois"

    # If website had emails, prefer that
    if site_data and site_data.get("emails"):
        enriched["email"] = site_data["emails"][0]
        enriched["enrichment"]["email_method"] = "website"

    # Contact methods
    methods = []
    if enriched.get("email") and enriched.get("email_method") != "pattern_guess":
        methods.append("email")
    if enriched.get("email") or enriched.get("email_guess"):
        methods.append("email_guess")
    if phone:
        methods.append("phone")
    methods.append("gbp_message")
    enriched["contact_methods"] = methods
    enriched["primary_contact"] = methods[0] if methods else "gbp_message"

    return enriched

def enrich_all():
    if not DB_PATH.exists():
        print("No agency.json found.")
        return
    db = json.loads(DB_PATH.read_text())
    leads = db.get("leads", [])
    if not leads:
        print("No leads.")
        return
    print(f"Enriching {len(leads)} leads...")
    for i, lead in enumerate(leads):
        print(f"[{i+1}/{len(leads)}] {lead.get('business_name', '?')}...", end=" ")
        enriched = enrich_lead(lead)
        # Update lead fields
        for k in ("email", "email_guess", "contact_methods", "primary_contact",
                  "enrichment", "enriched_at"):
            lead[k] = enriched.get(k)
        # Keep top-level identity fields
        lead["enrichment"] = enriched.get("enrichment", {})
        print(f"contact={enriched.get('primary_contact', '?')} | email={enriched.get('email', '') or '—'} | patterns={len(enriched.get('enrichment', {}).get('email_patterns', []))}")
        time.sleep(0.05)  # pace WHOIS calls

    db["leads"] = leads
    DB_PATH.write_text(json.dumps(db, indent=2))
    print(f"\nDone. {len(leads)} leads enriched.")

if __name__ == "__main__":
    enrich_all()
