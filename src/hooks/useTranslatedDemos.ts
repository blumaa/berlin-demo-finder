"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Demo } from "@/lib/types";
import type { Locale } from "@/i18n/types";

export interface TranslatedDemo extends Demo {
  originalTopic: string;
}

async function fetchTranslations(
  locale: string
): Promise<Record<string, string>> {
  const res = await fetch(`/api/translations?locale=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch translations");
  return res.json();
}

export function useTranslatedDemos(
  demos: Demo[],
  locale: Locale
): TranslatedDemo[] {
  const { data: translations } = useQuery({
    queryKey: ["translations", locale],
    queryFn: () => fetchTranslations(locale),
    enabled: locale !== "de",
    refetchOnWindowFocus: false,
  });

  return useMemo(() => {
    if (locale === "de" || !translations) {
      if (demos.length > 0 && "originalTopic" in demos[0]) {
        return demos as TranslatedDemo[];
      }
      return demos.map((d) => ({ ...d, originalTopic: d.topic }));
    }

    return demos.map((d) => {
      const translated = translations[d.id];
      if (!translated || translated === d.topic) {
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
