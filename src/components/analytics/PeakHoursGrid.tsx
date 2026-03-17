"use client";

import { PeakHoursData } from "@/lib/analytics/peakHours";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

interface PeakHoursGridProps {
  data: PeakHoursData;
}

const DAY_KEYS: TranslationKey[] = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
];

const MOBILE_HOUR_START = 6;
const MOBILE_HOUR_END = 22;

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "bg-gray-100";
  const intensity = value / max;
  if (intensity > 0.75) return "bg-orange-500";
  if (intensity > 0.5) return "bg-orange-300";
  if (intensity > 0.25) return "bg-amber-200";
  return "bg-amber-100";
}

export function PeakHoursGrid({ data }: PeakHoursGridProps) {
  const { t } = useTranslation();
  const days = DAY_KEYS.map((k) => t(k));
  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const mobileHours = allHours.filter(
    (h) => h >= MOBILE_HOUR_START && h <= MOBILE_HOUR_END
  );

  return (
    <Card title={t("analytics.peakHours")}>
      {/* Desktop: full 24h grid */}
      <div className="hidden md:block">
        <div className="flex gap-px ms-10 mb-1">
          {allHours.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-[9px] text-gray-600"
            >
              {h % 3 === 0 ? `${h}` : ""}
            </div>
          ))}
        </div>
        {data.grid.map((row, dayIdx) => (
          <div key={dayIdx} className="flex items-center gap-px mb-px">
            <span className="w-10 text-xs text-gray-700 text-end pe-2">
              {days[dayIdx]}
            </span>
            {row.map((val, hourIdx) => (
              <div
                key={hourIdx}
                className={`flex-1 aspect-square rounded-sm ${getColor(val, data.maxCount)}`}
                title={`${days[dayIdx]} ${hourIdx}:00 — ${val} demos`}
                role="gridcell"
                aria-label={`${days[dayIdx]} ${hourIdx}:00: ${val} demos`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile: condensed hours 6-22, larger cells */}
      <div className="md:hidden">
        <div className="flex gap-0.5 ms-8 mb-1">
          {mobileHours.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-[9px] text-gray-600"
            >
              {h % 2 === 0 ? `${h}` : ""}
            </div>
          ))}
        </div>
        {data.grid.map((row, dayIdx) => (
          <div key={dayIdx} className="flex items-center gap-0.5 mb-0.5">
            <span className="w-8 text-[11px] text-gray-700 text-end pe-1.5">
              {days[dayIdx]}
            </span>
            {mobileHours.map((hourIdx) => (
              <div
                key={hourIdx}
                className={`flex-1 aspect-square rounded-sm ${getColor(row[hourIdx], data.maxCount)}`}
                role="gridcell"
                aria-label={`${days[dayIdx]} ${hourIdx}:00: ${row[hourIdx]} demos`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-gray-600">
        <span>{t("analytics.low")}</span>
        <span className="inline-block w-3 h-3 rounded-sm bg-gray-100" />
        <span className="inline-block w-3 h-3 rounded-sm bg-amber-100" />
        <span className="inline-block w-3 h-3 rounded-sm bg-amber-200" />
        <span className="inline-block w-3 h-3 rounded-sm bg-orange-300" />
        <span className="inline-block w-3 h-3 rounded-sm bg-orange-500" />
        <span>{t("analytics.high")}</span>
      </div>
    </Card>
  );
}
