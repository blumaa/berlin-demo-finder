"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PlzCount } from "@/lib/analytics/demosByPlz";
import { Card } from "@/components/ui/Card";
import { CATEGORY_CONFIG } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";

interface DemosByPlzChartProps {
  data: PlzCount[];
}

export function DemosByPlzChart({ data }: DemosByPlzChartProps) {
  const { t } = useTranslation();

  return (
    <Card title={t("analytics.demosByPlz")}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="plz"
            width={50}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Bar dataKey="count" fill={CATEGORY_CONFIG["International Solidarity"].color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
