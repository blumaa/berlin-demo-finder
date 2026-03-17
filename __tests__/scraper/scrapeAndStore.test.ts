import { scrapeAndStore } from "@/lib/scraper/scrapeAndStore";
import * as fetchHtmlModule from "@/lib/scraper/fetchHtml";
import * as geocodeWithCacheModule from "@/lib/geocoder/geocodeWithCache";
import * as directionsModule from "@/lib/geocoder/directions";
import * as translateDemoModule from "@/lib/translation/translateDemo";
import { readFileSync } from "fs";
import { join } from "path";

const fixture = readFileSync(
  join(__dirname, "../fixtures/demos-page.html"),
  "utf-8"
);

// Mock dependencies
jest.mock("@/lib/scraper/fetchHtml");
jest.mock("@/lib/geocoder/geocodeWithCache");
jest.mock("@/lib/geocoder/directions");
jest.mock("@/lib/translation/translateDemo");

const mockUpsert = jest.fn().mockResolvedValue({ error: null });
const mockTranslationUpsert = jest.fn().mockResolvedValue({ error: null });
const mockUpdate = jest.fn().mockReturnValue({
  eq: jest.fn().mockResolvedValue({ error: null }),
});

// Chainable query mock for select().is().neq().limit()
const mockSelectChain = {
  is: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({
    data: [
      { id: "1", location: "Alexanderplatz", plz: "10115", route_text: null },
      { id: "2", location: "Brandenburger Tor", plz: "10557", route_text: null },
      { id: "3", location: "Unter den Linden 1", plz: "10178", route_text: "AP: Unter den Linden, EP: Potsdamer Platz" },
      { id: "4", location: "Oranienplatz", plz: "10969", route_text: "Oranienstraße, Kottbusser Damm, Hermannplatz" },
      { id: "5", location: "Denkmal für die ermordeten Juden Europas", plz: "10785", route_text: null },
    ],
  }),
};

// Chainable query mock for demos translation queries: select().order().limit()
const mockDemoTranslationSelectChain = {
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({
    data: [
      { id: "1", topic: "Demo topic 1" },
      { id: "2", topic: "Demo topic 2" },
    ],
  }),
};

// Mock for demo_translations table select (existing translations)
// fetchAllTranslatedDemoIds calls .select("demo_id").range(...)
const mockTranslationSelectChain = {
  select: jest.fn().mockReturnValue({
    range: jest.fn().mockResolvedValue({ data: [], error: null }),
  }),
};

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "demos") {
        return {
          upsert: mockUpsert,
          select: jest.fn((fields: string) => {
            if (fields === "id, topic") {
              return mockDemoTranslationSelectChain;
            }
            return mockSelectChain;
          }),
          update: mockUpdate,
        };
      }
      if (table === "demo_translations") {
        return {
          upsert: mockTranslationUpsert,
          select: mockTranslationSelectChain.select,
        };
      }
      return { upsert: mockUpsert };
    },
  }),
}));

describe("scrapeAndStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectChain.is.mockReturnThis();
    mockSelectChain.neq.mockReturnThis();
    (fetchHtmlModule.fetchHtml as jest.Mock).mockResolvedValue(fixture);
    (geocodeWithCacheModule.geocodeWithCache as jest.Mock).mockResolvedValue({
      lat: 52.52,
      lng: 13.405,
      formatted_address: "Berlin, Germany",
    });
    (directionsModule.getDirectionsPolyline as jest.Mock).mockResolvedValue(
      "encodedPolyline123"
    );
    (translateDemoModule.translateDemoTopics as jest.Mock).mockResolvedValue([]);
  });

  it("fetches, parses, bulk upserts, then geocodes", async () => {
    const result = await scrapeAndStore();
    expect(result.total).toBe(5);
    expect(result.geocoded).toBe(5);
    expect(result.errors).toHaveLength(0);
    // Bulk upsert called once (all 5 fit in one chunk)
    expect(mockUpsert).toHaveBeenCalledTimes(1);
  });

  it("throws on zero-row scrape result", async () => {
    (fetchHtmlModule.fetchHtml as jest.Mock).mockResolvedValue(
      "<html><body>Empty</body></html>"
    );
    await expect(scrapeAndStore()).rejects.toThrow("0 rows");
  });

  it("continues when geocoding fails for a demo", async () => {
    (geocodeWithCacheModule.geocodeWithCache as jest.Mock).mockResolvedValue(
      null
    );
    const result = await scrapeAndStore();
    expect(result.total).toBe(5);
    expect(result.geocoded).toBe(0);
    // Bulk upsert still happens
    expect(mockUpsert).toHaveBeenCalledTimes(1);
  });
});
