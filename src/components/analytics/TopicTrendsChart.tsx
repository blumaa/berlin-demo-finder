"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TopicTrendPoint } from "@/lib/analytics/topicTrends";
import { Card } from "@/components/ui/Card";
import { CATEGORY_CONFIG, ALL_CATEGORIES, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";

interface TopicTrendsChartProps {
  data: TopicTrendPoint[];
}

export function TopicTrendsChart({ data }: TopicTrendsChartProps) {
  const { t } = useTranslation();

  return (
    <Card title={t("analytics.topicTrends")}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          {ALL_CATEGORIES.map((cat) => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              stroke={CATEGORY_CONFIG[cat].color}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2">
        {ALL_CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-1 text-xs text-gray-700">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: CATEGORY_CONFIG[cat].color }}
            />
            {t(CATEGORY_TRANSLATION_KEYS[cat])}
          </div>
        ))}
      </div>
    </Card>
  );
}
