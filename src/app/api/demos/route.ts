import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Demo } from "@/lib/types";
import { paginateQuery } from "@/lib/supabase/paginateQuery";

export async function GET() {
  try {
    const supabase = createServerClient();
    const demos = await paginateQuery<Demo>((from, to) =>
      supabase
        .from("demos")
        .select("*")
        .order("date", { ascending: true })
        .order("time_from", { ascending: true })
        .range(from, to)
    );

    const lastUpdated = demos.reduce((latest, d) => {
      return d.scraped_at > latest ? d.scraped_at : latest;
    }, "");

    const cutoffDate = (() => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - 7);
      return d.toISOString().split("T")[0];
    })();

    return NextResponse.json(
      { demos, lastUpdated, cutoffDate },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Demos API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
