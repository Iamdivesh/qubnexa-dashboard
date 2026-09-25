"use client";

interface Props {
  leadId: string;
  leadName: string;
}

export function LeadActions({ leadId, leadName }: Props) {
  const handleAction = async (action: string, note?: string) => {
    const body: Record<string, string> = { id: leadId, action };
    if (note) body.note = note;

    try {
      const res = await fetch("/api/dashboard/leads/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (action === "add_note") {
          alert("Note added.");
          window.location.reload();
        } else {
          alert(`Lead "${leadName}" marked as ${action.replace("_", " ")}.`);
          window.location.reload();
        }
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error || "unknown error"}`);
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div className="space-y-3">
      <button
        className="w-full rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent-tint)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        onClick={() => handleAction("mark_contacted")}
      >
        <span className="block">Mark Contacted</span>
        <span className="block text-xs text-[var(--ink-50)] mt-0.5">
          Move to contacted stage
        </span>
      </button>

      <button
        className="w-full rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent-tint)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        onClick={() => handleAction("schedule_call")}
      >
        <span className="block">Schedule Call</span>
        <span className="block text-xs text-[var(--ink-50)] mt-0.5">
          Book a follow-up call
        </span>
      </button>

      <button
        className="w-full rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-tint)] hover:border-[var(--accent-tint)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        onClick={() => {
          const note = prompt("Add a note for this lead:");
          if (!note) return;
          handleAction("add_note", note);
        }}
      >
        <span className="block">Add Note</span>
        <span className="block text-xs text-[var(--ink-50)] mt-0.5">
          Attach a private note
        </span>
      </button>
    </div>
  );
}
