import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const QUEUE_DIR = "D:/QubNexa/hermes/cron/agent-queue";

export async function GET(request: NextRequest) {
  try {
    const queueDir = QUEUE_DIR;
    if (!fs.existsSync(queueDir)) {
      return NextResponse.json({ completed: [], pending: [] });
    }

    // Read ALL queue files directly (not from _executions.json index)
    const allItems: any[] = [];
    const files = fs.readdirSync(queueDir)
      .filter(f => f.endsWith(".json") && !f.startsWith("_"));

    for (const file of files) {
      try {
        const item = JSON.parse(fs.readFileSync(path.join(queueDir, file), "utf8"));
        allItems.push(item);
      } catch {}
    }

    // Sort by created_at descending
    allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const completed = allItems.filter((e: any) => e.status === "completed").slice(0, 10);
    const pending = allItems.filter((e: any) => e.status === "queued" || e.status === "running").slice(0, 10);

    return NextResponse.json({ completed, pending });
  } catch (err) {
    console.error("Agent results error:", err);
    return NextResponse.json({ completed: [], pending: [] });
  }
}