"use client";

import { useEffect, useState } from "react";
import type { Client } from "@/lib/orchestrator";

interface ClientAutomation {
  id: string;
  client_id: string;
  automation_name: string;
  status: string;
  last_run: string | null;
  last_status: string | null;
  failure_count: number;
  client_name?: string;
  mrr?: number;
  client_status?: string;
}

interface Props {
  initial?: {
    clients: Client[];
    health: ClientAutomation[];
  };
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-[var(--accent)] text-white",
  trial: "bg-[var(--sand-deep)] text-white",
  at_risk: "bg-[var(--sand-deep)] text-white",
  churned: "bg-[var(--ink-10)] text-[var(--ink-50)]",
};

export function ClientDeliveryPanel({ initial }: Props) {
  const [data, setData] = useState<{ clients: Client[]; health: ClientAutomation[] } | null>(
    initial ? { clients: initial.clients, health: initial.health } : null
  );

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/dashboard/mrr");
        const mrrData = await r.json();
        const s = await fetch("/api/dashboard/system");
        const systemData = await s.json();
        setData({ clients: mrrData.clients || [], health: systemData.health || [] });
      } catch {}
    };
    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  }, []);

  const clients = data?.clients || [];
  const health = data?.health || [];
  const [activeOnly, setActiveOnly] = useState(false);
  const filtered = activeOnly
    ? clients.filter((c: Client) => c.status === "active" || c.status === "trial")
    : clients;

  const clientAutoMap = health.reduce(
    (acc, ca) => {
      if (!acc[ca.client_id]) acc[ca.client_id] = [];
      acc[ca.client_id].push(ca);
      return acc;
    },
    {} as Record<string, ClientAutomation[]>
  );

  const totalMrr = clients.reduce((sum, c: Client) => sum + (c.mrr || 0), 0);
  const failedCount = health.filter((c) => c.last_status === "error" || c.status === "failed").length;

  function emptyRow() {
    return (
      <tr>
        <td colSpan={5} className="px-5 py-12 text-center text-[var(--ink-50)]">
          <p className="text-sm">No clients yet.</p>
          <p className="text-xs">Close your first deal to see delivery here.</p>
        </td>
      </tr>
    );
  }

  function clientRow(c: Client) {
    const autos = clientAutoMap[c.id] || [];
    const hasFailure = autos.some((a) => a.last_status === "error" || a.status === "failed");
    const healthColor =
      c.status === "churned"
        ? "bg-[var(--ink-10)] text-[var(--ink-50)]"
        : c.status === "at_risk"
        ? "bg-[var(--sand-deep)] text-white"
        : hasFailure
        ? "bg-[var(--sand-deep)] text-white"
        : c.status === "trial"
        ? "bg-[var(--sand-tint)] text-[var(--sand-deep)]"
        : "bg-[var(--accent)] text-white";

    return (
      <tr key={c.id} className="group transition-colors hover:bg-[var(--accent-tint)]">
        <td className="px-5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[var(--ink)]">{c.name}</span>
            {c.website ? (
              <span className="text-xs text-[var(--ink-50)] truncate max-w-[140px] sm:max-w-[200px]" title={c.website}>
                {c.website.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
              </span>
            ) : (
              <span className="text-xs text-[var(--ink-30)]">—</span>
            )}
          </div>
        </td>
        <td className="px-3 py-3 text-sm text-[var(--ink-70)] hidden sm:table-cell">
          <span className="text-xs">{autos.length ? autos.map((a) => a.automation_name).join(", ") : "—"}</span>
        </td>
        <td className="px-3 py-3 text-sm text-center hidden md:table-cell">
          <span className="text-xs">
            {c.mrr > 0 ? (
              <span className="font-medium text-[var(--accent-strong)]">${(c.mrr || 0).toLocaleString()}/mo</span>
            ) : (
              <span className="text-[var(--ink-30)]">${(c.deal_value || 0)} setup</span>
            )}
          </span>
        </td>
        <td className="px-3 py-3 text-center">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${healthColor}`}>
            {hasFailure ? "⚠ failing" : c.status === "active" ? "● live" : c.status}
          </span>
        </td>
        <td className="px-5 py-3 text-center hidden lg:table-cell">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] || "bg-[var(--ink-10)] text-[var(--ink-50)]"}`}>
            {c.status}
          </span>
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] shadow-sm">
      <div className="rounded-t-2xl border-b border-[var(--ink-10)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading text-base font-semibold tracking-tight">Client Delivery</h2>
            <p className="text-xs text-[var(--ink-50)]">
              {filtered.length} client{filtered.length !== 1 ? "s" : ""} · ${totalMrr.toLocaleString()} MRR · {failedCount} failing
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-[var(--ink-50)]">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-[var(--ink-10)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            Active only
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--ink-50)]">
            <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
              <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wide">Client</th>
              <th className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide hidden sm:table-cell">What was sold</th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide hidden md:table-cell">Pricing</th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide">Health</th>
              <th className="px-5 py-3 text-center font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ink-10)]">
            {filtered.length === 0 ? emptyRow() : filtered.map(clientRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
