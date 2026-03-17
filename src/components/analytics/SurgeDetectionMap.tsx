"use client";

import { SurgeData } from "@/lib/analytics/surgeDetection";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/contexts/LanguageContext";

interface SurgeDetectionMapProps {
  data: SurgeData[];
}

function getZScoreColor(z: number): string {
  if (z >= 2) return "bg-red-500 text-white";
  if (z >= 1) return "bg-orange-400 text-white";
  if (z >= 0) return "bg-yellow-100 text-gray-800";
  if (z >= -1) return "bg-blue-100 text-gray-800";
  return "bg-blue-400 text-white";
}

export function SurgeDetectionMap({ data }: SurgeDetectionMapProps) {
  const { t } = useTranslation();
  const top = data.slice(0, 20);

  const getSurgeLabel = (z: number): string => {
    if (z >= 2) return t("analytics.surgeLabel.surging");
    if (z >= 1) return t("analytics.surgeLabel.moreActive");
    if (z >= -1) return t("analytics.surgeLabel.normal");
    return t("analytics.surgeLabel.quieter");
  };

  return (
    <Card title={t("analytics.surgeTitle")}>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {top.map((d) => (
          <div
            key={d.plz}
            className={`rounded-lg p-2 text-center ${getZScoreColor(d.zScore)}`}
          >
            <div className="text-xs font-bold">{d.plz}</div>
            <div className="text-lg font-semibold">{d.recentCount}</div>
            <div className="text-[10px] opacity-80">
              {getSurgeLabel(d.zScore)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-gray-600">
        <span className="inline-block w-3 h-3 rounded bg-blue-400" />
        {t("analytics.surgeLabel.quieter")}
        <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-gray-200" />
        {t("analytics.surgeLabel.normal")}
        <span className="inline-block w-3 h-3 rounded bg-red-500" />
        {t("analytics.surgeLabel.busier")}
      </div>
    </Card>
  );
}
