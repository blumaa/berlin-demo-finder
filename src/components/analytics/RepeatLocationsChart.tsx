"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RepeatLocation } from "@/lib/analytics/repeatLocations";
import { Card } from "@/components/ui/Card";
import { CATEGORY_CONFIG, ALL_CATEGORIES } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";

interface RepeatLocationsChartProps {
  data: RepeatLocation[];
}

export function RepeatLocationsChart({ data }: RepeatLocationsChartProps) {
  const { t } = useTranslation();

  const chartData = data.map((loc) => ({
    location:
      loc.location.length > 25
        ? loc.location.substring(0, 25) + "..."
        : loc.location,
    ...loc.categories,
  }));

  return (
    <Card title={t("analytics.repeatLocations")}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="location"
            width={130}
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          {ALL_CATEGORIES.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={CATEGORY_CONFIG[cat].color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
