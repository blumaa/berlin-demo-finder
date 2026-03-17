import { Demo, TopicCategory } from "@/lib/types";
import { classifyTopic } from "./topicClassifier";

export interface TopicTrendPoint {
  month: string; // YYYY-MM
  [key: string]: string | number;
}

export function computeTopicTrends(demos: Demo[]): TopicTrendPoint[] {
  const monthMap = new Map<string, Map<TopicCategory, number>>();

  for (const demo of demos) {
    const month = demo.date.substring(0, 7); // YYYY-MM
    const category = classifyTopic(demo.topic);

    if (!monthMap.has(month)) {
      monthMap.set(month, new Map());
    }
    const catMap = monthMap.get(month)!;
    catMap.set(category, (catMap.get(category) || 0) + 1);
  }

  return [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, cats]) => {
      const point: TopicTrendPoint = { month };
      for (const [cat, count] of cats) {
        point[cat] = count;
      }
      return point;
    });
}
