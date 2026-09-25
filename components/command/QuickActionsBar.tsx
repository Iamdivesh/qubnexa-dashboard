import type { Department } from "./types";

export function QuickActionsBar({ departments }: { departments: Department[] }) {
  const allActions = departments.flatMap(d =>
    d.actions.map(a => ({ action: a, department: d.name, departmentId: d.id, color: d.color }))
  );

  // Show top 4 quick actions
  const topActions = allActions.slice(0, 6);

  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {topActions.map(({ action, department, color }) => (
          <button
            key={`${department}-${action}`}
            className="flex items-center gap-2 rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs font-medium text-[var(--ink-70)] transition-all hover:border-[var(--ink-30)] hover:bg-[var(--bg-raised)] hover:text-[var(--ink)] active:scale-[0.98]"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="truncate">{action}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--ink-10)]">
        <p className="text-[9px] text-[var(--ink-40)] text-center">
          Click a department tile for full details · Expanded view shows dashboard panels
        </p>
      </div>
    </div>
  );
}
