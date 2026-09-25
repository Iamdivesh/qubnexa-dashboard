import { NextResponse } from "next/server";

const targets = {
  targets: [
    { id: "mrr", label: "Monthly Recurring Revenue", target: 100000, current: 0, unit: "$/mo", color: "#0B1E3D" },
    { id: "clients", label: "Active Clients", target: 20, current: 0, unit: "clients", color: "#2F6FED" },
    { id: "revenue", label: "Revenue This Month", target: 50000, current: 0, unit: "$", color: "#E4DAC6" },
    { id: "leads", label: "Leads in Pipeline", target: 100, current: 29, unit: "leads", color: "#0B1E3D" },
    { id: "automations", label: "Automations Deployed", target: 15, current: 2, unit: "deployed", color: "#2F6FED" },
  ],
};

export async function GET() {
  return NextResponse.json(targets);
}
