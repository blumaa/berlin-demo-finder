import { computeDemosByPlz } from "@/lib/analytics/demosByPlz";
import { Demo } from "@/lib/types";

const makeDemo = (plz: string): Demo => ({
  id: "1",
  date: "2026-03-16",
  time_from: "10:00",
  time_to: null,
  topic: "Test",
  plz,
  location: "Test",
  lat: null,
  lng: null,
  route_text: null,
  route_json: null,
  scraped_at: "",
  created_at: "",
  updated_at: "",
});

describe("computeDemosByPlz", () => {
  it("returns top PLZs by count", () => {
    const demos = [
      makeDemo("10115"),
      makeDemo("10115"),
      makeDemo("10115"),
      makeDemo("10178"),
      makeDemo("10178"),
      makeDemo("10557"),
    ];
    const result = computeDemosByPlz(demos);
    expect(result[0]).toEqual({ plz: "10115", count: 3 });
    expect(result[1]).toEqual({ plz: "10178", count: 2 });
    expect(result[2]).toEqual({ plz: "10557", count: 1 });
  });

  it("limits to topN", () => {
    const demos = Array.from({ length: 30 }, (_, i) =>
      makeDemo(`${10000 + i}`)
    );
    const result = computeDemosByPlz(demos, 5);
    expect(result).toHaveLength(5);
  });
});
