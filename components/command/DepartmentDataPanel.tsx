import type { Department } from "./types";

const STAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  new: { bg: "bg-[var(--accent-tint)]", text: "text-[var(--accent-strong)]", dot: "bg-[var(--accent)]" },
  enriched: { bg: "bg-[var(--sand-tint)]", text: "text-[var(--sand-deep)]", dot: "bg-[var(--amber)]" },
  contacted: { bg: "bg-[var(--accent-tint)]", text: "text-[var(--accent-strong)]", dot: "bg-[var(--accent)]" },
  replied: { bg: "bg-[var(--green-10)]", text: "text-[var(--green-700)]", dot: "bg-[var(--green)]" },
  booked: { bg: "bg-[var(--accent-tint)]", text: "text-[var(--accent-strong)]", dot: "bg-[var(--accent)]" },
  won: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  lost: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  nurture: { bg: "bg-[var(--ink-10)]", text: "text-[var(--ink-50)]", dot: "bg-[var(--ink-40)]" },
};

export function DepartmentDataPanel({ department, onClose }: { department: Department; onClose: () => void }) {
  const stages = department.stages || {};

  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-l-4" style={{ borderLeftColor: department.color }}>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink-40)] transition-colors hover:bg-[var(--ink-10)] hover:text-[var(--ink)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 flex-1">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: department.bgSubtle }}
          >
            {/* icon rendered via CSS class matching department.icon */}
            <div className="h-4 w-4 text-[var(--ink-70)]">
              {department.icon === "target" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                </svg>
              )}
              {department.icon === "send" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12L6 12zm0 0h7.5L15.731 3.126A59.768 59.768 0 013.269 12L6 12z" />
                </svg>
              )}
              {department.icon === "chart" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3M9 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3" />
                </svg>
              )}
              {department.icon === "settings" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z" />
                </svg>
              )}
              {department.icon === "lightbulb" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18.75h.008v.008h-.008v-.008zm0 0h.008v.008h-.008v-.008z" />
                </svg>
              )}
              {department.icon === "megaphone" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875z" />
                </svg>
              )}
              {department.icon === "code" && (
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              )}
            </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)]">{department.name}</h3>
              <p className="text-[10px] text-[var(--ink-50)]">{department.lastRun}</p>
            </div>
        </div>

        {/* Status badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
            department.status === "operational"
              ? "bg-[var(--green-10)] text-[var(--green-700)]"
              : department.status === "degraded"
              ? "bg-[var(--amber-10)] text-[var(--amber-deep)]"
              : "bg-[var(--red-10)] text-red-600"
          }`}
        >
          {department.status}
        </span>
      </div>

      {/* Content panel */}
      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Pipeline stages (Sales) */}
        {Object.keys(stages).length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Pipeline Stages</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(stages).map(([stage, count]) => {
                const colors = STAGE_COLORS[stage] || STAGE_COLORS.new;
                return (
                  <div key={stage} className="rounded-lg bg-[var(--bg)]/50 p-2.5 text-center">
                    <div className={`h-2 w-2 rounded-full ${colors.dot} mx-auto mb-1.5`} />
                    <p className={`text-lg font-bold ${colors.text}`}>{count}</p>
                    <p className="text-[9px] text-[var(--ink-50)] capitalize">{stage}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leads detail (Sales) */}
        {department.leadCount !== undefined && department.leadCount > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Lead Distribution</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-[var(--ink-10)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(department.readyToContact! / department.leadCount) * 100}%`,
                      backgroundColor: department.color,
                    }}
                  />
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(department.needEnrichment! / department.leadCount) * 100}%`,
                      backgroundColor: "#d97706",
                      marginLeft: `${(department.readyToContact! / department.leadCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[var(--ink-40)] mt-1">
                  <span>Ready: {department.readyToContact}</span>
                  <span>Need enrichment: {department.needEnrichment}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--ink-50)]">Top score</p>
                <p className="text-2xl font-bold" style={{ color: department.color }}>
                  {department.topScore}
                </p>
                <p className="text-[9px] text-[var(--ink-40)]">Avg: {department.avgScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* MRR detail (Finance) */}
        {department.mrr !== undefined && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Revenue</p>
            <div className="rounded-xl bg-[var(--bg)]/50 p-4 text-center">
              <p className="text-[10px] text-[var(--ink-50)] mb-1">Current MRR</p>
              <p className="text-4xl font-bold" style={{ color: department.color }}>
                ${department.mrr.toLocaleString()}
              </p>
              <p className="text-[10px] text-[var(--ink-40)]">per month</p>
              <div className="flex justify-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-[var(--green-700)]">{department.activeClients}</p>
                  <p className="text-[9px] text-[var(--ink-50)]">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[var(--amber-deep)]">{department.trialClients}</p>
                  <p className="text-[9px] text-[var(--ink-50)]">Trial</p>
                </div>
                {department.atRiskClients !== undefined && department.atRiskClients > 0 && (
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{department.atRiskClients}</p>
                    <p className="text-[9px] text-[var(--ink-50)]">At Risk</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Drafts detail (Marketing) */}
        {department.draftsReady !== undefined && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2.5">Content Pipeline</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Drafts Ready", value: department.draftsReady, color: department.color },
                { label: "Posted", value: department.draftsPosted, color: "var(--green)" },
                { label: "LinkedIn", value: department.linkedinDrafts || 0, color: "#2F6FED" },
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
        {department.highlights && department.highlights.length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ink-50)] mb-2">Highlights</p>
            <div className="space-y-1.5">
              {department.highlights.map((h, i) => (
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
            {department.actions.map((action) => (
              <button
                key={action}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--accent-20)] bg-[var(--accent-tint)]/30 px-3 py-2 text-xs font-medium text-[var(--accent-strong)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent)]"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
