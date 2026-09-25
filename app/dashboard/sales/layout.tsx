import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Sales & Pipeline",
  description: "Sales pipeline management — leads, stages, scoring, outreach.",
};

export default function SalesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
