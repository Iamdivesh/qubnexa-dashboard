import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Finance & MRR",
  description: "Finance tracking — MRR, clients, deals, invoices.",
};

export default function FinanceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
