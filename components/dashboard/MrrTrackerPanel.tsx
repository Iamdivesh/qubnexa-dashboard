"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/lib/orchestrator";

interface MrrTotals {
  total_mrr: number;
  active_clients: number;
  trial_clients: number;
  at_risk_clients: number;
  churned_clients: number;
}

interface ApiShape {
  totals: MrrTotals;
  clients: Client[];
}

export function MrrTrackerPanel() {
  const [data, setData] = useState<ApiShape | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/dashboard/mrr");
        const json = (await r.json()) as ApiShape;
        setData(json);
      } catch {}
      setLoading(false);
    };
    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  }, []);

  const totals = data?.totals ?? { total_mrr: 0, active_clients: 0, trial_clients: 0, at_risk_clients: 0, churned_clients: 0 };
  const clients = data?.clients ?? [];

  const activeClients = clients.filter((c) => c.status === "active");
  const largestClient = [...activeClients].sort((a, b) => b.mrr - a.mrr)[0];

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <h2 className="text-heading text-base font-semibold tracking-tight">MRR</h2>
        <p className="text-xs text-[var(--ink-50)]">Monthly recurring revenue</p>
      </div>

      <div className="p-5">
        {/* Big MRR number */}
        <div className="mb-5 rounded-xl border border-[var(--accent-tint)] bg-[var(--accent-tint)] p-5 text-center">
          <p className="label-mono text-[10px] text-[var(--accent-strong)] mb-1">CURRENT MRR</p>
          <p className="text-3xl font-semibold tracking-tight text-[var(--accent-strong)]">
            ${totals.total_mrr.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--ink-50)]">
            {totals.active_clients} active clients · {totals.trial_clients} trial · {totals.at_risk_clients} at-risk
          </p>
        </div>

        {/* Per-client breakdown */}
        <div>
          <p className="label-mono text-[10px] text-[var(--ink-50)] mb-3">BY CLIENT</p>
          {clients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--ink-10)] bg-[var(--bg)]/50 p-5 text-center text-sm text-[var(--ink-50)]">
              No clients yet. Close your first deal to see MRR here.
            </div>
          ) : (
            <div className="space-y-2">
              {clients
                .sort((a, b) => b.mrr - a.mrr)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-[var(--ink)]">{c.name}</span>
                      <span className="text-xs text-[var(--ink-50)]">
                        {c.industry || "—"} · {c.region || "—"} · {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[var(--ink)]">
                        ${c.mrr.toLocaleString()}/mo
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        c.status === "active"
                          ? "bg-[var(--accent)] text-white"
                          : c.status === "trial"
                          ? "bg-[var(--sand-deep)] text-white"
                          : c.status === "at_risk"
                          ? "bg-[var(--sand-deep)] text-white"
                          : "bg-[var(--ink-10)] text-[var(--ink-50)]"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Largest client callout */}
        {largestClient && (
          <div className="mt-5 rounded-lg border border-[var(--sand-tint)] bg-[var(--sand-tint)] p-4 text-sm">
            <p className="text-xs text-[var(--sand-deep)]">Largest active client</p>
            <p className="font-medium text-[var(--ink)]">{largestClient.name} — ${largestClient.mrr.toLocaleString()}/mo</p>
          </div>
        )}
      </div>
    </div>
  );
}
