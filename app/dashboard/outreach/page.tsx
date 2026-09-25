"use client";
import { useEffect, useState } from "react";

import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

interface OutreachData {
  stats: any[]; totals: { total_sent: number; total_replied: number; total_booked: number; total_no_reply: number };
  today: { sent: number; replied: number; booked: number }; metrics: any[];
}
interface Lead { id: string; business_name: string; score: number; stage: string; category: string; city: string; }

export default function OutreachPage() {
  const [data, setData] = useState<OutreachData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"activity" | "drafts" | "calendar">("activity");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/outreach").then(r => r.json()),
      fetch("/api/dashboard/pipeline").then(r => r.json()),
    ]).then(([o, p]) => { setData(o); setLeads(p.pipeline.slice(0, 5)); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const t = data?.totals || { total_sent: 0, total_replied: 0, total_booked: 0, total_no_reply: 0 };
  const today = data?.today || { sent: 0, replied: 0, booked: 0 };
  const rate = t.total_sent > 0 ? Math.round((t.total_replied / t.total_sent) * 100) : 0;

  const channels = [
    { id: "email", label: "Email", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V17.25a2.25 2.25 0 00-2.25-2.25m19.5 0H6.75A2.25 2.25 0 014.5 15v-5.25A2.25 2.25 0 016.75 7.5h15z"/></svg> },
    { id: "phone", label: "Phone", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.673 15 15 15h2.25c-4.527 0-8.25-3.723-8.25-8.25v-1.5c0-4.527 3.723-8.25 8.25-8.25h1.5z"/></svg> },
    { id: "gbp_message", label: "Google Maps", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"/></svg> },
  ];

  if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" /><p className="text-sm text-[var(--ink-50)] mt-2">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg)]/50 text-[var(--ink-50)] hover:bg-[var(--bg-raised)]"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7m0 0l-7 7 7 7"/></svg></a>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/25"><svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V17.25a2.25 2.25 0 00-2.25-2.25m19.5 0H6.75A2.25 2.25 0 014.5 15v-5.25A2.25 2.25 0 016.75 7.5h15z"/></svg></div>
            <div><h1 className="text-sm font-bold text-[var(--ink)]">Outreach & CRM</h1><p className="text-[10px] text-[var(--ink-50)]">{t.total_sent} sent · {t.total_replied} replies · {t.total_booked} booked</p></div>
          </div>
        </div>
        <div className="flex gap-1">
          {(["activity","drafts","calendar"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize ${activeTab === tab ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)]/50 text-[var(--ink-50)] hover:bg-[var(--bg-raised)]"}`}>{tab}</button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Sent", value: t.total_sent, sub: "All time", color: "var(--accent)", icon: channels[0].icon },
                { label: "Replies", value: t.total_replied, sub: `${rate}% rate`, color: "var(--green)", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                { label: "Calls Booked", value: t.total_booked, sub: "Meetings", color: "var(--amber)", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                { label: "Today", value: today.sent, sub: `${today.replied} replied`, color: "var(--ink)", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] p-4 flex items-center gap-3 shadow-sm">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>{s.icon}</div>
                  <div><p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p><p className="text-[10px] text-[var(--ink-50)]">{s.sub}</p></div>
                </div>
              ))}
            </div>

            {/* Channel breakdown */}
            <div className="rounded-2xl border border-[var(--ink-10)] shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Channel Breakdown</h2>
              </div>
              <div className="p-4">
                <p className="text-xs text-[var(--ink-50)] mb-3">No outreach sent yet. Draft your first message to begin.</p>
                <div className="space-y-2">
                  {channels.map(c => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 p-3">
                      <div className="flex items-center gap-2"><span className="text-[var(--ink-40)]">{c.icon}</span><span className="text-xs font-medium capitalize text-[var(--ink)]">{c.label}</span></div>
                      <span className="text-xs font-semibold text-[var(--ink-50)]">0 sent</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Draft form */}
            <div className="rounded-2xl border-2 border-[var(--accent-20)] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-[var(--accent-tint)] border-b border-[var(--accent-20)]">
                <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5l-9 6 9 6m0 0l-9-6 9-6"/></svg>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-strong)]">Draft Outreach</h2>
              </div>
              <div className="p-4">
                <p className="text-xs text-[var(--ink-50)] mb-3">Select a lead and channel to create a draft for CEO review.</p>
                {leads.length === 0 ? <p className="text-xs text-[var(--ink-40)] italic">No leads available.</p> : (
                  <div className="space-y-2">
                    <select className="w-full rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]">
                      <option value="">Select a lead...</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.business_name} ({l.city}) — {l.score}pts</option>)}
                    </select>
                    <div className="flex gap-2">
                      <select className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-sm text-[var(--ink)] flex-1 focus:outline-none focus:border-[var(--accent)]">
                        <option value="">Channel...</option>
                        {channels.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-dark)] transition-colors">Draft</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-[var(--ink-10)] shadow-sm overflow-hidden sticky top-20">
              <div className="px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">Top Leads</h3>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                {leads.map(l => (
                  <button key={l.id} className="w-full flex items-center gap-2 rounded-lg p-2 text-left hover:bg-[var(--bg-raised)]">
                    <div className={`h-7 w-7 rounded flex items-center justify-center text-xs font-bold ${l.score >= 80 ? "bg-blue-100 text-blue-700" : l.score >= 65 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{l.score}</div>
                    <div className="flex-1 min-w-0"><p className="text-xs font-medium text-[var(--ink)] truncate">{l.business_name}</p><p className="text-[9px] text-[var(--ink-40)] truncate">{l.category} · {l.city}</p></div>
                  </button>
                ))}
                {leads.length === 0 && <p className="text-xs text-[var(--ink-40)] text-center py-4">No leads</p>}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)] mb-3">Quick Stats</h3>
              <div className="space-y-2">
                {[
                  { label: "Response rate", value: `${rate}%`, color: "text-[var(--green)]" },
                  { label: "Today sent", value: today.sent, color: "text-[var(--ink)]" },
                  { label: "Today replied", value: today.replied, color: "text-[var(--ink)]" },
                  { label: "Booked calls", value: t.total_booked, color: "text-[var(--amber)]" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between"><span className="text-xs text-[var(--ink-50)]">{s.label}</span><span className={`text-xs font-semibold ${s.color}`}>{s.value}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      <DepartmentAgents departmentId="outreach" deptColor="#E4DAC6" deptName="Outreach & CRM" deptIcon="💌" />
      </div>
    </div>
  );
}