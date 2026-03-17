"use client";

import { APIProvider, Map, InfoWindow, useMap, ControlPosition } from "@vis.gl/react-google-maps";
import { Demo, TopicCategory } from "@/lib/types";
import { getDemoCategory } from "@/lib/getDemoCategory";
import { DemoMarker } from "./DemoMarker";
import { ClusterMarker } from "./ClusterMarker";
import { LocationPinMarker } from "./LocationPinMarker";
import { DemoRoute } from "./DemoRoute";
import { DemoPopover } from "./DemoPopover";
import { LocationListPanel } from "./LocationListPanel";
import { useState, useCallback, useEffect, useRef, memo, useMemo } from "react";
import { useClusteredMarkers, type MarkerItem, type ClusterItem } from "@/hooks/useClusteredMarkers";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { BERLIN_CENTER, DEFAULT_ZOOM } from "@/lib/mapConfig";

interface CameraState {
  zoom: number;
  bounds: google.maps.LatLngBoundsLiteral | undefined;
}

interface DemoMapProps {
  demos: Demo[];
  selectedDemo: Demo | null;
  onSelectedDemoChange: (demo: Demo | null) => void;
  onMapReady: () => void;
}

const RouteList = memo(
  function RouteList({ demos, selectedId }: { demos: Demo[]; selectedId: string | null }) {
    return (
      <>
        {demos
          .filter((d) => d.route_json?.encoded_polyline)
          .map((demo) => (
            <DemoRoute
              key={`route-${demo.id}`}
              routeJson={demo.route_json!}
              isActive={demo.id === selectedId}
              hasSelection={selectedId !== null}
            />
          ))}
      </>
    );
  },
  (prev, next) => prev.demos === next.demos && prev.selectedId === next.selectedId
);

const MapContent = memo(
  function MapContent({
    demos,
    items,
    selectedId,
    onMarkerClick,
    onClusterClick,
    onLocationClick,
  }: {
    demos: Demo[];
    items: MarkerItem[];
    selectedId: string | null;
    onMarkerClick: (demo: Demo) => void;
    onClusterClick: (lat: number, lng: number, zoom: number) => void;
    onLocationClick: (cluster: ClusterItem) => void;
  }) {
    return (
      <>
        {items.map((item) => {
          if (item.type === "cluster") {
            if (item.coLocated) {
              return (
                <LocationPinMarker
                  key={`loc-${item.id}`}
                  cluster={item}
                  onLocationClick={onLocationClick}
                />
              );
            }
            return (
              <ClusterMarker
                key={`cluster-${item.id}`}
                cluster={item}
                onClusterClick={onClusterClick}
              />
            );
          }
          return (
            <DemoMarker
              key={item.demo.id}
              demo={item.demo}
              isSelected={item.demo.id === selectedId}
              isDimmed={selectedId !== null && item.demo.id !== selectedId}
              category={item.category}
              onClick={onMarkerClick}
            />
          );
        })}
        <RouteList demos={demos} selectedId={selectedId} />
      </>
    );
  },
);

export function DemoMap({
  demos,
  selectedDemo,
  onSelectedDemoChange,
  onMapReady,
}: DemoMapProps) {
  const selectedId = selectedDemo?.id ?? null;
  const isDesktop = useIsDesktop();

  const [camera, setCamera] = useState<CameraState>({
    zoom: DEFAULT_ZOOM,
    bounds: undefined,
  });
  const [locationCluster, setLocationCluster] = useState<ClusterItem | null>(null);

  // Throttle camera updates using requestAnimationFrame
  const pendingCameraRef = useRef<CameraState | null>(null);
  const rafRef = useRef<number>(0);

  const handleCameraChanged = useCallback(
    (ev: { detail: { zoom: number; bounds: google.maps.LatLngBoundsLiteral } }) => {
      pendingCameraRef.current = {
        zoom: ev.detail.zoom,
        bounds: ev.detail.bounds,
      };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          if (pendingCameraRef.current) {
            setCamera(pendingCameraRef.current);
            pendingCameraRef.current = null;
          }
        });
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const items = useClusteredMarkers(demos, camera.zoom, camera.bounds);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoId = params.get("demo");
    if (demoId && demos.length > 0) {
      const found = demos.find((d) => d.id === demoId);
      if (found) {
        onSelectedDemoChange(found);
        params.delete("demo");
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [demos, onSelectedDemoChange]);

  const handleMarkerClick = useCallback((demo: Demo) => {
    setLocationCluster(null);
    onSelectedDemoChange(demo);
  }, [onSelectedDemoChange]);

  const handleClose = useCallback(() => {
    onSelectedDemoChange(null);
    setLocationCluster(null);
  }, [onSelectedDemoChange]);

  const handleLocationClick = useCallback((cluster: ClusterItem) => {
    onSelectedDemoChange(null);
    setLocationCluster(cluster);
  }, [onSelectedDemoChange]);

  const handleLocationClose = useCallback(() => {
    setLocationCluster(null);
  }, []);

  const handleLocationSelectDemo = useCallback((demo: Demo) => {
    setLocationCluster(null);
    onSelectedDemoChange(demo);
  }, [onSelectedDemoChange]);

  const mapTypeControlOptions = useMemo(() => ({
    position: ControlPosition.TOP_RIGHT,
  }), []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        defaultCenter={BERLIN_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        mapId="berlin-demo-map"
        className="w-full h-full"
        onTilesLoaded={onMapReady}
        onCameraChanged={handleCameraChanged}
        onClick={handleClose}
        gestureHandling="greedy"
        zoomControl={true}
        mapTypeControlOptions={mapTypeControlOptions}
      >
        <MapInner
          demos={demos}
          items={items}
          selectedId={selectedId}
          selectedDemo={selectedDemo}
          isDesktop={isDesktop}
          locationCluster={locationCluster}
          onMarkerClick={handleMarkerClick}
          onLocationClick={handleLocationClick}
          onLocationClose={handleLocationClose}
          onLocationSelectDemo={handleLocationSelectDemo}
          onClose={handleClose}
        />
      </Map>

      {/* Mobile: selected demo popover */}
      {!isDesktop && selectedDemo && selectedDemo.lat && selectedDemo.lng && (
        <div className="fixed bottom-14 inset-inline-3 z-20">
          <MobilePopover demo={selectedDemo} onClose={handleClose} />
        </div>
      )}

      {/* Mobile: location list panel */}
      {!isDesktop && locationCluster && (
        <div className="fixed bottom-14 inset-inline-3 z-20">
          <LocationListPanel
            cluster={locationCluster}
            onClose={handleLocationClose}
            onSelectDemo={handleLocationSelectDemo}
          />
        </div>
      )}
    </APIProvider>
  );
}

function MapInner({
  demos,
  items,
  selectedId,
  selectedDemo,
  isDesktop,
  locationCluster,
  onMarkerClick,
  onLocationClick,
  onLocationClose,
  onLocationSelectDemo,
  onClose,
}: {
  demos: Demo[];
  items: MarkerItem[];
  selectedId: string | null;
  selectedDemo: Demo | null;
  isDesktop: boolean;
  locationCluster: ClusterItem | null;
  onMarkerClick: (demo: Demo) => void;
  onLocationClick: (cluster: ClusterItem) => void;
  onLocationClose: () => void;
  onLocationSelectDemo: (demo: Demo) => void;
  onClose: () => void;
}) {
  const map = useMap();

  const handleClusterClick = useCallback(
    (lat: number, lng: number, expansionZoom: number) => {
      map?.panTo({ lat, lng });
      map?.setZoom(expansionZoom);
    },
    [map]
  );

  const handleShowRoute = useCallback(() => {
    if (!map || !selectedDemo) return;
    if (selectedDemo.route_json?.encoded_polyline) {
      try {
        const path = google.maps.geometry.encoding.decodePath(
          selectedDemo.route_json.encoded_polyline
        );
        if (path.length > 0) {
          const b = new google.maps.LatLngBounds();
          path.forEach((p) => b.extend(p));
          map.fitBounds(b, 60);
          return;
        }
      } catch {
        // fall through
      }
    }
    if (selectedDemo.lat && selectedDemo.lng) {
      map.panTo({ lat: selectedDemo.lat, lng: selectedDemo.lng });
      map.setZoom(15);
    }
  }, [map, selectedDemo]);

  const selectedCategory = useMemo((): TopicCategory => {
    if (!selectedDemo) return "Other";
    const found = items.find(
      (i) => i.type === "event" && i.demo.id === selectedDemo.id
    );
    return found && found.type === "event" ? found.category : "Other";
  }, [selectedDemo?.id, items]);

  return (
    <>
      <MapContent
        demos={demos}
        items={items}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
        onClusterClick={handleClusterClick}
        onLocationClick={onLocationClick}
      />

      {/* Desktop: selected demo InfoWindow */}
      {isDesktop && selectedDemo && selectedDemo.lat && selectedDemo.lng && (
        <InfoWindow
          position={{ lat: selectedDemo.lat, lng: selectedDemo.lng }}
          onCloseClick={onClose}
          headerDisabled
          pixelOffset={[0, -16]}
        >
          <DemoPopover
            demo={selectedDemo}
            category={selectedCategory}
            onClose={onClose}
            onShowRoute={
              selectedDemo.route_json?.encoded_polyline ? handleShowRoute : undefined
            }
          />
        </InfoWindow>
      )}

      {/* Desktop: location list InfoWindow */}
      {isDesktop && locationCluster && (
        <InfoWindow
          position={{ lat: locationCluster.lat, lng: locationCluster.lng }}
          onCloseClick={onLocationClose}
          headerDisabled
          pixelOffset={[0, -16]}
        >
          <LocationListPanel
            cluster={locationCluster}
            onClose={onLocationClose}
            onSelectDemo={onLocationSelectDemo}
          />
        </InfoWindow>
      )}
    </>
  );
}

function MobilePopover({
  demo,
  onClose,
}: {
  demo: Demo;
  onClose: () => void;
}) {
  const map = useMap();
  const category: TopicCategory = getDemoCategory(demo);

  const handleShowRoute = useCallback(() => {
    if (!map) return;
    if (demo.route_json?.encoded_polyline) {
      try {
        const path = google.maps.geometry.encoding.decodePath(
          demo.route_json.encoded_polyline
        );
        if (path.length > 0) {
          const b = new google.maps.LatLngBounds();
          path.forEach((p) => b.extend(p));
          map.fitBounds(b, 60);
          return;
        }
      } catch {
        // fall through
      }
    }
    if (demo.lat && demo.lng) {
      map.panTo({ lat: demo.lat, lng: demo.lng });
      map.setZoom(15);
    }
  }, [map, demo]);

  return (
    <DemoPopover
      demo={demo}
      category={category}
      onClose={onClose}
      onShowRoute={demo.route_json?.encoded_polyline ? handleShowRoute : undefined}
    />
  );
}
