"use client";

import { useState, useCallback } from "react";
import { LeadPipelinePanel } from "@/components/dashboard/LeadPipelinePanel";

interface PipelineLead {
  id: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  score: number;
  rating: number;
  review_count: number;
  website: string;
  website_status: string;
  stage: string;
  phone: string;
  email: string;
  email_guess: string;
  email_patterns: string[];
  social_urls: Record<string, string>;
  contact_methods: string[];
  primary_contact: string;
  gbp_url: string;
  gbp_phone: string;
  gbp_hours: string;
  gbp_services: string[];
  gbp_about: string;
  scraped_at: string;
  created_at: string;
}

interface PipelineData {
  pipeline: PipelineLead[];
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

const STAGE_LABELS: Record<string, string> = {
  new: "New leads",
  enriched: "Enriched",
  contacted: "Contacted",
  replied: "Replied",
  booked: "Call booked",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
};

const STAGE_COLORS: Record<string, string> = {
  new: "bg-[var(--accent)] text-white",
  enriched: "bg-[var(--ink-40)] text-white",
  contacted: "bg-[var(--sand)] text-[var(--ink)]",
  replied: "bg-[var(--accent-strong)] text-white",
  booked: "bg-[var(--green)] text-white",
  won: "bg-[var(--green)] text-white",
  lost: "bg-[var(--red)] text-white",
  nurture: "bg-[var(--ink-20)] text-[var(--ink)]",
};

const STAGE_GLOW: Record<string, string> = {
  new: "shadow-[0_0_12px_var(--accent)]",
  enriched: "shadow-[0_0_8px_var(--ink-40)]",
  contacted: "shadow-[0_0_6px_var(--sand)]",
  replied: "shadow-[0_0_10px_var(--accent-strong)]",
  booked: "shadow-[0_0_12px_var(--green)]",
  won: "shadow-[0_0_12px_var(--green)]",
  lost: "shadow-[0_0_8px_var(--red)]",
  nurture: "shadow-[0_0_4px_var(--ink-20)]",
};

export default function OutreachPipelinePanel() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/pipeline");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => { fetchPipeline(); });

  const moveStage = useCallback(
    async (leadId: string, newStage: string) => {
      setMoving(leadId);
      try {
        const res = await fetch("/api/dashboard/pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: leadId, stage: newStage }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "failed" }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        await fetchPipeline();
      } catch (e) {
        setError(String(e));
      } finally {
        setMoving(null);
      }
    },
    [fetchPipeline]
  );

  const stageDropdowns = (lead: PipelineLead) => {
    const currentIdx = Object.keys(STAGE_LABELS).indexOf(lead.stage);
    const stages = Object.keys(STAGE_LABELS);
    return (
      <select
        className={`${lead.stage === "new" ? "text-[var(--accent)]" : ""} text-xs rounded-md border border-[var(--ink-10)] bg-[var(--bg-raised)] px-1.5 py-0.5 font-medium`}
        value={lead.stage}
        onChange={(e) => {
          const newStage = e.target.value;
          if (newStage !== lead.stage) moveStage(lead.id, newStage);
        }}
      >
        {stages.map((s) => (
          <option key={s} value={s}>
            {STAGE_LABELS[s]}
          </option>
        ))}
      </select>
    );
  };

  const canMoveTo = (lead: PipelineLead) => {
    const stages = Object.keys(STAGE_LABELS);
    return stages.filter((s) => s !== lead.stage);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-36 skeleton-block" />
          <div className="h-3.5 w-24 skeleton-block" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3">
              <div className="mb-2 h-3 w-24 skeleton-block" />
              <div className="h-4 w-full skeleton-block" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--red)] bg-[var(--red)]/10 p-4 text-center text-sm text-[var(--red)]">
        Pipeline load error: {error}
      </div>
    );
  }

  if (!data) return null;

  const { pipeline, stats } = data;
  const stages = Object.keys(STAGE_LABELS);

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-90)]">
            Outreach Pipeline
          </h3>
          <p className="text-xs text-[var(--ink-50)] mt-0.5">
            {stats.total} leads across {stages.length} stages
          </p>
        </div>
        <button
          className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-2.5 py-1 text-xs font-medium text-[var(--ink-70)] transition-colors hover:border-[var(--ink-30)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          onClick={fetchPipeline}
        >
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="mb-4 flex gap-3 rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="text-xs text-[var(--ink-70)]">
            <span className="font-medium text-[var(--ink)]">{stats.readyToContact}</span> ready to contact
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[var(--ink-40)]" />
          <span className="text-xs text-[var(--ink-70)]">
            <span className="font-medium text-[var(--ink)]">{stats.needEnrichment}</span> need enrichment
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-[var(--ink-70)]">
            Top: <span className="font-medium text-[var(--accent-strong)]">{stats.topScore}</span>
          </span>
          <span className="text-xs text-[var(--ink-50)]">·</span>
          <span className="text-xs text-[var(--ink-70)]">
            Avg: <span className="font-medium text-[var(--ink)]">{stats.avgScore}</span>
          </span>
        </div>
      </div>

      {/* Stage columns */}
      <div className="flex flex-col gap-3 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const leadsInStage = pipeline.filter((l) => l.stage === stage);
          const count = stats.byStage[stage] || 0;

          return (
            <div key={stage} className="flex flex-col min-w-[180px] flex-1">
              <div
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition-shadow ${STAGE_COLORS[stage] || "bg-[var(--ink-10)]"} ${STAGE_GLOW[stage] || ""}`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current/30" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {STAGE_LABELS[stage]}
                </span>
                <span
                  className={`ml-auto rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    stage === "new"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--bg)]/30 text-[var(--ink-90)]"
                  }`}
                >
                  {count}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 mt-1.5">
                {leadsInStage.length === 0 ? (
                  <div className="h-6 rounded border-2 border-dashed border-[var(--ink-10)] bg-[var(--bg)]/30" />
                ) : (
                  leadsInStage.map((lead) => (
                    <div
                      key={lead.id}
                      className={`group relative rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/70 p-2.5 transition-all duration-150 hover:border-[var(--accent-20)] hover:bg-[var(--bg-raised)] ${
                        moving === lead.id ? "opacity-50 scale-[0.98]" : ""
                      }`}
                    >
                      {/* Mobile-friendly mini card */}
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-[var(--ink)]">
                            {lead.business_name}
                          </div>
                          {lead.city && lead.state && (
                            <div className="truncate text-[10px] text-[var(--ink-50)]">
                              {lead.city}, {lead.state}
                            </div>
                          )}
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-[var(--accent-strong)]">
                              {lead.score}pts
                            </span>
                            <span className="text-[10px] text-[var(--ink-50)]">
                              {lead.rating}⭐
                            </span>
                            <span className="text-[10px] text-[var(--ink-50)]">
                              ({lead.review_count})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {lead.phone && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" title="Has phone" />
                          )}
                          {(lead.email || lead.email_guess) && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" title="Has email" />
                          )}
                          {lead.website && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--ink-40)]" title="Has website" />
                          )}
                          <div className="h-1.5 w-1.5 rounded-full bg-[var(--sand)]" title="Reviewed" />
                        </div>
                      </div>

                      {/* Quick action row */}
                      <div className="mt-1.5 flex items-center gap-1">
                        {stage === "new" && (
                          <button
                            className="flex-1 rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => moveStage(lead.id, "enriched")}
                          >
                            Enrich
                          </button>
                        )}
                        {stage === "enriched" && (
                          <button
                            className="flex-1 rounded-md bg-[var(--sand)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--sand)]/30 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => moveStage(lead.id, "contacted")}
                          >
                            Contact
                          </button>
                        )}
                        {(stage === "contacted" || stage === "replied") && (
                          <button
                            className="flex-1 rounded-md bg-[var(--accent-strong)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-strong)]/20 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => moveStage(lead.id, "booked")}
                          >
                            Book call
                          </button>
                        )}
                        {stage === "booked" && (
                          <div className="flex gap-1">
                            <button
                              className="flex-1 rounded-md bg-[var(--green)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--green)] transition-colors hover:bg-[var(--green)]/20 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                              onClick={() => moveStage(lead.id, "won")}
                            >
                              Won
                            </button>
                            <button
                              className="flex-1 rounded-md bg-[var(--red)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--red)] transition-colors hover:bg-[var(--red)]/20 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                              onClick={() => moveStage(lead.id, "lost")}
                            >
                              Lost
                            </button>
                          </div>
                        )}
                        {(stage !== "won" && stage !== "lost") && (
                          <button
                            className="rounded-md border border-[var(--ink-10)] bg-[var(--bg)]/50 px-1.5 py-0.5 text-[10px] text-[var(--ink-50)] transition-colors hover:border-[var(--ink-30)] hover:text-[var(--ink-70)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => {
                              const url = `/dashboard/leads?id=${lead.id}`;
                              window.open(url, "_blank");
                            }}
                          >
                            View
                          </button>
                        )}
                      </div>

                      {/* Stage dropdown for manual move */}
                      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {stageDropdowns(lead)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
