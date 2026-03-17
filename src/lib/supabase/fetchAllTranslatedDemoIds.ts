import type { SupabaseClient } from "@supabase/supabase-js";
import { paginateQuery } from "./paginateQuery";

/**
 * Fetches ALL distinct demo_ids from demo_translations by paginating
 * through the table.
 *
 * Returns a Set<string> of demo IDs that already have at least one translation.
 */
export async function fetchAllTranslatedDemoIds(
  supabase: SupabaseClient
): Promise<Set<string>> {
  const rows = await paginateQuery<{ demo_id: string }>((from, to) =>
    supabase
      .from("demo_translations")
      .select("demo_id")
      .range(from, to)
  );

  return new Set(rows.map((row) => row.demo_id));
}
