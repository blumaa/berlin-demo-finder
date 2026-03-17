"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { RouteJson } from "@/lib/types";

interface DemoRouteProps {
  routeJson: RouteJson;
  isActive: boolean;
  hasSelection: boolean;
}

export function DemoRoute({ routeJson, isActive, hasSelection }: DemoRouteProps) {
  const map = useMap();
  const geometryLib = useMapsLibrary("geometry");
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Create polyline once when map/geometry/encoded_polyline are available
  useEffect(() => {
    if (!map || !geometryLib || !routeJson.encoded_polyline) return;

    const path = geometryLib.encoding.decodePath(routeJson.encoded_polyline);
    const polyline = new google.maps.Polyline({
      path,
      map,
      strokeColor: "#6b7280",
      strokeOpacity: 0.6,
      strokeWeight: 3,
      zIndex: 1,
    });

    polylineRef.current = polyline;

    return () => {
      polyline.setMap(null);
      polylineRef.current = null;
    };
  }, [map, geometryLib, routeJson.encoded_polyline]);

  // Update style when selection state changes — no destroy/recreate
  useEffect(() => {
    if (!polylineRef.current) return;
    polylineRef.current.setOptions({
      strokeColor: isActive ? "#2563eb" : "#6b7280",
      strokeOpacity: hasSelection ? (isActive ? 0.9 : 0.15) : 0.6,
      strokeWeight: isActive ? 5 : 3,
      zIndex: isActive ? 10 : 1,
    });
  }, [isActive, hasSelection]);

  return null;
}
