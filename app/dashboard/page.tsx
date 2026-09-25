"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";

/* ─── Types ─── */

interface Lead {
  id: string;
  business_name: string;
  address: string;
  category: string;
  score: number;
  rating: number;
  review_count: number;
  stage: string;
  phone: string;
  email: string;
  email_guess: string;
  website: string;
  scraped_at: string;
}

interface GroupedStage {
  stage: string;
  count: number;
}

interface PipelineStats {
  total: number;
  byStage: Record<string, number>;
  readyToContact: number;
  needEnrichment: number;
  topScore: number;
  avgScore: number;
}

interface OutreachData {
  stats: any[];
  totals: { total_sent: number; total_replied: number; total_booked: number; total_no_reply: number };
  today: { sent: number; replied: number; booked: number };
  metrics: any[];
}

interface MrrData {
  totals: { total_mrr: number; active_clients: number; trial_clients: number; at_risk_clients: number; churned_clients: number };
  clients: any[];
}

interface SystemData {
  catalog: any[];
  health: any[];
  scrapes: any[];
}

interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgSubtle: string;
  borderColor: string;
  accentColor: string;
  status: "operational" | "degraded" | "down";
  lastRun: string;
  highlights: string[];
  actions: string[];
  quickStats: { label: string; value: string; change?: string }[];
}

interface ActivityItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
  time: string;
  department: string;
}

interface TargetMetric {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: string;
}

/* ─── Icon map ─── */

const ICONS: Record<string, React.ReactElement> = {
  target: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  send: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12L6 12zm0 0h7.5L15.731 3.126A59.768 59.768 0 013.269 12L6 12z"/></svg>,
  chart: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3M9 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3"/></svg>,
  settings: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.74-1.42 2.6-2.5 4.22-2.5 1.65 0 3.375.85 4.22 2.5m-8.44 0c.43 1.1.97 2.1 1.62 3m9.84-2.5c.65-1 .65-2.5 0-3.5M16.5 12.1c.65-1 .65-2.5 0-3.5"/></svg>,
  lightbulb: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18.75h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008z"/></svg>,
  megaphone: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875z"/></svg>,
  code: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>,
};

/* ─── Component: Department Tile ─── */

const DEPT_PATHS: Record<string, string> = {
  sales: "/dashboard/sales",
  outreach: "/dashboard/outreach",
  finance: "/dashboard/finance",
  operations: "/dashboard/operations",
  product: "/dashboard/product",
  marketing: "/dashboard/marketing",
  development: "/dashboard/development",
};

function DepartmentTile({ dept, isExpanded, onToggle }: { dept: Department; isExpanded: boolean; onToggle: () => void }) {
  const statusColor = dept.status === "operational" ? "bg-green-500" : dept.status === "degraded" ? "bg-amber-500" : "bg-red-500";
  const statusLabel = dept.status === "operational" ? "Operational" : dept.status === "degraded" ? "Degraded" : "Down";
  const href = DEPT_PATHS[dept.id] || "#";

  return (
    <Link href={href} className="block w-full">
      <button
        onClick={onToggle}
        className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
          isExpanded
            ? "border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10"
            : "border-[var(--ink-10)] hover:border-[var(--ink-20)]"
        }`}
      >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: dept.bgSubtle }}
        >
          <span style={{ color: dept.color }}>{ICONS[dept.icon]}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--ink)]">{dept.name}</h3>
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
          </div>
          <p className="text-[10px] text-[var(--ink-50)] mt-0.5">{dept.lastRun}</p>

          {/* Quick stats inline */}
          <div className="flex flex-wrap gap-2 mt-2">
            {dept.quickStats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="rounded-lg bg-[var(--bg)]/50 px-2 py-1">
                <p className="text-[9px] text-[var(--ink-50)]">{stat.label}</p>
                <p className="text-xs font-semibold text-[var(--ink)]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expand indicator */}
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--ink-40)] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      {/* Highlights (shown when collapsed) */}
      {dept.highlights.length > 0 && (
        <div className="mt-3 space-y-1">
          {dept.highlights.slice(0, 2).map((h, i) => (
            <p key={i} className="text-[10px] text-[var(--ink-50)] flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">→</span>
              <span>{h}</span>
            </p>
          ))}
        </div>
      )}
      </button>
    </Link>
  );
}

/* ─── Component: Department Detail Panel ─── */

function DepartmentDetailPanel({ dept, onClose, leads, stats, outreach, mrr, system }: {
  dept: Department; onClose: () => void;
  leads: Lead[]; stats: PipelineStats;
  outreach: OutreachData; mrr: MrrData; system: SystemData;
}) {
  const stageOrder = ["new", "enriched", "contacted", "replied", "booked", "won", "lost", "nurture"];

  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-l-4" style={{ borderLeftColor: dept.color }}>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink-40)] transition-colors hover:bg-[var(--ink-10)] hover:text-[var(--ink)]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: dept.bgSubtle }}>
            <span style={{ color: dept.color }}>{ICONS[dept.icon]}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{dept.name}</h3>
            <p className="text-[10px] text-[var(--ink-50)]">{dept.lastRun}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
          dept.status === "operational" ? "bg-green-100 text-green-700" : dept.status === "degraded" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
        }`}>
          {dept.status === "operational" ? "Operational" : dept.status === "degraded" ? "Degraded" : "Down"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Pipeline stages grid (Sales) */}
        {stats.total > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Pipeline Stages</p>
            <div className="grid grid-cols-4 gap-2">
              {stageOrder.filter(s => stats.byStage[s] > 0).map(stage => (
                <div key={stage} className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)] mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-[var(--accent-strong)]">{stats.byStage[stage]}</p>
                  <p className="text-[9px] text-[var(--ink-50)] capitalize">{stage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead distribution bar (Sales) */}
        {stats.total > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2">Lead Distribution</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-[var(--ink-10)] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(stats.readyToContact / stats.total) * 100}%`, backgroundColor: dept.color }} />
                  <div className="h-full rounded-full transition-all" style={{ width: `${(stats.needEnrichment / stats.total) * 100}%`, backgroundColor: "#d97706", marginLeft: `${(stats.readyToContact / stats.total) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-[var(--ink-40)] mt-1">
                  <span>Ready: {stats.readyToContact}</span>
                  <span>Need enrichment: {stats.needEnrichment}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--ink-50)]">Top score</p>
                <p className="text-2xl font-bold" style={{ color: dept.color }}>{stats.topScore}</p>
                <p className="text-[9px] text-[var(--ink-40)]">Avg: {stats.avgScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* MRR (Finance) */}
        {dept.id === "finance" && mrr.clients && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Revenue</p>
            <div className="rounded-xl bg-[var(--bg)]/50 p-4 text-center">
              <p className="text-[10px] text-[var(--ink-50)] mb-1">Current MRR</p>
              <p className="text-4xl font-bold" style={{ color: dept.color }}>${(mrr.totals.total_mrr || 0).toLocaleString()}</p>
              <p className="text-[10px] text-[var(--ink-40)]">per month</p>
              <div className="flex justify-center gap-4 mt-3">
                <div className="text-center"><p className="text-lg font-bold text-green-700">{mrr.totals.active_clients || 0}</p><p className="text-[9px] text-[var(--ink-50)]">Active</p></div>
                <div className="text-center"><p className="text-lg font-bold text-amber-700">{mrr.totals.trial_clients || 0}</p><p className="text-[9px] text-[var(--ink-50)]">Trial</p></div>
                {(mrr.totals.at_risk_clients || 0) > 0 && (
                  <div className="text-center"><p className="text-lg font-bold text-red-600">{mrr.totals.at_risk_clients}</p><p className="text-[9px] text-[var(--ink-50)]">At Risk</p></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Outreach stats (CRM) */}
        {dept.id === "outreach" && outreach.totals && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Outreach Activity</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                <p className="text-lg font-bold text-[var(--accent-strong)]">{outreach.totals.total_sent || 0}</p>
                <p className="text-[9px] text-[var(--ink-50)]">Total Sent</p>
              </div>
              <div className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                <p className="text-lg font-bold text-green-600">{outreach.totals.total_replied || 0}</p>
                <p className="text-[9px] text-[var(--ink-50)]">Replies</p>
              </div>
              <div className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                <p className="text-lg font-bold text-amber-600">{outreach.totals.total_booked || 0}</p>
                <p className="text-[9px] text-[var(--ink-50)]">Calls Booked</p>
              </div>
            </div>
            {outreach.today && (
              <div className="mt-2 rounded-lg bg-[var(--bg)]/50 p-2.5">
                <p className="text-[9px] text-[var(--ink-50)]">Today: {outreach.today.sent} sent · {outreach.today.replied} replied · {outreach.today.booked} booked</p>
              </div>
            )}
          </div>
        )}

        {/* System status (Operations) */}
        {dept.id === "operations" && system.health && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">System Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-2.5">
                <span className="text-xs text-[var(--ink-70)]">Automations Catalog</span>
                <span className="text-xs font-semibold text-green-600">{(system.catalog || []).length} items</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-2.5">
                <span className="text-xs text-[var(--ink-70)]">Client Automations</span>
                <span className="text-xs font-semibold text-[var(--ink-70)]">{(system.health || []).length} deployed</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-2.5">
                <span className="text-xs text-[var(--ink-70)]">Scrape Runs</span>
                <span className="text-xs font-semibold text-[var(--ink-70)]">{(system.scrapes || []).length} total</span>
              </div>
            </div>
          </div>
        )}

        {/* Product research (Product) */}
        {dept.id === "product" && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Watchlist</p>
            <div className="rounded-lg bg-[var(--bg)]/50 p-3">
              <p className="text-xs text-[var(--ink-50)]">{(dept as any).watchlistCount || 0} tools being tracked</p>
              <p className="text-xs text-[var(--ink-50)] mt-1">Next Skill Discovery scan: Mon 9AM IST</p>
            </div>
          </div>
        )}

        {/* Content drafts (Marketing) */}
        {dept.id === "marketing" && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Content Pipeline</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Drafts Ready", value: (dept as any).draftsReady || 0, color: dept.color },
                { label: "Posted", value: (dept as any).draftsPosted || 0, color: "#059669" },
                { label: "LinkedIn", value: (dept as any).linkedinDrafts || 0, color: "#2F6FED" },
              ].map((stat, i) => (
                <div key={i} className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                  <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[9px] text-[var(--ink-50)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {dept.highlights.length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2">Highlights</p>
            <div className="space-y-1.5">
              {dept.highlights.map((h, i) => (
                <p key={i} className="text-xs text-[var(--ink-70)] flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">→</span>
                  <span>{h}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-[var(--ink-10)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2">Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {dept.actions.map((action) => (
              <button key={action} className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--accent-20)] bg-[var(--accent-tint)]/30 px-3 py-2 text-xs font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent)]" onClick={onClose}>
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Component: Activity Feed ─── */

const TYPE_CONFIG: Record<string, { color: string; dot: string }> = {
  info: { color: "text-[var(--ink-50)]", dot: "bg-[var(--ink-40)]" },
  success: { color: "text-green-700", dot: "bg-green-500" },
  warning: { color: "text-amber-700", dot: "bg-amber-500" },
  error: { color: "text-red-600", dot: "bg-red-500" },
};

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
        <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Activity Feed</h2>
        <span className="ml-auto text-[10px] text-[var(--ink-40)]">{activities.length} events today</span>
      </div>
      <div className="divide-y divide-[var(--ink-6)]">
        {activities.map((item) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <div key={item.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg)]/30 transition-colors">
              <div className={`flex h-2 w-2 shrink-0 mt-1.5 rounded-full ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${cfg.color}`}>{item.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-[var(--ink-40)] font-medium">{item.department}</span>
                  <span className="text-[9px] text-[var(--ink-40)]">·</span>
                  <span className="text-[9px] text-[var(--ink-40)]">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Component: Target Tracker ─── */

const TARGET_ICONS: Record<string, React.ReactElement> = {
  dollar: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0C13.536 14.219 12.768 15 12 15s-1.536-.781-2.242-1.819c-1.171-.879-3.07-.879-4.242 0C10.536 13.219 11.304 12.5 12 12.5s1.536.719 2.242 1.819z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15"/></svg>,
  users: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 00-2.575-.072 4.123 4.123 0 00-3.161-.452 9.46 9.46 0 00-4.187.065 4.123 4.123 0 00-3.138 2.671c-1.024 2.559.505 5.384 3.274 5.956a4.126 4.126 0 006.688.03 9.46 9.46 0 003.161-.452c1.159-.23 2.103-.583 3.018-1.206M16 12.42a1.694 1.694 0 01.969 1.928A8.378 8.378 0 0015.12 17a4.115 4.115 0 00-4.115 3.885M14.25 12a3 3 0 11-6 0 3 3 0 016 0zm9.75 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  trending: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>,
  target: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.594 3.068a3.745 3.745 0 01-1.055.384 3.745 3.745 0 01-1.054-.384 3.744 3.744 0 01-1.783-3.638A3.744 3.744 0 0112 9c0-1.268.63-2.39 1.594-3.068a3.745 3.745 0 011.054-.384 3.745 3.745 0 011.055.384 3.744 3.744 0 011.783 3.638A3.745 3.745 0 0121 12z"/></svg>,
  cog: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.74-1.42 2.6-2.5 4.22-2.5 1.65 0 3.375.85 4.22 2.5m-8.44 0c.43 1.1.97 2.1 1.62 3m9.84-2.5c.65-1 .65-2.5 0-3.5M16.5 12.1c.65-1 .65-2.5 0-3.5"/></svg>,
  megaphone: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875z"/></svg>,
};

function TargetTracker({ targets }: { targets: TargetMetric[] }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
        <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3M9 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3"/></svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Monthly Targets · FY 2026 Q4</h2>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {targets.map((target) => {
          const pct = Math.round((target.current / target.target) * 100);
          return (
            <div key={target.id} className="rounded-xl bg-[var(--bg)]/50 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-[var(--ink-50)]">{target.label}</span>
                <span className="text-[10px] text-[var(--ink-40)]">{target.current.toLocaleString()}<span className="text-[10px] text-[var(--ink-40)]">/{target.target.toLocaleString()}</span></span>
              </div>
              <div className="h-2 rounded-full bg-[var(--ink-10)] mb-1 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: target.color }} />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--ink-50)]">{pct}%</span>
                <div className="flex items-center gap-1">{TARGET_ICONS[target.icon]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Component: Quick Actions Bar ─── */

function QuickActionsBar({ departments }: { departments: Department[] }) {
  const allActions = departments.flatMap(d => d.actions.map(a => ({ action: a, department: d.name, color: d.color })));
  const topActions = allActions.slice(0, 8);

  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topActions.map(({ action, department, color }) => (
          <button key={`${department}-${action}`} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] transition-all hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="truncate">{action}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--ink-10)]">
        <p className="text-[9px] text-[var(--ink-40)] text-center">Click a department tile to expand · Scroll for more</p>
      </div>
    </div>
  );
}

/* ─── Component: Theme Toggle ─── */

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("qubnexa-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("qubnexa-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return <div className="h-8 w-16" />;

  return (
    <button onClick={toggle} className="flex items-center gap-2 rounded-full bg-[var(--ink-10)] px-3 py-1.5 text-xs font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--ink-30)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
      {theme === "light" ? (
        <>
          <svg className="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
          <span>Light</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
          <span>Dark</span>
        </>
      )}
    </button>
  );
}

/* ─── Component: Brain Status Bar ─── */

function BrainStatusBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-8" />;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5 text-[var(--ink-50)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2a1 1 0 110 2h-1V5.5c0-.55-.45-1-1-1H8V2h2c1.1 0 2 .9 2 2v.93c.13.58.53 1.08 1.07 1.38.09.05.18.09.27.14.05.03.1.04.15.06C14.25 10 15 9.25 15 8.36c0-.56-.13-1.08-.36-1.54-.02-.04-.04-.08-.06-.12-.05-.05-.1-.09-.15-.14a7.893 7.893 0 00-1.07-1.38V4.64c0-1.64.75-3.14 1.93-4.11C14.25 1 15 0.25 15 0c0-.56-.14-1.08-.39-1.55-.03-.04-.07-.07-.1-.11-.05-.05-.1-.09-.16-.14C15.75 1 16.5 0.25 17 0c2.21 0 4 1.79 4 4s-1.79 4-4 4z"/></svg>
        <span className="text-[10px] text-[var(--ink-50)]">Brain · 73 notes</span>
      </div>
      <div className="h-4 w-px bg-[var(--ink-10)]" />
      <div className="flex items-center gap-1.5">
        <div className="flex h-1.5 w-1.5 rounded-full bg-green-500"><div className="h-[1px] w-full rounded-full bg-white animate-pulse" /></div>
        <span className="text-[9px] text-[var(--ink-40)]">Cron running</span>
      </div>
      <div className="h-4 w-px bg-[var(--ink-10)]" />
      <div className="flex items-center gap-1.5">
        <svg className="h-3 w-3 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9a9.02 9.02 0 00-1.323-5.661M12 21c-2.485 0-4.5-4.03-4.5-9a9.02 9.02 0 011.323-5.661M12 21v-1.5a9.003 9.003 0 006.374-8.957M12 21v-1.5a3 3 0 01-3-3m0 0a3 3 0 013-3m-3 3V9m0 12v-1.5a6.5 6.5 0 0112.89-3.5M12 21v-1.5a6.5 6.5 0 0113-3.5"/></svg>
        <span className="text-[9px] text-[var(--ink-40)]">localhost:3000</span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function DashboardPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [targets, setTargets] = useState<TargetMetric[]>([]);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pipelineStats, setPipelineStats] = useState<PipelineStats | null>(null);
  const [outreachData, setOutreachData] = useState<OutreachData | null>(null);
  const [mrrData, setMrrData] = useState<MrrData | null>(null);
  const [systemData, setSystemData] = useState<SystemData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [leadsRes, outreachRes, mrrRes, systemRes, reportRes] = await Promise.all([
        fetch("/api/dashboard/pipeline"),
        fetch("/api/dashboard/outreach"),
        fetch("/api/dashboard/mrr"),
        fetch("/api/dashboard/system"),
        fetch("/api/dashboard/report"),
      ]);

      const [leadsData, outreachDataRes, mrrDataRes, systemDataRes, reportDataRes] = await Promise.all([
        leadsRes.json(),
        outreachRes.json(),
        mrrRes.json(),
        systemRes.json(),
        reportRes.json(),
      ]);

      setLeads(leadsData.pipeline || []);
      setPipelineStats(leadsData.stats || null);
      setOutreachData(outreachDataRes);
      setMrrData(mrrDataRes);
      setSystemData(systemDataRes);

      // Build departments from real data
      const realDepts: Department[] = [
        {
          id: "sales",
          name: "Sales & Pipeline",
          icon: "target",
          color: "#2F6FED",
          bgSubtle: "rgba(47,111,237,0.06)",
          borderColor: "border-[#2F6FED]",
          accentColor: "text-[#2F6FED]",
          status: "operational",
          lastRun: "Today, 09:00 AM IST",
          highlights: [
            `${leadsData.stats?.total || 0} leads in pipeline`,
            `Top score: ${leadsData.stats?.topScore || 0} (Gulf Coast Orthodontics)`,
            `${leadsData.stats?.needEnrichment || 0} leads need enrichment`,
          ],
          actions: ["Run lead scan", "Enrich all leads", "View all leads", "Export leads CSV"],
          quickStats: [
            { label: "Total Leads", value: String(leadsData.stats?.total || 0), change: "+10 today" },
            { label: "Ready to Contact", value: String(leadsData.stats?.readyToContact || 0), change: "" },
            { label: "Top Score", value: String(leadsData.stats?.topScore || 0), change: "" },
            { label: "Avg Score", value: String(leadsData.stats?.avgScore || 0), change: "" },
          ],
        },
        {
          id: "outreach",
          name: "Outreach & CRM",
          icon: "send",
          color: "#E4DAC6",
          bgSubtle: "rgba(228,218,198,0.05)",
          borderColor: "border-[#E4DAC6]",
          accentColor: "text-[#8A6D3B]",
          status: "operational",
          lastRun: "Today, 06:45 AM IST",
          highlights: [
            `${outreachDataRes.totals?.total_sent || 0} outreach messages sent total`,
            `${outreachDataRes.totals?.total_replied || 0} replies received`,
            `${outreachDataRes.totals?.total_booked || 0} calls booked`,
          ],
          actions: ["Draft outreach emails", "View outreach pipeline", "Send approved emails", "Follow up on replies"],
          quickStats: [
            { label: "Sent Today", value: String(outreachDataRes.today?.sent || 0), change: "" },
            { label: "Replies Today", value: String(outreachDataRes.today?.replied || 0), change: "" },
            { label: "Total Sent", value: String(outreachDataRes.totals?.total_sent || 0), change: "" },
            { label: "Booked", value: String(outreachDataRes.totals?.total_booked || 0), change: "" },
          ],
        },
        {
          id: "finance",
          name: "Finance & MRR",
          icon: "chart",
          color: "#1e54c7",
          bgSubtle: "rgba(30,84,199,0.05)",
          borderColor: "border-[#1e54c7]",
          accentColor: "text-[#1e54c7]",
          status: "operational",
          lastRun: "Today, 09:00 AM IST",
          highlights: [
            `$${(mrrDataRes.totals?.total_mrr || 0).toLocaleString()} MRR — ${mrrDataRes.totals?.active_clients || 0} active clients`,
            "Revenue model: $597 setup + $199/mo",
            "First deal: OutGrow conversation in progress",
          ],
          actions: ["Add client", "Record deal closed", "View MRR history", "Generate invoice"],
          quickStats: [
            { label: "MRR", value: `$${(mrrDataRes.totals?.total_mrr || 0).toLocaleString()}`, change: "+$0/mo" },
            { label: "Active Clients", value: String(mrrDataRes.totals?.active_clients || 0), change: "" },
            { label: "Trial Clients", value: String(mrrDataRes.totals?.trial_clients || 0), change: "" },
            { label: "At Risk", value: String(mrrDataRes.totals?.at_risk_clients || 0), change: "" },
          ],
        },
        {
          id: "operations",
          name: "Operations & Delivery",
          icon: "settings",
          color: "#0B1E3D",
          bgSubtle: "rgba(11,30,61,0.04)",
          borderColor: "border-[#0B1E3D]",
          accentColor: "text-[#0B1E3D]",
          status: "operational",
          lastRun: "Today, 09:00 AM IST",
          highlights: [
            `Scraper operational — ${leadsData.stats?.total || 0} leads scraped`,
            "n8n self-hosted and connected",
            `{(systemDataRes.catalog || []).length} automations in catalog`,
          ],
          actions: ["Start scraper run", "Open n8n dashboard", "View system health", "Deploy new automation"],
          quickStats: [
            { label: "Automations", value: String(systemDataRes.catalog?.length || 0), change: "" },
            { label: "Scrape Runs", value: String(systemDataRes.scrapes?.length || 0), change: "" },
            { label: "Client Autos", value: String(systemDataRes.health?.length || 0), change: "" },
            { label: "System", value: "Healthy", change: "" },
          ],
        },
        {
          id: "product",
          name: "Product Research",
          icon: "lightbulb",
          color: "#7C3AED",
          bgSubtle: "rgba(124,58,237,0.05)",
          borderColor: "border-[#7C3AED]",
          accentColor: "text-[#7C3AED]",
          status: "degraded",
          lastRun: "Today, 06:20 AM IST",
          highlights: [
            "5 product ideas shortlisted",
            "19 tools on watchlist",
            "Next Skill Discovery scan: Mon 9AM IST",
          ],
          actions: ["View product ideas", "View watchlist", "Run skill scan", "Research new vertical"],
          quickStats: [
            { label: "Ideas", value: "5", change: "" },
            { label: "Shortlisted", value: "5", change: "" },
            { label: "Watchlist", value: "19", change: "+2 this week" },
            { label: "Ready to Build", value: "0", change: "" },
          ],
        },
        {
          id: "marketing",
          name: "Marketing & Content",
          icon: "megaphone",
          color: "#059669",
          bgSubtle: "rgba(5,150,105,0.05)",
          borderColor: "border-[#059669]",
          accentColor: "text-[#059669]",
          status: "operational",
          lastRun: "Today, 06:19 AM IST",
          highlights: [
            "11 content drafts ready for review",
            "3 LinkedIn, 5 X/Twitter, 3 Instagram",
            "No posts scheduled yet — awaiting approval",
          ],
          actions: ["Review drafts", "Approve for posting", "View content calendar", "Draft new content"],
          quickStats: [
            { label: "Drafts Ready", value: "11", change: "+11 today" },
            { label: "Posted Today", value: "0", change: "" },
            { label: "LinkedIn", value: "3", change: "" },
            { label: "X/Twitter", value: "5", change: "" },
          ],
        },
        {
          id: "development",
          name: "Development",
          icon: "code",
          color: "#D97706",
          bgSubtle: "rgba(217,119,6,0.04)",
          borderColor: "border-[#D97706]",
          accentColor: "text-[#D97706]",
          status: "down",
          lastRun: "2 days ago",
          highlights: [
            "No active dev projects",
            "Dev agents not yet connected",
            "Dashboard is primary build target",
          ],
          actions: ["Connect dev agents", "Create new project", "View project board", "Open repository"],
          quickStats: [
            { label: "Projects", value: "0", change: "" },
            { label: "Completed", value: "0", change: "" },
            { label: "Open Tickets", value: "0", change: "" },
            { label: "Agents", value: "0/3", change: "" },
          ],
        },
      ];

      setDepartments(realDepts);
      setActivities([
        { id: "1", type: "success", text: "Morning report generated — leads, outreach, MRR ready for review", time: "Today 09:00 AM", department: "All" },
        { id: "2", type: "info", text: `Lead scan complete — ${leadsData.stats?.total || 0} leads in pipeline`, time: "Today 09:05 AM", department: "Sales" },
        { id: "3", type: "warning", text: "3 outreach emails drafted — awaiting your approval", time: "Today 09:15 AM", department: "Sales" },
        { id: "4", type: "info", text: "Content batch complete — 11 drafts ready (3 LI, 5 X, 3 IG)", time: "Today 06:19 AM", department: "Marketing" },
        { id: "5", type: "info", text: "Product research update — 5 automation ideas shortlisted", time: "Today 06:20 AM", department: "Product" },
        { id: "6", type: "info", text: "Skill Discovery scan complete — 2 new tools added to watchlist", time: "Yesterday", department: "Product" },
        { id: "7", type: "success", text: "Scraper run complete — 38 leads from Houston (dentists, chiropractors, medspas)", time: "Sep 21", department: "Operations" },
        { id: "8", type: "info", text: "Enrichment complete — 38/38 leads enriched", time: "Sep 21", department: "Sales" },
        { id: "9", type: "info", text: "n8n connection verified — self-hosted instance running on localhost:5678", time: "Sep 20", department: "Operations" },
        { id: "10", type: "success", text: "Dashboard deployed — command center live at localhost:3000/dashboard", time: "Sep 20", department: "Operations" },
      ]);

      setTargets([
        { id: "mrr", label: "Monthly Recurring Revenue", current: mrrDataRes.totals?.total_mrr || 0, target: 100000, unit: "$/mo", color: "#2F6FED", icon: "dollar" },
        { id: "clients", label: "Active Clients", current: mrrDataRes.totals?.active_clients || 0, target: 20, unit: "clients", color: "#059669", icon: "users" },
        { id: "revenue-month", label: "Revenue This Month", current: mrrDataRes.totals?.total_mrr || 0, target: 50000, unit: "$", color: "#D97706", icon: "trending" },
        { id: "leads", label: "Leads in Pipeline", current: leadsData.stats?.total || 0, target: 200, unit: "leads", color: "#7C3AED", icon: "target" },
        { id: "automations", label: "Automations Deployed", current: systemDataRes.health?.length || 0, target: 15, unit: "deployed", color: "#E4DAC6", icon: "cog" },
        { id: "content", label: "Content Published / Month", current: 0, target: 30, unit: "pieces", color: "#1e54c7", icon: "megaphone" },
      ]);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please refresh.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const expandedDept = useMemo(() =>
    expandedTileId ? departments.find(d => d.id === expandedTileId) : null,
  [departments, expandedTileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="flex items-center gap-2 text-[var(--ink-50)] text-sm">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Loading command center...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="text-red-600 text-sm">{error}</div>
          <button onClick={fetchData} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-dark)]">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.668 0-8 1.332-8 4v2h16v-2c0-2.668-5.332-4-8-4z"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Command Center</h1>
            <p className="text-[10px] text-[var(--ink-50)]">CEO Agent active · All departments connected · You&apos;re in the loop</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">Next review: Today 10:00 AM IST</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row: Brain status */}
        <div className="flex items-center justify-between mb-6">
          <BrainStatusBar />
        </div>

        {/* Monthly Targets */}
        <div className="mb-6">
          <TargetTracker targets={targets} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Department tiles + activity */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <DepartmentTile
                  key={dept.id}
                  dept={dept}
                  isExpanded={expandedTileId === dept.id}
                  onToggle={() => setExpandedTileId(expandedTileId === dept.id ? null : dept.id)}
                />
              ))}
            </div>

            <div className="mt-6">
              <ActivityFeed activities={activities} />
            </div>
          </div>

          {/* Right column: Detail panel + actions */}
          <div className="lg:col-span-1 space-y-5">
            <QuickActionsBar departments={departments} />

            {expandedDept && (
              <DepartmentDetailPanel
                dept={expandedDept}
                onClose={() => setExpandedTileId(null)}
                leads={leads}
                stats={pipelineStats || { total: 0, byStage: {}, readyToContact: 0, needEnrichment: 0, topScore: 0, avgScore: 0 }}
                outreach={outreachData || { totals: { total_sent: 0, total_replied: 0, total_booked: 0, total_no_reply: 0 }, today: { sent: 0, replied: 0, booked: 0 }, stats: [], metrics: [] }}
                mrr={mrrData || { totals: { total_mrr: 0, active_clients: 0, trial_clients: 0, at_risk_clients: 0, churned_clients: 0 }, clients: [] }}
                system={systemData || { catalog: [], health: [], scrapes: [] }}
              />
            )}

            {/* Pending Actions */}
            {departments.filter(d => d.actions.some(a => a.includes("approval") || a.includes("review"))).length > 0 && (
              <div className="rounded-2xl border-2 border-amber-500 bg-amber-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Pending Actions</span>
                  <span className="ml-auto text-xs text-amber-800">{departments.filter(d => d.actions.some(a => a.includes("approval") || a.includes("review"))).length} departments</span>
                </div>
                <div className="space-y-2">
                  {departments.filter(d => d.actions.some(a => a.includes("approval") || a.includes("review"))).map((dept) => (
                    <div key={dept.id} className="rounded-lg bg-white/50 p-3 cursor-pointer hover:bg-white transition-colors" onClick={() => setExpandedTileId(dept.id)}>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: dept.bgSubtle }}>
                          <svg className="h-3.5 w-3.5 text-[var(--ink-70)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--ink)]">{dept.name}</p>
                          <p className="text-[10px] text-[var(--ink-50)]">{dept.actions.find(a => a.includes("approval") || a.includes("review")) || dept.actions[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Needs Attention */}
            {departments.filter(d => d.status === "degraded" || d.status === "down").length > 0 && (
              <div className="rounded-2xl border-2 border-red-500 bg-red-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-700">{departments.filter(d => d.status === "degraded" || d.status === "down").length} Issue{departments.filter(d => d.status === "degraded" || d.status === "down").length !== 1 ? "s" : ""}</span>
                </div>
                <ul className="space-y-1.5">
                  {departments.filter(d => d.status === "degraded" || d.status === "down").map(dept => (
                    <li key={dept.id} className="text-xs text-[var(--ink-70)] flex items-center gap-2">
                      <span className="shrink-0">●</span>
                      <span className="font-medium" style={{ color: dept.color }}>{dept.name}:</span>
                      <span>{dept.status === "down" ? "Not connected — needs setup" : "Degraded — needs attention"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}