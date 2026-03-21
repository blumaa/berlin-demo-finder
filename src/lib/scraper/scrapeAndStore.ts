import { z } from "zod";
import { fetchHtml } from "./fetchHtml";
import { parseHtml } from "./parseHtml";
import { parseRoute } from "./parseRoute";
import { hashContent } from "./contentHash";
import { geocodeWithCache } from "@/lib/geocoder/geocodeWithCache";
import { getDirectionsPolyline } from "@/lib/geocoder/directions";
import { createAdminClient } from "@/lib/supabase/admin";
import { RawScrapedDemo, RouteJson } from "@/lib/types";
import { translateDemoTopics } from "@/lib/translation/translateDemo";
import { SUPPORTED_LOCALES } from "@/i18n/types";
import { fetchAllTranslatedDemoIds } from "@/lib/supabase/fetchAllTranslatedDemoIds";

const DemoRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_from: z.string().regex(/^\d{2}:\d{2}$/),
  time_to: z.string().nullable(),
  topic: z.string().min(1),
  plz: z.string(),
  location: z.string(),
  route_text: z.string().nullable(),
});

const GEOCODE_BATCH_SIZE = 5;

async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

const TRANSLATE_BATCH_SIZE = 50;

export async function scrapeAndStore(): Promise<{
  total: number;
  geocoded: number;
  translated: number;
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
    return { total: 0, geocoded: 0, translated: 0, errors: [], skipped: true };
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

  // 5. Deduplicate by natural key, then bulk upsert WITHOUT geocoding (fast)
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

  // 6. Geocode demos that have a location but no lat/lng yet
  const { data: ungeocodedDemos } = await supabase
    .from("demos")
    .select("id, location, plz, route_text")
    .is("lat", null)
    .neq("location", "")
    .limit(200) as { data: { id: string; location: string; plz: string; route_text: string | null }[] | null };

  let geocoded = 0;

  if (ungeocodedDemos && ungeocodedDemos.length > 0) {
    await processBatch(ungeocodedDemos, GEOCODE_BATCH_SIZE, async (demo) => {
      const geo = await geocodeWithCache(demo.location, demo.plz);
      if (!geo) return;

      geocoded++;

      // Parse and geocode route if present
      let routeJson: RouteJson | null = null;
      if (demo.route_text) {
        const waypoints = parseRoute(demo.route_text);
        if (waypoints && waypoints.length >= 2) {
          const geocodedWaypoints = await Promise.all(
            waypoints.map(async (wp) => {
              const wpGeo = await geocodeWithCache(wp.street, demo.plz);
              return { ...wp, lat: wpGeo?.lat, lng: wpGeo?.lng };
            })
          );

          const validCoords = geocodedWaypoints.filter(
            (wp) => wp.lat != null && wp.lng != null
          );
          let encodedPolyline: string | null = null;
          if (validCoords.length >= 2) {
            encodedPolyline = await getDirectionsPolyline(
              validCoords.map((wp) => ({ lat: wp.lat!, lng: wp.lng! }))
            );
          }

          routeJson = {
            waypoints: geocodedWaypoints,
            encoded_polyline: encodedPolyline,
          };
        }
      }

      const { error } = await supabase
        .from("demos")
        .update({
          lat: geo.lat,
          lng: geo.lng,
          route_json: routeJson,
        } as never)
        .eq("id", demo.id);

      if (error) {
        errors.push(`Geocode update error: ${error.message}`);
      }
    });
  }

  // 7. Translate demo topics for all non-de locales
  let translated = 0;

  // Get recent demos and check which ones already have translations
  const [{ data: allDemosForTranslation }, translatedIds] = await Promise.all([
    supabase
      .from("demos")
      .select("id, topic")
      .order("created_at", { ascending: false })
      .limit(TRANSLATE_BATCH_SIZE * 2) as unknown as Promise<{ data: { id: string; topic: string }[] | null }>,
    fetchAllTranslatedDemoIds(supabase),
  ]);

  const untranslatedDemos = (allDemosForTranslation ?? [])
    .filter((d) => !translatedIds.has(d.id))
    .slice(0, TRANSLATE_BATCH_SIZE);

  if (untranslatedDemos.length > 0) {
    try {
      const translations = await translateDemoTopics(
        untranslatedDemos,
        SUPPORTED_LOCALES
      );

      if (translations.length > 0) {
        const { error: insertError } = await supabase
          .from("demo_translations")
          .upsert(translations as never[], { onConflict: "demo_id,locale" });

        if (insertError) {
          errors.push(`Translation insert error: ${insertError.message}`);
        } else {
          translated = untranslatedDemos.length;
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown translation error";
      errors.push(`Translation error: ${message}`);
    }
  }

  // 8. Store content hash for next run
  await supabase
    .from("scrape_metadata")
    .upsert({ key: "last_html_hash", value: currentHash, updated_at: new Date().toISOString() } as never, { onConflict: "key" });

  return { total: validDemos.length, geocoded, translated, errors, skipped: false };
}
