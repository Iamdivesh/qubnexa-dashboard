"use client";

import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface Draft {
  id: string; platform: string; topic: string; hashtag: string; status: string; word_count: number; created: string;
}

const MOCK_DRAFTS: Draft[] = [
  { id: "d1", platform: "LinkedIn", topic: "AI Automation for Houston Businesses", hashtag: "#AI #Automation #Houston", status: "ready", word_count: 145, created: "Today 06:19 AM" },
  { id: "d2", platform: "LinkedIn", topic: "Healthcare Lead Generation — What We Found", hashtag: "#Healthcare #LeadGen #B2B", status: "ready", word_count: 168, created: "Today 06:19 AM" },
  { id: "d3", platform: "LinkedIn", topic: "Building a Self-Hosted AI Agency", hashtag: "#n8n #SelfHosted #AI", status: "ready", word_count: 203, created: "Today 06:19 AM" },
  { id: "d4", platform: "X/Twitter", topic: "AI agents are eating the agency model", hashtag: "#AI #Agentic #FutureOfWork", status: "ready", word_count: 28, created: "Today 06:19 AM" },
  { id: "d5", platform: "X/Twitter", topic: "38 healthcare leads in Houston — here's what we found", hashtag: "#Sales #Houston #Healthcare", status: "ready", word_count: 35, created: "Today 06:19 AM" },
  { id: "d6", platform: "X/Twitter", topic: "n8n vs Zapier — why self-hosted wins for agencies", hashtag: "#n8n #Automation #OpenSource", status: "ready", word_count: 42, created: "Today 06:19 AM" },
  { id: "d7", platform: "X/Twitter", topic: "AI is not replacing agencies — it's making them dangerous", hashtag: "#AI #Agency #Growth", status: "ready", word_count: 31, created: "Today 06:19 AM" },
  { id: "d8", platform: "X/Twitter", topic: "The $597 setup that replaces a $5K/month retainer", hashtag: "#Pricing #Agency #AI", status: "ready", word_count: 29, created: "Today 06:19 AM" },
  { id: "d9", platform: "X/Twitter", topic: "Your competitors are already using AI agents", hashtag: "#AI #Competition #Strategy", status: "ready", word_count: 26, created: "Today 06:19 AM" },
  { id: "d10", platform: "Instagram", topic: "AI Dashboard Tour — Command Center Walkthrough", hashtag: "#AI #Dashboard #Tech", status: "ready", word_count: 87, created: "Today 06:19 AM" },
  { id: "d11", platform: "Instagram", topic: "Behind the Scenes — Building an AI Agency", hashtag: "#BuildInPublic #Agency #AI", status: "ready", word_count: 94, created: "Today 06:19 AM" },
  { id: "d12", platform: "Instagram", topic: "5 AI Tools We're Watching This Week", hashtag: "#AI #Tools #TechTrends", status: "ready", word_count: 76, created: "Today 06:19 AM" },
];

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"drafts" | "calendar" | "analytics">("drafts");
  const [filter, setFilter] = useState<"all" | "linkedin" | "x" | "instagram">("all");

  useEffect(() => { setLoading(false); }, []);

  const drafts = MOCK_DRAFTS;
  const filtered = filter === "all" ? drafts : drafts.filter(d => d.platform.toLowerCase().replace("/","") === filter);
  const linkedinCount = drafts.filter(d => d.platform === "LinkedIn").length;
  const xCount = drafts.filter(d => d.platform === "X/Twitter").length;
  const igCount = drafts.filter(d => d.platform === "Instagram").length;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const schedule = Array(7).fill(null);
  schedule[1] = { platform: "LinkedIn", topic: "AI Automation for Houston Businesses", time: "09:00 AM" };
  schedule[2] = { platform: "X/Twitter", topic: "AI agents are eating the agency model", time: "10:00 AM" };
  schedule[3] = { platform: "Instagram", topic: "AI Dashboard Tour", time: "06:00 PM" };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
            <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875z"/></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--ink)]">Marketing & Content</h1>
            <p className="text-[10px] text-[var(--ink-50)]">Content calendar · drafts · posting schedule · analytics</p>
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
            { label: "Drafts Ready", value: String(drafts.length), sub: "awaiting approval", color: "#D97706" },
            { label: "Posted Today", value: "0", sub: "published", color: "#059669" },
            { label: "LinkedIn", value: String(linkedinCount), sub: "drafts", color: "#2F6FED" },
            { label: "X / Instagram", value: `${xCount} / ${igCount}`, sub: "drafts", color: "#7C3AED" },
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
              {(["drafts", "calendar", "analytics"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${(activeTab === tab) ? "bg-[var(--bg)] text-[var(--ink)] shadow-sm" : "text-[var(--ink-40)] hover:text-[var(--ink-70)]"}`}>
                  {tab === "drafts" ? "Drafts" : tab === "calendar" ? "Calendar" : "Analytics"}
                </button>
              ))}
            </div>

            {/* Drafts tab */}
            {activeTab === "drafts" && (
              <div>
                {/* Platform filter */}
                <div className="flex gap-2 mb-4">
                  {(["all", "linkedin", "x", "instagram"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${(filter === f) ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-raised)] text-[var(--ink-50)] hover:text-[var(--ink-70)]"}`}>
                      {f === "all" ? "All" : f === "linkedin" ? "LinkedIn" : f === "x" ? "X/Twitter" : "Instagram"}
                      <span className="ml-1 text-[9px] opacity-70">({f === "all" ? drafts.length : f === "linkedin" ? linkedinCount : f === "x" ? xCount : igCount})</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {filtered.map(draft => (
                    <div key={draft.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${(draft.platform === "LinkedIn") ? "bg-blue-100 text-blue-700" : draft.platform === "X/Twitter" ? "bg-black text-white" : "bg-pink-100 text-pink-700"}`}>
                            {draft.platform}
                          </span>
                          <span className="text-[9px] text-[var(--ink-40)]">{draft.word_count} words</span>
                          <span className="text-[9px] text-[var(--ink-40)]">·</span>
                          <span className="text-[9px] text-[var(--ink-40)]">{draft.created}</span>
                        </div>
                        <span className="text-[9px] text-amber-700 font-medium">Ready for review</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--ink)] mb-1.5">{draft.topic}</p>
                      <p className="text-[10px] text-[var(--ink-40)] mb-2">{draft.hashtag}</p>
                      <div className="flex items-center gap-2">
                        <button className="text-[10px] font-medium text-white bg-[var(--accent)] rounded-md px-3 py-1 hover:bg-[var(--accent-dark)]">Review & Approve</button>
                        <button className="text-[10px] font-medium text-[var(--ink-50)] bg-[var(--bg)] rounded-md px-3 py-1 border border-[var(--ink-10)] hover:bg-[var(--bg-raised)]">Edit</button>
                        <button className="text-[10px] font-medium text-[var(--ink-40)] bg-transparent rounded-md px-3 py-1 hover:text-[var(--ink-70)]">Schedule</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar tab */}
            {activeTab === "calendar" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Content Calendar — This Week</h2>
                  <button className="text-[10px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] rounded-md px-2.5 py-1 hover:bg-[var(--accent-20)]">+ Schedule Post</button>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                  {days.map((day, i) => (
                    <div key={i} className={`text-center rounded-lg py-2 text-[10px] font-medium ${(i < 3) ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]" : "bg-[var(--bg)]/50 text-[var(--ink-50)]"}`}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {schedule.map((post, i) => (
                    post && (
                      <div key={i} className="rounded-xl border border-[var(--accent)] bg-[var(--accent-tint)]/20 p-3 flex items-center gap-3">
                        <div className="text-center shrink-0">
                          <p className="text-xs font-bold text-[var(--accent-strong)]">{post.time}</p>
                          <p className="text-[9px] text-[var(--ink-40)]">{days[i]}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--ink)]">{post.topic}</p>
                          <p className="text-[9px] text-[var(--accent-strong)]">{post.platform}</p>
                        </div>
                        <button className="text-[9px] text-[var(--accent)] font-medium hover:underline">Edit</button>
                      </div>
                    )
                  ))}
                  {schedule.filter(p => p !== null).length === 0 && (
                    <div className="rounded-xl bg-[var(--ink-10)] p-6 text-center">
                      <p className="text-sm text-[var(--ink-50)]">No posts scheduled</p>
                      <p className="text-[10px] text-[var(--ink-40)] mt-1">Approve drafts to auto-schedule</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics tab */}
            {activeTab === "analytics" && (
              <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-4">Content Analytics (Placeholder)</h2>
                <div className="rounded-xl bg-[var(--ink-10)] p-6 text-center mb-4">
                  <p className="text-sm text-[var(--ink-50)]">No posts published yet</p>
                  <p className="text-[10px] text-[var(--ink-40)] mt-1">Analytics will appear after first post goes live</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["LinkedIn", "X/Twitter", "Instagram"].map(platform => (
                    <div key={platform} className="rounded-xl bg-[var(--bg)]/50 p-3 text-center">
                      <p className="text-[9px] text-[var(--ink-40)] mb-1">{platform}</p>
                      <p className="text-lg font-bold text-[var(--ink-40)]">0</p>
                      <p className="text-[9px] text-[var(--ink-40)]">impressions</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Actions */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Review Queue</h2>
              <div className="space-y-2">
                {[
                  { platform: "LinkedIn", topic: "AI Automation for Houston Businesses", status: "ready" },
                  { platform: "LinkedIn", topic: "Healthcare Lead Generation", status: "ready" },
                  { platform: "X/Twitter", topic: "AI agents are eating the agency model", status: "ready" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-2.5">
                    <div>
                      <p className="text-xs font-medium text-[var(--ink)]">{item.platform}</p>
                      <p className="text-[9px] text-[var(--ink-40)] truncate max-w-[160px]">{item.topic}</p>
                    </div>
                    <span className="text-[9px] text-amber-600 font-medium">Review</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--ink-10)] text-center">
                <p className="text-[10px] text-[var(--ink-40)]">3 drafts waiting for your approval</p>
                <button className="mt-1 text-[10px] font-medium text-[var(--accent)] hover:underline">Approve All</button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {["Review drafts", "Approve for posting", "View calendar", "Draft new content"].map(a => (
                  <button key={a} className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="marketing" deptColor="#059669" deptName="Marketing & Content" deptIcon="📢" />
      </div>
    </div>
  );
}