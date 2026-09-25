"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      <DashboardHeader />
      <main className="container-x flex-1 px-1.5 pb-10 pt-6 md:px-2.5 md:pt-8">
        {/* Top section: pipeline + stats */}
        <div className="mx-auto grid gap-6 md:grid-cols-3 md:gap-6">
          {/* Pipeline skeleton — spans 2 cols */}
          <div className="md:col-span-2 rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 w-32 skeleton-block" />
              <div className="h-4 w-12 skeleton-block" />
            </div>
            {/* Stage tabs */}
            <div className="mb-5 flex gap-2 overflow-x-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-shrink-0 rounded-lg bg-[var(--bg)]/50 p-1.5">
                  <div className="h-5 min-w-[48px] skeleton-block" />
                </div>
              ))}
            </div>
            {/* Table skeleton */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
                    {["Business", "Category", "Address", "Reviews", "Rating", "Domain", "Score", "Stage"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide"
                        >
                          <div className="h-3 w-20 skeleton-block" />
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ink-10)]">
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="group">
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="h-4 w-40 skeleton-block" />
                          <div className="h-3 w-24 skeleton-block" />
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <div className="h-4 w-24 skeleton-block" />
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <div className="h-4 w-36 skeleton-block" />
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <div className="h-4 w-6 skeleton-block mx-auto" />
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <div className="h-4 w-6 skeleton-block mx-auto" />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="h-4 w-12 skeleton-block mx-auto" />
                      </td>
                      <td className="px-3 py-3 text-center hidden lg:table-cell">
                        <div className="h-5 w-7 rounded-full skeleton-block mx-auto" />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="h-5 w-16 rounded-full skeleton-block mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Filter bar */}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--ink-10)] bg-[var(--bg)]/50 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-12 skeleton-block" />
                <div className="h-7 min-w-[140px] rounded-lg border border-[var(--ink-10)] bg-[var(--bg-raised)] p-1.5">
                  <div className="h-4 w-full skeleton-block" />
                </div>
              </div>
              <div className="ml-auto h-3.5 w-20 skeleton-block" />
            </div>
          </div>

          {/* Right column — stats stack */}
          <div className="flex flex-col gap-6">
            {/* Outreach skeleton */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-5 w-24 skeleton-block" />
                <div className="h-3.5 w-20 skeleton-block" />
              </div>
              <div className="mb-4 flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-1">
                    <div className="mb-2 h-3 w-16 skeleton-block" />
                    <div className="h-8 w-12 rounded-lg bg-[var(--ink-10)] skeleton-block mx-auto" />
                  </div>
                ))}
              </div>
              <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-3 w-16 skeleton-block" />
                    <div className="mt-1 h-5 w-10 skeleton-block mx-auto" />
                  </div>
                ))}
              </div>
              {/* Sparkline skeleton */}
              <div className="mb-4">
                <div className="mb-3 h-3 w-24 skeleton-block" />
                <div className="flex gap-0.5">
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center">
                      <div
                        className="h-[2px] w-full rounded skeleton-block"
                        style={{ height: `${20 + Math.random() * 36}px` }}
                      />
                      <div
                        className="h-[2px] w-full rounded skeleton-block bg-[var(--accent)]"
                        style={{ height: `${8 + Math.random() * 24}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MRR skeleton */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-5 w-20 skeleton-block" />
                <div className="h-3.5 w-24 skeleton-block" />
              </div>
              <div className="mb-4 rounded-xl border border-[var(--accent-tint)] bg-[var(--accent-tint)] p-5 text-center">
                <div className="mb-1 h-3 w-16 skeleton-block mx-auto" />
                <div className="mt-1 h-10 w-32 rounded skeleton-block mx-auto" />
                <div className="mt-2 h-3 w-40 skeleton-block mx-auto" />
              </div>
              <div className="h-3 w-16 skeleton-block mb-3" />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="mb-2 flex items-center justify-between rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="h-4 w-32 skeleton-block" />
                    <div className="h-3 w-24 skeleton-block" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 skeleton-block" />
                    <div className="h-5 rounded-full w-12 skeleton-block" />
                  </div>
                </div>
              ))}
            </div>

            {/* System Health skeleton */}
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-5 w-32 skeleton-block" />
                <div className="h-3.5 w-28 skeleton-block" />
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-3">
                    <div className="mb-2 h-3 w-24 skeleton-block" />
                    <div className="h-4 w-full skeleton-block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section: catalog + delivery */}
        <div className="mx-auto mt-10 grid gap-6 md:grid-cols-2">
          {/* Automation Catalog skeleton */}
          <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="mb-1 h-5 w-36 skeleton-block" />
                <div className="h-3.5 w-20 skeleton-block" />
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-14 rounded-md skeleton-block" />
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
                    {["Automation", "Type", "Pricing", "Status", "Sellable"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide"
                      >
                        <div className="h-3 w-16 skeleton-block" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ink-10)]">
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="group">
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="h-4 w-36 skeleton-block" />
                          <div className="h-3 w-28 skeleton-block" />
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <div className="h-4 w-20 skeleton-block" />
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <div className="h-4 w-16 skeleton-block mx-auto" />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="h-5 w-16 rounded-full skeleton-block mx-auto" />
                      </td>
                      <td className="px-5 py-3 text-center hidden lg:table-cell">
                        <div className="h-5 w-14 rounded-full skeleton-block mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Client Delivery skeleton */}
          <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="mb-1 h-5 w-36 skeleton-block" />
                <div className="h-3.5 w-40 skeleton-block" />
              </div>
              <div className="h-4 w-16 flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded skeleton-block" />
                <div className="h-3.5 w-16 skeleton-block" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ink-10)] bg-[var(--bg)]/50">
                    {["Client", "What was sold", "Pricing", "Health", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left font-medium text-xs uppercase tracking-wide"
                      >
                        <div className="h-3 w-16 skeleton-block" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ink-10)]">
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="group">
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="h-4 w-32 skeleton-block" />
                          <div className="h-3 w-24 skeleton-block" />
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <div className="h-4 w-24 skeleton-block" />
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <div className="h-4 w-16 skeleton-block mx-auto" />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="h-5 w-16 rounded-full skeleton-block mx-auto" />
                      </td>
                      <td className="px-5 py-3 text-center hidden lg:table-cell">
                        <div className="h-5 w-14 rounded-full skeleton-block mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
