"use client";

import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface Idea {
  id: string; title: string; category: string; status: string; score: number; description: string; source: string;
}

interface WatchlistItem {
  id: string; name: string; url: string; category: string; added: string; notes: string; status: string;
}

const MOCK_IDEAS: Idea[] = [
  { id: "i1", title: "Healthcare Lead Scraper", category: "Sales Automation", status: "shortlisted", score: 92, description: "Scrape healthcare provider leads (dentists, chiropractors, medspas) with enrichment. Proven 38-lead run in Houston.", source: "Live data — Houston scrape" },
  { id: "i2", title: "Multi-Channel Outreach Orchestrator", category: "Outreach", status: "shortlisted", score: 88, description: "Draft, review, approve, send across email + LinkedIn + SMS. CEO-in-loop approval gate.", source: "Outreach gap analysis" },
  { id: "i3", title: "Content Engine — AI Draft + Review", category: "Marketing", status: "shortlisted", score: 85, description: "AI drafts social content, CEO reviews in command center, auto-schedules to LinkedIn + X + Instagram.", source: "11 drafts from today's batch" },
  { id: "i4", title: "Obsidian Brain Sync", category: "Ops", status: "shortlisted", score: 82, description: "Two-way sync between Obsidian vault and agency.json — single source of truth for notes, leads, drafts.", source: "Obsidian gap analysis" },
  { id: "i5", title: "Client Onboarding Automator", category: "Delivery", status: "shortlisted", score: 79, description: "Auto-setup client workspace: n8n workflows, dashboard access, CRM records, welcome sequence.", source: "Operations gap" },
];

const MOCK_WATCHLIST: WatchlistItem[] = [
  { id: "w1", name: "cursor.com", url: "https://cursor.com", category: "Dev Tool", added: "Sep 20", notes: "AI code editor — for dev agency work", status: "watching" },
  { id: "w2", name: "n8n.io", url: "https://n8n.io", category: "Automation", added: "Sep 20", notes: "Self-hosted workflow automation — already running", status: "active" },
  { id: "w3", name: "claude.com", url: "https://claude.com", category: "AI", added: "Sep 19", notes: "Anthropic Claude — agent hosting option", status: "watching" },
  { id: "w4", name: "opencode.dev", url: "https://opencode.dev", category: "Dev Tool", added: "Sep 19", notes: "OpenCode CLI — dev agent runtime", status: "watching" },
  { id: "w5", name: "hermes.nousresearch.com", url: "https://hermes.nousresearch.com", category: "AI Agent", added: "Sep 19", notes: "Hermes Agent — cron + auto-start already configured", status: "active" },
  { id: "w6", name: "solar.pro", url: "https://solar.pro", category: "AI", added: "Sep 19", notes: "Upstage Solar Pro 4 — free tier for reasoning", status: "active" },
  { id: "w7", name: "obsidian.md", url: "https://obsidian.md", category: "Knowledge", added: "Sep 18", notes: "Second brain — 73 notes in QubNexa vault", status: "active" },
  { id: "w8", name: "notion.so", url: "https://notion.so", category: "Knowledge", added: "Sep 18", notes: "Alternative knowledge base — evaluate vs Obsidian", status: "comparing" },
  { id: "w9", name: "linear.app", url: "https://linear.app", category: "Dev Tool", added: "Sep 17", notes: "Issue tracking — for dev projects", status: "watching" },
  { id: "w10", name: "github.com", url: "https://github.com", category: "Dev Tool", added: "Sep 17", notes: "Repo hosting — agency-agents, qubnexa_website", status: "active" },
  { id: "w11", name: "stripe.com", url: "https://stripe.com", category: "Payments", added: "Sep 16", notes: "Payment processing — for client invoicing", status: "watching" },
  { id: "w12", name: "sendgrid.com", url: "https://sendgrid.com", category: "Email", added: "Sep 16", notes: "Transactional email — outreach sending", status: "watching" },
  { id: "w13", name: "linkedin.com", url: "https://linkedin.com", category: "Social", added: "Sep 15", notes: "B2B outreach — primary channel", status: "active" },
  { id: "w14", name: "twitter.com", url: "https://twitter.com", category: "Social", added: "Sep 15", notes: "Content distribution — X/Twitter", status: "active" },
  { id: "w15", name: "instagram.com", url: "https://instagram.com", category: "Social", added: "Sep 15", notes: "Visual content — Instagram", status: "active" },
  { id: "w16", name: "railway.app", url: "https://railway.app", category: "Hosting", added: "Sep 14", notes: "Deploy n8n + dashboard — free tier", status: "watching" },
  { id: "w17", name: "supabase.com", url: "https://supabase.com", category: "DB", added: "Sep 14", notes: "PostgreSQL — eventual DB backend", status: "watching" },
  { id: "w18", name: "vercel.com", url: "https://vercel.com", category: "Hosting", added: "Sep 14", notes: "Next.js hosting — dashboard deploy target", status: "watching" },
  { id: "w19", name: "docker.com", url: "https://docker.com", category: "Infra", added: "Sep 13", notes: "Containerization — n8n + services", status: "active" },
];

export default function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ideas" | "watchlist" | "trends">("ideas");

  useEffect(() => { setLoading(false); }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.668 0-8 1.332-8 4v2h16v-2c0-2.668-5.332-4-8-4z"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Product Research</h1>
            <p className="text-[10px] text-[var(--ink-50)]">Ideas · watchlist · trends · skill discovery</p>
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
            { label: "Ideas", value: "5", sub: "total generated", color: "#7C3AED" },
            { label: "Shortlisted", value: "5", sub: "ready to build", color: "#D97706" },
            { label: "Watchlist", value: "19", sub: "tools tracked", color: "#0B1E3D" },
            { label: "Ready to Build", value: "0", sub: "in development", color: "#dc2626" },
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
              {(["ideas", "watchlist", "trends"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${(activeTab === tab) ? "bg-[var(--bg)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-40)] hover:text-[var(--ink-70)]"}`}>
                  {tab === "ideas" ? "Ideas" : tab === "watchlist" ? "Watchlist" : "Trends"}
                </button>
              ))}
            </div>

            {/* Ideas tab */}
            {activeTab === "ideas" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Product Ideas</h2>
                  <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ New Idea</button>
                </div>
                <div className="space-y-3">
                  {MOCK_IDEAS.map(idea => (
                    <div key={idea.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--ink)]">{idea.title}</p>
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${(idea.status === "shortlisted") ? "bg-amber-100 text-amber-700" : idea.status === "watching" ? "bg-[var(--ink-10)] text-[var(--ink-50)]" : "bg-green-100 text-green-700"}`}>
                              {idea.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--ink-40)] mt-1">{idea.description}</p>
                          <p className="text-[9px] text-[var(--ink-40)] mt-1.5">Source: {idea.source}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold" style={{ color: idea.score > 85 ? "#059669" : "#D97706" }}>{idea.score}</p>
                          <p className="text-[9px] text-[var(--ink-40)]">score</p>
                          <p className="text-[9px] text-[var(--ink-40)] mt-1">{idea.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">View Details</button>
                        <button className="text-[10px] font-medium text-[var(--ink-50)] bg-[var(--bg)] rounded-md px-2.5 py-1 border border-[var(--ink-10)] hover:bg-[var(--bg-raised)]">Move to Build</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watchlist tab */}
            {activeTab === "watchlist" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Tool Watchlist</h2>
                  <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ Add Tool</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOCK_WATCHLIST.map(item => (
                    <div key={item.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3">
                      <div className="flex items-start gap-2">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--accent-strong)] truncate">{item.name}</p>
                          <p className="text-[9px] text-[var(--ink-40)]">{item.category}</p>
                        </a>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${(item.status === "active") ? "bg-green-100 text-green-700" : item.status === "watching" ? "bg-amber-100 text-amber-700" : "bg-[var(--ink-10)] text-[var(--ink-50)]"}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-[var(--ink-40)] mt-1.5">Added {item.added} · {item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends tab */}
            {activeTab === "trends" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-4">AI & Industry Trends</h2>
                <div className="space-y-3">
                  {[
                    { trend: "AI Agents going mainstream", source: "Industry scan", relevance: "High", note: "Agency model perfectly timed — clients want AI automation" },
                    { trend: "Healthcare tech spending up 35%", source: "Market data", relevance: "High", note: "4 of 5 PRIORITY leads are healthcare — vertical to focus" },
                    { trend: "Self-hosted AI preferred by enterprises", source: "Survey", relevance: "Medium", note: "n8n self-hosted is a selling point" },
                    { trend: "D2C brands automating outreach", source: "Lead scan", relevance: "High", note: "Foxtale, Moxie Beauty — both D2C, both need outreach" },
                  ].map((t, i) => (
                    <div key={i} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{t.trend}</p>
                          <p className="text-[10px] text-[var(--ink-40)] mt-1">{t.note}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${(t.relevance === "High") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {t.relevance}
                          </span>
                          <p className="text-[9px] text-[var(--ink-40)] mt-1">{t.source}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Skill Discovery */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Skill Discovery</h2>
                <span className="text-[10px] text-[var(--ink-40)]">Next scan: Mon 9AM IST</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--ink-10)] bg-[var(--bg)]/50 py-4 text-xs font-medium text-[var(--ink-50)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-tint)]/20 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                Run Skill Discovery Scan
              </button>
              <div className="mt-3 text-[10px] text-[var(--ink-40)] text-center">Scans new AI tools, libraries, and platforms weekly</div>
            </div>

            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {["View ideas", "View watchlist", "Run skill scan", "Research vertical"].map(a => (
                  <button key={a} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="product" deptColor="#7C3AED" deptName="Product Research" deptIcon="💡" />
      </div>
    </div>
  );
}