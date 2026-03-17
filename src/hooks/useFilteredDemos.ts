"use client";

import { useMemo } from "react";
import { Demo, TopicCategory, EventType } from "@/lib/types";
import { getDemoCategory } from "@/lib/getDemoCategory";
import type { TranslatedDemo } from "@/hooks/useTranslatedDemos";

function hasOriginalTopic(demo: Demo): demo is TranslatedDemo {
  return "originalTopic" in demo;
}

export function useFilteredDemos(
  demos: Demo[],
  dateFrom: string,
  dateTo: string,
  keyword: string,
  plz: string,
  categories: TopicCategory[],
  eventTypes: EventType[],
): Demo[] {
  return useMemo(() => {
    return demos.filter((demo) => {
      if (dateFrom && demo.date < dateFrom) return false;
      if (dateTo && demo.date > dateTo) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        const topicMatch = demo.topic.toLowerCase().includes(kw);
        const locationMatch = demo.location.toLowerCase().includes(kw);
        const originalTopicMatch =
          hasOriginalTopic(demo) &&
          demo.originalTopic.toLowerCase().includes(kw);
        if (!topicMatch && !locationMatch && !originalTopicMatch) return false;
      }
      if (plz && !demo.plz.startsWith(plz)) return false;
      if (categories.length > 0) {
        if (!categories.includes(getDemoCategory(demo))) return false;
      }
      if (eventTypes.length > 0) {
        const type: EventType = demo.route_text ? "march" : "rally";
        if (!eventTypes.includes(type)) return false;
      }
      return true;
    });
  }, [demos, dateFrom, dateTo, keyword, plz, categories, eventTypes]);
}
