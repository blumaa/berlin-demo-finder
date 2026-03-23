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

  const allResults = await Promise.all(
    targetLocales.map(async (locale) => {
      const translated = await translateTexts(topics, locale, "de");
      return demos.map((demo, i) => ({
        demo_id: demo.id,
        locale,
        topic: translated[i],
      }));
    })
  );

  return allResults.flat();
}
