import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HERMES_HOME = process.env.HERMES_HOME || "D:/QubNexa/hermes";
const AGENTS_DIR = path.join(HERMES_HOME, "..", "Obsidian Vault", "Projects", "QubNexa", "agency-agents");

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");
  if (!file) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
  }

  // file can be: "sales-outbound-strategist.md" or "sales/sales-outbound-strategist.md"
  // Normalize: if no subdirectory, try direct; if has path separator, use as-is
  const safeName = file.replace(/"/g, "").replace(/<|>|\|:*"/g, "");
  const filePath = path.join(AGENTS_DIR, safeName);

  // Also try without subdirectory prefix if direct lookup fails
  const basename = path.basename(safeName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}