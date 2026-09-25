"use client";

import { useEffect, useState } from "react";

interface Props {
  initial?: Array<{
    id: string;
    name: string;
    description: string | null;
    target_industries: string | null;
    product_type: string | null;
    price_setup: number | null;
    price_monthly: number | null;
    sellable: string;
    demo_url: string | null;
    build_status: string;
    mrr_potential: number | null;
    notes: string | null;
  }>;
}

const BUILD_STATUS_LABELS: Record<string, string> = {
  idea: "Idea",
  in_progress: "In progress",
  ready: "Ready",
  selling: "Selling",
  archived: "Archived",
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  subscription: "Subscription",
  "setup+subscription": "Setup + sub",
  "one-off": "One-off",
};

export function AutomationCatalogPanel({ initial }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "ready" | "selling" | "subscription">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/dashboard/system");
        const json = await r.json();
        setRows(json.catalog || []);
      } catch {}
    };
    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  }, []);

  const sourceRows = rows.length ? rows : initial || [];

  const filtered = sourceRows.filter((r: any) => {
    if (filter === "ready") return r.build_status === "ready";
    if (filter === "selling") return r.build_status === "selling" || r.build_status === "ready";
    if (filter === "subscription") return r.product_type === "subscription" || r.product_type === "setup+subscription";
    return true;
  });

  const sellableCount = sourceRows.filter((r: any) => r.sellable === "yes").length;

  function emptyRow() {
    return (
      <tr>
        <td colSpan={5} className="px-5 py-12 text-center text-[var(--ink-50)]">
          <p className="text-sm">No automations in catalog yet.</p>
          <p className="text-xs">Add your first automation product.</p>
        </td>
      </tr>
    );
  }

  function productRow(row: any) {
    const hasPricing = row.price_setup != null || row.price_monthly != null;
    return (
      <tr key={row.id} className="group transition-colors hover:bg-[var(--accent-tint)]">
        <td className="px-5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[var(--ink)]">{row.name}</span>
            {row.description ? (
              <span className="text-xs text-[var(--ink-50)] line-clamp-1">{row.description}</span>
            ) : (
              <span className="text-xs text-[var(--ink-30)]">—</span>
            )}
          </div>
        </td>
        <td className="px-3 py-3 text-sm text-[var(--ink-70)] hidden sm:table-cell">
          <span className="text-xs">
            {row.product_type ? (PRODUCT_TYPE_LABELS[row.product_type] || row.product_type) : "—"}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-center hidden md:table-cell">
          <span className="text-xs text-[var(--ink-70)]">
            {hasPricing ? (
              <span className="font-medium text-[var(--accent-strong)]">
                {row.price_setup != null ? `$${row.price_setup}` : ""}
                {row.price_setup != null && row.price_monthly != null ? " + " : ""}
                {row.price_monthly != null ? `$${row.price_monthly}/mo` : ""}
              </span>
            ) : (
              "—"
            )}
          </span>
        </td>
        <td className="px-3 py-3 text-center">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.build_status === "ready" || row.build_status === "selling"
              ? "bg-[var(--accent)] text-white"
              : row.build_status === "in_progress"
              ? "bg-[var(--sand-deep)] text-white"
              : row.build_status === "archived"
              ? "bg-[var(--ink-10)] text-[var(--ink-50)]"
              : "bg-[var(--ink-10)] text-[var(--ink-50)]"
          }`}>
            {BUILD_STATUS_LABELS[row.build_status] || row.build_status}
          </span>
        </td>
        <td className="px-5 py-3 text-center hidden lg:table-cell">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.sellable === "yes"
              ? "bg-[var(--accent-tint)] text-[var(--accent-strong)]"
              : row.sellable === "pending"
              ? "bg-[var(--sand-tint)] text-[var(--sand-deep)]"
              : "bg-[var(--ink-10)] text-[var(--ink-50)]"
          }`}>
            {row.sellable}
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
            <h2 className="text-heading text-base font-semibold tracking-tight">Automation Catalog</h2>
            <p className="text-xs text-[var(--ink-50)]">
              {sellableCount ? `${sellableCount} sellable · ` : ""}
              {sourceRows.length || 0} products
            </p>
          </div>
          <div className="flex gap-1">
            {(["all", "ready", "selling", "subscription"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  filter === f
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg)]/50 text-[var(--ink-50)] hover:text-[var(--ink)]"
                }`}
              >
                {f === "all" ? "All" : f === "subscription" ? "Subs" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--ink-50)]">
            <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
              <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wide">Automation</th>
              <th className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide hidden md:table-cell">Pricing</th>
              <th className="px-3 py-3 text-center font-medium text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-center font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Sellable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ink-10)]">
            {filtered.length === 0 ? emptyRow() : filtered.map(productRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
