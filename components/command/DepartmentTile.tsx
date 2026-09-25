"use client";

import React from "react";
import Link from "next/link";
import type { ReactElement } from "react";
import type { Department } from "./types";

const ICONS: Record<string, ReactElement> = {
  target: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  send: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12L6 12zm0 0h7.5L15.731 3.126A59.768 59.768 0 013.269 12L6 12z" />
    </svg>
  ),
  chart: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3M9 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3" />
    </svg>
  ),
  settings: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.74-1.42 2.6-2.5 4.22-2.5 1.65 0 3.375.85 4.22 2.5m-8.44 0c.43 1.1.97 2.1 1.62 3m9.84-2.5c.65-1 .65-2.5 0-3.5M16.5 12.1c.65-1 .65-2.5 0-3.5" />
    </svg>
  ),
  lightbulb: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18.75h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008z" />
    </svg>
  ),
  megaphone: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875zM15.75 12.75v1.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5v-1.5a3 3 0 014.5 0z" />
    </svg>
  ),
  code: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
};

const STATUS_CONFIG = {
  operational: { dot: "bg-green-500", label: "Operational", border: "border-l-[var(--green)]" },
  degraded: { dot: "bg-amber-500", label: "Degraded", border: "border-l-[var(--amber)]" },
  down: { dot: "bg-red-500", label: "Down", border: "border-l-[var(--red)]" },
};

const PAGE_PATHS: Record<string, string> = {
  sales: "/dashboard/sales",
  outreach: "/dashboard/outreach",
  finance: "/dashboard/finance",
  operations: "/dashboard/operations",
  product: "/dashboard/product",
  marketing: "/dashboard/marketing",
  development: "/dashboard/development",
};

interface DepartmentTileProps {
  department: Department;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DepartmentTile({ department, isExpanded, onToggle }: DepartmentTileProps) {
  const statusConfig = STATUS_CONFIG[department.status];
  const iconColor = department.color;
  const href = PAGE_PATHS[department.id] || "/dashboard";

  return (
    <>
      {/* Tile card — wraps a Link for navigation, click anywhere navigates */}
      <div
        className={`group relative rounded-xl border-2 bg-[var(--bg-raised)] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
          isExpanded
            ? `border-l-4 ${statusConfig.border} shadow-md`
            : "border-[var(--ink-10)] hover:border-[var(--ink-30)]"
        }`}
        onClick={onToggle}
      >
        {/* Left accent border */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
            isExpanded ? "" : "opacity-0 group-hover:opacity-100"
          } transition-opacity duration-200`}
          style={{ backgroundColor: department.color }}
        />

        {/* Inner link for keyboard/accessibility */}
        <Link href={href} className="flex block p-4" aria-label={`Go to ${department.name} page`}>
          {/* Header row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Icon */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: department.bgSubtle }}
            >
              {React.useMemo(() => ICONS[department.icon], [department.icon])}
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--ink)] truncate">
                  {department.name}
                </h3>
                <span className={`inline-flex h-5 min-w-16 items-center justify-center rounded-full px-2 text-[10px] font-medium ${
                  department.status === "operational"
                    ? "bg-[var(--green-10)] text-[var(--green-700)]"
                    : department.status === "degraded"
                    ? "bg-[var(--amber-10)] text-[var(--amber-deep)]"
                    : "bg-[var(--red-10)] text-red-600"
                }`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-[10px] text-[var(--ink-50)] mt-0.5">
                {department.lastRun}
              </p>
            </div>

            {/* Chevron (expand indicator) */}
            <div
              className={`flex h-5 w-5 items-center justify-center rounded transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg className="h-4 w-4 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Quick stats */}
          {department.quickStats && department.quickStats.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {department.quickStats.map((stat) => (
                <div key={stat.label} className="text-center rounded-lg bg-[var(--bg)]/50 p-2">
                  <p className="text-lg font-bold" style={{ color: iconColor }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-[var(--ink-50)] leading-tight">{stat.label}</p>
                  {stat.change && <p className="text-[9px] text-green-600">{stat.change}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Highlights */}
          {department.highlights && department.highlights.length > 0 && (
            <div className="space-y-1 mb-3">
              {department.highlights.slice(0, 2).map((h, i) => (
                <p key={i} className="text-[10px] text-[var(--ink-50)] flex items-start gap-1.5 leading-snug">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span className="line-clamp-1">{h}</span>
                </p>
              ))}
              {department.highlights.length > 2 && (
                <p className="text-[9px] text-[var(--ink-40)] pl-4">+{department.highlights.length - 2} more</p>
              )}
            </div>
          )}

          {/* Action buttons (clickable, don't expand) */}
          <div className="flex flex-wrap gap-1.5">
            {department.actions.slice(0, 2).map((action) => (
              <button
                key={action}
                className="flex-1 min-w-0 text-left text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--accent-20)] whitespace-nowrap"
                onClick={(e) => { e.stopPropagation(); }}
                title={`Action: ${action}`}
              >
                {action}
              </button>
            ))}
            {department.actions.length > 2 && (
              <button
                className="text-[10px] font-medium text-[var(--ink-50)] bg-[var(--bg)]/50 rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--bg-raised)] hover:text-[var(--ink-70)] whitespace-nowrap"
                onClick={(e) => { e.stopPropagation(); }}
              >
                +{department.actions.length - 2} more
              </button>
            )}
          </div>
        </Link>
      </div>
    </>
  );
}