"use client";

import { useState, useEffect, useRef } from "react";

interface ActivityItem {
  id: string;
  agent: string;
  department: string;
  action: string;
  detail: string;
  time: string;
  status: "done" | "pending" | "needs_review" | "error";
}

const STATUS_ICONS: Record<string, string> = {
  done: "text-[var(--green)]",
  pending: "text-[var(--amber)]",
  needs_review: "text-[var(--accent-strong)]",
  error: "text-[var(--red)]",
};

const STATUS_LABELS: Record<string, string> = {
  done: "Done",
  pending: "Pending",
  needs_review: "Needs review",
  error: "Error",
};

interface AgentActivityFeedProps {
  activity: ActivityItem[];
}

export function AgentActivityFeed({ activity }: AgentActivityFeedProps) {
  const [filter, setFilter] = useState<"all" | "done" | "pending" | "needs_review">("all");
  const endRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "all"
      ? activity
      : activity.filter((a) => a.status === filter);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filtered]);

  const DEPT_COLORS: Record<string, string> = {
    Sales: "var(--accent)",
    "Delivery & Ops": "var(--amber)",
    "Product Research": "var(--accent-strong)",
    Marketing: "var(--accent)",
    Finance: "var(--sand-deep)",
    Development: "var(--ink-90)",
    CEO: "var(--accent-strong)",
  };

  return (
    <section className="rounded-2xl border-2 border-[var(--ink-10)] bg-[var(--bg-raised)]/50 p-0.5">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-raised)]">
        <svg className="h-4 w-4 text-[var(--ink-70)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-90)]">
          Agent Activity Feed
        </h2>
        <div className="ml-auto flex items-center gap-1.5">
          {(["all", "done", "pending", "needs_review"] as const).map((f) => (
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

      <div className="divide-y divide-[var(--ink-10)]">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            {/* Status indicator */}
            <div className={`mt-0.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full ${STATUS_ICONS[item.status]}`}>
              {item.status === "done" && (
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
              {item.status === "needs_review" && (
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {item.status === "error" && (
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.303a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0zM12 12.75h.008v.008H12V12.75z" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="rounded text-[10px] font-medium px-1.5 py-0.5"
                  style={{ backgroundColor: DEPT_COLORS[item.department] + "20", color: DEPT_COLORS[item.department] }}
                >
                  {item.department}
                </span>
                <span className="text-[10px] text-[var(--ink-40)]">{item.time}</span>
              </div>
              <p className="text-sm text-[var(--ink)]">
                <span className="font-medium text-[var(--ink-70)]">{item.agent}</span>
                {" "}
                <span className="text-[var(--ink-70)]">{item.action}</span>
              </p>
              {item.detail && (
                <p className="mt-0.5 text-xs text-[var(--ink-40)]">{item.detail}</p>
              )}
            </div>

            {/* Status label */}
            <span className={`text-[10px] font-medium ${STATUS_ICONS[item.status]}`}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-2">
        <p className="flex items-center justify-between text-[10px] text-[var(--ink-40)]">
          <span>{activity.length} events today</span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-[var(--green)] animate-pulse" />
            Live feed · refreshing every 60s
          </span>
        </p>
      </div>
    </section>
  );
}
