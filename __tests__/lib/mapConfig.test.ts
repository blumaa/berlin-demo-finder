import {
  BERLIN_CENTER,
  DEFAULT_ZOOM,
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  MAX_ZOOM,
} from "@/lib/mapConfig";

describe("mapConfig", () => {
  it("exports Berlin center coordinates", () => {
    expect(BERLIN_CENTER.lat).toBeCloseTo(52.52, 1);
    expect(BERLIN_CENTER.lng).toBeCloseTo(13.405, 1);
  });

  it("exports default zoom level", () => {
    expect(DEFAULT_ZOOM).toBe(12);
  });

  it("exports cluster config values", () => {
    expect(CLUSTER_MAX_ZOOM).toBe(14);
    expect(CLUSTER_RADIUS).toBe(50);
    expect(MAX_ZOOM).toBe(20);
  });
});
