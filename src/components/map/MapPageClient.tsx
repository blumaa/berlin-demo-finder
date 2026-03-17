"use client";

import { useState, useCallback, useMemo } from "react";
import { Demo } from "@/lib/types";
import { DemoMap } from "./DemoMap";
import { MapFilters } from "./MapFilters";
import { MapLoadingSpinner } from "@/components/ui/MapLoadingSpinner";
import { useFilteredDemos } from "@/hooks/useFilteredDemos";
import { useFilterState } from "@/contexts/FilterContext";
import { useTranslatedDemos } from "@/hooks/useTranslatedDemos";
import { useTranslation } from "@/contexts/LanguageContext";

interface MapPageClientProps {
  demos: Demo[];
}

export function MapPageClient({ demos }: MapPageClientProps) {
  const [loading, setLoading] = useState(true);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);

  const { categories, eventTypes, dateFrom, dateTo, keyword, plz } = useFilterState();
  const { locale } = useTranslation();
  const translatedDemos = useTranslatedDemos(demos, locale);

  const filteredDemos = useFilteredDemos(
    translatedDemos,
    dateFrom,
    dateTo,
    keyword,
    plz,
    categories,
    eventTypes,
  );

  // Derive selectedDemo from current translated demos so it updates on locale change
  const selectedDemo = useMemo(() => {
    if (!selectedDemoId) return null;
    return translatedDemos.find((d) => d.id === selectedDemoId) ?? null;
  }, [selectedDemoId, translatedDemos]);

  const handleSelectedDemoChange = useCallback((demo: Demo | null) => {
    setSelectedDemoId(demo?.id ?? null);
  }, []);

  const handleMapReady = useCallback(() => {
    setLoading(false);
  }, []);

  const handleFilterExpand = useCallback(() => {
    setSelectedDemoId(null);
  }, []);

  return (
    <div className="fixed inset-0 pt-11 pb-12 md:pt-12 md:pb-0">
      {loading && <MapLoadingSpinner />}
      <DemoMap
        demos={filteredDemos}
        selectedDemo={selectedDemo}
        onSelectedDemoChange={handleSelectedDemoChange}
        onMapReady={handleMapReady}
      />
      <MapFilters
        onExpand={handleFilterExpand}
        demoCount={filteredDemos.length}
      />
    </div>
  );
}
