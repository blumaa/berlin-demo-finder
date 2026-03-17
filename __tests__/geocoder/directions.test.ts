import { getDirectionsPolyline } from "@/lib/geocoder/directions";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("getDirectionsPolyline", () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  it("returns encoded polyline for two waypoints", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "OK",
        routes: [
          {
            overview_polyline: { points: "abc123encodedPolyline" },
          },
        ],
      }),
    });

    const result = await getDirectionsPolyline([
      { lat: 52.5219, lng: 13.4132 },
      { lat: 52.5163, lng: 13.3777 },
    ]);
    expect(result).toBe("abc123encodedPolyline");
  });

  it("handles 3+ waypoints with intermediate waypoints", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "OK",
        routes: [{ overview_polyline: { points: "multiWaypointPolyline" } }],
      }),
    });

    const result = await getDirectionsPolyline([
      { lat: 52.52, lng: 13.41 },
      { lat: 52.51, lng: 13.39 },
      { lat: 52.50, lng: 13.37 },
    ]);
    expect(result).toBe("multiWaypointPolyline");
    // Verify the fetch URL includes waypoints parameter
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("waypoints=");
  });

  it("returns null for single waypoint", async () => {
    const result = await getDirectionsPolyline([{ lat: 52.52, lng: 13.41 }]);
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "REQUEST_DENIED", routes: [] }),
    });

    const result = await getDirectionsPolyline([
      { lat: 52.52, lng: 13.41 },
      { lat: 52.51, lng: 13.39 },
    ]);
    expect(result).toBeNull();
  });
});
