"use client";

import { useState } from "react";

interface DeptStatus {
  id: string;
  name: string;
  icon: string;
  color: string;
  agents: { name: string; status: string; lastAction: string; taskCount: number }[];
  health: "healthy" | "degraded" | "down";
  lastRun: string;
  pendingTasks: number;
  bottlenecks: string[];
}

const ICON_MAP: Record<string, string> = {
  target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z M12 6v4l2 2",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l2.8-2.8a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 0 1.4 0l3.2-3.2a1 1 0 0 0 0-1.4l-3.2-3.2a1 1 0 0 1-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l3.2 3.2a2 2 0 0 1-2 2l-2.8 2.8a1 1 0 0 0-1.4 0L14.7 13.7a1 1 0 0 0-1.4 0l-1.6-1.6a1 1 0 0 1-1.4 0l-3.2 3.2a1 1 0 0 0-1.4 0L3.3 10.3a1 1 0 0 1-1.4 0L1.5 8.7a1 1 0 0 0 0-1.4L3.3 3.3a1 1 0 0 1-1.4 0L1.5 1.5a1 1 0 0 0-1.4 0L3.3 1.5a2 2 0 0 1 2-2l2.8 2.8a1 1 0 0 0 1.4 0z",
  lightbulb: "M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M8.5 3a2.5 2.5 0 0 1 4 0v2.4a2.5 2.5 0 0 1-2.5 2.5H5a1.5 1.5 0 0 1 0-3h1.7L8 5.5V3h.5z M16 7a1.5 1.5 0 0 0-3 0v4a1.5 1.5 0 0 0 3 0V7z M13 13a1.5 1.5 0 0 0 0 3h2.8a1.5 1.5 0 0 0 1.5-1.5v-2.3l-1.5-.5V13z",
  megaphone: "M21 5.5a1 1 0 0 0-1 1v11.2a1 1 0 0 0 1 1h3.2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2.4l-2.8-4.2a1 1 0 0 0-1.8 0l-2.8 4.2H7a1 1 0 0 0-1 1v8.3a1 1 0 0 0 1 1h3.2a1 1 0 1 0 0 2H6v2a1 1 0 0 0 1 1h4a2 2 0 0 0 0-4h-1V7.5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11.2a1 1 0 0 0 1 1h3.2a3 3 0 0 0 0 6h7.6a3 3 0 0 0 0-6H19V6.5a1 1 0 0 0-1-1z M18.5 13h-3.5a1.5 1.5 0 0 0 0 3h3.5a1.5 1.5 0 0 0 0-3z",
  chart: "M3.5 17.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M3 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M3.5 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M7 17.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M7 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M7 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M11 17.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M11 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M11 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M16 17.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M16 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M16 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M20 17.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M20 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M20 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M4 19h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2z M19 12l-4-5-5 5H6v2h8l-1 3 4-3v-2h1z",
  code: "M16 13a2 2 0 0 1-2 2v3a2 2 0 0 1-2-2l3-1m6 0a2 2 0 0 0 2 2v3a2 2 0 0 0-2-2l-3-1m6 0V8m-6 5h6M5 8h2m12 0h2M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8z",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-[var(--green)]",
  waiting_approval: "bg-[var(--amber)]",
  idle: "bg-[var(--ink-30)]",
  not_connected: "bg-[var(--red)]",
};

const HEALTH_BORDER: Record<string, string> = {
  healthy: "border-[var(--green)]",
  degraded: "border-[var(--amber)]",
  down: "border-[var(--red)]",
};

const HEALTH_GLOW: Record<string, string> = {
  healthy: "shadow-[0_0_12px_rgba(34,197,94,0.15)]",
  degraded: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
  down: "shadow-[0_0_12px_rgba(239,68,68,0.12)]",
};

interface DepartmentGridProps {
  departments: DeptStatus[];
}

export function DepartmentGrid({ departments }: DepartmentGridProps) {
  return (
    <section className="rounded-2xl border-2 border-[var(--ink-10)] bg-[var(--bg-raised)]/50 p-0.5">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-raised)]">
        <div className="flex gap-1.5">
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-[var(--accent)] animate-pulse" />
          </div>
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-[var(--green)]" />
          </div>
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-[var(--amber)]" />
          </div>
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-[var(--red)]" />
          </div>
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-[var(--ink-30)]" />
          </div>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-90)]">
          Departments
        </h2>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-[var(--ink-40)]">
          <span>6 departments</span>
          <span className="rounded-full bg-[var(--ink-10)] px-1.5 py-0.5 text-[9px]">{departments.filter((d) => d.health === "healthy").length} healthy</span>
          <span className="rounded-full bg-[var(--amber-10)] px-1.5 py-0.5 text-[9px]">{departments.filter((d) => d.health === "degraded").length} degraded</span>
          <span className="rounded-full bg-[var(--red-10)] px-1.5 py-0.5 text-[9px]">{departments.filter((d) => d.health === "down").length} down</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-4 md:p-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className={`rounded-xl border-2 p-4 transition-all hover:-translate-x-0.5 hover:shadow-md ${HEALTH_BORDER[dept.health]} ${HEALTH_GLOW[dept.health]} bg-[var(--bg)]/50`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-raised)]">
                  <svg
                    className="h-5 w-5 text-[var(--ink-70)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_MAP[dept.icon] || ICON_MAP.target} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{dept.name}</h3>
                  <p className="text-[10px] text-[var(--ink-40)]">
                    {dept.health === "healthy" ? "● Operational" : dept.health === "degraded" ? "⚠ Degraded" : "✕ Not connected"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[var(--ink-40)]">Last run: {dept.lastRun}</span>
            </div>

            {/* Agent list */}
            <div className="space-y-1.5 mb-3">
              {dept.agents.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`flex h-2 w-2 shrink-0 items-center justify-center rounded-full ${STATUS_DOT[agent.status]}`}>
                      {agent.status === "active" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs text-[var(--ink-70)] truncate">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {agent.taskCount > 0 && (
                      <span className="rounded-full bg-[var(--ink-10)] px-1.5 py-0.5 text-[9px] text-[var(--ink-50)]">
                        {agent.taskCount} task{agent.taskCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className={`text-[9px] ${agent.status === "active" ? "text-[var(--green)]" : agent.status === "waiting_approval" ? "text-[var(--amber)]" : agent.status === "not_connected" ? "text-[var(--red)]" : "text-[var(--ink-40)]"}`}>
                      {agent.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Last action + pending */}
            <div className="mb-3">
              <p className="text-[10px] text-[var(--ink-40)]">
                {dept.agents[0]?.lastAction || "No recent activity"}
              </p>
              {dept.pendingTasks > 0 && (
                <p className="mt-1 text-[10px] text-[var(--accent-strong)]">
                  {dept.pendingTasks} pending task{dept.pendingTasks !== 1 ? "s" : ""} · Click to view
                </p>
              )}
            </div>

            {/* Bottlenecks */}
            {dept.bottlenecks.length > 0 && (
              <div className="rounded-lg bg-[var(--amber-10)] p-2.5">
                <p className="text-[9px] text-[var(--amber)] font-medium uppercase tracking-wide">Bottleneck</p>
                <p className="mt-0.5 text-xs text-[var(--amber-deep)]">{dept.bottlenecks[0]}</p>
              </div>
            )}

            {/* Expand button */}
            <button className="mt-3 w-full rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 py-2 text-xs font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--bg-raised)] hover:text-[var(--ink)]">
              Open department view →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
