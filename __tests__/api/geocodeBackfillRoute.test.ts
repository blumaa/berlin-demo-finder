import { POST } from "@/app/api/geocode-backfill/route";
import { NextRequest } from "next/server";

const mockUpdate = jest.fn().mockReturnValue({
  eq: jest.fn().mockResolvedValue({ error: null }),
});

const mockUngeocodedDemos = [
  { id: "1", location: "Alexanderplatz", plz: "10115", route_text: null },
  { id: "2", location: "Brandenburger Tor", plz: "10557", route_text: null },
];

const mockSelectChain = {
  is: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: mockUngeocodedDemos }),
};

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: jest.fn((fields: string) => {
        if (fields === "id") {
          return {
            is: jest.fn().mockReturnValue({
              neq: jest.fn().mockResolvedValue({
                data: mockUngeocodedDemos.map((d) => ({ id: d.id })),
                error: null,
              }),
            }),
          };
        }
        return mockSelectChain;
      }),
      update: mockUpdate,
    }),
  }),
}));

const mockGeocodeWithCache = jest.fn().mockResolvedValue({
  lat: 52.52,
  lng: 13.405,
  formatted_address: "Berlin, Germany",
});

jest.mock("@/lib/geocoder/geocodeWithCache", () => ({
  geocodeWithCache: (...args: unknown[]) => mockGeocodeWithCache(...args),
}));

jest.mock("@/lib/geocoder/directions", () => ({
  getDirectionsPolyline: jest.fn().mockResolvedValue("encodedPolyline123"),
}));

describe("POST /api/geocode-backfill", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, CRON_SECRET: "test-secret" };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("returns 401 without authorization header", async () => {
    const req = new NextRequest("http://localhost/api/geocode-backfill", {
      method: "POST",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const req = new NextRequest("http://localhost/api/geocode-backfill", {
      method: "POST",
      headers: { Authorization: "Bearer wrong-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("geocodes a batch and returns remaining count", async () => {
    const req = new NextRequest("http://localhost/api/geocode-backfill", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.geocoded).toBe(2);
    expect(typeof body.remaining).toBe("number");
  });

  it("continues when geocoding returns null for a demo", async () => {
    mockGeocodeWithCache.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/geocode-backfill", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.geocoded).toBe(0);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns zero when no ungeocoded demos exist", async () => {
    mockSelectChain.limit.mockResolvedValueOnce({ data: [] });
    const req = new NextRequest("http://localhost/api/geocode-backfill", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.geocoded).toBe(0);
    expect(body.remaining).toBe(0);
  });
});
