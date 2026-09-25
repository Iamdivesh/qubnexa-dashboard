import { NextResponse } from "next/server";
import { writeAndRenderReport } from "@/lib/orchestrator";

export async function POST() {
  try {
    const { report, date } = await writeAndRenderReport();
    return NextResponse.json({ report, date, success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
