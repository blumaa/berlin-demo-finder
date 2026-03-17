"use client";

import { memo, useCallback } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { ClusterItem } from "@/hooks/useClusteredMarkers";
import { MapPinIcon } from "@/components/ui/icons";

interface LocationPinMarkerProps {
  cluster: ClusterItem;
  onLocationClick: (cluster: ClusterItem) => void;
}

export const LocationPinMarker = memo(
  function LocationPinMarker({ cluster, onLocationClick }: LocationPinMarkerProps) {
    const handleClick = useCallback(() => {
      onLocationClick(cluster);
    }, [cluster, onLocationClick]);

    return (
      <AdvancedMarker
        position={{ lat: cluster.lat, lng: cluster.lng }}
        onClick={handleClick}
        zIndex={1000 + cluster.count}
      >
        <div
          className="relative flex items-center justify-center cursor-pointer"
          role="img"
          aria-label={`${cluster.count} demos at this location`}
        >
          {/* Pin body */}
          <div
            className="w-8 h-8 rounded-full border-[2.5px] border-white shadow-md flex items-center justify-center"
            style={{ backgroundColor: cluster.dominantColor }}
          >
            <MapPinIcon size={16} className="text-white" />
          </div>
          {/* Badge count */}
          <span className="absolute -top-1.5 -end-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gray-900 text-white text-[10px] font-bold border border-white">
            {cluster.count}
          </span>
        </div>
      </AdvancedMarker>
    );
  },
  (prev, next) =>
    prev.cluster.id === next.cluster.id &&
    prev.cluster.count === next.cluster.count &&
    prev.cluster.dominantColor === next.cluster.dominantColor
);
