"use client";

import { useMemo } from "react";
import Supercluster, { type PointFeature } from "supercluster";
import { Demo, TopicCategory, CATEGORY_CONFIG } from "@/lib/types";
import { getDemoCategory } from "@/lib/getDemoCategory";
import { CLUSTER_MAX_ZOOM, CLUSTER_RADIUS, MAX_ZOOM } from "@/lib/mapConfig";

export interface ClusterItem {
  type: "cluster";
  id: number;
  lat: number;
  lng: number;
  count: number;
  dominantCategory: TopicCategory;
  dominantColor: string;
  expansionZoom: number;
  /** True when all points share the same coordinates — zoom won't separate them */
  coLocated: boolean;
  /** Demos in this cluster, populated only for co-located clusters */
  demos: Demo[];
}

export interface EventItem {
  type: "event";
  demo: Demo;
  category: TopicCategory;
}

export type MarkerItem = ClusterItem | EventItem;

interface DemoPoint {
  id: string;
  category: TopicCategory;
}

interface ClusterProps {
  dominantCategory: TopicCategory;
}

function findDominant(catCounts: Record<string, number>): TopicCategory {
  let maxCat: TopicCategory = "Other";
  let maxCount = 0;
  for (const cat in catCounts) {
    if (catCounts[cat] > maxCount) {
      maxCount = catCounts[cat];
      maxCat = cat as TopicCategory;
    }
  }
  return maxCat;
}

export function useClusteredMarkers(
  demos: Demo[],
  zoom: number | undefined,
  bounds: google.maps.LatLngBoundsLiteral | undefined,
): MarkerItem[] {
  // Build GeoJSON points — only recompute when demos change
  const { points, demoMap } = useMemo(() => {
    const pts: PointFeature<DemoPoint>[] = [];
    const map = new Map<string, { demo: Demo; category: TopicCategory }>();

    for (const demo of demos) {
      if (demo.lat == null || demo.lng == null) continue;
      const category = getDemoCategory(demo);
      map.set(demo.id, { demo, category });
      pts.push({
        type: "Feature",
        properties: { id: demo.id, category },
        geometry: {
          type: "Point",
          coordinates: [demo.lng, demo.lat],
        },
      });
    }

    return { points: pts, demoMap: map };
  }, [demos]);

  // Build supercluster index with map/reduce for pre-aggregated dominant category
  const index = useMemo(() => {
    const sc = new Supercluster<DemoPoint, ClusterProps>({
      radius: CLUSTER_RADIUS,
      maxZoom: CLUSTER_MAX_ZOOM,
      minZoom: 0,
      map: (props) => ({
        dominantCategory: props.category,
        _catCounts: { [props.category]: 1 } as Record<string, number>,
      }) as unknown as ClusterProps,
      reduce: (accumulated, props) => {
        const acc = accumulated as unknown as { _catCounts: Record<string, number>; dominantCategory: TopicCategory };
        const p = props as unknown as { _catCounts: Record<string, number> };
        for (const cat in p._catCounts) {
          acc._catCounts[cat] = (acc._catCounts[cat] || 0) + p._catCounts[cat];
        }
        acc.dominantCategory = findDominant(acc._catCounts);
      },
    });
    sc.load(points);
    return sc;
  }, [points]);

  // Query for current viewport
  return useMemo(() => {
    if (zoom === undefined || !bounds) return [];

    const bbox: [number, number, number, number] = [
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    ];

    const features = index.getClusters(bbox, Math.round(zoom));

    return features.map((feature): MarkerItem => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      // Cluster
      if ("cluster" in props && props.cluster) {
        const clusterId = (props as { cluster_id: number }).cluster_id;
        const count = (props as { point_count: number }).point_count;
        const dominantCategory = (props as unknown as ClusterProps).dominantCategory ?? "Other";
        const expansionZoom = Math.min(
          index.getClusterExpansionZoom(clusterId),
          MAX_ZOOM
        );

        // Detect co-located cluster: check if expansion zoom is at max
        // (supercluster returns maxZoom+1 when points can't be separated)
        const isCoLocated = expansionZoom > CLUSTER_MAX_ZOOM;

        // For co-located clusters, collect the demos
        let clusterDemos: Demo[] = [];
        if (isCoLocated) {
          const leaves = index.getLeaves(clusterId, Infinity);
          clusterDemos = leaves
            .map((leaf) => demoMap.get((leaf.properties as DemoPoint).id)?.demo)
            .filter((d): d is Demo => d != null);
        }

        return {
          type: "cluster",
          id: clusterId,
          lat,
          lng,
          count,
          dominantCategory,
          dominantColor: CATEGORY_CONFIG[dominantCategory]?.color ?? "#6B7280",
          expansionZoom,
          coLocated: isCoLocated,
          demos: clusterDemos,
        };
      }

      // Individual event
      const demoPoint = props as DemoPoint;
      const entry = demoMap.get(demoPoint.id);
      return {
        type: "event",
        demo: entry!.demo,
        category: entry!.category,
      };
    });
  }, [index, zoom, bounds, demoMap]);
}
