"use client";

import { memo } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Demo, CATEGORY_CONFIG, TopicCategory } from "@/lib/types";

interface DemoMarkerProps {
  demo: Demo;
  isSelected: boolean;
  isDimmed: boolean;
  category: TopicCategory;
  onClick: (demo: Demo) => void;
}

export const DemoMarker = memo(
  function DemoMarker({
    demo,
    isSelected,
    isDimmed,
    category,
    onClick,
  }: DemoMarkerProps) {
    if (demo.lat == null || demo.lng == null) return null;

    const hasRoute = !!demo.route_text;
    const color = CATEGORY_CONFIG[category].color;

    return (
      <AdvancedMarker
        position={{ lat: demo.lat, lng: demo.lng }}
        onClick={() => onClick(demo)}
        title={demo.topic}
        zIndex={isSelected ? 100 : 1}
      >
        <div
          className={`flex items-center justify-center cursor-pointer transition-[opacity,transform] duration-150 ${
            isDimmed ? "opacity-35" : "opacity-100"
          } ${isSelected ? "scale-150" : "scale-100"}`}
          role="img"
          aria-label={`${category}: ${demo.topic}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            {hasRoute ? (
              /* March: diamond shape — white stroke always for map contrast */
              <>
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  fill={color}
                  stroke="white"
                  strokeWidth={isSelected ? "0" : "2.5"}
                  transform="rotate(45 12 12)"
                />
                {isSelected && (
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    transform="rotate(45 12 12)"
                  />
                )}
              </>
            ) : (
              /* Rally: circle shape — white stroke always for map contrast */
              <>
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill={color}
                  stroke="white"
                  strokeWidth={isSelected ? "0" : "2.5"}
                />
                {isSelected && (
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="white"
                    strokeWidth="2.5"
                    fill="none"
                  />
                )}
              </>
            )}
          </svg>
        </div>
      </AdvancedMarker>
    );
  },
  (prev, next) =>
    prev.demo.id === next.demo.id &&
    prev.isSelected === next.isSelected &&
    prev.isDimmed === next.isDimmed &&
    prev.category === next.category
);
