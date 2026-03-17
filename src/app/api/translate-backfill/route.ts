import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateDemoTopics } from "@/lib/translation/translateDemo";
import { SUPPORTED_LOCALES } from "@/i18n/types";
import { fetchAllTranslatedDemoIds } from "@/lib/supabase/fetchAllTranslatedDemoIds";
import { paginateQuery } from "@/lib/supabase/paginateQuery";
import type { SupabaseClient } from "@supabase/supabase-js";

const BATCH_SIZE = 20;

async function fetchAllDemos(
  supabase: SupabaseClient
): Promise<{ id: string; topic: string }[]> {
  return paginateQuery<{ id: string; topic: string }>((from, to) =>
    supabase
      .from("demos")
      .select("id, topic")
      .order("created_at", { ascending: false })
      .range(from, to)
  );
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  let allDemos: { id: string; topic: string }[];
  let translatedDemoIds: Set<string>;

  try {
    [allDemos, translatedDemoIds] = await Promise.all([
      fetchAllDemos(supabase),
      fetchAllTranslatedDemoIds(supabase),
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (allDemos.length === 0) {
    return NextResponse.json({ translated: 0, remaining: 0 });
  }

  const demosNeedingTranslation = allDemos.filter(
    (demo) => !translatedDemoIds.has(demo.id)
  );

  const batch = demosNeedingTranslation.slice(0, BATCH_SIZE);

  if (batch.length === 0) {
    return NextResponse.json({ translated: 0, remaining: 0 });
  }

  const translations = await translateDemoTopics(batch, SUPPORTED_LOCALES);

  if (translations.length > 0) {
    const { error: insertError } = await supabase
      .from("demo_translations")
      .upsert(translations, { onConflict: "demo_id,locale" });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    translated: batch.length,
    remaining: demosNeedingTranslation.length - batch.length,
  });
}
