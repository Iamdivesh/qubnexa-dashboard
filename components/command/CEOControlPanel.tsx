"use client";

import { useState } from "react";

interface CEOAction {
  id: string;
  type: string;
  description: string;
  department: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected" | "done";
  details: string;
}

const PRIORITY_CLASS: Record<string, string> = {
  high: "bg-[var(--red)] text-white",
  medium: "bg-[var(--amber)] text-white",
  low: "bg-[var(--ink-20)] text-[var(--ink-50)]",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-[var(--amber-10)] text-[var(--amber-deep)]",
  approved: "bg-[var(--green-10)] text-[var(--green)]",
  rejected: "bg-[var(--red-10)] text-[var(--red)]",
  done: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
};

interface CEOControlPanelProps {
  actions: CEOAction[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function CEOControlPanel({ actions, onApprove, onReject }: CEOControlPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingActions = actions.filter((a) => a.status === "pending");

  return (
    <section className="rounded-2xl border-2 border-[var(--accent-20)] bg-[var(--accent-tint)]/5 p-0.5">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--accent-tint)]/20">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0a5 5 0 0 0 5 5h-3.5a3.5 3.5 0 0 0-2.5-.5M16 6.5a2.5 2.5 0 0 0-5 0v7a2.5 2.5 0 0 1-4-2 3 3 0 0 1 4-3h2a5 5 0 0 1 3.5-1.5M6 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
            CEO Control Panel
          </h2>
          <p className="text-[10px] text-[var(--accent-60)]">
            Action required from you · {pendingActions.length} pending
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--ink-40)]">Reviewing as:</span>
          <span className="rounded-full bg-[var(--accent-tint)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--accent-strong)]">
            Co-founder
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-3">
        {pendingActions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--green)] bg-[var(--green-10)]/30 p-4 text-center">
            <svg className="mx-auto h-8 w-8 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 10.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <p className="mt-2 text-sm font-medium text-[var(--green)]">All clear — no pending actions</p>
            <p className="text-xs text-[var(--green-700)]">CEO Agent will notify you when something needs your review</p>
          </div>
        ) : (
          pendingActions.map((action) => (
            <div
              key={action.id}
              className={`rounded-xl border p-4 transition-all ${expandedId === action.id ? "border-[var(--accent)] shadow-md" : "border-[var(--ink-10)] bg-[var(--bg)]/50"}`}
            >
              {/* Compact view */}
              {expandedId !== action.id && (
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${PRIORITY_CLASS[action.priority]}`}>
                    {action.priority}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--ink)] truncate">{action.description}</p>
                    <p className="text-[10px] text-[var(--ink-40)]">{action.department} · {action.type}</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(action.id)}
                    className="shrink-0 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-1.5 text-xs font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--bg-raised)]"
                  >
                    Review
                  </button>
                </div>
              )}

              {/* Expanded view */}
              {expandedId === action.id && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${PRIORITY_CLASS[action.priority]}`}>
                        {action.priority}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[var(--ink)]">{action.description}</p>
                        <p className="text-[10px] text-[var(--ink-40)]">{action.department} · {action.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="shrink-0 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-1 text-[10px] text-[var(--ink-40)] hover:text-[var(--ink)]"
                    >
                      Collapse
                    </button>
                  </div>

                  <div className="rounded-lg bg-[var(--bg)]/50 p-3">
                    <p className="label-mono text-[10px] text-[var(--ink-40)] mb-1">DETAILS</p>
                    <p className="text-xs text-[var(--ink-70)] leading-relaxed">{action.details}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => { onApprove(action.id); setExpandedId(null); }}
                      className="flex-1 rounded-lg bg-[var(--green)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--green-600)] focus-visible:outline-2 focus-visible:outline-[var(--green)]"
                    >
                      ✓ Approve & Send
                    </button>
                    <button
                      onClick={() => { onReject(action.id); setExpandedId(null); }}
                      className="flex-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-2 text-xs font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--bg-raised)] hover:text-[var(--ink)]"
                    >
                      Reject / Edit
                    </button>
                    <button className="rounded-lg border border-[var(--accent-tint)] bg-[var(--accent-tint)]/30 px-3 py-2 text-xs font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-tint)]">
                      Edit draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick stats footer */}
      <div className="border-t border-[var(--accent-20)] bg-[var(--accent-tint)]/10 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-[var(--ink-50)]">
          <span>Today: {pendingActions.filter((a) => a.priority === "high").length} high-priority</span>
          <span>· {pendingActions.filter((a) => a.priority === "medium").length} medium</span>
          <span>· {pendingActions.filter((a) => a.priority === "low").length} low</span>
          <span className="ml-auto">CEO Agent · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>
      </div>
    </section>
  );
}
