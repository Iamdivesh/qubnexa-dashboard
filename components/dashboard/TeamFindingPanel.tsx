"use client";

import { useState } from "react";

interface TeamEntry {
  id: string;
  name: string;
  location: string;
  contact: string;
  why: string;
  status: "researching" | "contacted" | "meeting" | "closed";
  notes: string;
}

const TEAMS: TeamEntry[] = [
  {
    id: "1",
    name: "OutGrow (AI MarTech Agency)",
    location: "Nagpur, India",
    contact: "Zain Khan · connect@letsoutgrow.com",
    why: "Top partnership lead from scan. AI MarTech agency in adjacent space. Potential white-label or referral partnership.",
    status: "contacted",
    notes: "Intro email sent Sep 19. Awaiting reply.",
  },
  {
    id: "2",
    name: "3DM Agency",
    location: "Hyderabad, India",
    contact: "79-person Google Partner",
    why: "Large Google Partner agency. Potential for automation subcontracting on lead gen campaigns.",
    status: "researching",
    notes: "Need to find right contact. Researching org structure.",
  },
  {
    id: "3",
    name: "Houston Digital Agencies",
    location: "Houston, TX",
    contact: "Local Google Partner network",
    why: "Local presence = faster trust. Agencies without in-house automation could outsource to QubNexa.",
    status: "researching",
    notes: "Scoping: which local agencies have 5-20 person teams with lead gen focus.",
  },
];

const STATUS_LABELS: Record<string, string> = {
  researching: "Researching",
  contacted: "Contacted",
  meeting: "Meeting",
  closed: "Closed",
};

const STATUS_COLORS: Record<string, string> = {
  researching: "bg-[var(--ink-10)] text-[var(--ink-50)]",
  contacted: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
  meeting: "bg-[var(--accent)] text-white",
  closed: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
};

export function TeamFindingPanel() {
  const [rows] = useState<TeamEntry[]>(TEAMS);

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">Team Finding</h2>
            <p className="text-xs text-[var(--ink-50)]">Partnerships & sellable automation targets</p>
          </div>
          <span className="rounded-full border border-[var(--ink-10)] px-2.5 py-0.5 text-[10px] text-[var(--ink-50)]">
            {rows.length} targets
          </span>
        </div>
      </div>

      <div className="divide-y divide-[var(--ink-10)]">
        {rows.map((t) => (
          <div key={t.id} className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--ink)]">{t.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${STATUS_COLORS[t.status]}`}>
                    {STATUS_LABELS[t.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ink-50)]">{t.location}</p>
                <p className="mt-0.5 text-xs text-[var(--ink-40)]">{t.contact}</p>
                <p className="mt-1.5 text-xs text-[var(--accent-strong)]">{t.why}</p>
              </div>
              {t.notes && (
                <div className="shrink-0 text-right">
                  <p className="text-[10px] text-[var(--ink-40)] max-w-[100px] text-right">{t.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--ink-10)] bg-[var(--bg)]/50 px-5 py-2.5">
        <p className="text-[10px] text-[var(--ink-40)]">
          Target: 3-5 partnerships by end of Q4 2026 · Focus on agencies that can white-label or resell QubNexa automations.
        </p>
      </div>
    </div>
  );
}
