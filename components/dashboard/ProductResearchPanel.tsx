"use client";

import { useState } from "react";

interface ResearchEntry {
  id: string;
  idea: string;
  target: string;
  icp: string;
  revenuePotential: string;
  status: "evaluating" | "shortlist" | "building" | "sold";
  notes: string;
}

const RESEARCH: ResearchEntry[] = [
  {
    id: "1",
    idea: "D2C Beauty Subscription Box Automation",
    target: "Beauty & personal care D2C brands ($1M-$10M ARR)",
    icp: "Brands running live chat but no post-purchase nurture; 20%+ churn month 2",
    revenuePotential: "$597 setup + $199/mo",
    status: "shortlist",
    notes: "Top ICP from lead scan. Gulf Coast Orthodontics adjacent vertical.",
  },
  {
    id: "2",
    idea: "Agency Lead Response Engine",
    target: "7-20 person marketing agencies",
    icp: "Agencies missing 40%+ inbound leads; no CRM-to-outreach wiring",
    revenuePotential: "$597 setup + $199/mo",
    status: "evaluating",
    notes: "Directly serves QubNexa's own ICP. OutGrow (Nagpur) is a warm lead.",
  },
  {
    id: "3",
    idea: "Real Estate Lead Router",
    target: "Boutique real estate brokerages (5-30 agents)",
    icp: "Zillow/portal leads landing in shared inbox with 24h+ response time",
    revenuePotential: "$597 setup + $199/mo",
    status: "evaluating",
    notes: "Houston market = 100+ brokerages. High lead volume, low response quality.",
  },
  {
    id: "4",
    idea: "E-commerce Return/Exchange Assistant",
    target: "D2C brands ($500K-$5M ARR) on Shopify",
    icp: "Return rate >15%; manual CS handling every exchange request",
    revenuePotential: "$997 setup + $299/mo",
    status: "evaluating",
    notes: "Higher price point. Needs Shopify API integration depth.",
  },
  {
    id: "5",
    idea: "Healthcare Appointment No-Show Reduction",
    target: "Dental & ortho practices (1-5 locations)",
    icp: "15%+ no-show rate; SMS reminder only, no two-way confirmation",
    revenuePotential: "$597 setup + $149/mo",
    status: "building",
    notes: "Gulf Coast Orthodontics (95pts) is the first candidate. Phone verified.",
  },
];

const STATUS_COLORS: Record<string, string> = {
  evaluating: "bg-[var(--ink-10)] text-[var(--ink-50)]",
  shortlist: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
  building: "bg-[var(--accent)] text-white",
  sold: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
};

const STATUS_LABELS: Record<string, string> = {
  evaluating: "Evaluating",
  shortlist: "Shortlist",
  building: "Building",
  sold: "Sold",
};

export function ProductResearchPanel() {
  const [rows] = useState<ResearchEntry[]>(RESEARCH);
  const [filter, setFilter] = useState<"all" | "evaluating" | "shortlist" | "building" | "sold">("all");

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts = rows.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">Product Research</h2>
            <p className="text-xs text-[var(--ink-50)]">
              {counts.shortlist || 0} shortlist · {counts.building || 0} building · {rows.length} total
            </p>
          </div>
          <div className="flex gap-1">
            {(["all", "evaluating", "shortlist", "building", "sold"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${filter === f ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)]/50 text-[var(--ink-50)] hover:text-[var(--ink)]"}`}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--ink-10)]">
        {filtered.map((r) => (
          <div key={r.id} className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--ink)]">{r.idea}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${STATUS_COLORS[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ink-50)]">{r.target}</p>
                <p className="mt-0.5 text-xs text-[var(--ink-40)]">{r.icp}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-[var(--accent-strong)]">{r.revenuePotential}</p>
                {r.notes && <p className="mt-0.5 text-[10px] text-[var(--ink-40)] max-w-[120px] text-right">{r.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
