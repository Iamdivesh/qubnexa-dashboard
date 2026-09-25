import { useEffect, useState } from "react";
import type { Department } from "./types";

export function BrainStatusBar() {
  const [obsidianConnected, setObsidianConnected] = useState(true);
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    // In production: check if Obsidian is connected / vault accessible
    // For now, simulate
    setNotesCount(73);
    setObsidianConnected(true);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--ink-10)] px-3 py-1.5 shadow-sm">
      {/* Obsidian brain indicator */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <svg className="h-3.5 w-3.5 text-[var(--ink-50)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2a1 1 0 110 2h-1V5.5c0-.55-.45-1-1-1H8V2h2c1.1 0 2 .9 2 2v.93c.13.58.53 1.08 1.07 1.38.09.05.18.09.27.14.05.03.1.04.15.06C14.25 10 15 9.25 15 8.36c0-.56-.13-1.08-.36-1.54-.02-.04-.04-.08-.06-.12-.05-.05-.1-.09-.15-.14a7.893 7.893 0 00-1.07-1.38V4.64c0-1.64.75-3.14 1.93-4.11C14.25 1 15 0.25 15 0c0-.56-.14-1.08-.39-1.55-.03-.04-.07-.07-.1-.11-.05-.05-.1-.09-.16-.14C15.75 1 16.5 0.25 17 0c2.21 0 4 1.79 4 4s-1.79 4-4 4z"/>
          </svg>
          {obsidianConnected && (
            <div className="absolute -right-0.5 -bottom-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-green-500">
              <div className="h-[1px] w-[2px] rounded-full bg-white" />
            </div>
          )}
        </div>
        <span className="text-[10px] text-[var(--ink-50)]">
          Brain · {notesCount} notes
        </span>
      </div>

      <div className="h-4 w-px bg-[var(--ink-10)]" />

      {/* Cron status */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-1.5 w-1.5 rounded-full bg-green-500">
          <div className="h-[1px] w-full rounded-full bg-white animate-pulse" />
        </div>
        <span className="text-[9px] text-[var(--ink-40)]">Cron running</span>
      </div>

      <div className="h-4 w-px bg-[var(--ink-10)]" />

      {/* Dev server */}
      <div className="flex items-center gap-1.5">
        <svg className="h-3 w-3 text-[var(--ink-40)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9a9.02 9.02 0 00-1.323-5.661M12 21c-2.485 0-4.5-4.03-4.5-9a9.02 9.02 0 011.323-5.661M12 21v-1.5a9.003 9.003 0 006.374-8.957M12 21v-1.5a3 3 0 01-3-3m0 0a3 3 0 013-3m-3 3V9m0 12v-1.5a6.5 6.5 0 0112.89-3.5M12 21v-1.5a6.5 6.5 0 0113-3.5" />
        </svg>
        <span className="text-[9px] text-[var(--ink-40)]">localhost:3000</span>
      </div>
    </div>
  );
}
