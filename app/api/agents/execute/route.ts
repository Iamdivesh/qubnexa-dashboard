import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HERMES_HOME = process.env.HERMES_HOME || "D:/QubNexa/hermes";
const QUEUE_DIR = path.join(HERMES_HOME, "cron", "agent-queue");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, task, context, department } = body;

    if (!agent || !task) {
      return NextResponse.json(
        { error: "Missing agent or task" },
        { status: 400 }
      );
    }

    // Create execution request
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const execution = {
      id: executionId,
      agent: agent,
      task: task,
      context: context || {},
      department: department || "general",
      status: "queued",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Ensure queue directory exists
    fs.mkdirSync(QUEUE_DIR, { recursive: true });

    // Save to queue
    const queueFile = path.join(QUEUE_DIR, `${executionId}.json`);
    fs.writeFileSync(queueFile, JSON.stringify(execution, null, 2));

    // Also save to executions log
    const executionsFile = path.join(QUEUE_DIR, "_executions.json");
    let executions: any[] = [];
    if (fs.existsSync(executionsFile)) {
      executions = JSON.parse(fs.readFileSync(executionsFile, "utf8"));
    }
    executions.unshift(execution);
    // Keep only last 100
    if (executions.length > 100) executions = executions.slice(0, 100);
    fs.writeFileSync(executionsFile, JSON.stringify(executions, null, 2));

    return NextResponse.json({
      success: true,
      execution_id: executionId,
      status: "queued",
      message: `Agent "${agent}" queued for execution. Results will appear in the activity feed.`,
    });
  } catch (err) {
    console.error("Agent execution error:", err);
    return NextResponse.json(
      { error: "Failed to queue agent execution" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const queueDir = QUEUE_DIR;
    if (!fs.existsSync(queueDir)) {
      return NextResponse.json({ executions: [], queue: [] });
    }

    // Get executions list
    const executionsFile = path.join(queueDir, "_executions.json");
    let executions: any[] = [];
    if (fs.existsSync(executionsFile)) {
      executions = JSON.parse(fs.readFileSync(executionsFile, "utf8"));
    }

    // Get pending queue items
    const queueItems: any[] = [];
    const files = fs.readdirSync(queueDir)
      .filter(f => f.endsWith(".json") && !f.startsWith("_"));

    for (const file of files.slice(0, 20)) {
      try {
        const item = JSON.parse(fs.readFileSync(path.join(queueDir, file), "utf8"));
        queueItems.push(item);
      } catch {
        // skip corrupt files
      }
    }

    return NextResponse.json({
      executions,
      queue: queueItems,
    });
  } catch (err) {
    console.error("Agent queue error:", err);
    return NextResponse.json(
      { error: "Failed to fetch agent queue" },
      { status: 500 }
    );
  }
}