"use client";

import { useMemo } from "react";
import { useDemos } from "@/hooks/useDemos";
import { MapPageClient } from "@/components/map/MapPageClient";
import { MapLoadingSpinner } from "@/components/ui/MapLoadingSpinner";

export default function HomePage() {
  const { demos, cutoffDate, isLoading } = useDemos();

  const mapDemos = useMemo(() => {
    return demos.filter((d) => d.date >= cutoffDate);
  }, [demos, cutoffDate]);

  if (isLoading) return <MapLoadingSpinner />;

  return <MapPageClient demos={mapDemos} />;
}
