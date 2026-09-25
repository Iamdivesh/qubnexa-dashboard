import { NextResponse } from "next/server";
import { getLatestReport } from "@/lib/db/queries";

export async function GET() {
  const report = getLatestReport();
  return NextResponse.json({ report });
}
