import { z } from "zod";
import { fetchHtml } from "./fetchHtml";
import { parseHtml } from "./parseHtml";
import { hashContent } from "./contentHash";
import { createAdminClient } from "@/lib/supabase/admin";
import { RawScrapedDemo } from "@/lib/types";

const DemoRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_from: z.string().regex(/^\d{2}:\d{2}$/),
  time_to: z.string().nullable(),
  topic: z.string().min(1),
  plz: z.string(),
  location: z.string(),
  route_text: z.string().nullable(),
});

export async function scrapeAndStore(): Promise<{
  total: number;
  errors: string[];
  skipped: boolean;
}> {
  const errors: string[] = [];

  // 1. Fetch HTML
  const html = await fetchHtml();

  // 1b. Check if content has changed since last scrape
  const supabase = createAdminClient();
  const currentHash = hashContent(html);
  const { data: hashRow } = await supabase
    .from("scrape_metadata")
    .select("value")
    .eq("key", "last_html_hash")
    .single() as { data: { value: string } | null };

  if (hashRow?.value === currentHash) {
    return { total: 0, errors: [], skipped: true };
  }

  // 2. Parse
  const rawDemos = parseHtml(html);

  // 3. Zero-row guard
  if (rawDemos.length === 0) {
    throw new Error(
      "Scrape returned 0 rows — HTML structure may have changed"
    );
  }

  // 4. Validate with Zod
  const validDemos: RawScrapedDemo[] = [];
  for (const demo of rawDemos) {
    const result = DemoRowSchema.safeParse(demo);
    if (result.success) {
      validDemos.push(demo);
    } else {
      errors.push(`Invalid row: ${JSON.stringify(result.error.issues)}`);
    }
  }

  // 5. Deduplicate by natural key, then bulk upsert
  const now = new Date().toISOString();
  const seen = new Set<string>();
  const rows: Array<Record<string, unknown>> = [];
  for (const demo of validDemos) {
    const key = `${demo.date}|${demo.time_from}|${demo.topic}|${demo.plz}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      date: demo.date,
      time_from: demo.time_from,
      time_to: demo.time_to,
      topic: demo.topic,
      plz: demo.plz,
      location: demo.location,
      route_text: demo.route_text,
      scraped_at: now,
    });
  }

  // Upsert in chunks of 500 to avoid payload limits
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await supabase
      .from("demos")
      .upsert(chunk as never[], { onConflict: "date,time_from,topic,plz" });
    if (error) {
      errors.push(`Bulk upsert error (chunk ${i}): ${error.message}`);
    }
  }

  // 6. Store content hash for next run
  await supabase
    .from("scrape_metadata")
    .upsert({ key: "last_html_hash", value: currentHash, updated_at: new Date().toISOString() } as never, { onConflict: "key" });

  return { total: validDemos.length, errors, skipped: false };
}
