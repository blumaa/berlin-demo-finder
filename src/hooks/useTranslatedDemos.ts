"use client";

import { useMemo } from "react";
import useSWR from "swr";
import type { Demo } from "@/lib/types";
import type { Locale } from "@/i18n/types";

export interface TranslatedDemo extends Demo {
  originalTopic: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTranslatedDemos(
  demos: Demo[],
  locale: Locale
): TranslatedDemo[] {
  const { data: translations } = useSWR<Record<string, string>>(
    locale !== "de" ? `/api/translations?locale=${locale}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return useMemo(() => {
    // When German or no translations loaded yet, add originalTopic only if needed
    if (locale === "de" || !translations) {
      // Only create new objects if demos don't already have originalTopic
      if (demos.length > 0 && "originalTopic" in demos[0]) {
        return demos as TranslatedDemo[];
      }
      return demos.map((d) => ({ ...d, originalTopic: d.topic }));
    }

    return demos.map((d) => {
      const translated = translations[d.id];
      if (!translated || translated === d.topic) {
        // No translation or same text — reuse with originalTopic
        return { ...d, originalTopic: d.topic };
      }
      return {
        ...d,
        originalTopic: d.topic,
        topic: translated,
      };
    });
  }, [demos, locale, translations]);
}
