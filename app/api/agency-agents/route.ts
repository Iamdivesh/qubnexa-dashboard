import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const hermesHome = process.env.HERMES_HOME || "D:/QubNexa/hermes";
  // Derive drive from HERMES_HOME (e.g. "D:/QubNexa/hermes" -> "D:/")
  const drive = hermesHome.charAt(0) + ":/";
  const jsonPath = path.join(drive, "Obsidian Vault", "Projects", "QubNexa", "agency-agents.json");

  if (!fs.existsSync(jsonPath)) {
    return NextResponse.json(
      { error: "agency-agents.json not found — run: npm run agency:build-agents" },
      { status: 503 }
    );
  }

  try {
    const data = fs.readFileSync(jsonPath, "utf8");
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600", // 10 min cache
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read agents index" }, { status: 500 });
  }
}
