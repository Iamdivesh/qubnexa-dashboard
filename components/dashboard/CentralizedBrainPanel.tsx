"use client";

import { useEffect, useState } from "react";

interface Report {
  id: string;
  date: string;
  summary: string;
  needs_attention: string;
  created_at?: string;
  leads_scan?: {
    total: number;
    ready: number;
    highPriority: number;
    topLead: string;
  };
  social?: {
    drafts: number;
    posted: number;
  };
  skills?: {
    watchlist: number;
    topSkill: string;
  };
}

interface BrainData {
  report: Report | null;
  pendingActions: Array<{
    id: string;
    type: string;
    description: string;
    priority: string;
    due: string;
  }>;
}

const EMPTY_ACTIONS: BrainData["pendingActions"] = [
  { id: "1", type: "lead", description: "Outreach to OutGrow (Zain Khan) — top partnership lead", priority: "high", due: "Today" },
  { id: "2", type: "lead", description: "Enrich 7 leads missing email/domain data", priority: "high", due: "Today" },
  { id: "3", type: "social", description: "Review & schedule AI content fatigue LinkedIn post", priority: "medium", due: "Today" },
  { id: "4", type: "product", description: "Decide: D2C beauty vs. real estate as next build", priority: "medium", due: "This week" },
  { id: "5", type: "skill", description: "Evaluate ManyChat for lead pipeline product integration", priority: "low", due: "This week" },
];

export function CentralizedBrainPanel() {
  const [data, setData] = useState<BrainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch("/api/dashboard/report").then((r) => r.json()),
          fetch("/api/dashboard/pipeline").then((r) => r.json()),
        ]);
        setData({
          report: r1.report || null,
          pendingActions: EMPTY_ACTIONS,
        });
      } catch {}
      setLoading(false);
    };
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const report = data?.report;
  const actions = data?.pendingActions || [];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">Centralized Brain</h2>
            <p className="text-xs text-[var(--ink-50)]">Morning report · {today}</p>
          </div>
          <span className="rounded-full bg-[var(--accent-tint)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--accent-strong)]">
            {report ? report.date : "No report"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Morning report summary */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">MORNING REPORT</p>
          {loading ? (
            <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-xs text-[var(--ink-30)]">Loading…</div>
          ) : report ? (
            <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-sm">
              <p className="text-[var(--ink-70)] leading-relaxed">{report.summary}</p>
              {report.needs_attention && (
                <div className="mt-2 rounded-lg bg-[var(--sand-tint)] p-2.5">
                  <p className="text-[10px] text-[var(--sand-deep)] font-medium uppercase tracking-wide">Needs attention</p>
                  <p className="mt-0.5 text-xs text-[var(--sand-deep)]">{report.needs_attention}</p>
                </div>
              )}
              {report.leads_scan && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="text-[var(--ink-50)]">Leads: <strong className="text-[var(--ink)]">{report.leads_scan.total}</strong> total</span>
                  <span className="text-[var(--ink-50)]">Ready: <strong className="text-[var(--accent-strong)]">{report.leads_scan.ready}</strong></span>
                  <span className="text-[var(--ink-50)]">Priority: <strong className="text-[var(--sand-deep)]">{report.leads_scan.highPriority}</strong></span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 text-xs text-[var(--ink-40)]">
              No morning report yet. Run the orchestrator to generate.
            </div>
          )}
        </div>

        {/* Priority actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label-mono text-[10px] text-[var(--ink-50)]">PRIORITY ACTIONS</p>
            <span className="text-[10px] text-[var(--accent-strong)]">{actions.length} items</span>
          </div>
          <div className="space-y-1.5">
            {actions.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-2.5">
                <span className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${a.priority === "high" ? "bg-[var(--sand-deep)] text-white" : a.priority === "medium" ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]" : "bg-[var(--ink-10)] text-[var(--ink-50)]"}`}>
                  {a.priority}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-[var(--ink)]">{a.description}</p>
                  <p className="text-[10px] text-[var(--ink-40)]">{a.type} · {a.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-3 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4 text-xs sm:grid-cols-3">
          <div>
            <p className="text-[var(--ink-40)]">Total Leads</p>
            <p className="text-lg font-semibold text-[var(--ink)]">{report?.leads_scan?.total ?? 38}</p>
          </div>
          <div>
            <p className="text-[var(--ink-40)]">Social Drafts</p>
            <p className="text-lg font-semibold text-[var(--ink)]">{report?.social?.drafts ?? 11}</p>
          </div>
          <div>
            <p className="text-[var(--ink-40)]">Skills Watchlist</p>
            <p className="text-lg font-semibold text-[var(--ink)]">{report?.skills?.watchlist ?? 8}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
