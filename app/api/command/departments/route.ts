import { NextResponse } from "next/server";

// Mock department status — in production, reads from DB + agent state
const departments = {
  departments: [
    {
      id: "sales",
      name: "Sales & BD",
      icon: "target",
      color: "#2F6FED",
      health: "healthy",
      lastRun: "Today, 09:00 AM IST",
      pendingTasks: 5,
      bottlenecks: [],
      agents: [
        { name: "Lead Scanner", status: "active", lastAction: "Scanned Houston dentists — 12 new leads pushed to DB", taskCount: 3 },
        { name: "Enrichment Agent", status: "active", lastAction: "Enriched 73 leads, 71 email guesses generated", taskCount: 1 },
        { name: "Outreach Drafter", status: "waiting_approval", lastAction: "3 emails drafted — Foxtale, Healing Hands, Moxie Beauty", taskCount: 2 },
      ],
    },
    {
      id: "delivery",
      name: "Delivery & Ops",
      icon: "wrench",
      color: "#E4DAC6",
      health: "healthy",
      lastRun: "Yesterday, 06:30 PM IST",
      pendingTasks: 2,
      bottlenecks: ["2 automations need client onboarding"],
      agents: [
        { name: "n8n Workflow Builder", status: "active", lastAction: "Built D2C lead routing for Client #2 — live", taskCount: 2 },
        { name: "Client Onboarding", status: "idle", lastAction: "Awaiting approved deal to start onboarding", taskCount: 0 },
        { name: "QA & Monitoring", status: "active", lastAction: "All 2 live automations healthy — no errors", taskCount: 0 },
      ],
    },
    {
      id: "product",
      name: "Product Research",
      icon: "lightbulb",
      color: "#0B1E3D",
      health: "degraded",
      lastRun: "Yesterday, 11:00 AM IST",
      pendingTasks: 4,
      bottlenecks: ["No new automation ideas shortlisted this week"],
      agents: [
        { name: "Trend Scanner", status: "active", lastAction: "5 AI trends logged (Adobe fatigue, W+K UGC, BCG, Bata, MIT)", taskCount: 2 },
        { name: "Competitor Analyst", status: "idle", lastAction: "Last full scan: Sep 17 — healthcare dominating ICP", taskCount: 0 },
        { name: "ICP Refiner", status: "idle", lastAction: "Healthcare: 7 of 12 priority leads — validate as primary ICP", taskCount: 0 },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "megaphone",
      color: "#2F6FED",
      health: "healthy",
      lastRun: "Today, 06:20 AM IST",
      pendingTasks: 11,
      bottlenecks: [],
      agents: [
        { name: "Content Planner", status: "active", lastAction: "11 drafts ready — 3 LI, 5 X, 3 IG (Sep 24 batch)", taskCount: 3 },
        { name: "Social Scheduler", status: "idle", lastAction: "Awaiting approval on 11 drafts before scheduling", taskCount: 0 },
        { name: "Brand Strategist", status: "active", lastAction: "Positioning doc v2 — build-don't-consult, outcomes over AI", taskCount: 1 },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      icon: "chart",
      color: "#8A6D3B",
      health: "healthy",
      lastRun: "Today, 09:00 AM IST",
      pendingTasks: 1,
      bottlenecks: [],
      agents: [
        { name: "MRR Tracker", status: "active", lastAction: "$0 MRR — 0 active clients, 0 trials — first revenue pending", taskCount: 1 },
        { name: "Billing Alert", status: "idle", lastAction: "No billing issues — no clients yet", taskCount: 0 },
      ],
    },
    {
      id: "development",
      name: "Development",
      icon: "code",
      color: "#0B1E3D",
      health: "down",
      lastRun: "3 days ago",
      pendingTasks: 3,
      bottlenecks: ["No dev agent connected yet", "OpenCode not installed", "agency-agents dev personas not copied"],
      agents: [
        { name: "Web Developer", status: "not_connected", lastAction: "Not yet connected — install OpenCode + copy agent files", taskCount: 0 },
        { name: "Mobile Developer", status: "not_connected", lastAction: "Not yet connected", taskCount: 0 },
        { name: "AI Engineer", status: "not_connected", lastAction: "Not yet connected", taskCount: 0 },
      ],
    },
  ],
};

export async function GET() {
  return NextResponse.json(departments);
}
