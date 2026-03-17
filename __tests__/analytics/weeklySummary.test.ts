import { computeWeeklySummary } from "@/lib/analytics/weeklySummary";
import { Demo } from "@/lib/types";

const makeDemo = (overrides: Partial<Demo> = {}): Demo => ({
  id: "1",
  date: "2026-03-16",
  time_from: "10:00",
  time_to: "18:00",
  topic: "Test demo",
  plz: "10115",
  location: "Alexanderplatz",
  lat: 52.52,
  lng: 13.405,
  route_text: null,
  route_json: null,
  scraped_at: "2026-03-16T00:00:00Z",
  created_at: "2026-03-16T00:00:00Z",
  updated_at: "2026-03-16T00:00:00Z",
  ...overrides,
});

describe("computeWeeklySummary", () => {
  // Reference: Monday 2026-03-16
  const refDate = new Date("2026-03-18"); // Wednesday of that week

  it("counts this week demos", () => {
    const demos = [
      makeDemo({ date: "2026-03-16" }), // Monday (this week)
      makeDemo({ date: "2026-03-17" }), // Tuesday (this week)
      makeDemo({ date: "2026-03-09" }), // Monday (last week)
    ];
    const result = computeWeeklySummary(demos, refDate);
    expect(result.thisWeekCount).toBe(2);
    expect(result.lastWeekCount).toBe(1);
  });

  it("computes percent change", () => {
    const demos = [
      makeDemo({ date: "2026-03-16" }),
      makeDemo({ date: "2026-03-17" }),
      makeDemo({ date: "2026-03-09" }),
    ];
    const result = computeWeeklySummary(demos, refDate);
    expect(result.percentChange).toBe(100); // 2 vs 1 = +100%
  });

  it("returns top topics", () => {
    const demos = [
      makeDemo({ date: "2026-03-16", topic: "Klimastreik" }),
      makeDemo({ date: "2026-03-16", topic: "Klimaschutz jetzt" }),
      makeDemo({ date: "2026-03-17", topic: "Gegen Mieterverdrängung" }),
    ];
    const result = computeWeeklySummary(demos, refDate);
    expect(result.topTopics[0].topic).toBe("Climate");
    expect(result.topTopics[0].count).toBe(2);
  });

  it("handles empty demos", () => {
    const result = computeWeeklySummary([], refDate);
    expect(result.thisWeekCount).toBe(0);
    expect(result.lastWeekCount).toBe(0);
    expect(result.percentChange).toBe(0);
  });
});
