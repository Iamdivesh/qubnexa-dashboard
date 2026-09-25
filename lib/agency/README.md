# QubNexa Agency — Scraper Pipeline

Multi-source lead scraper that feeds the agency dashboard.

## Sources

- **Google Maps** — primary source, businesses with reviews but no/bad website
- **Bing Places** — secondary source, same pattern
- **Yelp** — tertiary source, different review culture
- **GBP Deep-Dive** — visits each business's full Google Business Profile page for:
  - Review response rate
  - Photo count
  - Post count
  - Business hours
  - Services listed
  - Engagement score

## Setup

1. Install Playwright:
```bash
pip install playwright
python -m playwright install chromium
```

2. Run a manual scrape:
```bash
npm run agency:scrape "dentists in Houston, TX" "google,gbpp_deep" 50
```

3. Push results to dashboard DB:
```bash
npm run agency:push-leads "dentists in Houston, TX" "google,gbpp_deep" 50
```

## n8n Integration

The scraper can POST results directly to an n8n webhook:
```bash
python lib/agency/scrapers/multi_source_scraper.py \
  --query "dentists in Houston, TX" \
  --sources google bing yelp gbpp_deep \
  --max-results 200 \
  --webhook http://localhost:5678/webhook/multi-source-leads \
  --gbpp-deep-dive
```

See `lib/agency/n8n_workflow_spec.md` for the n8n workflow setup.

## Docker

Build and run the scraper as a container:
```bash
docker build -f Dockerfile.scraper -t qubnexa/scraper .
docker run -d --name qubnexa-scraper --network host -v $(pwd)/lib/agency/scrapers:/app qubnexa/scraper \
  python multi_source_scraper.py --query "dentists in Houston, TX" --sources google bing yelp gbpp_deep --max-results 200 --webhook http://localhost:5678/webhook/multi-source-leads --gbpp-deep-dive
```

## Files

- `lib/agency/scrapers/multi_source_scraper.py` — main scraper (960 lines)
- `lib/agency/scrapers/test_scraper.py` — quick test runner
- `lib/agency/push_leads.py` — push scraped leads to dashboard DB
- `lib/agency/n8n_workflow_spec.md` — n8n workflow spec
- `Dockerfile.scraper` — Docker image for the scraper
