import { getDemoCategory } from "@/lib/getDemoCategory";
import { Demo } from "@/lib/types";

function makeDemoWithTopic(topic: string, overrides?: Partial<Demo>): Demo {
  return {
    id: "1",
    date: "2025-01-01",
    time_from: "10:00:00",
    time_to: "12:00:00",
    topic,
    location: "Alexanderplatz",
    plz: "10178",
    route_text: null,
    route_json: null,
    lat: 52.52,
    lng: 13.405,
    scraped_at: "2025-01-01T00:00:00Z",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("getDemoCategory", () => {
  it("classifies using topic for regular demos", () => {
    const demo = makeDemoWithTopic("Klimastreik Fridays for Future");
    expect(getDemoCategory(demo)).toBe("Climate");
  });

  it("classifies using originalTopic for translated demos", () => {
    const demo = {
      ...makeDemoWithTopic("Climate Strike Fridays for Future"),
      originalTopic: "Klimastreik Fridays for Future",
    };
    expect(getDemoCategory(demo)).toBe("Climate");
  });

  it("returns Other for unrecognized topics", () => {
    const demo = makeDemoWithTopic("Allgemeiner Protest");
    expect(getDemoCategory(demo)).toBe("Other");
  });

  it("classifies housing topics", () => {
    const demo = makeDemoWithTopic("Miete runter, keine Räumung");
    expect(getDemoCategory(demo)).toBe("Housing");
  });

  it("classifies anti-fascism topics", () => {
    const demo = makeDemoWithTopic("Gegen Rechts und AfD");
    expect(getDemoCategory(demo)).toBe("Anti-Fascism");
  });
});
