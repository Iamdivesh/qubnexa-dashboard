"use client";

import { useState } from "react";

interface Agent {
  name: string; filename: string; division_label: string; color: string; emoji: string;
  description: string; vibe: string; filepath: string;
}

interface ExecutionResult {
  id: string; agent: string; task: string; status: string; result: string;
  created_at: string; completed_at: string; result_path: string;
}

interface AgentExecutionPanelProps {
  agent: Agent;
  deptColor: string;
}

export function AgentExecutionPanel({ agent, deptColor }: AgentExecutionPanelProps) {
  const [task, setTask] = useState("");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState("");

  const handleExecute = async () => {
    if (!task.trim() || executing) return;

    setExecuting(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agent.filename,
          task: task,
          department: agent.division_label,
          context: { agent_name: agent.name, description: agent.description },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Execution failed");
        setExecuting(false);
        return;
      }

      // Poll for result (simple approach — in production use WebSocket or polling)
      setResult({
        id: data.execution_id,
        agent: agent.name,
        task: task,
        status: "queued",
        result: "",
        created_at: new Date().toISOString(),
        completed_at: "",
        result_path: "",
      });

      // Poll for up to 30 seconds
      let polls = 0;
      const pollInterval = setInterval(async () => {
        polls++;
        try {
          const pollRes = await fetch("/api/agents/results");
          const pollData = await pollRes.json();
          const finished = pollData.completed.find((r: any) => r.id === data.execution_id);
          if (finished && finished.status === "completed") {
            clearInterval(pollInterval);
            setResult(finished);
          } else if (finished && finished.status === "error") {
            clearInterval(pollInterval);
            setError(finished.error || "Execution failed");
            setResult(finished);
          }
        } catch {}

        if (polls > 60) {
          clearInterval(pollInterval);
          setExecuting(false);
        }
      }, 5000);

      // Also stop polling after 30 seconds
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (err) {
      setError("Network error: " + (err as Error).message);
      setExecuting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: `${deptColor}18` }}>
          <span className="text-xs" style={{ color: deptColor }}>{agent.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--ink)]">{agent.name}</p>
          <p className="text-[9px] text-[var(--ink-40)] truncate">{agent.division_label}</p>
        </div>
      </div>

      {/* Execute form */}
      <div className="space-y-3">
        <div>
          <label className="text-[9px] font-medium text-[var(--ink-50)] uppercase tracking-wider block mb-1">
            What should this agent do?
          </label>
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Describe the task... e.g. 'Research the top 5 competitors in D2C skincare and summarize their digital marketing strategies'"
            className="w-full rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs text-[var(--ink)] placeholder-[var(--ink-40)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
            rows={3}
            disabled={executing}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecute}
            disabled={!task.trim() || executing}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium text-white hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {executing ? (
              <>
                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Executing...
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132a1.23 1.23 0 00-1.76 1.76l2.132 3.197m-5.464 0l3.197 2.132a1.23 1.23 0 001.76-1.76l-2.132-3.197m5.464 0l-3.196 2.132a1.23 1.23 0 001.76 1.76l3.196-2.132M16 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Execute Agent
              </>
            )}
          </button>
          <button
            onClick={() => { setTask(""); setResult(null); setError(""); }}
            className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 px-3 py-2 text-xs text-[var(--ink-50)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && result.status === "queued" && (
        <div className="mt-3 rounded-lg bg-[var(--accent-tint)]/20 border border-[var(--accent)]/20 p-3">
          <div className="flex items-center gap-2 text-xs text-[var(--accent-strong)]">
            <svg className="h-3.5 w-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Execution queued — waiting for Hermes cron to process...
          </div>
          <p className="text-[9px] text-[var(--ink-40)] mt-1">ID: {result.id}</p>
        </div>
      )}

      {result && result.status === "completed" && result.result && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--green)]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="font-medium">Execution complete</span>
            <span className="text-[var(--ink-40)]">· {result.completed_at?.split("T")[0]}</span>
          </div>
          <div className="rounded-lg bg-[var(--bg)]/50 border border-[var(--ink-10)]/50 p-3 max-h-48 overflow-y-auto">
            <pre className="text-[10px] text-[var(--ink-600)] whitespace-pre-wrap font-mono leading-relaxed">{result.result}</pre>
          </div>
          <button
            onClick={() => window.open("/dashboard/agents", "_blank")}
            className="flex items-center gap-1 text-[9px] text-[var(--accent)] hover:underline"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM6.75 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zM12 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM17.25 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM17.25 12a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5"/></svg>
            View full agent roster → More agents
          </button>
        </div>
      )}

      {/* Info */}
      {!result && !error && (
        <div className="mt-2 text-[9px] text-[var(--ink-40)] leading-relaxed">
          <p className="leading-none">{agent.description}</p>
          {agent.vibe && <p className="mt-1" style={{ color: deptColor }}>{agent.vibe}</p>}
        </div>
      )}
    </div>
  );
}