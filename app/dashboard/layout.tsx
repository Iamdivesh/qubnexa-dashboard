import { Geist_Mono, Inter } from "next/font/google";
import "../globals.css";

const interSans = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "QubNexa Agency Dashboard",
  description: "Internal agency dashboard — leads, outreach, MRR, automation catalog.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
