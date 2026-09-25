"use client";

import { useEffect, useState } from "react";

interface Trend {
  source: string;
  headline: string;
  takeaway: string;
  date: string;
  url?: string;
}

const TRENDS: Trend[] = [
  {
    source: "Adobe Digital Trends 2026",
    headline: "54% of Americans report AI fatigue; only 19% feel excited about AI",
    takeaway: "Lead with outcomes, not AI. The AI stays in the engine.",
    date: "2026-09-21",
  },
  {
    source: "Wieden+Kennedy Split Test",
    headline: "UGC beat AI-rendered imagery by 340% on thumb-stop rate",
    takeaway: "Lo-fi, creator-shot content is outperforming polished AI creative.",
    date: "2026-09-20",
  },
  {
    source: "BCG CMO Survey Jun 2026",
    headline: "96% of CMOs say AI is transforming marketing; only 8% run multi-agent campaigns",
    takeaway: "The gap between belief and deployment is the opportunity.",
    date: "2026-09-18",
  },
  {
    source: "Financial Express",
    headline: "Bata rebuilt marketing around AI agents — no agencies, 80% cost reduction target",
    takeaway: "Execution is moving to AI. Strategy and judgment still need humans.",
    date: "2026-09-15",
  },
  {
    source: "MIT Media Lab Jul 2026",
    headline: "Consumers exposed to AI ads for 18+ months show lower trust scores",
    takeaway: "Authenticity carries emotional weight in food, personal care, finance.",
    date: "2026-09-12",
  },
];

export function AITrendsPanel() {
  const [trends] = useState<Trend[]>(TRENDS);
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">AI Trends Feed</h2>
            <p className="text-xs text-[var(--ink-50)]">{trends.length} trends · updated {today}</p>
          </div>
          <span className="rounded-full border border-[var(--accent)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--accent-strong)]">
            LIVE
          </span>
        </div>
      </div>

      <div className="divide-y divide-[var(--ink-10)]">
        {trends.map((t, i) => (
          <div key={i} className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--ink)] leading-snug">{t.headline}</p>
                <p className="mt-1 text-xs text-[var(--accent-strong)]">{t.takeaway}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-[var(--ink-40)]">{t.source}</p>
                <p className="text-[10px] text-[var(--ink-50)]">{t.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--ink-10)] bg-[var(--bg)]/50 px-5 py-2.5">
        <p className="text-[10px] text-[var(--ink-40)]">
          Sources: Adobe, BCG, MIT Media Lab, Financial Express, Wieden+Kennedy · Feeding the centralized brain.
        </p>
      </div>
    </div>
  );
}
