export type LeadStage = "new" | "enriched" | "contacted" | "replied" | "booked" | "won" | "lost" | "nurture";
export type OutreachStatus = "sent" | "replied" | "booked" | "no_reply" | "bounced";
export type ClientStatus = "trial" | "active" | "at_risk" | "churned";
export type AutomationBuildStatus = "idea" | "in_progress" | "ready" | "selling" | "archived";
export type ScrapeStatus = "queued" | "running" | "done" | "error";

export interface Lead {
  id: string;
  business_name: string;
  website: string | null;
  domain_status: string;
  phone: string | null;
  email_guess: string | null;
  industry: string | null;
  region: string | null;
  review_count: number;
  rating: number | null;
  source: string;
  scraped_at: string | null;
  enriched_at: string | null;
  score: number;
  stage: LeadStage;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Outreach {
  id: string;
  lead_id: string;
  channel: string;
  template: string | null;
  subject: string | null;
  body: string | null;
  sent_at: string | null;
  reply_detected: number;
  reply_at: string | null;
  reply_text: string | null;
  call_booked: number;
  call_at: string | null;
  status: OutreachStatus;
  next_followup_at: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  industry: string | null;
  region: string | null;
  deal_value: number;
  mrr: number;
  status: ClientStatus;
  started_at: string | null;
  next_billing_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrchestratorSnapshot {
  mrr: number;
  active_clients: number;
  trial_clients: number;
  at_risk_clients: number;
  churned_clients: number;
  new_leads_today: number;
  new_leads_top5: Lead[];
  outreach_today: { sent: number; replied: number; booked: number };
  outreach_total: { total_sent: number; total_replied: number; total_booked: number };
  leads_needing_outreach: Lead[];
  leads_with_unread_reply: Lead[];
  leads_booked_no_time: Lead[];
  client_automation_failures: { client_name: string; automation_name: string; last_run: string | null; last_status: string | null }[];
  at_risk_client_list: Client[];
  unsold_ready_automations: { name: string; mrr_potential: number | null; demo_url: string | null }[];
  scrape_overdue: { region: string; status: ScrapeStatus; finished_at: string | null }[];
  mrr_close_today: number;
  mrr_churn_today: number;
}

// Rule config — edit these to tune the orchestrator.
export const RULES = {
  /** Lead score threshold to flag for outreach. */
  OUTREACH_SCORE_MIN: 70,
  /** How many days since a scrape region last ran before flagging overdue. */
  SCRAPE_OVERDUE_DAYS: 7,
  /** Default morning report hour in user's timezone (UTC offset). */
  REPORT_HOUR_UTC_OFFSET: 5.5, // IST
};

/** Build the orchestrator's read of the db for today's report. */
export async function buildSnapshot(): Promise<OrchestratorSnapshot> {
  // All reads go through the same better-sqlite3 synchronous API — kept async
  // so the route layer can be async-ready if we swap the DB later.
  const us = await import("@/lib/db/queries");

  const mrr = (await us.getMrrTotals()) as any;
  const metrics = (await us.getDailyMetrics(1)) as any[];
  const todayMetric = metrics.find((m) => m.date === new Date().toISOString().slice(0, 10)) || {};

  const leads = (await us.getLeads()) as Lead[];
  const today = new Date().toISOString().slice(0, 10);
  const newLeads = leads.filter((l) => l.created_at && l.created_at.slice(0, 10) === today);
  const newLeadsTop5 = newLeads
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const outreachToday = (await us.getOutreachToday()) as any;
  const outreachTotal = (await us.getOutreachTotals()) as any;

  const leadsNeedingOutreach = leads
    .filter((l) => l.stage === "new" && l.score >= RULES.OUTREACH_SCORE_MIN)
    .slice(0, 10);

  const leadsWithUnreadReply = leads.filter(
    (l) => l.stage === "replied" || l.stage === "booked"
  );

  const leadsBookedNoTime = leads.filter((l) => l.stage === "booked");

  const caHealth = (await us.getClientAutomationHealth()) as any[];
  const clientAutoFailures = caHealth
    .filter((c) => c.last_status === "error" || c.status === "failed")
    .map((c) => ({
      client_name: c.client_name,
      automation_name: c.automation_name,
      last_run: c.last_run,
      last_status: c.last_status,
    }));

  const clients = (await us.getClients()) as Client[];
  const atRiskClients = clients.filter((c) => c.status === "at_risk");

  const unsoldReady = (await us.getUnsoldReadyAutomations()) as any[];

  const scrapes = (await us.getScrapeRunStatus()) as any[];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RULES.SCRAPE_OVERDUE_DAYS);
  const scrapeOverdue = scrapes
    .filter((s) => s.status === "done" && (!s.finished_at || new Date(s.finished_at) < cutoff))
    .map((s) => ({ region: s.region, status: s.status as ScrapeStatus, finished_at: s.finished_at }));

  return {
    mrr: mrr.total_mrr || 0,
    active_clients: mrr.active_clients || 0,
    trial_clients: mrr.trial_clients || 0,
    at_risk_clients: mrr.at_risk_clients || 0,
    churned_clients: mrr.churned_clients || 0,
    new_leads_today: newLeads.length,
    new_leads_top5: newLeadsTop5,
    outreach_today: {
      sent: outreachToday.sent || 0,
      replied: outreachToday.replied || 0,
      booked: outreachToday.booked || 0,
    },
    outreach_total: {
      total_sent: outreachTotal.total_sent || 0,
      total_replied: outreachTotal.total_replied || 0,
      total_booked: outreachTotal.total_booked || 0,
    },
    leads_needing_outreach: leadsNeedingOutreach,
    leads_with_unread_reply: leadsWithUnreadReply,
    leads_booked_no_time: leadsBookedNoTime,
    client_automation_failures: clientAutoFailures,
    at_risk_client_list: atRiskClients,
    unsold_ready_automations: unsoldReady,
    scrape_overdue: scrapeOverdue,
    mrr_close_today: todayMetric.mrr_close || 0,
    mrr_churn_today: todayMetric.mrr_churn || 0,
  };
}

/** Render the snapshot into the morning report text. */
export function renderMorningReport(s: OrchestratorSnapshot, date: string): string {
  const lines: string[] = [];
  lines.push(`## Morning Report — ${date}`);
  lines.push("");
  lines.push(`**MRR:** $${s.mrr.toLocaleString()} / month  ·  **Active clients:** ${s.active_clients}  ·  **Trial:** ${s.trial_clients}  ·  **At-risk:** ${s.at_risk_clients}`);
  if (s.mrr_close_today) lines.push(`**MRR added today:** $${s.mrr_close_today}`);
  if (s.mrr_churn_today) lines.push(`**MRR lost today:** $${s.mrr_churn_today}`);
  lines.push("");

  lines.push(`**New leads today:** ${s.new_leads_today}`);
  if (s.new_leads_top5.length) {
    lines.push("Top by score:");
    for (const l of s.new_leads_top5) {
      lines.push(`- ${l.business_name} (${l.region}) — score ${l.score}, ${l.review_count} reviews, ${l.rating ? l.rating.toFixed(1) : "n/a"}/5, website: ${l.website || "none"}`);
    }
  }
  lines.push("");

  lines.push(`**Outreach today:** sent ${s.outreach_today.sent}, replies ${s.outreach_today.replied}, calls booked ${s.outreach_today.booked}`);
  const replyRate =
    s.outreach_total.total_sent
      ? Math.round((s.outreach_total.total_replied / s.outreach_total.total_sent) * 100)
      : 0;
  lines.push(`**All-time:** sent ${s.outreach_total.total_sent}, replied ${s.outreach_total.total_replied} (${replyRate}%), booked ${s.outreach_total.total_booked}`);
  lines.push("");

  lines.push("**Needs attention:**");
  const needs: string[] = [];

  if (s.leads_needing_outreach.length)
    needs.push(`Start outreach on ${s.leads_needing_outreach.length} high-score new lead(s)`);
  if (s.leads_with_unread_reply.length)
    needs.push(`${s.leads_with_unread_reply.length} lead(s) in replied/booked stage need follow-up`);
  if (s.leads_booked_no_time.length)
    needs.push(`${s.leads_booked_no_time.length} booked call(s) need a confirmed time`);
  for (const f of s.client_automation_failures) {
    needs.push(`Automation failure for ${f.client_name} — ${f.automation_name} (last: ${f.last_status || "no_run"})`);
  }
  for (const c of s.at_risk_client_list) {
    needs.push(`At-risk client: ${c.name} — reach out`);
  }
  for (const a of s.unsold_ready_automations) {
    needs.push(`Ready to sell (no clients yet): ${a.name} — est. $${a.mrr_potential?.toLocaleString() || "?"}/mo`);
  }
  for (const sInfo of s.scrape_overdue) {
    needs.push(`Scrape overdue: ${sInfo.region} (last finished ${sInfo.finished_at || "unknown"})`);
  }

  if (needs.length) {
    for (const n of needs) lines.push(`- ${n}`);
  } else {
    lines.push("- Nothing urgent. Pipeline is moving.");
  }
  lines.push("");

  lines.push("**Unsold ready automations:**");
  if (s.unsold_ready_automations.length) {
    for (const a of s.unsold_ready_automations) {
      lines.push(`- ${a.name} — est. $${a.mrr_potential?.toLocaleString() || "?"}/mo${a.demo_url ? ` (demo: ${a.demo_url})` : ""}`);
    }
  } else {
    lines.push("- None — all ready automations have at least one client.");
  }

  return lines.join("\n");
}

/** Persist today's report and return it. */
export async function writeAndRenderReport(): Promise<{ report: string; date: string }> {
  const snapshot = await buildSnapshot();
  const date = new Date().toISOString().slice(0, 10);

  // Build needs_attention as a concise bullet list.
  const needs: string[] = [];
  if (snapshot.leads_needing_outreach.length)
    needs.push(`${snapshot.leads_needing_outreach.length} high-score lead(s) ready for outreach`);
  if (snapshot.leads_with_unread_reply.length)
    needs.push(`${snapshot.leads_with_unread_reply.length} lead(s) need follow-up`);
  if (snapshot.leads_booked_no_time.length)
    needs.push(`${snapshot.leads_booked_no_time.length} booked call(s) need time confirmation`);
  for (const f of snapshot.client_automation_failures) {
    needs.push(`${f.client_name}: ${f.automation_name} — ${f.last_status || "error"}`);
  }
  for (const c of snapshot.at_risk_client_list) needs.push(`${c.name} — at risk`);
  for (const a of snapshot.unsold_ready_automations) {
    needs.push(`${a.name} — ready to sell, est. $${a.mrr_potential?.toLocaleString() || "?"}/mo`);
  }
  for (const s of snapshot.scrape_overdue) {
    needs.push(`Scrape overdue: ${s.region}`);
  }

  const report = renderMorningReport(snapshot, date);
  await import("@/lib/db/queries").then((us) =>
    us.upsertReport({
      id: date,
      date,
      summary: report,
      needs_attention: needs.join(" | ") || "None",
    })
  );

  return { report, date };
}
