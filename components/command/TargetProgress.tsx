"use client";

interface Target {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  color: string;
}

interface TargetProgressProps {
  targets: Target[];
}

function ProgressBar({ current, target, color }: { current: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="mt-1.5 h-2 rounded-full bg-[var(--bg-raised)]">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function TargetProgress({ targets }: TargetProgressProps) {
  return (
    <section className="rounded-2xl border-2 border-[var(--accent-strong)] bg-[var(--accent-tint)]/5 p-0.5">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--accent-tint)]/20">
        <svg className="h-4 w-4 text-[var(--accent-strong)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4-4m0 0l4 4m-4-4v9M5 15h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1-2-2z" />
        </svg>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
          Monthly Targets — FY 2026 Q4
        </h2>
      </div>

      <div className="p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {targets.map((t) => (
            <div key={t.id} className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
              <p className="text-xs text-[var(--ink-40)]">{t.label}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: t.color }}>
                  {t.current.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--ink-40)]">/{t.target.toLocaleString()} {t.unit}</span>
              </div>
              <ProgressBar current={t.current} target={t.target} color={t.color} />
              <p className="mt-1.5 text-[10px] text-[var(--ink-40)]">
                {Math.round((t.current / t.target) * 100)}% complete
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
