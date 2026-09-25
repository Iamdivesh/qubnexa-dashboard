"use client";

import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface Project {
  id: string; name: string; status: string; progress: number; tickets: number; agent: string | null; deadline: string;
}

const MOCK_PROJECTS: Project[] = [
  { id: "p1", name: "QubNexa Command Center", status: "in_progress", progress: 72, tickets: 8, agent: "Solar Pro 4 (active)", deadline: "Oct 15, 2026" },
  { id: "p2", name: "n8n Workflow Library", status: "not_started", progress: 0, tickets: 12, agent: null, deadline: "Nov 1, 2026" },
  { id: "p3", name: "Client Onboarding Flow", status: "not_started", progress: 0, tickets: 6, agent: null, deadline: "Nov 15, 2026" },
];

interface Ticket {
  id: string; project: string; title: string; priority: string; status: string; assignee: string | null;
}

const MOCK_TICKETS: Ticket[] = [
  { id: "t1", project: "QubNexa Command Center", title: "Add department deep-dive pages", priority: "high", status: "in_progress", assignee: "Solar Pro 4" },
  { id: "t2", project: "QubNexa Command Center", title: "Connect Obsidian as brain sync", priority: "medium", status: "todo", assignee: null },
  { id: "t3", project: "QubNexa Command Center", title: "Implement agency-agents personas", priority: "medium", status: "done", assignee: "Solar Pro 4" },
  { id: "t4", project: "QubNexa Command Center", title: "Dark/light theme toggle", priority: "low", status: "done", assignee: "Solar Pro 4" },
  { id: "t5", project: "n8n Workflow Library", title: "Build healthcare lead scraper workflow", priority: "high", status: "todo", assignee: null },
  { id: "t6", project: "n8n Workflow Library", title: "Build outreach orchestrator workflow", priority: "high", status: "todo", assignee: null },
  { id: "t7", project: "n8n Workflow Library", title: "Build content pipeline workflow", priority: "medium", status: "todo", assignee: null },
  { id: "t8", project: "Client Onboarding Flow", title: "Auto-create client workspace", priority: "medium", status: "todo", assignee: null },
];

export default function DevelopmentPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "tickets" | "agents">("projects");

  useEffect(() => { setLoading(false); }, []);

  const openTickets = MOCK_TICKETS.filter(t => t.status !== "done").length;
  const devAgents = [
    { name: "Solar Pro 4", status: "active", role: "Primary dev agent", tasks: 2, note: "Building dashboard — currently active" },
    { name: "OpenCode CLI", status: "not_connected", role: "Dev agent runtime", tasks: 0, note: "Install and configure to enable" },
    { name: "Claude Code", status: "not_connected", role: "Alternative dev agent", tasks: 0, note: "Optional — for comparison" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Development</h1>
            <p className="text-[10px] text-[var(--ink-50)]">Projects · tickets · dev agents · repositories</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="flex items-center gap-1 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-2.5 py-1 text-[10px] text-[var(--ink-50)] hover:bg-[var(--bg-raised)]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Command Center
          </a>
        </div>
      </header>

      <div className="flex w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Projects", value: String(MOCK_PROJECTS.length), sub: "total", color: "#D97706" },
            { label: "In Progress", value: "1", sub: "active now", color: "#2F6FED" },
            { label: "Open Tickets", value: String(openTickets), sub: "need attention", color: "#dc2626" },
            { label: "Dev Agents", value: "1/3", sub: "connected", color: "#059669" },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[var(--ink-50)] font-medium uppercase tracking-wider">{kpi.label}</span>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: kpi.color }} />
              </div>
              <p className="text-3xl font-bold text-[var(--ink)]">{kpi.value}</p>
              <p className="text-[10px] text-[var(--ink-40)] mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] p-1">
              {(["projects", "tickets", "agents"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${(activeTab === tab) ? "bg-[var(--bg)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-40)] hover:text-[var(--ink-70)]"}`}>
                  {tab === "projects" ? "Projects" : tab === "tickets" ? "Tickets" : "Dev Agents"}
                </button>
              ))}
            </div>

            {/* Projects tab */}
            {activeTab === "projects" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Projects</h2>
                  <button className="text-[10px] font-medium text-white bg-[var(--accent)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-dark)]">+ New Project</button>
                </div>
                <div className="space-y-3">
                  {MOCK_PROJECTS.map(project => (
                    <div key={project.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--ink)]">{project.name}</p>
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${(project.status === "in_progress") ? "bg-blue-100 text-blue-700" : project.status === "not_started" ? "bg-[var(--ink-10)] text-[var(--ink-50)]" : "bg-green-100 text-green-700"}`}>
                              {project.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 rounded-full bg-[var(--ink-10)] overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: project.progress > 0 ? "#2F6FED" : "transparent", border: project.progress === 0 ? "1px dashed var(--ink-20)" : "none" }} />
                            </div>
                            <span className="text-[9px] text-[var(--ink-40)]">{project.progress}%</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[var(--ink-40)]">
                            <span>{project.tickets} tickets</span>
                            <span>·</span>
                            <span>{project.agent || "No agent assigned"}</span>
                            <span>·</span>
                            <span>Due {project.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">View Board</button>
                        <button className="text-[10px] font-medium text-[var(--ink-50)] bg-[var(--bg)] rounded-md px-2.5 py-1 border border-[var(--ink-10)] hover:bg-[var(--bg-raised)]">Add Ticket</button>
                        <button className="text-[10px] font-medium text-[var(--ink-40)] bg-transparent rounded-md px-2.5 py-1 hover:text-[var(--ink-70)]">Repo</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tickets tab */}
            {activeTab === "tickets" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Tickets</h2>
                  <button className="text-[10px] font-medium text-white bg-[var(--accent)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-dark)]">+ New Ticket</button>
                </div>
                <div className="space-y-2">
                  {MOCK_TICKETS.map(ticket => (
                    <div key={ticket.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3 flex items-start gap-3">
                      <div className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${(ticket.priority === "high") ? "bg-red-100 text-red-700" : ticket.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-[var(--ink-10)] text-[var(--ink-50)]"}`}>
                        {ticket.priority}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)] truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-[var(--ink-40)]">{ticket.project}</span>
                          <span className="text-[9px] text-[var(--ink-40)]">·</span>
                          <span className={`text-[9px] ${ticket.status === "done" ? "text-green-600" : ticket.status === "in_progress" ? "text-blue-600" : "text-[var(--ink-40)]"}`}>
                            {ticket.status.replace("_", " ")}
                          </span>
                          <span className="text-[9px] text-[var(--ink-40)]">·</span>
                          <span className="text-[9px] text-[var(--ink-40)]">{ticket.assignee || "Unassigned"}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button className="text-[9px] text-[var(--ink-40)] hover:text-[var(--accent)] px-1.5">Move</button>
                        <button className="text-[9px] text-[var(--ink-40)] hover:text-[var(--ink-70)] px-1.5">Assign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agents tab */}
            {activeTab === "agents" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Dev Agents</h2>
                  <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ Connect Agent</button>
                </div>
                <div className="space-y-3">
                  {devAgents.map(agent => (
                    <div key={agent.name} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${(agent.status === "active") ? "bg-green-100" : "bg-[var(--ink-10)]"}`}>
                            <span className="text-sm font-bold" style={{ color: agent.status === "active" ? "#059669" : "var(--ink-40)" }}>
                              {agent.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--ink)]">{agent.name}</p>
                            <p className="text-[9px] text-[var(--ink-40)]">{agent.role}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${(agent.status === "active") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {agent.status === "active" ? "Active" : "Not Connected"}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--ink-40)] mt-2">{agent.note}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-[var(--ink-40)]">{agent.tasks} active tasks</span>
                        {agent.status !== "active" && (
                          <button className="ml-auto text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">Connect</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Repository + Quick Actions */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Repositories</h2>
              <div className="space-y-2.5">
                {[
                  { name: "qubnexa_website", url: "github.com/divesh/qubnexa_website", desc: "Next.js 16 dashboard — live at localhost:3000", lang: "TypeScript" },
                  { name: "agency-agents", url: "github.com/msitarzewski/agency-agents", desc: "150+ agent personas — 13 divisions", lang: "Markdown" },
                  { name: "agency-automations", url: "github.com/divesh/agency-automations", desc: "n8n workflows — not yet created", lang: "—" },
                ].map(repo => (
                  <div key={repo.name} className="rounded-lg bg-[var(--bg)]/50 p-3">
                    <div className="flex items-center justify-between">
                      <a href={`https://${repo.url}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--accent-strong)] truncate hover:underline">
                        {repo.name}
                      </a>
                      <span className="text-[9px] text-[var(--ink-40)] shrink-0 ml-2">{repo.lang}</span>
                    </div>
                    <p className="text-[9px] text-[var(--ink-40)] truncate mt-0.5">{repo.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {["View projects", "View tickets", "Connect agent", "Open repo"].map(a => (
                  <button key={a} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{a}
                  </button>
                ))}
              </div>
            </div>

            {/* Setup note */}
            <div className="rounded-2xl border border-amber-500 bg-amber-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Dev Setup Needed</span>
              </div>
              <p className="text-xs text-amber-700">Install OpenCode CLI + configure dev agents to enable full development automation. Dashboard build is in progress by Solar Pro 4.</p>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="development" deptColor="#D97706" deptName="Development" deptIcon="💻" />
      </div>
    </div>
  );
}