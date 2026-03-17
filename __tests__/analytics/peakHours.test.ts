import { computePeakHours } from "@/lib/analytics/peakHours";
import { Demo } from "@/lib/types";

const makeDemo = (date: string, time: string): Demo => ({
  id: "1",
  date,
  time_from: time,
  time_to: null,
  topic: "Test",
  plz: "10115",
  location: "Test",
  lat: null,
  lng: null,
  route_text: null,
  route_json: null,
  scraped_at: "",
  created_at: "",
  updated_at: "",
});

describe("computePeakHours", () => {
  it("places demos in correct day/hour cells", () => {
    // 2026-03-16 is a Monday
    const demos = [
      makeDemo("2026-03-16", "10:00"), // Monday 10am
      makeDemo("2026-03-16", "10:00"), // Monday 10am (second)
      makeDemo("2026-03-17", "14:00"), // Tuesday 2pm
    ];
    const result = computePeakHours(demos);
    expect(result.grid[0][10]).toBe(2); // Monday, 10am
    expect(result.grid[1][14]).toBe(1); // Tuesday, 2pm
    expect(result.maxCount).toBe(2);
  });

  it("returns zero grid for empty demos", () => {
    const result = computePeakHours([]);
    expect(result.grid).toHaveLength(7);
    expect(result.maxCount).toBe(0);
  });
});
