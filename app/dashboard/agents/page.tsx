"use client";

import { useEffect, useState } from "react";
import { AgentExecutionPanel } from "../../../components/command/AgentExecutionPanel";

interface Agent {
  name: string; division: string; division_label: string; division_color: string; division_icon: string;
  description: string; color: string; emoji: string; vibe: string; filename: string; filepath: string;
  sections: string[]; department: string; department_name: string;
}

interface DepartmentInfo {
  name: string; color: string; icon: string; count: number;
}

const DEPARTMENTS: { id: string; info: DepartmentInfo }[] = [
  { id: "sales", info: { name: "Sales & Pipeline", color: "#2F6FED", icon: "🎯", count: 0 } },
  { id: "outreach", info: { name: "Outreach & CRM", color: "#E4DAC6", icon: "💌", count: 0 } },
  { id: "marketing", info: { name: "Marketing & Content", color: "#059669", icon: "📢", count: 0 } },
  { id: "finance", info: { name: "Finance & MRR", color: "#1e54c7", icon: "💰", count: 0 } },
  { id: "product", info: { name: "Product Research", color: "#7C3AED", icon: "💡", count: 0 } },
  { id: "operations", info: { name: "Operations & Delivery", color: "#0B1E3D", icon: "⚙️", count: 0 } },
  { id: "development", info: { name: "Development", color: "#D97706", icon: "💻", count: 0 } },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeDept, setActiveDept] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [fullPrompt, setFullPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/agency-agents.json")
      .then(r => r.json())
      .then(data => {
        // Outreach = sales-outbound + marketing-linkedin + sales-outreach
        const outreachAgents = data.filter(a =>
          a.filename.includes('outbound') || a.filename.includes('LinkedIn') ||
          a.filename.includes('outreach') || a.filename.includes('email-strategist') ||
          a.filename.includes('sales-outreach')
        );
        outreachAgents.forEach(a => { a.department = 'outreach'; a.department_name = 'Outreach & CRM'; });

        // Count per department
        const counts: Record<string, number> = {};
        data.forEach((a: Agent) => { counts[a.department] = (counts[a.department] || 0) + 1; });
        outreachAgents.forEach((a: Agent) => { counts['outreach'] = (counts['outreach'] || 0) + 1; });

        DEPARTMENTS.forEach((d: typeof DEPARTMENTS[number]) => { d.info.count = counts[d.id] || 0; });

        // Merge outreach agents into the list
        const allAgents: Agent[] = [...data, ...outreachAgents];
        setAgents(allAgents);
        setLoading(false);
      })
      .catch(err => { console.error("Failed to load agents:", err); setLoading(false); });
  }, []);

  // Fetch full prompt when agent changes
  useEffect(() => {
    if (!selectedAgent) { setFullPrompt(null); return; }
    fetch(`/api/agents?file=${encodeURIComponent(selectedAgent.filepath.replace(/\\/g, '/'))}`)
      .then(r => r.text())
      .then(text => {
        // Strip YAML frontmatter
        const body = text.split("---").slice(2).join("---").trim();
        setFullPrompt(body);
      })
      .catch(() => setFullPrompt(null));
  }, [selectedAgent]);

  const filtered = agents.filter(a => {
    if (activeDept !== "all" && a.department !== activeDept) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) ||
             a.division_label.toLowerCase().includes(q) || a.vibe.toLowerCase().includes(q);
    }
    return true;
  });

  const deptAgents = (deptId: string) => agents.filter(a => a.department === deptId);
  const totalAgents = agents.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <p className="text-sm text-[var(--ink-50)]">Loading agent roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg)]/50 text-[var(--ink-50)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7m0 0l-7 7 7 7"/></svg>
          </a>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
              <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--ink)]">Agent Roster</h1>
              <p className="text-[10px] text-[var(--ink-50)]">{totalAgents} specialists ready · 7 departments</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedAgent && (
            <button onClick={() => setSelectedAgent(null)} className="flex items-center gap-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-2.5 py-1 text-[10px] text-[var(--ink-50)] hover:bg-[var(--bg-raised)]">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              Close
            </button>
          )}
          <span className="text-[10px] text-[var(--ink-40)]">Source: agency-agents · MIT</span>
        </div>
      </header>

      <div className="flex w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search agents by name, role, or division..."
              className="w-full rounded-xl border border-[var(--ink-10)] bg-[var(--bg-raised)] pl-9 pr-4 py-2.5 text-xs text-[var(--ink)] placeholder-[var(--ink-40)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setActiveDept("all")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeDept === "all" ? "bg-[var(--accent)] text-white shadow-sm" : "bg-[var(--bg-raised)] text-[var(--ink-60)] hover:bg-[var(--bg-muted)]"}`}>
              All ({totalAgents})
            </button>
            {DEPARTMENTS.map(d => (
              <button key={d.id} onClick={() => setActiveDept(d.id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${activeDept === d.id ? "text-white shadow-sm" : "bg-[var(--bg-raised)] text-[var(--ink-60)] hover:bg-[var(--bg-muted)]"}`}
                style={activeDept === d.id ? { backgroundColor: d.info.color } : {}}>
                <span style={{ color: activeDept === d.id ? "#fff" : d.info.color }}>{d.info.icon}</span>
                {d.info.name} ({d.info.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left: Agent list */}
          <div className="lg:col-span-3 space-y-4">
            {activeDept !== "all" && (
              <div className="flex items-center gap-2 text-xs text-[var(--ink-50)]">
                <span>{filtered.length} agents in {DEPARTMENTS.find(d => d.id === activeDept)?.info.name}</span>
                <span className="text-[var(--ink-30)]">·</span>
                <button onClick={() => setActiveDept("all")} className="text-[var(--accent)] hover:underline">Clear filter</button>
              </div>
            )}

            {selectedAgent ? (
              /* Agent detail view */
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm overflow-hidden">
                {/* Agent header */}
                <div className="flex items-start gap-4 p-5 border-b border-[var(--ink-10)]" style={{ backgroundColor: `${selectedAgent.color}08` }}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${selectedAgent.color}18` }}>
                    <span className="text-2xl">{selectedAgent.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-[var(--ink)]">{selectedAgent.name}</h2>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: selectedAgent.color + '22', color: selectedAgent.color }}>
                        {selectedAgent.division_label}
                      </span>
                      <span className="text-[10px] text-[var(--ink-40)]">·</span>
                      <span className="text-[10px] text-[var(--ink-50)]">{selectedAgent.department_name}</span>
                    </div>
                    <p className="text-sm text-[var(--ink-60)] mt-1.5" style={{ color: selectedAgent.color }}>{selectedAgent.vibe}</p>
                    <p className="text-xs text-[var(--ink-50)] mt-2">{selectedAgent.description}</p>
                  </div>
                </div>

                {/* Agent prompt content */}
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                  <div className="rounded-xl bg-[var(--bg)]/50 p-4 mb-4">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-2">File</p>
                    <p className="text-xs text-[var(--accent-strong)] font-mono break-all">{selectedAgent.filepath}</p>
                  </div>

                  {selectedAgent.sections.length > 0 && (
                    <div className="rounded-xl bg-[var(--bg)]/50 p-4 mb-4">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-2">Sections</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAgent.sections.map((s, i) => (
                          <span key={i} className="text-[10px] text-[var(--ink-60)] bg-[var(--bg)]/50 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Load full prompt via API */}
                  {fullPrompt === null && (
                    <div className="rounded-xl bg-[var(--ink-900)]/50 p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-3">Agent Prompt</p>
                      <div className="flex items-center gap-2 text-xs text-[var(--ink-400)]">
                        <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        Loading full prompt from {selectedAgent.filename}...
                      </div>
                    </div>
                  )}
                  {fullPrompt !== null && (
                    <div className="rounded-xl bg-[var(--bg)]/50 p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-3">Agent Prompt (full — {fullPrompt.length.toLocaleString()} chars)</p>
                      <pre className="text-xs text-[var(--ink-300)] whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto">{fullPrompt}</pre>
                    </div>
                  )}
                </div>

                {/* Action bar */}
                <div className="mt-2 flex gap-2">
                  <AgentExecutionPanel agent={selectedAgent} deptColor={selectedAgent.color} />
                </div>
              </div>
            ) : (
              /* Agent grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map(agent => (
                  <button key={agent.filename}
                    onClick={() => setSelectedAgent(agent)}
                    className="text-left rounded-xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm hover:shadow-md hover:border-[var(--ink-30)] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${agent.color}18` }}>
                        <span className="text-lg">{agent.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent-strong)] transition-colors truncate">{agent.name}</h3>
                          <span className="text-[9px] text-[var(--ink-40)]">·</span>
                          <span className="text-[9px] text-[var(--ink-50)]">{agent.division_label}</span>
                        </div>
                        <p className="text-[10px] text-[var(--ink-50)] mt-1 line-clamp-2 leading-relaxed">{agent.description}</p>
                        {agent.vibe && (
                          <p className="text-[9px] text-[var(--ink-40)] mt-1.5 italic" style={{ color: agent.color }}>{agent.vibe}</p>
                        )}
                      </div>
                    </div>
                    {agent.sections.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {agent.sections.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[9px] text-[var(--ink-40)] bg-[var(--bg)]/50 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                        {agent.sections.length > 3 && (
                          <span className="text-[9px] text-[var(--ink-40)]">+{agent.sections.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Department summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-4">Department Breakdown</h2>
              <div className="space-y-3">
                {DEPARTMENTS.map(d => {
                  const count = d.info.count;
                  const pct = totalAgents > 0 ? Math.round((count / totalAgents) * 100) : 0;
                  return (
                    <button key={d.id} onClick={() => setActiveDept(activeDept === d.id ? "all" : d.id)}
                      className={`w-full text-left rounded-xl p-3 transition-all ${activeDept === d.id ? "ring-2 ring-[var(--accent)] bg-[var(--accent-tint)]/20" : "bg-[var(--bg)]/50 hover:bg-[var(--bg-muted)]"}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${d.info.color}18` }}>
                          <span style={{ color: d.info.color, fontSize: '14px' }}>{d.info.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--ink)]">{d.info.name}</p>
                          <p className="text-[9px] text-[var(--ink-40)]">{count} agents</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold" style={{ color: d.info.color }}>{pct}%</p>
                          <div className="w-12 h-1.5 rounded-full bg-[var(--ink-10)] overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: d.info.color }} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roster info */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">About This Roster</h2>
              <div className="space-y-2 text-xs text-[var(--ink-50)]">
                <p><span className="text-[var(--ink-70)] font-medium">Source:</span> msitarzewski/agency-agents (GitHub)</p>
                <p><span className="text-[var(--ink-70)] font-medium">License:</span> MIT — free to use, modify, distribute</p>
                <p><span className="text-[var(--ink-70)] font-medium">Total:</span> {totalAgents} agents across 18 divisions</p>
                <p><span className="text-[var(--ink-70)] font-medium">Usage:</span> Each agent is a markdown file with YAML frontmatter + system prompt. Copy into Claude Code (~/.claude/agents/), Cursor, Codex, or use as system prompt for any LLM.</p>
                <p className="text-[var(--ink-50)] mt-3">Click any agent to view its full prompt. Use the "Use This Agent" button to activate it in your current workflow.</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Use as prompt", icon: "📝", color: "#2F6FED" },
                  { label: "View full prompt", icon: "📄", color: "#7C3AED" },
                  { label: "Add to workflow", icon: "⚡", color: "#059669" },
                  { label: "Download all", icon: "⬇️", color: "#D97706" },
                ].map(a => (
                  <button key={a.label} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span style={{ color: a.color }}>{a.icon}</span>{a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}