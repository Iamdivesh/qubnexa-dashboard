"use client";

import { useEffect, useState } from "react";

interface SystemData {
  report: { id: string; date: string; summary: string; needs_attention: string; created_at?: string } | null;
  catalog: Array<{
    id: string;
    name: string;
    build_status: string;
    sellable: string;
    status?: string;
    last_status?: string | null;
    last_run?: string | null;
  }>;
  health: Array<{ client_name: string; automation_name: string; status: string; last_status: string | null; last_run: string | null }>;
  scrapes: Array<{ region?: string; query?: string; status: string; finished_at: string | null; created_at: string; leads_found?: number; qualified_found?: number; source?: string }>;
}

interface Lead {
  id: string;
  email_found?: boolean | null;
  email?: string | null;
  email_guess?: string | null;
  domain_status?: string;
  domain?: string | null;
  score: number;
  stage: string;
  business_name: string;
}

interface LeadsData {
  leads: Lead[];
}

export function SystemHealthPanel() {
  const [data, setData] = useState<SystemData | null>(null);
  const [leadsData, setLeadsData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/dashboard/system");
        const json = (await r.json()) as SystemData;
        setData(json);
      } catch {}
      setLoading(false);
    };
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const r = await fetch("/api/dashboard/leads?limit=200");
        const json = (await r.json()) as LeadsData;
        setLeadsData(json);
      } catch {}
      setLeadsLoading(false);
    };
    loadLeads();
    const id = setInterval(loadLeads, 120_000);
    return () => clearInterval(id);
  }, []);

  const report = data?.report;
  const failures = data?.health.filter((h) => h.last_status === "error" || h.status === "failed") ?? [];
  const overdueScrapes = (() => {
    if (!data?.scrapes) return [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return data.scrapes
      .filter((s) => s.status === "done" && (!s.finished_at || new Date(s.finished_at) < cutoff))
      .slice(0, 3);
  })();
  const readyToSell = (data?.catalog ?? []).filter(
    (c) => (c.build_status === "ready" || c.build_status === "selling") && c.sellable === "yes"
  );

  // Leads needing enrichment: email_found is false/null/missing OR domain_status is empty/missing
  const enrichmentCount = (() => {
    if (!leadsData?.leads) return 0;
    return leadsData.leads.filter((l) => {
      const hasEmail = l.email_found !== false && l.email_found !== null && l.email && l.email.length > 0;
      const hasDomain = l.domain_status && l.domain_status.length > 0;
      return !hasEmail && !hasDomain;
    }).length;
  })();

  // Scraper status: last scrape run
  const lastScrape = (() => {
    if (!data?.scrapes || data.scrapes.length === 0) return null;
    return data.scrapes.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))[0];
  })();

  const lastRunText = report ? `Report: ${report.date}` : "No report yet";
  const lastRunTime = report && report.created_at ? new Date(report.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <h2 className="text-heading text-base font-semibold tracking-tight">System Health</h2>
        <p className="text-xs text-[var(--ink-50)]">Orchestrator &amp; automation status</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Leads needing enrichment - NEW */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">ENRICHMENT QUEUE</p>
          {leadsLoading ? (
            <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-xs text-[var(--ink-30)]">
              Loading…
            </div>
          ) : enrichmentCount > 0 ? (
            <div className="rounded-lg border border-[var(--sand-tint)] bg-[var(--sand-tint)] p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--sand-deep)] font-medium">
                  {enrichmentCount} lead{enrichmentCount !== 1 ? "s" : ""} needing enrichment
                </span>
                <span className="text-xs text-[var(--sand-deep)]">email or domain missing</span>
              </div>
              <p className="mt-1 text-xs text-[var(--sand-deep)]">
                Enrich these leads to unlock email outreach and domain-based prospecting.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--accent-tint)] bg-[var(--accent-tint)] p-3 text-xs text-[var(--accent-strong)]">
              All leads enriched — email and domain data available.
            </div>
          )}
        </div>

        {/* Orchestrator status */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">ORCHESTRATOR</p>
          <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--ink-70)]">{lastRunText}</span>
              <span className="text-xs text-[var(--ink-50)]">{lastRunTime}</span>
            </div>
            {report ? (
              <p className="mt-1.5 text-xs text-[var(--ink-50)] leading-relaxed">{report.needs_attention}</p>
            ) : (
              <p className="mt-1.5 text-xs text-[var(--ink-30)]">Run the orchestrator to generate the first morning report.</p>
            )}
          </div>
        </div>

        {/* Automation failures */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">AUTOMATION HEALTH</p>
          {failures.length === 0 ? (
            <div className="rounded-lg border border-[var(--accent-tint)] bg-[var(--accent-tint)] p-3 text-xs text-[var(--accent-strong)]">
              All client automations healthy — no failures in last 24h.
            </div>
          ) : (
            <div className="space-y-2">
              {failures.map((f) => (
                <div key={`${f.client_name}-${f.automation_name}`} className="flex items-start gap-2 rounded-lg border border-[var(--sand-tint)] bg-[var(--sand-tint)] p-2.5 text-sm">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sand-deep)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <p className="font-medium text-[var(--ink)]">{f.client_name}</p>
                    <p className="text-xs text-[var(--sand-deep)]">{f.automation_name} — {f.last_status || "error"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scraper status - ENHANCED */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">SCRAPER STATUS</p>
          {lastScrape ? (
            <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--ink-70)] font-medium">
                    {lastScrape.region || lastScrape.query || "Unknown region"}
                  </p>
                  <p className="text-xs text-[var(--ink-50)]">
                    {lastScrape.source} · {lastScrape.status}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium text-xs ${
                    lastScrape.status === "done"
                      ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]"
                      : lastScrape.status === "running"
                      ? "bg-[var(--accent)] text-white animate-pulse"
                      : lastScrape.status === "error"
                      ? "bg-[var(--sand-deep)] text-white"
                      : "bg-[var(--ink-10)] text-[var(--ink-50)]"
                  }`}
                >
                  {lastScrape.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-[var(--ink-50)]">
                <span>
                  Last run: {lastScrape.created_at ? new Date(lastScrape.created_at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) : "—"}
                </span>
                {lastScrape.finished_at && (
                  <span>
                    Finished: {new Date(lastScrape.finished_at).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                )}
                {typeof lastScrape.leads_found === "number" && lastScrape.leads_found !== undefined && (
                  <span className="font-medium text-[var(--accent-strong)]">
                    {lastScrape.leads_found} lead{lastScrape.leads_found !== 1 ? "s" : ""} found
                  </span>
                )}
                {typeof lastScrape.qualified_found === "number" && lastScrape.qualified_found !== undefined && (
                  <span className="text-[var(--sand-deep)]">
                    {lastScrape.qualified_found} qualified
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-xs text-[var(--ink-50)]">
              No scrape run yet.
            </div>
          )}

          {/* Scrape queue */}
          {data?.scrapes && data.scrapes.length > 0 && (
            <div className="mt-2">
              <p className="label-mono text-[10px] text-[var(--ink-30)] mb-1.5">RECENT RUNS</p>
              <div className="space-y-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-sm">
                {data.scrapes.slice(0, 5).map((s) => (
                  <div key={s.region + s.created_at} className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ink-70)] truncate max-w-[160px]">{s.region || s.query || "unknown"}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[var(--ink-50)]">
                        {typeof s.leads_found === "number" && s.leads_found !== undefined
                          ? `${s.leads_found} leads`
                          : ""}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          s.status === "done"
                            ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]"
                            : s.status === "running"
                            ? "bg-[var(--accent)] text-white animate-pulse"
                            : s.status === "error"
                            ? "bg-[var(--sand-deep)] text-white"
                            : "bg-[var(--ink-10)] text-[var(--ink-50)]"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {overdueScrapes.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[var(--ink-10)]">
              <p className="text-xs text-[var(--sand-deep)]">
                Overdue re-scrape: {overdueScrapes.map((s) => s.region).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Ready to sell */}
        {readyToSell.length > 0 && (
          <div>
            <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">READY TO SELL</p>
            <div className="space-y-1.5 rounded-lg border border-[var(--accent-tint)] bg-[var(--accent-tint)] p-3">
              {readyToSell.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--accent-strong)]">{c.name}</span>
                  <span className="text-xs text-[var(--ink-50)]">{c.build_status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
