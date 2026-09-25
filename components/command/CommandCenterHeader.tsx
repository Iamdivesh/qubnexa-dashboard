import Link from "next/link";

export function CommandCenterHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between rounded-none border-b border-[var(--ink-10)] bg-[var(--bg)]/90 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Pulsing AI indicator */}
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-raised)] border-2 border-[var(--accent)] shadow-sm">
              <svg className="h-4.5 w-4.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 017 7c0 2.385-1.193 4.417-2.957 5.754M6.5 14.5a4.5 4.5 0 011.5 3.75V16.5h-3v2.25a4.5 4.5 0 01-1.5 3.75V21h-3v2.25a4.5 4.5 0 01-4.5 0v-2.25H4.5v-1.5a4.5 4.5 0 01-1.5-3.75V16.5H0V14.5a4.5 4.5 0 013.75-4.5h1.5V9a7 7 0 017-7z" />
              </svg>
            </div>
            {/* Pulse dot */}
            <div className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--accent)] shadow-sm">
              <div className="h-[2px] w-1 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-base font-semibold tracking-tight text-[var(--ink)]">
              Command Center
            </h1>
            <p className="text-[10px] text-[var(--ink-50)] leading-tight">
              QubNexa Agency · AI-powered operations
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-4">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[var(--green-10)] px-2.5 py-1 text-[10px] font-medium text-[var(--green-700)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)] animate-pulse" />
            All systems go
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[var(--ink-10)]" />

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard/agents"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--ink-60)] transition-colors hover:bg-[var(--ink-10)] hover:text-[var(--ink)]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Agents
            </Link>
            <div className="h-5 w-px bg-[var(--ink-10)]" />
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--ink-70)] transition-colors hover:bg-[var(--ink-10)] hover:text-[var(--ink)]"
            >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </div>
  </header>
  );
}
