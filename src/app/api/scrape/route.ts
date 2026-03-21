import { NextRequest, NextResponse } from "next/server";
import { scrapeAndStore } from "@/lib/scraper/scrapeAndStore";
import { verifyBearerToken } from "@/lib/auth/verifyBearerToken";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!verifyBearerToken(authHeader, process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await scrapeAndStore();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
