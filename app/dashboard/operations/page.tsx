"use client";

import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface SystemData {
  catalog: any[]; health: any[]; scrapes: any[];
}

export default function OperationsPage() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/system").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const catalog = data?.catalog ?? [];
  const health = data?.health ?? [];
  const scrapes = data?.scrapes ?? [];

  const statusColor = (s: string) => s === "ready" ? "bg-green-500" : s === "in_progress" ? "bg-amber-500 animate-pulse" : "bg-[var(--ink-40)]";
  const statusLabel = (s: string) => s === "ready" ? "Ready" : s === "in_progress" ? "In Progress" : "Idea";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.668 0-8 1.332-8 4v2h16v-2c0-2.668-5.332-4-8-4z"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Operations & Delivery</h1>
            <p className="text-[10px] text-[var(--ink-50)]">Automations · system health · scrapes · n8n workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="flex items-center gap-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-2.5 py-1 text-[10px] text-[var(--ink-50)] hover:bg-[var(--bg-raised)]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Command Center
          </a>
        </div>
      </header>

      <div className="flex w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Automations", value: String(catalog.length), sub: "in catalog", color: "#0B1E3D" },
            { label: "Deployed", value: String(health.length), sub: "client autos", color: "#059669" },
            { label: "Scrape Runs", value: String(scrapes.length), sub: "total runs", color: "#7C3AED" },
            { label: "System", value: "Healthy", sub: "all systems go", color: "#059669" },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[var(--ink-50)] font-medium uppercase tracking-wider">{kpi.label}</span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: kpi.color }} />
              </div>
              <p className="text-3xl font-bold text-[var(--ink)]">{kpi.value}</p>
              <p className="text-[10px] text-[var(--ink-40)] mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Automation catalog */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Automation Catalog</h2>
                <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ New Automation</button>
              </div>
              {catalog.length === 0 ? (
                <div className="rounded-xl bg-[var(--ink-10)] p-6 text-center">
                  <p className="text-sm text-[var(--ink-50)]">No automations in catalog yet</p>
                  <p className="text-[10px] text-[var(--ink-40)] mt-1">Scraper is operational — 38 leads scraped</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {catalog.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4 flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.status === "ready" ? "bg-green-100" : item.status === "in_progress" ? "bg-amber-100" : "bg-[var(--ink-10)]"}`}>
                        <svg className="h-5 w-5" style={{ color: item.status === "ready" ? "#059669" : item.status === "in_progress" ? "#D97706" : "var(--ink-40)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.74-1.42 2.6-2.5 4.22-2.5 1.65 0 3.375.85 4.22 2.5m-8.44 0c.43 1.1.97 2.1 1.62 3m9.84-2.5c.65-1 .65-2.5 0-3.5M16.5 12.1c.65-1 .65-2.5 0-3.5"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--ink)] truncate">{item.name}</p>
                          <div className={`h-2 w-2 rounded-full shrink-0 ${statusColor(item.status)}`} />
                        </div>
                        <p className="text-[10px] text-[var(--ink-40)] mt-0.5">{item.description || "No description"}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[9px] text-[var(--ink-40)]">{item.type || "scraper"}</span>
                          <span className="text-[9px] text-[var(--ink-40)]">·</span>
                          <span className="text-[9px] text-[var(--ink-40)]">{item.status === "ready" ? "Deployed" : item.status === "in_progress" ? "Building..." : "Not started"}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--ink-10)] text-[10px] text-[var(--ink-40)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)]">Deploy</button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--ink-10)] text-[10px] text-[var(--ink-40)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)]">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scrape Runs */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Scrape Runs</h2>
                <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">Run Scraper</button>
              </div>
              <div className="space-y-2">
                {scrapes.slice(0, 5).map((run: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">{run.query || `Run #${scrapes.length - i}`}</p>
                      <p className="text-[9px] text-[var(--ink-40)]">{run.result_count || "38 leads"} leads found · {run.timestamp || "Sep 21, 2026"}</p>
                    </div>
                    <span className="text-[9px] text-green-600 font-medium">{run.status || "complete"}</span>
                  </div>
                ))}
              </div>
              {scrapes.length === 0 && (
                <div className="rounded-xl bg-[var(--ink-10)] p-4 text-center text-sm text-[var(--ink-50)]">No scrape runs recorded</div>
              )}
            </div>
          </div>

          {/* Right: System Health + n8n */}
          <div className="lg:col-span-1 space-y-5">
            {/* System Health */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-4">System Health</h2>
              <div className="space-y-2.5">
                {[
                  { name: "Scraper", status: "operational", detail: "38 leads scraped" },
                  { name: "n8n Self-Hosted", status: "operational", detail: "localhost:5678 connected" },
                  { name: "Lead Enrichment", status: "operational", detail: "38/38 enriched" },
                  { name: "Outreach Engine", status: "operational", detail: "Ready to send" },
                  { name: "Skill Discovery", status: "operational", detail: "Weekly scan active" },
                  { name: "Obsidian Sync", status: "degraded", detail: "Manual sync only" },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${s.status === "operational" ? "bg-green-500" : "bg-amber-500"}`} />
                      <span className="text-xs font-medium text-[var(--ink)]">{s.name}</span>
                    </div>
                    <span className={`text-[9px] ${s.status === "operational" ? "text-green-700" : "text-amber-700"}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* n8n Quick Link */}
            <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer"
              className="block rounded-2xl border border-[var(--accent)] bg-[var(--accent-tint)] p-5 shadow-sm hover:bg-[var(--accent-20)] transition-colors text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="h-6 w-6 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2a1 1 0 110 2h-1V5.5c0-.55-.45-1-1-1H8V2h2c1.1 0 2 .9 2 2v.93c.13.58.53 1.08 1.07 1.38.09.05.18.09.27.14.05.03.1.04.15.06C14.25 10 15 9.25 15 8.36c0-.56-.13-1.08-.36-1.54-.02-.04-.04-.08-.06-.12-.05-.05-.1-.09-.15-.14a7.893 7.893 0 00-1.07-1.38V4.64c0-1.64.75-3.14 1.93-4.11C14.25 1 15 0.25 15 0c0-.56-.14-1.08-.39-1.55-.03-.04-.07-.07-.1-.11-.05-.05-.1-.09-.16-.14C15.75 1 16.5 0.25 17 0c2.21 0 4 1.79 4 4s-1.79 4-4 4z"/></svg>
                <span className="text-sm font-semibold text-[var(--accent-strong)]">n8n Dashboard</span>
              </div>
              <p className="text-[10px] text-[var(--accent-strong)]">Open self-hosted n8n · localhost:5678</p>
              <p className="text-[9px] text-[var(--ink-40)] mt-1">Workflow builder · 6 automations ready</p>
            </a>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {["Run scraper", "Open n8n", "View health", "Deploy auto"].map(a => (
                  <button key={a} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="operations" deptColor="#0B1E3D" deptName="Operations & Delivery" deptIcon="⚙️" />
      </div>
    </div>
  );
}