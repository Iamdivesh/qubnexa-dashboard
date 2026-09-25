import type { ActivityItem } from "./types";

const TYPE_CONFIG = {
  info: { color: "text-[var(--ink-50)]", dot: "bg-[var(--ink-40)]" },
  success: { color: "text-green-700", dot: "bg-green-500" },
  warning: { color: "text-amber-deep", dot: "bg-amber-500" },
  error: { color: "text-red-600", dot: "bg-red-500" },
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-raised)] border border-[var(--ink-10)] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--bg)]/50 border-b border-[var(--ink-10)]">
        <svg className="h-4 w-4 text-[var(--ink-50)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-70)]">
          Activity Feed
        </h2>
        <span className="ml-auto text-[10px] text-[var(--ink-40)]">{activities.length} events today</span>
      </div>

      <div className="divide-y divide-[var(--ink-6)]">
        {activities.map((item) => {
          const config = TYPE_CONFIG[item.type];
          return (
            <div key={item.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg)]/30 transition-colors">
              {/* Status dot */}
              <div className={`flex h-2 w-2 shrink-0 mt-1.5 rounded-full ${config.dot}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${config.color}`}>
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-[var(--ink-40)] font-medium">{item.department}</span>
                  <span className="text-[9px] text-[var(--ink-40)]">·</span>
                  <span className="text-[9px] text-[var(--ink-40)]">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
