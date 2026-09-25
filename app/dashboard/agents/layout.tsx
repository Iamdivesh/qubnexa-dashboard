import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Agent Roster",
  description: "Browse all 264 AI specialists — organized by department, searchable, with full prompts.",
};

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}