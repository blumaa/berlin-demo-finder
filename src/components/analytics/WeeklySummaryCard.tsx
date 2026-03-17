"use client";

import { WeeklySummary } from "@/lib/analytics/weeklySummary";
import { Card } from "@/components/ui/Card";
import { CATEGORY_CONFIG, TopicCategory, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const { locale, t } = useTranslation();
  const isUp = summary.percentChange > 0;
  const isDown = summary.percentChange < 0;

  return (
    <Card title={t("analytics.weeklyPulse")}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-bold text-gray-900">
          {summary.thisWeekCount}
        </span>
        <span className="text-sm text-gray-700">
          {t("analytics.thisWeek")}
        </span>
        <span
          className={`text-sm font-medium ${
            isUp
              ? "text-blue-600"
              : isDown
                ? "text-blue-600"
                : "text-gray-600"
          }`}
        >
          {isUp ? "\u2191 +" : isDown ? "\u2193 " : ""}
          {summary.percentChange}%
        </span>
      </div>

      {summary.topTopics.length > 0 && (
        <div className="space-y-1 mb-2">
          <p className="text-xs text-gray-700 uppercase tracking-wide">
            {t("analytics.topTopics")}
          </p>
          {summary.topTopics.map((topic) => (
            <div key={topic.topic} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {CATEGORY_CONFIG[topic.topic as TopicCategory]
                  ? t(CATEGORY_TRANSLATION_KEYS[topic.topic as TopicCategory])
                  : topic.topic}
              </span>
              <span className="text-gray-600">{topic.count}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 text-xs text-gray-700">
        {summary.busiestPlz && (
          <span>
            PLZ: {summary.busiestPlz}
          </span>
        )}
        {summary.busiestDay && (
          <span>
            {t("analytics.day")}:{" "}
            {new Date(summary.busiestDay + "T00:00:00").toLocaleDateString(
              locale,
              { weekday: "short", day: "numeric", month: "short" }
            )}
          </span>
        )}
      </div>
    </Card>
  );
}
