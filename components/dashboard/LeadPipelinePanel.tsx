"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lead, LeadStage } from "@/lib/orchestrator";

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  enriched: "Enriched",
  contacted: "Contacted",
  replied: "Replied",
  booked: "Booked",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
};

const STAGE_COLORS: Record<LeadStage, string> = {
  new: "bg-[var(--ink-10)] text-[var(--ink-70)]",
  enriched: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
  contacted: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
  replied: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
  booked: "bg-[var(--sand-deep)] text-white",
  won: "bg-[var(--accent)] text-white",
  lost: "bg-[var(--ink-10)] text-[var(--ink-50)]",
  nurture: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
};

const STAGE_ORDER: LeadStage[] = [
  "new",
  "enriched",
  "contacted",
  "replied",
  "booked",
  "won",
  "lost",
  "nurture",
];

interface Props {
  leads: Lead[];
}

export function LeadPipelinePanel({ leads }: Props) {
  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");
  const [regionFilter, setRegionFilter] = useState("");

  const filtered = leads.filter((l) => {
    if (stageFilter !== "all" && l.stage !== stageFilter) return false;
    if (regionFilter && !l.region?.toLowerCase().includes(regionFilter.toLowerCase()))
      return false;
    return true;
  });

  const grouped = STAGE_ORDER.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.stage === s).length,
  }));

  const activeStageCount = grouped.find((g) => g.stage === stageFilter)?.count ?? 0;

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">
              Lead Pipeline
            </h2>
            <p className="text-sm text-[var(--ink-50)]">
              {leads.length} leads total · {activeStageCount} in{" "}
              {stageFilter === "all" ? "all stages" : STAGE_LABELS[stageFilter]}
            </p>
          </div>
          <span className="label-mono text-xs text-[var(--accent-strong)]">LIVE</span>
        </div>
      </div>

      {/* Stage roadmap */}
      <div className="flex overflow-x-auto border-b border-[var(--ink-10)] px-5">
        {grouped.map((g) => (
          <button
            key={g.stage}
            onClick={() => setStageFilter(g.stage)}
            className={`mb-1 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
              stageFilter === g.stage
                ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)] bg-[var(--accent)] text-white"
                : "bg-[var(--bg-raised)] text-[var(--ink-70)] hover:text-[var(--ink)]"
            }`}
          >
            <span className="mr-1.5 text-[var(--ink-30)]">{g.count}</span>
            {STAGE_LABELS[g.stage]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--ink-50)]">
            <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
              <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wide">
                Business
              </th>
              <th className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide">
                Category
              </th>
              <th className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide hidden sm:table-cell">
                Address
              </th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                Reviews
              </th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                Rating
              </th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide">
                Domain
              </th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide hidden lg:table-cell">
                Score
              </th>
              <th className="px-5 py-3 text-center font-medium text-xs uppercase tracking-wide">
                Stage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ink-10)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[var(--ink-50)]">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-8 w-8 text-[var(--ink-30)]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" />
                    </svg>
                    <p className="text-sm">No leads match this filter.</p>
                    <p className="text-xs">Try a different stage or region.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads?id=${lead.id}`}
                  prefetch={false}
                  className="block"
                >
                  <tr className="group transition-all duration-150 hover:bg-[var(--accent-tint)] active:bg-[var(--accent)]/20 active:scale-[0.995]">
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-[var(--ink)] group-hover:text-[var(--accent-strong)] transition-colors">
                          {lead.business_name}
                        </span>
                        {lead.industry ? (
                          <span className="text-xs text-[var(--ink-50)]">
                            {lead.industry}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--ink-30)]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[var(--ink-70)]">
                    {(lead as any).category ? (
                      <span className="truncate max-w-[120px] inline-block" title={(lead as any).category}>
                        {(lead as any).category}
                      </span>
                    ) : (
                      <span className="text-[var(--ink-30)]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-[var(--ink-70)] hidden sm:table-cell">
                    {(lead as any).address ? (
                      <span className="truncate max-w-[160px] sm:max-w-[200px] inline-block" title={(lead as any).address}>
                        {(lead as any).address}
                      </span>
                    ) : (
                      <span className="text-[var(--ink-30)]">—</span>
                    )}
                  </td>
                    <td className="px-3 py-3 text-sm text-center hidden md:table-cell">
                      {lead.review_count > 0 ? (
                        <span className="font-medium text-[var(--accent-strong)]">
                          {lead.review_count}
                        </span>
                      ) : (
                        <span className="text-[var(--ink-30)]">0</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-center hidden md:table-cell">
                      {lead.rating ? lead.rating.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-xs font-medium ${
                          lead.domain_status === "active"
                            ? "text-[var(--accent-strong)]"
                            : lead.domain_status === "broken"
                            ? "text-[var(--sand-deep)]"
                            : "text-[var(--ink-50)]"
                        }`}
                      >
                        {lead.domain_status || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden lg:table-cell">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          lead.score >= 80
                            ? "bg-[var(--accent)] text-white"
                            : lead.score >= 60
                            ? "bg-[var(--sand-deep)] text-white"
                            : "bg-[var(--ink-10)] text-[var(--ink-70)]"
                        }`}
                      >
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[lead.stage]}`}
                      >
                        {STAGE_LABELS[lead.stage]}
                      </span>
                    </td>
                  </tr>
                </Link>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--ink-10)] bg-[var(--bg)]/50 px-5 py-3">
        <label className="flex items-center gap-2 text-xs text-[var(--ink-50)]">
          <span className="font-medium">Region:</span>
          <input
            type="text"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            placeholder="e.g. Houston, TX"
            className="min-w-[140px] rounded-lg border border-[var(--ink-10)] bg-[var(--bg-raised)] px-2.5 py-1.5 text-xs text-[var(--ink)] placeholder-[var(--ink-30)] focus:outline-2 focus:outline-[var(--accent)]"
          />
        </label>
        {regionFilter && (
          <button
            onClick={() => setRegionFilter("")}
            className="rounded-lg px-2.5 py-1 text-xs text-[var(--ink-50)] hover:text-[var(--ink)]"
          >
            Clear
          </button>
        )}
        <div className="ml-auto text-xs text-[var(--ink-30)]">
          Showing {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  );
}
