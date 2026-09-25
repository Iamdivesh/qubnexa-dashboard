#!/usr/bin/env -S npx tsx
/**
 * Initialize + seed the agency DB in one step.
 *
 * Usage: npm run agency:init  (creates tables + indexes if missing)
 *        npm run agency:seed  (seeds automation catalog via UPSERT)
 *
 * Both are idempotent — safe to run any number of times.
 */
import { initDb } from "@/lib/db/client";

async function main() {
  await initDb();
  console.log("[agency-init] DB initialized.");
}

main().catch((err) => {
  console.error("[agency-init] failed:", err);
  process.exit(1);
});
