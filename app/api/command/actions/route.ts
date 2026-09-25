import { NextResponse } from "next/server";

const actions = {
  actions: [
    {
      id: "1",
      type: "outreach",
      description: "3 outreach emails ready for your review",
      department: "Sales",
      priority: "high" as const,
      status: "pending" as const,
      details: "Foxtale (romita@foxtale.in, $30M Series C, SRK campaign live), Healing Hands Clinic (info@healinghandsclinic.co.in, $30M L Catterton, expanding 40→100 centers), Moxie Beauty (LinkedIn @Nikita Khanna, $15M Series A, US expansion). All have verified contacts. Drafts in Obsidian → Social/Drafts/.",
    },
    {
      id: "2",
      type: "product_decision",
      description: "Which automation should we build next?",
      department: "Product Research",
      priority: "medium" as const,
      status: "pending" as const,
      details: "Top candidates: (1) Healthcare patient engagement automation — strongest ICP signal, 7 priority leads. (2) D2C post-purchase nurture — Foxtale, Moxie, Home Essentials all need it. (3) Real estate lead router — Houston 100+ brokerages. Agent recommends #1.",
    },
    {
      id: "3",
      type: "approve_draft",
      description: "Review and approve 11 social media drafts for Sep 24",
      department: "Marketing",
      priority: "medium" as const,
      status: "pending" as const,
      details: "3 LinkedIn (what 'live' means, 67% beyond pilot, why self-host n8n), 5 X (151x speed, 3 n8n differentiators, agency no office, thinking still human, 90-sec lead routing), 3 IG (automation how-to carousel, agency no office, before/after carousel). All in Obsidian → Social/Drafts/.",
    },
    {
      id: "4",
      type: "dev",
      description: "Development department not connected — install OpenCode + dev agents",
      department: "Development",
      priority: "low" as const,
      status: "pending" as const,
      details: "All 3 dev agents (Web, Mobile, AI Engineer) show as not_connected. To activate: install OpenCode CLI, clone agency-agents repo, copy dev personas from specialized/ and engineering/ folders into ~/.opencode/agents/. Or use Claude Code with same agent files.",
    },
  ],
};

export async function GET() {
  return NextResponse.json(actions);
}

export async function POST(request: Request) {
  const { id, action } = await request.json();
  // In production: update action status in DB, trigger downstream agent
  return NextResponse.json({ ok: true, id, action });
}
