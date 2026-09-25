import { NextResponse } from "next/server";
import { getLead } from "@/lib/db/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const lead = getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "lead not found" }, { status: 404 });
  }

  // Return the full lead with enrichment data
  return NextResponse.json(lead);
}
