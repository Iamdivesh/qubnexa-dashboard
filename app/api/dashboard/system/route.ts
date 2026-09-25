import { NextResponse } from "next/server";
import { getAutomationsCatalog, getClientAutomationHealth, getScrapeRunStatus } from "@/lib/db/queries";

export async function GET() {
  const catalog = getAutomationsCatalog();
  const health = getClientAutomationHealth();
  const scrapes = getScrapeRunStatus();
  return NextResponse.json({ catalog, health, scrapes });
}
