"use client";

import { memo, useCallback } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { ClusterItem } from "@/hooks/useClusteredMarkers";

interface ClusterMarkerProps {
  cluster: ClusterItem;
  onClusterClick: (lat: number, lng: number, expansionZoom: number) => void;
}

function getSizeClass(count: number): string {
  if (count < 10) return "w-[34px] h-[34px] text-xs";
  if (count < 50) return "w-[42px] h-[42px] text-xs";
  if (count < 100) return "w-[50px] h-[50px] text-sm";
  return "w-[58px] h-[58px] text-base";
}

export const ClusterMarker = memo(
  function ClusterMarker({ cluster, onClusterClick }: ClusterMarkerProps) {
    const handleClick = useCallback(() => {
      onClusterClick(cluster.lat, cluster.lng, cluster.expansionZoom);
    }, [cluster.lat, cluster.lng, cluster.expansionZoom, onClusterClick]);

    return (
      <AdvancedMarker
        position={{ lat: cluster.lat, lng: cluster.lng }}
        onClick={handleClick}
        zIndex={1000 + cluster.count}
      >
        <div
          className={`rounded-full border-[2.5px] border-white flex items-center justify-center text-white font-bold font-sans cursor-pointer opacity-90 ${getSizeClass(cluster.count)}`}
          style={{ backgroundColor: cluster.dominantColor }}
          role="img"
          aria-label={`${cluster.count} ${cluster.dominantCategory} demos`}
        >
          {cluster.count}
        </div>
      </AdvancedMarker>
    );
  },
  (prev, next) =>
    prev.cluster.id === next.cluster.id &&
    prev.cluster.count === next.cluster.count &&
    prev.cluster.dominantColor === next.cluster.dominantColor
);
