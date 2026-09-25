import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Marketing & Content",
  description: "Marketing dashboard — content calendar, drafts, posting.",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
