import { Demo, TopicCategory } from "@/lib/types";
import { classifyTopic } from "./topicClassifier";

export interface RepeatLocation {
  location: string;
  total: number;
  categories: Record<TopicCategory, number>;
}

export function computeRepeatLocations(
  demos: Demo[],
  topN: number = 15
): RepeatLocation[] {
  const locationMap = new Map<
    string,
    { total: number; categories: Map<TopicCategory, number> }
  >();

  for (const demo of demos) {
    const loc = demo.location.trim();
    if (!loc) continue;

    if (!locationMap.has(loc)) {
      locationMap.set(loc, { total: 0, categories: new Map() });
    }
    const entry = locationMap.get(loc)!;
    entry.total++;
    const cat = classifyTopic(demo.topic);
    entry.categories.set(cat, (entry.categories.get(cat) || 0) + 1);
  }

  return [...locationMap.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, topN)
    .map(([location, data]) => ({
      location,
      total: data.total,
      categories: Object.fromEntries(data.categories) as Record<
        TopicCategory,
        number
      >,
    }));
}
