import { NextResponse } from "next/server";
import { getMrrTotals, getClients } from "@/lib/db/queries";

export async function GET() {
  const totals = getMrrTotals();
  const clients = getClients();
  return NextResponse.json({ totals, clients });
}
