"use client";

import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface MrrData {
  totals: { total_mrr: number; active_clients: number; trial_clients: number; at_risk_clients: number; churned_clients: number };
  clients: any[];
}

interface Deal {
  id: string; client_name: string; amount: number; stage: string; close_date: string | null; notes: string;
}

const MOCK_DEALS: Deal[] = [
  { id: "d1", client_name: "OutGrow (in conversation)", amount: 597, stage: "pitch", close_date: null, notes: "Setup fee discussed. Follow up next week." },
  { id: "d2", client_name: "TBD — Healthcare lead", amount: 2588, stage: "qualified", close_date: null, notes: "From Even Healthcare outreach. $199/mo x 12 + $597 setup." },
];

export default function FinancePage() {
  const [data, setData] = useState<MrrData | null>(null);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/mrr").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalMrr = data?.totals?.total_mrr ?? 0;
  const activeClients = data?.totals?.active_clients ?? 0;
  const trialClients = data?.totals?.trial_clients ?? 0;
  const atRisk = data?.totals?.at_risk_clients ?? 0;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const history = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.668 0-8 1.332-8 4v2h16v-2c0-2.668-5.332-4-8-4z"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Finance & MRR</h1>
            <p className="text-[10px] text-[var(--ink-50)]">Revenue tracking · clients · deals · invoices</p>
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
            { label: "Total MRR", value: `$${totalMrr.toLocaleString()}`, sub: "per month", color: "#2F6FED", icon: "💰" },
            { label: "Active Clients", value: String(activeClients), sub: "paying customers", color: "#059669", icon: "👥" },
            { label: "Trial Clients", value: String(trialClients), sub: "in onboarding", color: "#D97706", icon: "🔄" },
            { label: "At Risk", value: String(atRisk), sub: "needs attention", color: "#dc2626", icon: "⚠️" },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[var(--ink-50)] font-medium uppercase tracking-wider">{kpi.label}</span>
                <span className="text-lg">{kpi.icon}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] text-[var(--ink-40)] mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: MRR History chart */}
          <div className="lg:col-span-2 space-y-5">
            {/* MRR History */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">MRR History · Last 9 Months</h2>
                <span className="text-[10px] text-[var(--ink-40)]">FY 2026</span>
              </div>
              <div className="flex items-end gap-2 sm:gap-3 h-40">
                {history.map((val, i) => {
                  const max = Math.max(...history, 1);
                  const pct = (val / max) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full rounded-t-md transition-all" style={{ height: `${pct}%`, minHeight: val > 0 ? "4px" : "0px", backgroundColor: val > 0 ? "#2F6FED" : "var(--ink-10)" }} />
                      <span className="text-[9px] text-[var(--ink-40)]">{months[i]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--ink-50)]">
                <span>No revenue recorded yet — first client deal in progress</span>
                <span className="font-medium text-[var(--accent)]">$0 → $100K target</span>
              </div>
            </div>

            {/* Deal Pipeline */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Deal Pipeline</h2>
                <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ Add Deal</button>
              </div>
              <div className="space-y-3">
                {deals.map(deal => (
                  <div key={deal.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{deal.client_name}</p>
                        <p className="text-[10px] text-[var(--ink-40)] mt-0.5">{deal.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--accent)]">${deal.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-[var(--ink-40)]">total value</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <select className="flex-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--ink-70)]">
                        <option>pitch</option>
                        <option>qualified</option>
                        <option>proposal</option>
                        <option>closed-won</option>
                        <option>closed-lost</option>
                      </select>
                      <span className="text-[9px] text-[var(--ink-40)]">{deal.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Client list */}
          <div className="lg:col-span-1 space-y-5">
            {/* Revenue Model */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Revenue Model</h2>
              <div className="space-y-2.5 text-xs">
                <div className="rounded-lg bg-[var(--bg)]/50 p-3 flex items-center justify-between">
                  <span className="text-[var(--ink-70)]">Setup fee (one-time)</span>
                  <span className="font-bold text-[var(--accent)]">$597</span>
                </div>
                <div className="rounded-lg bg-[var(--bg)]/50 p-3 flex items-center justify-between">
                  <span className="text-[var(--ink-70)]">Monthly retainer</span>
                  <span className="font-bold text-[var(--accent)]">$199/mo</span>
                </div>
                <div className="rounded-lg bg-[var(--accent-tint)] p-3 flex items-center justify-between border border-[var(--accent-20)]">
                  <span className="text-[var(--accent-strong)] font-medium">Break-even at 4 clients</span>
                  <span className="font-bold text-[var(--accent)]">$597 + 4×$199</span>
                </div>
              </div>
            </div>

            {/* Client List */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Clients</h2>
                <span className="text-[10px] text-[var(--ink-40)]">{activeClients} active · {trialClients} trial</span>
              </div>
              {activeClients === 0 && trialClients === 0 ? (
                <div className="rounded-xl bg-[var(--ink-10)] p-4 text-center">
                  <p className="text-sm text-[var(--ink-50)]">No clients yet</p>
                  <p className="text-[10px] text-[var(--ink-40)] mt-1">First deal in progress — OutGrow conversation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data?.clients?.map((c: any) => (
                    <div key={c.id} className="rounded-lg bg-[var(--bg)]/50 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--ink)]">{c.name}</p>
                        <p className="text-[9px] text-[var(--ink-40)]">{c.plan || "Standard"} · since {c.joined || "—"}</p>
                      </div>
                      <p className="font-bold text-green-600">${(c.mrr || 0).toLocaleString()}/mo</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {["Add client", "Record deal closed", "Generate invoice", "View MRR history"].map(action => (
                  <button key={action} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="finance" deptColor="#1e54c7" deptName="Finance & MRR" deptIcon="💰" />
      </div>
    </div>
  );
}