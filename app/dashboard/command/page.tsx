"use client";

import { useEffect, useState } from "react";
import { CommandCenterHeader } from "@/components/command/CommandCenterHeader";
import { DepartmentGrid } from "@/components/command/DepartmentGrid";
import { CEOControlPanel } from "@/components/command/CEOControlPanel";
import { AgentActivityFeed } from "@/components/command/AgentActivityFeed";
import { TargetProgress } from "@/components/command/TargetProgress";

interface DeptStatus {
  id: string;
  name: string;
  icon: string;
  color: string;
  agents: { name: string; status: string; lastAction: string; taskCount: number }[];
  health: "healthy" | "degraded" | "down";
  lastRun: string;
  pendingTasks: number;
  bottlenecks: string[];
}

interface ActivityItem {
  id: string;
  agent: string;
  department: string;
  action: string;
  detail: string;
  time: string;
  status: "done" | "pending" | "needs_review" | "error";
}

interface Target {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  color: string;
}

interface CEOAction {
  id: string;
  type: string;
  description: string;
  department: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected" | "done";
  details: string;
}

export default function CommandCenterPage() {
  const [deptStatus, setDeptStatus] = useState<DeptStatus[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [ceoActions, setCeoActions] = useState<CEOAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/command/departments").then((r) => r.json()),
      fetch("/api/command/activity").then((r) => r.json()),
      fetch("/api/command/targets").then((r) => r.json()),
      fetch("/api/command/actions").then((r) => r.json()),
    ])
      .then(([depts, acts, targs, actions]) => {
        setDeptStatus(depts?.departments || []);
        setActivity(acts?.activity || []);
        setTargets(targs?.targets || []);
        setCeoActions(actions?.actions || []);
      })
      .catch(() => {
        // Seed with realistic mock data so the UI always has something to show
        setDeptStatus(getMockDepts());
        setActivity(getMockActivity());
        setTargets(getMockTargets());
        setCeoActions(getMockActions());
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
        <CommandCenterHeader />
        <main className="container-x flex-1 px-1.5 pb-10 pt-6 md:px-2.5 md:pt-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6">
              <div className="h-12 rounded-xl border border-[var(--ink-10)] bg-[var(--bg-raised)] skeleton-block" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] skeleton-block" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      <CommandCenterHeader />
      <main className="container-x flex-1 px-1.5 pb-10 pt-6 md:px-2.5 md:pt-8">
        <div className="mx-auto max-w-6xl">
          {/* TOP BAR: Target progress */}
          <div className="mb-6">
            <TargetProgress targets={targets} />
          </div>

          {/* CEO CONTROL PANEL */}
          <div className="mb-6">
            <CEOControlPanel
              actions={ceoActions}
              onApprove={(id) => handleAction(id, "approve")}
              onReject={(id) => handleAction(id, "reject")}
            />
          </div>

          {/* DEPARTMENT GRID */}
          <div className="mb-6">
            <DepartmentGrid departments={deptStatus} />
          </div>

          {/* AGENT ACTIVITY FEED */}
          <div>
            <AgentActivityFeed activity={activity} />
          </div>
        </div>
      </main>
    </div>
  );
}

function handleAction(id: string, action: "approve" | "reject") {
  // In real impl, POST to /api/command/actions/approve or /reject
  console.log(`Action ${action} on ${id}`);
}

/* ---- Mock data so the UI renders even before API routes exist ---- */

function getMockDepts(): DeptStatus[] {
  return [
    {
      id: "sales",
      name: "Sales & BD",
      icon: "target",
      color: "var(--accent)",
      health: "healthy",
      lastRun: "Today, 09:00 AM",
      pendingTasks: 5,
      bottlenecks: [],
      agents: [
        { name: "Lead Scanner", status: "active", lastAction: "Scanned Houston dentists — 12 new leads", taskCount: 3 },
        { name: "Enrichment Agent", status: "active", lastAction: "Enriched 73 leads, 71 email guesses", taskCount: 1 },
        { name: "Outreach Drafter", status: "waiting_approval", lastAction: "3 emails drafted for Foxtale, Healing Hands, Moxie", taskCount: 2 },
      ],
    },
    {
      id: "delivery",
      name: "Delivery & Ops",
      icon: "wrench",
      color: "var(--amber)",
      health: "healthy",
      lastRun: "Yesterday, 06:30 PM",
      pendingTasks: 2,
      bottlenecks: ["2 automations need client onboarding"],
      agents: [
        { name: "n8n Workflow Builder", status: "active", lastAction: "Built D2C lead routing for Client #2", taskCount: 2 },
        { name: "Client Onboarding", status: "idle", lastAction: "Awaiting approved deal to start", taskCount: 0 },
        { name: "QA & Monitoring", status: "active", lastAction: "All 2 live automations healthy", taskCount: 0 },
      ],
    },
    {
      id: "product",
      name: "Product Research",
      icon: "lightbulb",
      color: "var(--accent-strong)",
      health: "degraded",
      lastRun: "Yesterday, 11:00 AM",
      pendingTasks: 4,
      bottlenecks: ["No new automation ideas shortlisted this week"],
      agents: [
        { name: "Trend Scanner", status: "active", lastAction: "5 AI trends logged (Adobe fatigue, W+K UGC, BCG, Bata, MIT)", taskCount: 2 },
        { name: "Competitor Analyst", status: "idle", lastAction: "Last scan: Sep 17", taskCount: 0 },
        { name: "ICP Refiner", status: "idle", lastAction: "Healthcare dominating — 7 of 12 priority leads", taskCount: 0 },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "megaphone",
      color: "var(--accent)",
      health: "healthy",
      lastRun: "Today, 06:20 AM",
      pendingTasks: 11,
      bottlenecks: [],
      agents: [
        { name: "Content Planner", status: "active", lastAction: "11 drafts ready for review (3 LI, 5 X, 3 IG)", taskCount: 3 },
        { name: "Social Scheduler", status: "idle", lastAction: "Awaiting approval on 11 drafts", taskCount: 0 },
        { name: "Brand Strategist", status: "active", lastAction: "Positioning doc v2 — build-don't-consult", taskCount: 1 },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      icon: "chart",
      color: "var(--sand-deep)",
      health: "healthy",
      lastRun: "Today, 09:00 AM",
      pendingTasks: 1,
      bottlenecks: [],
      agents: [
        { name: "MRR Tracker", status: "active", lastAction: "$0 MRR — 0 active clients, 0 trials", taskCount: 1 },
        { name: "Billing Alert", status: "idle", lastAction: "No billing issues", taskCount: 0 },
      ],
    },
    {
      id: "development",
      name: "Development",
      icon: "code",
      color: "var(--ink-90)",
      health: "down",
      lastRun: "3 days ago",
      pendingTasks: 3,
      bottlenecks: ["No dev agent connected yet", "OpenCode not installed"],
      agents: [
        { name: "Web Developer", status: "not_connected", lastAction: "Not yet connected", taskCount: 0 },
        { name: "Mobile Developer", status: "not_connected", lastAction: "Not yet connected", taskCount: 0 },
        { name: "AI Engineer", status: "not_connected", lastAction: "Not yet connected", taskCount: 0 },
      ],
    },
  ];
}

function getMockActivity(): ActivityItem[] {
  const now = new Date();
  const t = (h: number, m: number, label: string, agent: string, dept: string, status: ActivityItem["status"]) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return {
      id: Math.random().toString(36).slice(2),
      agent,
      department: dept,
      action: label,
      detail: "",
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      status,
    };
  };
  return [
    t(9, 0, "Morning report generated", "CEO Agent", "CEO", "done"),
    t(8, 0, "Social content batch — 11 drafts ready", "Content Planner", "Marketing", "needs_review"),
    t(7, 55, "Lead scan complete — 5 new PRIORITY leads", "Lead Scanner", "Sales", "done"),
    t(7, 50, "Outreach emails drafted — 3 leads", "Outreach Drafter", "Sales", "needs_review"),
    t(6, 30, "D2C lead routing automation delivered — Client #2 live", "n8n Workflow Builder", "Delivery", "done"),
    t(6, 0, "AI trends feed updated — 5 new entries", "Trend Scanner", "Product", "done"),
    t(5, 45, "Enrichment complete — 73 leads, 71 email guesses", "Enrichment Agent", "Sales", "done"),
    t(4, 20, "Pipeline index updated — 29 total leads", "Lead Scanner", "Sales", "done"),
    t(3, 0, "Brand positioning doc v2 written", "Brand Strategist", "Marketing", "done"),
  ];
}

function getMockTargets(): Target[] {
  return [
    { id: "mrr", label: "Monthly Recurring Revenue", target: 100000, current: 0, unit: "$/mo", color: "var(--accent-strong)" },
    { id: "clients", label: "Active Clients", target: 20, current: 0, unit: "clients", color: "var(--accent)" },
    { id: "revenue", label: "Revenue This Month", target: 50000, current: 0, unit: "$", color: "var(--amber)" },
    { id: "leads", label: "Leads in Pipeline", target: 100, current: 29, unit: "leads", color: "var(--ink-90)" },
    { id: "automations", label: "Automations Deployed", target: 15, current: 2, unit: "deployed", color: "var(--accent)" },
  ];
}

function getMockActions(): CEOAction[] {
  return [
    {
      id: "1",
      type: "outreach",
      description: "3 outreach emails ready for your review — Foxtale, Healing Hands, Moxie Beauty",
      department: "Sales",
      priority: "high",
      status: "pending",
      details: "Drafted by Outreach Drafter agent. Review and approve to send. All 3 targets have verified contacts. Foxtale: romita@foxtale.in ($30M Series C, SRK campaign live). Healing Hands: info@healinghandsclinic.co.in ($30M L Catterton, expanding 40→100 centers). Moxie Beauty: LinkedIn @Nikita Khanna ($15M Series A, US expansion).",
    },
    {
      id: "2",
      type: "product",
      description: "Product Research wants direction — which automation to build next?",
      department: "Product Research",
      priority: "medium",
      status: "pending",
      details: "Top candidates from research: (1) Healthcare patient engagement automation — strongest ICP signal (7 priority leads). (2) D2C post-purchase nurture — Foxtale, Moxie, Home Essentials all need it. (3) Real estate lead router — Houston has 100+ brokerages. Agent recommends #1 based on lead density.",
    },
    {
      id: "3",
      type: "approve_draft",
      description: "Review and approve 11 social media drafts for Sep 24 posting",
      department: "Marketing",
      priority: "medium",
      status: "pending",
      details: "3 LinkedIn, 5 X/Twitter, 3 Instagram. Topics: what 'live' means, 67% beyond pilot stat, why self-host n8n, 151x speed improvement, 3 n8n differentiators, agency with no office, thinking still human, 90-second lead routing, automation workflow carousel, before/after carousel. All in Obsidian → Social/Drafts/.",
    },
    {
      id: "4",
      type: "dev",
      description: "Development department not yet connected — install OpenCode and connect dev agents",
      department: "Development",
      priority: "low",
      status: "pending",
      details: "Development tile shows all 3 agents (Web, Mobile, AI Engineer) as not_connected. To activate: install OpenCode CLI, then copy agency-agents dev personas into ~/.opencode/agents/. Or use Claude Code with the same agent files. Start with Web Developer for dashboard improvements.",
    },
  ];
}
