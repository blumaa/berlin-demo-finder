import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/types";
import { paginateQuery } from "@/lib/supabase/paginateQuery";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");

  if (!locale || !SUPPORTED_LOCALES.includes(locale as Locale)) {
    return NextResponse.json(
      { error: "Invalid or missing locale parameter" },
      { status: 400 }
    );
  }

  if (locale === "de") {
    return NextResponse.json({}, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  const supabase = createServerClient();

  try {
    const rows = await paginateQuery<{ demo_id: string; topic: string }>(
      (from, to) =>
        supabase
          .from("demo_translations")
          .select("demo_id, topic")
          .eq("locale", locale)
          .range(from, to)
    );

    const translations: Record<string, string> = {};
    for (const row of rows) {
      translations[row.demo_id] = row.topic;
    }

    return NextResponse.json(translations, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
