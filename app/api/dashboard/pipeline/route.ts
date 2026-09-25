import { NextResponse } from "next/server";
import { getLeads, upsertLead, getLeadsGroupedByStage } from "@/lib/db/queries";

export async function GET() {
  const leads = getLeads();
  const grouped = getLeadsGroupedByStage();

  // Enrich each lead with computed fields for the pipeline view
  const pipeline = leads.map((lead) => {
    const stage = lead.stage || lead.outreach_status || "new";
    const score = lead.score || lead.overall_score || 0;
    const email = lead.email || "";
    const emailGuess = lead.email_guess || "";
    const phone = lead.phone || "";
    const contactMethods = lead.contact_methods || [];
    const primaryContact = lead.primary_contact || "gbp_message";
    const enrichment = lead.enrichment || {};
    const emailPatterns = enrichment.email_patterns || [];
    const socialUrls = enrichment.social_urls || {};

    return {
      id: lead.id,
      business_name: lead.business_name || "?",
      address: lead.address || "",
      city: lead.city || "",
      state: lead.state || "",
      category: lead.category || "",
      score,
      rating: lead.rating || 0,
      review_count: lead.review_count || 0,
      website: lead.website || "",
      website_status: lead.website_status || "no_website",
      stage,
      phone,
      email,
      email_guess: emailGuess,
      email_patterns: emailPatterns,
      social_urls: socialUrls,
      contact_methods: contactMethods,
      primary_contact: primaryContact,
      gbp_url: lead.google_maps_url || "",
      gbp_phone: lead.gbp_phone || "",
      gbp_hours: lead.gbp_hours || "",
      gbp_services: lead.gbp_services || [],
      gbp_about: lead.gbp_about || "",
      scraped_at: lead.scraped_at || "",
      created_at: lead.created_at || "",
    };
  });

  // Sort by score descending within each stage group
  const stageOrder = ["new", "enriched", "contacted", "replied", "booked", "won", "lost", "nurture"];
  pipeline.sort((a, b) => {
    const ai = stageOrder.indexOf(a.stage);
    const bi = stageOrder.indexOf(b.stage);
    if (ai !== bi) return ai - bi;
    return (b.score || 0) - (a.score || 0);
  });

  // Build stats
  const stats = {
    total: pipeline.length,
    byStage: grouped.reduce((acc, g) => {
      acc[g.stage] = g.count;
      return acc;
    }, {} as Record<string, number>),
    readyToContact: pipeline.filter(
      (l) => l.stage === "new" && (l.phone || l.email || l.email_guess || l.gbp_url)
    ).length,
    needEnrichment: pipeline.filter((l) => l.stage === "new" && !l.email && !l.email_guess).length,
    topScore: Math.max(...pipeline.map((l) => l.score), 0),
    avgScore:
      pipeline.length > 0
        ? Math.round(pipeline.reduce((s, l) => s + l.score, 0) / pipeline.length)
        : 0,
  };

  return NextResponse.json({ pipeline, grouped, stats });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const lead = getLeads().find((l: any) => l.id === body.id);
  if (!lead) {
    return NextResponse.json({ error: "lead not found" }, { status: 404 });
  }

  const allowedStages = ["new", "enriched", "contacted", "replied", "booked", "won", "lost", "nurture"];
  const newStage = body.stage;
  if (!newStage || !allowedStages.includes(newStage)) {
    return NextResponse.json({ error: `stage must be one of: ${allowedStages.join(", ")}` }, { status: 400 });
  }

  // Update the lead's stage
  upsertLead({
    ...lead,
    stage: newStage,
    outreach_status: newStage,
    updated_at: new Date().toISOString(),
    last_contacted_at: body.last_contacted_at || lead.last_contacted_at,
    last_contact_method: body.last_contact_method || lead.last_contact_method,
    notes: body.notes !== undefined ? (lead.notes || "") + (body.notes || "") : lead.notes,
  });

  // Also log to outreach table if a message was sent
  if (body.action === "email" || body.action === "phone" || body.action === "gbp_message") {
    const { getDb } = await import("@/lib/db/client");
    const db = getDb();
    if (!db.outreach) db.outreach = [];
    db.outreach.push({
      id: `out_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      lead_id: body.id,
      channel: body.action,
      subject: body.subject || "",
      body: body.message || "",
      status: "sent",
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    // Write back
    const { writeFileSync } = await import("fs");
    const { DB_PATH } = await import("@/lib/db/client").then((m: any) => ({ DB_PATH: m.DB_PATH }));
    if (DB_PATH) {
      const { writeFileSync: wf } = await import("fs");
      wf(DB_PATH, JSON.stringify(db, null, 2));
    }
  }

  return NextResponse.json({ success: true, stage: newStage });
}
