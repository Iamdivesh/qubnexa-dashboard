import type { ReactElement } from "react";

export function TargetTracker({ targets }: { targets: Array<{ id: string; label: string; current: number; target: number; unit: string; color: string; icon: string }> }) {
  const maxTarget = Math.max(...targets.map(t => t.target), 1);

  const icons: Record<string, ReactElement> = {
    dollar: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0C13.536 14.219 12.768 15 12 15s-1.536-.781-2.242-1.819c-1.171-.879-3.07-.879-4.242 0C10.536 13.219 11.304 12.5 12 12.5s1.536.719 2.242 1.819z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>,
    users: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 00-2.575-.072 4.123 4.123 0 00-3.161-.452 9.46 9.46 0 00-4.187.065 4.123 4.123 0 00-3.138 2.671c-1.024 2.559.505 5.384 3.274 5.956a4.126 4.126 0 006.688.03 9.46 9.46 0 003.161-.452c1.159-.23 2.103-.583 3.018-1.206M16 12.42a1.694 1.694 0 01.969 1.928A8.378 8.378 0 0015.12 17a4.115 4.115 0 00-4.115 3.885M14.25 12a3 3 0 11-6 0 3 3 0 016 0zm9.75 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    trending: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    target: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.594 3.068a3.745 3.745 0 01-1.055.384 3.745 3.745 0 01-1.054-.384 3.744 3.744 0 01-1.783-3.638A3.744 3.744 0 0112 9c0-1.268.63-2.39 1.594-3.068a3.745 3.745 0 011.054-.384 3.745 3.745 0 011.055.384 3.744 3.744 0 011.783 3.638A3.745 3.745 0 0121 12z" /></svg>,
    cog: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h9.078c.352 0 .648-.266.712-.64l.213-1.281c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.36.64.712.64h.008a49.586 49.586 0 01-1.075 7.24A49.54 49.54 0 019.668 19.255c-4.502 0-8.562-3.053-9.846-7.542A49.557 49.557 0 010 10.15c0-4.242 2.83-7.87 6.748-8.846z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5c.74-1.42 2.6-2.5 4.22-2.5 1.65 0 3.375.85 4.22 2.5m-8.44 0c.43 1.1.97 2.1 1.62 3m9.84-2.5c.65-1 .65-2.5 0-3.5M16.5 12.1c.65-1 .65-2.5 0-3.5" /></svg>,
    megaphone: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-5.25M12 4.875A2.625 2.625 0 109.375 7.5a6.625 6.625 0 003.75 5.625v2.625a8.25 8.25 0 01-1.5.562q-.21.-0625-.42-.0625A8.25 8.25 0 019.75 15.562V10.125a6.625 6.625 0 00-3.75-5.625A2.625 2.625 0 1012 4.875zM15.75 12.75v1.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5v-1.5a3 3 0 014.5 0z" /></svg>,
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
        <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3M9 13.5h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3m0-3h1.5m1.5-1.5v3" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">
          Monthly Targets · FY 2026 Q4
        </h2>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {targets.map((target) => {
          const pct = Math.round((target.current / target.target) * 100);
          return (
            <div key={target.id} className="rounded-xl bg-[var(--bg)]/50 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-[var(--ink-50)]">{target.label}</span>
                <span className="text-[10px] text-[var(--ink-40)]">{target.current.toLocaleString()}<span className="text-[10px] text-[var(--ink-40)]">/{target.target.toLocaleString()}</span></span>
              </div>
              <div className="h-2 rounded-full bg-[var(--ink-10)] mb-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    backgroundColor: target.color,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[var(--ink-50)]">{pct}%</span>
                <div className="flex items-center gap-1">
                  {icons[target.icon] || icons.target}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
