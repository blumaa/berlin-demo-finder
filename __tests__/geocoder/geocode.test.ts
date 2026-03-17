import { geocode } from "@/lib/geocoder/geocode";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("geocode", () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  it("returns lat/lng from Google Geocoding API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "OK",
        results: [
          {
            geometry: { location: { lat: 52.5219, lng: 13.4132 } },
            formatted_address: "Alexanderplatz, 10178 Berlin, Germany",
          },
        ],
      }),
    });

    const result = await geocode("alexanderplatz, 10115 berlin, germany");
    expect(result).toEqual({
      lat: 52.5219,
      lng: 13.4132,
      formatted_address: "Alexanderplatz, 10178 Berlin, Germany",
    });
  });

  it("returns null when API returns ZERO_RESULTS", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ZERO_RESULTS", results: [] }),
    });

    const result = await geocode("nonexistent place");
    expect(result).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await geocode("some address");
    expect(result).toBeNull();
  });
});
