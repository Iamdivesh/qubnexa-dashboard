import Link from "next/link";

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--ink-10)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="container-x flex h-14 items-center justify-between px-3 py-2 md:px-4">
        <div className="flex items-center gap-3">
          <span className="label-mono text-[var(--accent-strong)]">QubNexa</span>
          <span className="hidden sm:inline text-sm text-[var(--ink-50)]">/</span>
          <span className="hidden sm:inline text-sm text-[var(--ink-70)]">Agency Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <time className="text-sm text-[var(--ink-50)]">{today}</time>
          <Link
            href="/dashboard/report"
            className="glass-pill text-xs"
            prefetch={false}
          >
            View report
          </Link>
          <form method="POST" action="/api/dashboard/report/run">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ink-10)] bg-[var(--bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--ink-70)] shadow-sm transition-colors hover:border-[var(--ink-30)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0-3-3m3 3 3-3M3 16v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
              </svg>
              Run now
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
