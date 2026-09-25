"use client";

import { useEffect, useState } from "react";

interface Props {
  initial?: {
    stats: Array<{ channel: string; status: string; count: number }>;
    totals: { total_sent: number; total_replied: number; total_booked: number; total_no_reply: number };
    today: { sent: number; replied: number; booked: number };
    metrics: Array<{ date: string; messages_sent: number; replies: number; calls_booked: number }>;
  };
}

export function OutreachStatsPanel({ initial }: Props) {
  const [data, setData] = useState<{
    stats: Array<{ channel: string; status: string; count: number }>;
    totals: { total_sent: number; total_replied: number; total_booked: number; total_no_reply: number };
    today: { sent: number; replied: number; booked: number };
    metrics: Array<{ date: string; messages_sent: number; replies: number; calls_booked: number }>;
  } | null>(initial ? initial : null);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/dashboard/outreach");
        const json = await r.json();
        setData(json);
      } catch {}
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { clearInterval(id); };
  }, []);

  const d = data ?? {
    stats: [],
    totals: { total_sent: 0, total_replied: 0, total_booked: 0, total_no_reply: 0 },
    today: { sent: 0, replied: 0, booked: 0 },
    metrics: [],
  };

  const replyRate = d.totals.total_sent ? Math.round((d.totals.total_replied / d.totals.total_sent) * 100) : 0;

  const series = d.metrics
    .slice()
    .reverse()
    .map((m) => ({
      date: m.date.slice(5),
      sent: m.messages_sent,
      replied: m.replies,
    }));
  const maxSent = Math.max(...series.map((s) => s.sent), 1);

  const channelMap = d.stats.reduce(
    (acc, row) => {
      if (!acc[row.channel]) acc[row.channel] = { sent: 0, replied: 0, booked: 0, total: 0 };
      acc[row.channel].total += row.count;
      if (row.status === "replied") acc[row.channel].replied += row.count;
      if (row.status === "booked") acc[row.channel].booked += row.count;
      if (row.status === "sent") acc[row.channel].sent += row.count;
      return acc;
    },
    {} as Record<string, { sent: number; replied: number; booked: number; total: number }>
  );

  const channels = Object.entries(channelMap)
    .map(([channel, v]) => ({
      channel,
      sent: v.sent || v.total,
      replied: v.replied,
      booked: v.booked,
      replyRate: v.total ? Math.round((v.replied / v.total) * 100) : 0,
    }))
    .sort((a, b) => b.sent - a.sent);

  const displayChannels = channels.length ? channels : [
    { channel: "email", sent: 0, replied: 0, booked: 0, replyRate: 0 },
  ];

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <h2 className="text-heading text-base font-semibold tracking-tight">Outreach</h2>
        <p className="text-xs text-[var(--ink-50)]">Today + rolling 14 days</p>
      </div>

      <div className="p-5">
        {/* Today row */}
        <div className="mb-5 flex gap-4">
          <div className="flex-1">
            <p className="label-mono text-[10px] text-[var(--ink-50)]">SENT TODAY</p>
            <p className="text-2xl font-semibold text-[var(--ink)]">{d.today.sent}</p>
          </div>
          <div className="flex-1">
            <p className="label-mono text-[10px] text-[var(--ink-50)]">REPLIES TODAY</p>
            <p className="text-2xl font-semibold text-[var(--accent-strong)]">{d.today.replied}</p>
          </div>
          <div className="flex-1">
            <p className="label-mono text-[10px] text-[var(--ink-50)]">CALLS BOOKED</p>
            <p className="text-2xl font-semibold text-[var(--sand-deep)]">{d.today.booked}</p>
          </div>
        </div>

        {/* All-time KPIs */}
        <div className="mb-5 grid grid-cols-3 gap-3 rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
          <div>
            <p className="text-xs text-[var(--ink-50)]">Total sent</p>
            <p className="text-lg font-semibold text-[var(--ink)]">{d.totals.total_sent}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--ink-50)]">Replies</p>
            <p className="text-lg font-semibold text-[var(--accent-strong)]">{d.totals.total_replied}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--ink-50)]">Close rate</p>
            <p className="text-lg font-semibold text-[var(--sand-deep)]">{replyRate}%</p>
          </div>
        </div>

        {/* Sparkline */}
        <div className="mb-5">
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-3">SENT vs REPLIES · 14 DAYS</p>
          <div className="flex items-baseline gap-0.5 text-xs font-medium text-[var(--ink-50)]">
            {series.map((m, i) => {
              const h = maxSent ? Math.round((m.sent / maxSent) * 56) : 0;
              const rh = maxSent ? Math.round((m.replied / maxSent) * 56) : 0;
              return (
                <div key={i} className="flex flex-1 flex-col items-center">
                  <span className="h-[2px] w-full bg-[var(--accent)]/40 rounded" style={{ height: `${h}px` }} />
                  <span className="h-[2px] w-full bg-[var(--accent)] rounded" style={{ height: `${rh}px` }} />
                  <span className="mt-0.5 text-[10px]">{m.date}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-4 text-[10px] text-[var(--ink-50)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]/40" /> Sent
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Replies
            </span>
          </div>
        </div>

        {/* Channel breakdown */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-2">BY CHANNEL</p>
          <div className="space-y-2">
            {displayChannels.map((c) => (
              <div key={c.channel} className="flex items-center justify-between rounded-lg bg-[var(--bg)]/50 px-3 py-2 text-xs">
                <span className="text-[var(--ink-70)] capitalize">{c.channel}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--ink-50)]">{c.sent} sent</span>
                  <span className="text-[var(--accent-strong)]">{c.replied} replies</span>
                  <span className="text-[var(--sand-deep)]">{c.replyRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
