import { translateTexts } from "./translate";
import type { Locale } from "@/i18n/types";
import type { DemoTranslation } from "@/lib/types";

export async function translateDemoTopics(
  demos: { id: string; topic: string }[],
  locales: Locale[]
): Promise<DemoTranslation[]> {
  if (demos.length === 0) return [];

  const targetLocales = locales.filter((l) => l !== "de");
  if (targetLocales.length === 0) return [];

  const topics = demos.map((d) => d.topic);
  const results: DemoTranslation[] = [];

  for (const locale of targetLocales) {
    const translated = await translateTexts(topics, locale, "de");

    for (let i = 0; i < demos.length; i++) {
      results.push({
        demo_id: demos[i].id,
        locale,
        topic: translated[i],
      });
    }
  }

  return results;
}
