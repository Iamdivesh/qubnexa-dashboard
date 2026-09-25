import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Operations & Delivery",
  description: "Operations dashboard — automations, system health, scrapes.",
};

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}