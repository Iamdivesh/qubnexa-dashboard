import { getDb } from "@/lib/db/client";

// In-memory helpers operating on the JSON store.
// Identical return shapes to the SQLite version — routes and orchestrator unchanged.

function byId(table: string, id: string) {
  const db = getDb();
  const arr = (db as any)[table] as any[];
  return arr.find((r) => r.id === id) || null;
}

function all(table: string): any[] {
  const db = getDb();
  return ((db as any)[table] as any[]) || [];
}

function insert(table: string, row: any): void {
  const db = getDb();
  const arr = (db as any)[table] as any[];
  const existing = arr.find((r) => r.id === row.id);
  if (existing) {
    Object.assign(existing, row as any);
  } else {
    arr.push(row as any);
  }
}

// ---- Leads ----

export function getLeads(filter?: {
  stage?: string;
  region?: string;
  minScore?: number;
  limit?: number;
}): any[] {
  let rows = all("leads");
  // Normalize field names: scraper writes overall_score/outreach_status,
  // legacy code reads score/stage. Accept both.
  rows = rows.map((r: any) => ({
    ...r,
    score: r.score ?? r.overall_score ?? 0,
    stage: r.stage ?? r.outreach_status ?? "new",
  }));
  if (filter?.stage) rows = rows.filter((r: any) => r.stage === filter.stage);
  if (filter?.region) rows = rows.filter((r: any) => r.region && r.region.toLowerCase().includes(filter.region!.toLowerCase()));
  if (filter?.minScore != null) rows = rows.filter((r: any) => (r.score || 0) >= filter.minScore!);
  rows = rows.sort((a: any, b: any) => (b.score || 0) - (a.score || 0) || (b.updated_at || "").localeCompare(a.updated_at || ""));
  if (filter?.limit) rows = rows.slice(0, filter.limit);
  return rows;
}

export function getLead(id: string): any | undefined {
  return byId("leads", id) || undefined;
}

export function getLeadsGroupedByStage(): any[] {
  const rows = all("leads").map((r: any) => ({
    ...r,
    stage: r.stage ?? r.outreach_status ?? "new",
  }));
  const counts: Record<string, number> = {};
  for (const r of rows) {
    counts[r.stage] = (counts[r.stage] || 0) + 1;
  }
  const order = ["new", "enriched", "contacted", "replied", "booked", "won", "lost", "nurture"];
  return order
    .filter((s) => counts[s])
    .map((s) => ({ stage: s, count: counts[s] }));
}

export function upsertLead(lead: any): void {
  insert("leads", lead);
}

// ---- Outreach ----

export function getOutreachStats(days = 14): any[] {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const rows = all("outreach").filter((r: any) => r.sent_at && r.sent_at >= since.toISOString());
  const groups: Record<string, Record<string, number>> = {};
  for (const r of rows) {
    if (!groups[r.channel]) groups[r.channel] = {};
    groups[r.channel][r.status] = (groups[r.channel][r.status] || 0) + 1;
  }
  const out: any[] = [];
  for (const channel of Object.keys(groups)) {
    for (const status of Object.keys(groups[channel])) {
      out.push({ channel, status, count: groups[channel][status] });
    }
  }
  return out;
}

export function getOutreachTotals(): any {
  const rows = all("outreach");
  let sent = 0, replied = 0, booked = 0, no_reply = 0;
  for (const r of rows) {
    sent++;
    if (r.status === "replied") replied++;
    if (r.status === "booked") booked++;
    if (r.status === "no_reply") no_reply++;
  }
  return { total_sent: sent, total_replied: replied, total_booked: booked, total_no_reply: no_reply };
}

export function getOutreachToday(): any {
  const today = new Date().toISOString().slice(0, 10);
  const rows = all("outreach").filter((r: any) => r.sent_at && r.sent_at.startsWith(today));
  let sent = 0, replied = 0, booked = 0;
  for (const r of rows) {
    sent++;
    if (r.status === "replied") replied++;
    if (r.status === "booked") booked++;
  }
  return { sent, replied, booked };
}

// ---- Daily metrics ----

export function getDailyMetrics(days = 14): any[] {
  return all("daily_metrics")
    .slice()
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, days);
}

// ---- Clients ----

export function getClients(): any[] {
  return all("clients").sort((a: any, b: any) => (b.mrr || 0) - (a.mrr || 0) || (a.status || "").localeCompare(b.status || ""));
}

export function getMrrTotals(): any {
  const rows = all("clients");
  let total_mrr = 0, active = 0, trial = 0, at_risk = 0, churned = 0;
  for (const r of rows) {
    total_mrr += r.mrr || 0;
    if (r.status === "active") active++;
    else if (r.status === "trial") trial++;
    else if (r.status === "at_risk") at_risk++;
    else if (r.status === "churned") churned++;
  }
  return { total_mrr, active_clients: active, trial_clients: trial, at_risk_clients: at_risk, churned_clients: churned };
}

// ---- Client automations ----

export function getClientAutomationHealth(): any[] {
  const db = getDb();
  const cals = (db.client_automations as any[]) || [];
  const clients = (db.clients as any[]) || [];
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const out: any[] = [];
  for (const ca of cals) {
    const client = clientMap.get(ca.client_id);
    out.push({
      ...ca,
      client_name: client?.name || ca.client_id,
      mrr: client?.mrr || 0,
      client_status: client?.status || "unknown",
    });
  }
  return out.sort((a: any, b: any) => (b.last_run || "").localeCompare(a.last_run || ""));
}

// ---- Automations catalog ----

export function getAutomationsCatalog(): any[] {
  return all("automations_catalog").sort((a: any, b: any) =>
    (a.build_status || "").localeCompare(b.build_status || "") || (a.name || "").localeCompare(b.name || "")
  );
}

export function getUnsoldReadyAutomations(): any[] {
  const cat = all("automations_catalog")
    .filter((c: any) => (c.build_status === "ready" || c.build_status === "selling") && c.sellable === "yes");
  const usedNames = new Set(all("client_automations").map((ca: any) => ca.automation_name));
  return cat.filter((c: any) => !usedNames.has(c.id)).sort((a: any, b: any) =>
    (b.mrr_potential || 0) - (a.mrr_potential || 0)
  );
}

// ---- Scrape runs ----

export function getScrapeRunStatus(): any[] {
  return all("scrape_runs")
    .slice()
    .sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || ""))
    .slice(0, 20);
}

// ---- Orchestrator reports ----

export function getLatestReport(): any | null {
  const rows = all("orchestrator_reports");
  if (!rows.length) return null;
  return rows.sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))[0];
}

export function upsertDailyMetric(metric: any): void {
  insert("daily_metrics", metric);
}

export function upsertReport(report: any): void {
  insert("orchestrator_reports", report);
}
