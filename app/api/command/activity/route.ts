import { NextResponse } from "next/server";

const now = new Date();
const t = (h: number, m: number, agent: string, action: string, dept: string, status: string) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return {
    id: Math.random().toString(36).slice(2, 10),
    agent,
    department: dept,
    action,
    detail: "",
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    status: status as any,
  };
};

const activity = {
  activity: [
    t(9, 0, "CEO Agent", "Morning report generated — 5 new leads, 11 drafts need review, $0 MRR", "CEO", "done"),
    t(8, 0, "Content Planner", "Social content batch complete — 11 drafts ready for review", "Marketing", "needs_review"),
    t(7, 55, "Lead Scanner", "Daily lead scan complete — 5 new PRIORITY leads added", "Sales", "done"),
    t(7, 50, "Outreach Drafter", "3 outreach emails drafted — awaiting your approval", "Sales", "needs_review"),
    t(6, 30, "n8n Workflow Builder", "D2C lead routing delivered — Client #2 live in production", "Delivery & Ops", "done"),
    t(6, 0, "Trend Scanner", "AI trends feed updated — 5 new entries from Adobe, BCG, MIT, W+K", "Product Research", "done"),
    t(5, 45, "Enrichment Agent", "Full enrichment complete — 73 leads, 71 email guesses, 5 phones", "Sales", "done"),
    t(4, 20, "Lead Scanner", "Pipeline index updated — 29 total leads, 22 identified", "Sales", "done"),
    t(3, 0, "Brand Strategist", "Brand positioning doc v2 written — build-don't-consult framework", "Marketing", "done"),
    t(2, 15, "n8n Workflow Builder", "Client #1 automation health check — all workflows green", "Delivery & Ops", "done"),
  ],
};

export async function GET() {
  return NextResponse.json(activity);
}
