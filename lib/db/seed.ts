#!/usr/bin/env -S npx tsx
/**
 * Seed the automation catalog (UPSERT — safe to run any number of times).
 *
 * Usage: npm run agency:seed
 */
import { getDb } from "@/lib/db/client";

async function main() {
  // initDb() is a no-op now (auto-init on first getDb), but kept for explicit intent.
  const db = getDb();

  const rows = [
    {
      id: "gbp-automation",
      name: "Google Business Profile Automation",
      description: "Review monitoring, AI review response drafts, auto-post scheduling, GBP lead capture → CRM. Built for the 'reviews but no website' businesses.",
      target_industries: "Home services, dentists, clinics, salons, restaurants, local retail",
      product_type: "subscription",
      price_setup: 497,
      price_monthly: 149,
      sellable: "yes",
      demo_url: "",
      build_status: "ready",
      mrr_potential: 149,
      notes: "Primary offer for scraped leads. Natural upsell into website build.",
    },
    {
      id: "lead-pipeline-automation",
      name: "Lead Capture → CRM → Follow-up Pipeline",
      description: "Inbound lead (form, GBP, directory) → enrichment → CRM entry → SMS/email sequence → booking. Keeps the pipeline moving so no lead goes cold.",
      target_industries: "B2B services, trades, consultants, clinics, real estate",
      product_type: "subscription",
      price_setup: 597,
      price_monthly: 199,
      sellable: "yes",
      demo_url: "",
      build_status: "ready",
      mrr_potential: 199,
      notes: "Highest willingness-to-pay when tied to a real lead source the client already has.",
    },
    {
      id: "reputation-monitoring",
      name: "Reputation Monitoring & Alert",
      description: "Monitor reviews across Google + industry sites + social. Flag negative reviews fast. Suggest AI responses for approval. Monthly monitoring fee.",
      target_industries: "Any business with reviews: hospitality, medical, legal, trades",
      product_type: "subscription",
      price_setup: 297,
      price_monthly: 99,
      sellable: "yes",
      demo_url: "",
      build_status: "ready",
      mrr_potential: 99,
      notes: "Easier entry product. Can bundle with GBP automation.",
    },
    {
      id: "social-content-pipeline",
      name: "Social Content Pipeline",
      description: "Take the business's offerings → generate social posts → schedule → report performance. Content + reporting on a monthly cadence.",
      target_industries: "Brands, agencies, coaches, local businesses building presence",
      product_type: "subscription",
      price_setup: 397,
      price_monthly: 129,
      sellable: "pending",
      demo_url: "",
      build_status: "in_progress",
      mrr_potential: 129,
      notes: "Pending — validate with 1-2 pilot clients before selling broadly.",
    },
    {
      id: "appointment-booking-automation",
      name: "Appointment Booking Automation",
      description: "Inquiry → schedule → confirm → remind → re-engage missed appointments. For clinics, salons, consultants, contractors.",
      target_industries: "Clinics, salons, consultants, contractors, tutors",
      product_type: "subscription",
      price_setup: 447,
      price_monthly: 149,
      sellable: "pending",
      demo_url: "",
      build_status: "idea",
      mrr_potential: 149,
      notes: "Idea stage. Build after GBP automation is selling.",
    },
    {
      id: "internal-ops-automation",
      name: "Internal Ops Automation",
      description: "Invoice capture → data entry → accounting handoff. Report generation. Inventory sync. Continuous ops work the business does manually.",
      target_industries: "Trades, small retail, clinics, professional services",
      product_type: "subscription",
      price_setup: 797,
      price_monthly: 249,
      sellable: "pending",
      demo_url: "",
      build_status: "idea",
      mrr_potential: 249,
      notes: "Higher price, higher touch. Build on demand for a pilot client first.",
    },
  ];

  const catalog = db.automations_catalog as any[];
  for (const row of rows) {
    const existing = catalog.find((c) => c.id === row.id);
    if (existing) {
      Object.assign(existing, row as any);
    } else {
      catalog.push(row as any);
    }
  }

  console.log(`[agency-seed] catalog seeded: ${rows.length} automations`);
}

main().catch((err) => {
  console.error("[agency-seed] failed:", err);
  process.exit(1);
});
