import type { ReactNode } from "react";

export const metadata = {
  title: "QubNexa — Product Research",
  description: "Product research — ideas, watchlist, skill discovery.",
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
