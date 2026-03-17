"use client";

import { useCallback, useRef, useEffect } from "react";
import { Demo, CATEGORY_CONFIG } from "@/lib/types";
import { getDemoCategory } from "@/lib/getDemoCategory";
import { formatDate, formatTime } from "@/lib/format";
import { useTranslation } from "@/contexts/LanguageContext";
import { CloseIcon, ClockIcon } from "@/components/ui/icons";
import type { ClusterItem } from "@/hooks/useClusteredMarkers";

interface LocationListPanelProps {
  cluster: ClusterItem;
  onClose: () => void;
  onSelectDemo: (demo: Demo) => void;
}

export function LocationListPanel({ cluster, onClose, onSelectDemo }: LocationListPanelProps) {
  const { t, locale } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [cluster.id]);

  // Sort demos by date, then time
  const sortedDemos = [...cluster.demos].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time_from.localeCompare(b.time_from);
  });

  // Group by location name for the header
  const locationName = sortedDemos[0]?.location ?? "";

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col max-h-[70vh] md:max-h-[60vh] w-full md:w-96"
      role="dialog"
      aria-label={`${cluster.count} events at ${locationName}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: cluster.dominantColor }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {locationName}
            </p>
            <p className="text-xs text-gray-500">
              {cluster.count} {t("filters.results")}
            </p>
          </div>
        </div>
        <button
          ref={closeRef}
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0"
          aria-label={t("popover.close")}
        >
          <CloseIcon size={14} />
        </button>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
        {sortedDemos.map((demo) => (
          <DemoListItem
            key={demo.id}
            demo={demo}
            locale={locale}
            onSelect={onSelectDemo}
          />
        ))}
      </div>
    </div>
  );
}

const DemoListItem = ({
  demo,
  locale,
  onSelect,
}: {
  demo: Demo;
  locale: string;
  onSelect: (demo: Demo) => void;
}) => {
  const category = getDemoCategory(demo);
  const config = CATEGORY_CONFIG[category];

  const handleClick = useCallback(() => {
    onSelect(demo);
  }, [demo, onSelect]);

  return (
    <button
      onClick={handleClick}
      className="w-full text-start px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
    >
      {/* Category dot + topic */}
      <div className="flex items-start gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: config.color }}
        />
        <p className="text-sm font-medium text-gray-900 line-clamp-2">
          {demo.topic}
        </p>
      </div>

      {/* Date & time */}
      <div className="flex items-center gap-3 mt-1 ms-4">
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <ClockIcon size={11} className="shrink-0 text-gray-400" />
          {formatDate(demo.date, locale)} · {formatTime(demo.time_from, demo.time_to)}
        </span>
      </div>
    </button>
  );
};
