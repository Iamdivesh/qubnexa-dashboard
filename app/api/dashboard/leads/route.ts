import { NextResponse } from "next/server";
import { getLeads, getLeadsGroupedByStage } from "@/lib/db/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage") || undefined;
  const region = searchParams.get("region") || undefined;
  const minScore = searchParams.get("minScore");
  const limit = searchParams.get("limit");

  const filter: any = {};
  if (stage) filter.stage = stage;
  if (region) filter.region = region;
  if (minScore) filter.minScore = Number(minScore);
  if (limit) filter.limit = Number(limit);

  const leads = getLeads(filter);
  const grouped = getLeadsGroupedByStage();

  return NextResponse.json({ leads, grouped });
}
