import { readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.AGENCY_DB_PATH || join(process.cwd(), "agency.json");

export interface AgencyDb {
  leads: any[];
  outreach: any[];
  clients: any[];
  client_automations: any[];
  automations_catalog: any[];
  orchestrator_reports: any[];
  daily_metrics: any[];
  scrape_runs: any[];
}

let _db: AgencyDb | null = null;
let _saveTimer: ReturnType<typeof setTimeout> | null = null;
let _lastMtime: number | null = null;

function defaultDb(): AgencyDb {
  return {
    leads: [],
    outreach: [],
    clients: [],
    client_automations: [],
    automations_catalog: [],
    orchestrator_reports: [],
    daily_metrics: [],
    scrape_runs: [],
  };
}

function loadDb(): AgencyDb {
  // Check if file was modified since last load
  if (_db && _lastMtime != null && existsSync(DB_PATH /*turbopackIgnore: true*/)) {
    const currentMtime = statSync(DB_PATH).mtimeMs;
    if (currentMtime <= _lastMtime) {
      return _db;
    }
  }

  if (existsSync(DB_PATH)) {
    try {
      const raw = readFileSync(DB_PATH, "utf-8");
      if (!raw.trim()) {
        _db = defaultDb();
        _lastMtime = null;
        return _db;
      }
      const parsed = JSON.parse(raw) as AgencyDb;
      const def = defaultDb();
      const keys = Object.keys(def) as (keyof AgencyDb)[];
      for (const k of keys) {
        if (!((parsed as any)[k])) (parsed as any)[k] = [];
      }
      _db = parsed;
      _lastMtime = existsSync(DB_PATH) ? statSync(DB_PATH).mtimeMs : 0;
    } catch {
      _db = defaultDb();
      _lastMtime = null;
      return _db;
    }
  } else {
    _db = defaultDb();
    _lastMtime = null;
  }
  scheduleSave();
  return _db;
}

export function getDb(): AgencyDb {
  return loadDb();
}

export function saveDb(): void {
  if (!_db) return;
  try {
    writeFileSync(DB_PATH, JSON.stringify(_db, null, 2), "utf-8");
  } catch (err) {
    console.warn("[agency-db] save failed:", err);
  }
}

function scheduleSave(): void {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => saveDb(), 2000);
}

export function closeDb(): void {
  saveDb();
  if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  _db = null;
}

// Backwards-compat async wrappers (kept for callers that await them).
export async function initDb(): Promise<AgencyDb> {
  return loadDb();
}

export async function ensureDb(): Promise<AgencyDb> {
  return loadDb();
}

if (typeof process !== "undefined") {
  process.on("beforeExit", saveDb);
  process.on("exit", saveDb);
}
