"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { DepartmentAgents } from "../../../components/command/DepartmentAgents";

/* ─── Types ─── */

interface Lead {
  id: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  score: number;
  rating: number;
  review_count: number;
  stage: string;
  phone: string;
  email: string;
  email_guess: string;
  website: string;
  website_status: string;
  scraped_at: string;
  created_at: string;
  contact_methods: string[];
  primary_contact: string;
  gbp_url: string;
  enrichment?: {
    social_urls?: Record<string, string>;
    email_patterns?: string[];
    candidate_domains?: { domain: string; registered: boolean }[];
  };
}

interface PipelineData {
  pipeline: Lead[];
  grouped: { stage: string; count: number }[];
  stats: {
    total: number;
    byStage: Record<string, number>;
    readyToContact: number;
    needEnrichment: number;
    topScore: number;
    avgScore: number;
  };
}

interface OutreachData {
  stats: any[];
  totals: { total_sent: number; total_replied: number; total_booked: number; total_no_reply: number };
  today: { sent: number; replied: number; booked: number };
  metrics: any[];
}

/* ─── Stage config ─── */

const STAGES = ["new", "enriched", "contacted", "replied", "booked", "won", "lost", "nurture"] as const;
const STAGE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  new: { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  enriched: { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  contacted: { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  replied: { bg: "bg-green-50 dark:bg-green-950/40", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  booked: { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  won: { bg: "bg-green-100 dark:bg-green-950/40", border: "border-green-300 dark:border-green-700", text: "text-green-800 dark:text-green-300", dot: "bg-green-500" },
  lost: { bg: "bg-red-100 dark:bg-red-950/40", border: "border-red-300 dark:border-red-700", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  nurture: { bg: "bg-gray-100 dark:bg-gray-900/40", border: "border-gray-200 dark:border-gray-700", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
};

/* ─── Component ─── */

export default function SalesPage() {
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [producing, setProducing] = useState(false);

  const fetchPipeline = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/pipeline");
      const data = await res.json();
      setPipeline(data);
    } catch (err) {
      console.error("Failed to fetch pipeline:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

  const leadsByStage = useMemo(() => {
    if (!pipeline) return {};
    const map: Record<string, Lead[]> = {};
    for (const lead of pipeline.pipeline) {
      const stage = lead.stage || "new";
      if (!map[stage]) map[stage] = [];
      map[stage].push(lead);
    }
    return map;
  }, [pipeline]);

  const filteredLeads = useMemo(() => {
    if (!pipeline || !activeStage) return pipeline?.pipeline || [];
    return leadsByStage[activeStage] || [];
  }, [pipeline, activeStage, leadsByStage]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [filteredLeads]);

  const totalLeads = pipeline?.stats.total || 0;
  const stages = pipeline?.grouped || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <p className="text-sm text-[var(--ink-50)]">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)] px-4 py-3">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg)]/50 text-[var(--ink-50)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7m0 0l-7 7 7 7"/></svg>
          </a>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
              <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--ink)]">Sales & Pipeline</h1>
              <p className="text-[10px] text-[var(--ink-50)]">{totalLeads} leads · Live scrape data</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">Live</span>
          <span className="text-[10px] text-[var(--ink-40)]">Last updated: {pipeline?.stats.total ? new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "—"}</span>
        </div>
      </header>

      {/* Stage filters */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--ink-10)] overflow-x-auto">
        <button
          onClick={() => setActiveStage(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
            !activeStage
              ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/20"
              : "bg-[var(--bg)]/50 text-[var(--ink-60)] hover:bg-[var(--bg-raised)]"
          }`}
        >
          All ({totalLeads})
        </button>
        {STAGES.map(stage => {
          const count = stages.find(s => s.stage === stage)?.count || 0;
          const colors = STAGE_COLORS[stage];
          if (count === 0) return null;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(activeStage === stage ? null : stage)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                activeStage === stage
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : "bg-[var(--bg)]/50 text-[var(--ink-60)] hover:bg-[var(--bg-raised)]"
              }`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${colors.dot} mr-1.5`} />
              {stage.charAt(0).toUpperCase() + stage.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lead table — 3 columns */}
          <div className="lg:col-span-3">
            {sortedLeads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--ink-10)] p-8 text-center">
                <p className="text-sm text-[var(--ink-50)]">No leads in this stage</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--ink-10)] shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] w-10">#</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)]">Business</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] hidden sm:table-cell">Category</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] hidden md:table-cell">Address</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] w-20">Score</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] w-16">Stage</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] w-20">Rating</th>
                      <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-50)] w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeads.map((lead, idx) => {
                      const stageColors = STAGE_COLORS[lead.stage] || STAGE_COLORS.new;
                      return (
                        <tr
                          key={lead.id}
                          className={`border-b border-[var(--ink-6)] hover:bg-[var(--bg-raised)] transition-colors cursor-pointer ${
                            selectedLead?.id === lead.id ? "bg-[var(--accent-tint)]" : ""
                          }`}
                          onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                        >
                          <td className="px-4 py-2.5 text-[11px] text-[var(--ink-40)]">{idx + 1}</td>
                          <td className="px-4 py-2.5">
                            <p className="text-sm font-semibold text-[var(--ink)] truncate max-w-[200px] sm:max-w-[300px]">{lead.business_name}</p>
                            {lead.phone && (
                              <p className="text-[10px] text-[var(--ink-40)] mt-0.5 truncate">{lead.phone}</p>
                            )}
                            {lead.email_guess && !lead.email && (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 truncate">Guess: {lead.email_guess}</p>
                            )}
                          </td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            <span className="text-xs text-[var(--ink-60)]">{lead.category || "—"}</span>
                          </td>
                          <td className="px-4 py-2.5 hidden md:table-cell">
                            <p className="text-xs text-[var(--ink-50)] truncate max-w-[150px] md:max-w-[250px]">{lead.address || "—"}</p>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <p className={`text-lg font-bold ${
                              lead.score >= 80 ? "text-blue-600 dark:text-blue-400" :
                              lead.score >= 65 ? "text-amber-600 dark:text-amber-400" :
                              "text-gray-500 dark:text-gray-400"
                            }`}>
                              {lead.score}
                            </p>
                            {lead.review_count > 0 && (
                              <p className="text-[9px] text-[var(--ink-40)]">{lead.review_count} reviews</p>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${stageColors.border} ${stageColors.text}`}>
                              {lead.stage}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-semibold text-[var(--ink)]">{lead.rating.toFixed(1)}</span>
                              <span className="text-[9px] text-[var(--ink-40)]">({lead.review_count})</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                                className="rounded-lg hover:bg-[var(--bg-muted)] p-1 text-[var(--ink-40)] hover:text-[var(--ink)] transition-colors"
                                title="View details"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 6-.426 2.396-2.072 4.187-4.032 5.582-2.54 1.802-5.654 2.402-8.594 2.402a4.082 4.082 0 11-8.11 3.322 4.082 4.082 0 018.11-3.322z"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Lead detail sidebar */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="rounded-2xl border border-[var(--ink-10)] shadow-sm overflow-hidden sticky top-20">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--ink-40)] hover:bg-[var(--bg-muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--ink)] truncate">{selectedLead.business_name}</h3>
                    <p className="text-[10px] text-[var(--ink-50)]">{selectedLead.category || "—"}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                    selectedLead.score >= 80 ? "bg-blue-100 text-blue-700" :
                    selectedLead.score >= 65 ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedLead.score}pts
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Contact info */}
                  <div className="rounded-xl bg-[var(--bg)]/50 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-2">Contact</p>
                    <div className="space-y-1.5">
                      {selectedLead.phone ? (
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 shrink-0 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.673 15 15 15h2.25c-4.527 0-8.25-3.723-8.25-8.25v-1.5c0-4.527 3.723-8.25 8.25-8.25h1.5zM12 17.25h.008v.008H12v-.008zM12 17.25v-.008a3 3 0 01-3-3h1.5a3 3 0 013 3v.008zM16.5 12c0-2.217-1.783-4-4.5-4a4.5 4.5 0 00-4.5 4v.008a4.5 4.5 0 004.5 4h1.5z"/></svg>
                          <span className="text-xs text-[var(--ink)]">{selectedLead.phone}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                          <span className="text-xs text-red-500">No phone</span>
                        </div>
                      )}
                      {(selectedLead.email || selectedLead.email_guess) && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 shrink-0 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V17.25a2.25 2.25 0 00-2.25-2.25m19.5 0H6.75A2.25 2.25 0 014.5 15v-5.25A2.25 2.25 0 016.75 7.5h15z"/></svg>
                          <span className="text-xs text-[var(--ink)] break-all">
                            {selectedLead.email || selectedLead.email_guess}
                          </span>
                        </div>
                      )}
                      {selectedLead.gbp_url && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 shrink-0 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75H5.5a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h3.5M9 6.75a2.25 2.25 0 012.25-2.25h3.5a2.25 2.25 0 012.25 2.25m-5.25 2.25v10.5a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25h-1.5z"/></svg>
                          <span className="text-xs text-[var(--ink-50)] truncate">Google Maps</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  {selectedLead.website && (
                    <div className="rounded-xl bg-[var(--bg)]/50 p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-1.5">Website</p>
                      <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:text-[var(--accent-strong)] truncate block">
                        {selectedLead.website}
                      </a>
                      <p className="text-[9px] text-[var(--ink-40)] mt-0.5">Status: {selectedLead.website_status}</p>
                    </div>
                  )}

                  {/* Social links */}
                  {selectedLead.enrichment?.social_urls && Object.keys(selectedLead.enrichment.social_urls).length > 0 && (
                    <div className="rounded-xl bg-[var(--bg)]/50 p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-1.5">Social</p>
                      <div className="space-y-1">
                        {Object.entries(selectedLead.enrichment.social_urls).map(([platform, url]) => (
                          <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--ink-60)] hover:text-[var(--ink)] truncate block">
                            {platform}: {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stage & score */}
                  <div className="rounded-xl bg-[var(--bg)]/50 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--ink-50)] mb-2">Summary</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] text-[var(--ink-40)]">Stage</p>
                        <p className="text-xs font-medium text-[var(--ink)] capitalize">{selectedLead.stage}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--ink-40)]">Scraped</p>
                        <p className="text-xs text-[var(--ink-50)]">{new Date(selectedLead.scraped_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--ink-40)]">Rating</p>
                        <p className="text-xs font-medium text-[var(--ink)]">{selectedLead.rating.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--ink-40)]">Reviews</p>
                        <p className="text-xs text-[var(--ink-50)]">{selectedLead.review_count}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[var(--ink-10)] space-y-1.5">
                    <button className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[var(--accent-20)] bg-[var(--accent-tint)]/30 px-3 py-2 text-xs font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent)]">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.269 3.126a59.768 59.768 0 0112 6c5.531 0 10.057-3.636 11.405-8.087l.552-3.062.551-3.063a59.77 59.77 0 016.083-6.083l3.062-.551 3.063-.552a59.768 59.768 0 018.087-1.405h3.77c3.636 0 6.364 5.531 6.364 11.062 0 1.937-.504 3.786-1.353 5.472a59.768 59.768 0 01-3.063 6.083l-.552 3.062-.551 3.063a59.77 59.77 0 01-6.083 6.083l-3.062.551-3.063.552A59.76 59.76 0 019 18c-5.531 0-10.057-3.636-11.405-8.087l-.552-3.062-.551-3.063a59.77 59.77 0 01-6.083-6.083l-3.062-.551-3.063-.552A59.768 59.768 0 013.269 3.126z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Enrich lead
                    </button>
                    <select
                      className="w-full rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs text-[var(--ink-70)] focus:outline-none focus:border-[var(--accent)]"
                      defaultValue={selectedLead.stage}
                      onChange={(e) => {
                        const newStage = e.target.value;
                        fetch(`/api/dashboard/pipeline`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: selectedLead.id, stage: newStage }),
                        }).then(() => { setSelectedLead({ ...selectedLead, stage: newStage }); fetchPipeline(); });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="new">→ Move to: New</option>
                      <option value="enriched">→ Move to: Enriched</option>
                      <option value="contacted">→ Move to: Contacted</option>
                      <option value="replied">→ Move to: Replied</option>
                      <option value="booked">→ Move to: Booked</option>
                      <option value="won">→ Move to: Won</option>
                      <option value="lost">→ Move to: Lost</option>
                      <option value="nurture">→ Move to: Nurture</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--ink-10)] p-8 text-center">
                <svg className="h-8 w-8 mx-auto mb-3 text-[var(--ink-30)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h8.25a2.25 2.25 0 012.25 2.25v.75m-8.25-.75L9 15m5.25-3.75 3 3 3-3M12 15l3-3"/></svg>
                <p className="text-sm text-[var(--ink-50)]">Select a lead to view details</p>
                <p className="text-[10px] text-[var(--ink-40)] mt-1">Click any row in the table</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: totalLeads, color: "var(--accent)", icon: "target" },
            { label: "Ready to Contact", value: pipeline?.stats.readyToContact || 0, color: "var(--green)", icon: "check" },
            { label: "Need Enrichment", value: pipeline?.stats.needEnrichment || 0, color: "var(--amber)", icon: "alert" },
            { label: "Top Score", value: `${pipeline?.stats.topScore || 0}pts`, color: "var(--accent)", icon: "star" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] p-3 flex items-center gap-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                {stat.icon === "target" && <svg className="h-4 w-4" style={{ color: stat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
                {stat.icon === "check" && <svg className="h-4 w-4" style={{ color: stat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                {stat.icon === "alert" && <svg className="h-4 w-4" style={{ color: stat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>}
                {stat.icon === "star" && <svg className="h-4 w-4" style={{ color: stat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 14.39 9.5 15.5 6 12 4.5 13.5 3 15l4.5 4.5L18 9l3-3-1.5-1.5z"/></svg>}
              </div>
              <div>
                <p className="text-xs text-[var(--ink-50)]">{stat.label}</p>
                <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DepartmentAgents departmentId="sales" deptColor="#2F6FED" deptName="Sales & Pipeline" deptIcon="🎯" />
    </div>
  );
}