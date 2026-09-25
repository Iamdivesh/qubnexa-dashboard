import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, note } = body as { id?: string; action?: string; note?: string };

    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    const db = getDb();
    const leads = db.leads as any[];
    const lead = leads.find((l) => l.id === id);

    if (!lead) {
      return NextResponse.json({ error: "lead not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    switch (action) {
      case "mark_contacted": {
        lead.stage = "contacted";
        lead.outreach_status = "contacted";
        lead.updated_at = now;
        lead.last_seen = now;
        break;
      }
      case "schedule_call": {
        lead.stage = "booked";
        lead.outreach_status = "booked";
        lead.updated_at = now;
        lead.last_seen = now;
        break;
      }
      case "add_note": {
        const existing = lead.notes || "";
        const newNote = note ? `[${new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}] ${note}\n` : "";
        lead.notes = existing + newNote;
        lead.updated_at = now;
        lead.last_seen = now;
        break;
      }
      default:
        return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
    }

    saveDb();
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error("[leads-actions] error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
