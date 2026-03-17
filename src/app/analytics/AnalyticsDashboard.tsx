"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Demo } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";
import { computeWeeklySummary } from "@/lib/analytics/weeklySummary";
import { computePeakHours } from "@/lib/analytics/peakHours";
import { computeTopicTrends } from "@/lib/analytics/topicTrends";
import { computeSurgeDetection } from "@/lib/analytics/surgeDetection";
import { computeDemosByPlz } from "@/lib/analytics/demosByPlz";
import { computeRepeatLocations } from "@/lib/analytics/repeatLocations";
import { WeeklySummaryCard } from "@/components/analytics/WeeklySummaryCard";
import { PeakHoursGrid } from "@/components/analytics/PeakHoursGrid";
import { TopicTrendsChart } from "@/components/analytics/TopicTrendsChart";
import { SurgeDetectionMap } from "@/components/analytics/SurgeDetectionMap";
import { DemosByPlzChart } from "@/components/analytics/DemosByPlzChart";
import { RepeatLocationsChart } from "@/components/analytics/RepeatLocationsChart";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";

interface AnalyticsDashboardProps {
  demos: Demo[];
}

export function AnalyticsDashboard({ demos }: AnalyticsDashboardProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const dateFrom = searchParams.get("from") || "";
  const dateTo = searchParams.get("to") || "";

  const filteredDemos = useMemo(() => {
    return demos.filter((d) => {
      if (dateFrom && d.date < dateFrom) return false;
      if (dateTo && d.date > dateTo) return false;
      return true;
    });
  }, [demos, dateFrom, dateTo]);

  const weeklySummary = useMemo(
    () => computeWeeklySummary(filteredDemos),
    [filteredDemos]
  );
  const peakHours = useMemo(
    () => computePeakHours(filteredDemos),
    [filteredDemos]
  );
  const topicTrends = useMemo(
    () => computeTopicTrends(filteredDemos),
    [filteredDemos]
  );
  const surgeData = useMemo(
    () => computeSurgeDetection(filteredDemos),
    [filteredDemos]
  );
  const demosByPlz = useMemo(
    () => computeDemosByPlz(filteredDemos),
    [filteredDemos]
  );
  const repeatLocations = useMemo(
    () => computeRepeatLocations(filteredDemos),
    [filteredDemos]
  );

  return (
    <div className="pt-14 pb-20 px-3 md:pt-16 md:pb-8 md:px-4 md:max-w-7xl md:mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-2 md:text-xl md:mb-3">
          {t("analytics.title")}
        </h1>
        <DateRangeFilter />
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton heightClass="h-[200px]" type="card" />}>
          <WeeklySummaryCard summary={weeklySummary} />
        </Suspense>

        <Suspense fallback={<ChartSkeleton heightClass="h-[200px]" type="heatmap" />}>
          <PeakHoursGrid data={peakHours} />
        </Suspense>

        <div className="md:col-span-2">
          <Suspense fallback={<ChartSkeleton heightClass="h-[300px]" type="area" />}>
            <TopicTrendsChart data={topicTrends} />
          </Suspense>
        </div>

        <Suspense fallback={<ChartSkeleton heightClass="h-[300px]" type="heatmap" />}>
          <SurgeDetectionMap data={surgeData} />
        </Suspense>

        <Suspense fallback={<ChartSkeleton heightClass="h-[350px]" type="bar" />}>
          <DemosByPlzChart data={demosByPlz} />
        </Suspense>

        <div className="md:col-span-2">
          <Suspense fallback={<ChartSkeleton heightClass="h-[350px]" type="bar" />}>
            <RepeatLocationsChart data={repeatLocations} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
