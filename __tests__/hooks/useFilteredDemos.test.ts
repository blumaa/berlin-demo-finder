import type { Demo, TopicCategory, EventType } from "@/lib/types";
import { classifyTopic } from "@/lib/analytics/topicClassifier";

// Test the filtering logic directly (same logic as useFilteredDemos hook)
// This avoids needing jsdom for a pure data transformation

interface TranslatedDemo extends Demo {
  originalTopic: string;
}

function hasOriginalTopic(demo: Demo): demo is TranslatedDemo {
  return "originalTopic" in demo;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  keyword: string;
  plz: string;
  categories: TopicCategory[];
  eventTypes: EventType[];
}

function filterDemos(demos: Demo[], filters: Filters): Demo[] {
  return demos.filter((demo) => {
    if (filters.dateFrom && demo.date < filters.dateFrom) return false;
    if (filters.dateTo && demo.date > filters.dateTo) return false;
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const topicMatch = demo.topic.toLowerCase().includes(kw);
      const locationMatch = demo.location.toLowerCase().includes(kw);
      const originalTopicMatch =
        hasOriginalTopic(demo) &&
        demo.originalTopic.toLowerCase().includes(kw);
      if (!topicMatch && !locationMatch && !originalTopicMatch) return false;
    }
    if (filters.plz && !demo.plz.startsWith(filters.plz)) return false;
    if (filters.categories.length > 0) {
      const topicForClassification = hasOriginalTopic(demo)
        ? demo.originalTopic
        : demo.topic;
      if (!filters.categories.includes(classifyTopic(topicForClassification)))
        return false;
    }
    if (filters.eventTypes.length > 0) {
      const type: EventType = demo.route_text ? "march" : "rally";
      if (!filters.eventTypes.includes(type)) return false;
    }
    return true;
  });
}

const baseDemoFields = {
  time_to: null,
  lat: 52.52,
  lng: 13.405,
  route_text: null,
  route_json: null,
  scraped_at: "2026-03-16T12:00:00Z",
  created_at: "2026-03-16T12:00:00Z",
  updated_at: "2026-03-16T12:00:00Z",
};

function makeDemo(overrides: Partial<Demo> & { id: string; topic: string }): Demo {
  return {
    date: "2026-03-20",
    time_from: "14:00",
    plz: "10115",
    location: "Alexanderplatz",
    ...baseDemoFields,
    ...overrides,
  };
}

function makeTranslatedDemo(
  overrides: { id: string; topic: string; originalTopic: string } & Partial<Demo>
): TranslatedDemo {
  return {
    ...makeDemo(overrides),
    originalTopic: overrides.originalTopic,
  };
}

const defaultFilters: Filters = {
  dateFrom: "",
  dateTo: "",
  keyword: "",
  plz: "",
  categories: [],
  eventTypes: [],
};

describe("filterDemos with translations", () => {
  it("keyword search matches translated topic", () => {
    const demos = [
      makeTranslatedDemo({ id: "1", topic: "Housing protest", originalTopic: "Wohnungsprotest" }),
      makeTranslatedDemo({ id: "2", topic: "Climate march", originalTopic: "Klimamarsch" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, keyword: "housing" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("keyword search matches original German topic", () => {
    const demos = [
      makeTranslatedDemo({ id: "1", topic: "Housing protest", originalTopic: "Wohnungsprotest" }),
      makeTranslatedDemo({ id: "2", topic: "Climate march", originalTopic: "Klimamarsch" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, keyword: "Wohnung" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("category filter uses original German topic for classification", () => {
    const demos = [
      makeTranslatedDemo({ id: "1", topic: "Housing protest", originalTopic: "Mietenwahnsinn stoppen" }),
      makeTranslatedDemo({ id: "2", topic: "Climate march", originalTopic: "Klimastreik" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, categories: ["Housing"] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("category filter does not match translated text against German patterns", () => {
    const demos = [
      makeTranslatedDemo({ id: "1", topic: "Rent madness stop", originalTopic: "Mietenwahnsinn stoppen" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, categories: ["Housing"] });
    expect(result).toHaveLength(1);
  });

  it("works with plain Demo objects (no originalTopic)", () => {
    const demos = [
      makeDemo({ id: "1", topic: "Mietenwahnsinn stoppen" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, categories: ["Housing"] });
    expect(result).toHaveLength(1);
  });

  it("keyword search matches location", () => {
    const demos = [
      makeTranslatedDemo({ id: "1", topic: "Some protest", originalTopic: "Ein Protest", location: "Alexanderplatz" }),
    ];

    const result = filterDemos(demos, { ...defaultFilters, keyword: "Alexander" });
    expect(result).toHaveLength(1);
  });
});

describe("classifyTopic uses German keywords", () => {
  it("classifies German housing topic", () => {
    expect(classifyTopic("Mietenwahnsinn stoppen")).toBe("Housing");
  });

  it("does not classify translated housing topic", () => {
    expect(classifyTopic("Housing protest")).toBe("Other");
  });

  it("classifies German climate topic", () => {
    expect(classifyTopic("Klimastreik")).toBe("Climate");
  });
});
