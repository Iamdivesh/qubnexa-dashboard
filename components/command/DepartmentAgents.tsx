"use client";

import { useEffect, useState } from "react";

interface Agent {
  name: string; division: string; division_label: string; color: string; emoji: string;
  description: string; vibe: string; filename: string; filepath: string; sections: string[];
}

interface DepartmentAgentsProps {
  departmentId: string;
  deptColor: string;
  deptName: string;
  deptIcon: string;
}

const DEPT_FILTERS: Record<string, string[]> = {
  sales: ["outbound", "pipeline", "deal", "proposal", "discovery", "account", "lead", "customer-success", "sales-"],
  outreach: ["outbound", "LinkedIn", "email-strategist", "outreach", "sales-outreach", "email"],
  marketing: ["linkedin-content", "SEO", "twitter", "instagram", "social-media", "content-creator", "PR", "podcast", "email-marketing", "paid-media", "influencer", "conversion", "growth", "community", "brand", "video", "carrosel", "carousel"],
  finance: ["bookkeeper", "financial-analyst", "tax", "revenue", "expense", "invoicing", "cashflow", "bookkeeping"],
  product: ["product-manager", "trend-researcher", "feedback", "sprint", "prioritizer", "market-research", "research", "user-research", "competitive"],
  operations: ["project-management", "support", "automation", "workflow", "onboarding", "reporting", "strategy", "security", "sla", "escalation", "process", "ops"],
  development: ["backend", "frontend", "AI-engineer", "code-reviewer", "DevOps", "devops", "CMS", "codebase", "onboarding", "testing", "security", "architecture", "database", "API", "mobile", "full-stack"],
};

export function DepartmentAgents({ departmentId, deptColor, deptName, deptIcon }: DepartmentAgentsProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/agency-agents.json")
      .then(r => r.json())
      .then(data => {
        const filters = DEPT_FILTERS[departmentId] || [];
        const matches = data.filter(a => {
          // Direct department match (from our mapping)
          const deptMap: Record<string, string> = {
            sales: 'sales', outreach: 'sales', marketing: 'marketing', finance: 'finance',
            product: 'product', operations: 'operations', development: 'development',
          };
          if (deptMap[departmentId] && a.division === deptMap[departmentId]) return true;
          // Filename filter match
          return filters.some(f => a.filename.toLowerCase().includes(f.toLowerCase()));
        });
        setAgents(matches.slice(0, 8)); // Top 8 per department panel
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [departmentId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-5 rounded-full bg-[var(--bg-muted)]" />
          <div className="h-3 w-20 rounded bg-[var(--bg-muted)]" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-full rounded-lg bg-[var(--bg-muted)]" />
          <div className="h-6 w-3/4 rounded-lg bg-[var(--bg-muted)]" />
          <div className="h-6 w-5/6 rounded-lg bg-[var(--bg-muted)]" />
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{deptIcon}</span>
          <h3 className="text-xs font-semibold text-[var(--ink-60)]">Specialists</h3>
        </div>
        <p className="text-[10px] text-[var(--ink-40)]">No specialist agents mapped yet for this department.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm" style={{ color: deptColor }}>{deptIcon}</span>
        <h3 className="text-xs font-semibold text-[var(--ink-60)]">Specialist Agents</h3>
        <span className="text-[9px] text-[var(--ink-40)] ml-auto">{agents.length} available</span>
      </div>
      <div className="space-y-2">
        {agents.map(agent => (
          <button key={agent.filename}
            onClick={() => window.open(`/dashboard/agents?agent=${encodeURIComponent(agent.filename)}`, "_blank")}
            className="w-full text-left rounded-lg border border-[var(--ink-10)]/50 bg-[var(--bg)]/50 p-2.5 hover:border-[var(--ink-20)] hover:bg-[var(--bg-muted)] transition-colors group"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${agent.color}18` }}>
                <span className="text-xs" style={{ color: agent.color }}>{agent.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[var(--ink)] group-hover:text-[var(--accent-strong)] transition-colors truncate">
                  {agent.name}
                </p>
                <p className="text-[9px] text-[var(--ink-40)] truncate">{agent.division_label} · {agent.description.substring(0, 60)}{agent.description.length > 60 ? "…" : ""}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => window.open("/dashboard/agents", "_blank")}
        className="mt-2 flex items-center gap-1 text-[9px] text-[var(--accent)] hover:underline w-full"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM6.75 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM17.25 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM17.25 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5"/></svg>
        View full roster ({264} agents)
      </button>
    </div>
  );
}