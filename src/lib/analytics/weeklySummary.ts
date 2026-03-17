import { Demo, TopicCategory } from "@/lib/types";
import { classifyTopic } from "./topicClassifier";

export interface WeeklySummary {
  thisWeekCount: number;
  lastWeekCount: number;
  percentChange: number;
  topTopics: { topic: TopicCategory; count: number }[];
  busiestPlz: string | null;
  busiestDay: string | null;
}

export function computeWeeklySummary(
  demos: Demo[],
  referenceDate: Date = new Date()
): WeeklySummary {
  const startOfThisWeek = getMonday(referenceDate);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const thisWeek = demos.filter((d) => {
    const date = new Date(d.date);
    return date >= startOfThisWeek && date < addDays(startOfThisWeek, 7);
  });

  const lastWeek = demos.filter((d) => {
    const date = new Date(d.date);
    return date >= startOfLastWeek && date < startOfThisWeek;
  });

  const thisWeekCount = thisWeek.length;
  const lastWeekCount = lastWeek.length;
  const percentChange =
    lastWeekCount === 0
      ? thisWeekCount > 0
        ? 100
        : 0
      : Math.round(
          ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
        );

  // Top topics this week
  const topicCounts = new Map<TopicCategory, number>();
  for (const demo of thisWeek) {
    const cat = classifyTopic(demo.topic);
    topicCounts.set(cat, (topicCounts.get(cat) || 0) + 1);
  }
  const topTopics = [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic, count]) => ({ topic, count }));

  // Busiest PLZ this week
  const plzCounts = new Map<string, number>();
  for (const demo of thisWeek) {
    if (demo.plz) plzCounts.set(demo.plz, (plzCounts.get(demo.plz) || 0) + 1);
  }
  const busiestPlz =
    [...plzCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Busiest day this week
  const dayCounts = new Map<string, number>();
  for (const demo of thisWeek) {
    dayCounts.set(demo.date, (dayCounts.get(demo.date) || 0) + 1);
  }
  const busiestDay =
    [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    thisWeekCount,
    lastWeekCount,
    percentChange,
    topTopics,
    busiestPlz,
    busiestDay,
  };
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
