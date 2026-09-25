import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Outreach & CRM",
  description: "Outreach management — emails, channels, replies, calendar.",
};

export default function OutreachLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}