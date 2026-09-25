import { NextResponse } from "next/server";
import {
  getOutreachStats,
  getOutreachTotals,
  getOutreachToday,
  getDailyMetrics,
} from "@/lib/db/queries";

export async function GET() {
  const stats = getOutreachStats(14);
  const totals = getOutreachTotals();
  const today = getOutreachToday();
  const metrics = getDailyMetrics(14);

  return NextResponse.json({ stats, totals, today, metrics });
}
