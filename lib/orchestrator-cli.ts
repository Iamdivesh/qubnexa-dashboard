#!/usr/bin/env -S npx tsx
/**
 * Run the orchestrator morning report manually (one-shot).
 *
 * Usage: npm run agency:run-report
 *
 * Generates today's report from the DB, writes it to orchestrator_reports,
 * and prints it to stdout.
 */
import { getDb, saveDb } from "@/lib/db/client";

async function main() {
  console.log("Running orchestrator morning report…\n");
  const { writeAndRenderReport } = await import("@/lib/orchestrator");
  const { report, date } = await writeAndRenderReport();
  console.log(report);
  console.log(`\n[Saved] orchestrator_reports (date=${date})`);
  saveDb();
}

main().catch((err) => {
  console.error("[orchestrator-cli] failed:", err);
  process.exit(1);
});
