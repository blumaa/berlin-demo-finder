import { computeRepeatLocations } from "@/lib/analytics/repeatLocations";
import { Demo } from "@/lib/types";

const makeDemo = (location: string, topic: string): Demo => ({
  id: "1",
  date: "2026-03-16",
  time_from: "10:00",
  time_to: null,
  topic,
  plz: "10115",
  location,
  lat: null,
  lng: null,
  route_text: null,
  route_json: null,
  scraped_at: "",
  created_at: "",
  updated_at: "",
});

describe("computeRepeatLocations", () => {
  it("ranks locations by frequency", () => {
    const demos = [
      makeDemo("Alexanderplatz", "Klimastreik"),
      makeDemo("Alexanderplatz", "Gegen Miete"),
      makeDemo("Alexanderplatz", "Klimaschutz"),
      makeDemo("Brandenburger Tor", "Freiheit"),
    ];
    const result = computeRepeatLocations(demos);
    expect(result[0].location).toBe("Alexanderplatz");
    expect(result[0].total).toBe(3);
  });

  it("includes topic category breakdown", () => {
    const demos = [
      makeDemo("Alexanderplatz", "Klimastreik"),
      makeDemo("Alexanderplatz", "Klimaschutz"),
      makeDemo("Alexanderplatz", "Gegen Mieterverdrängung"),
    ];
    const result = computeRepeatLocations(demos);
    expect(result[0].categories["Climate"]).toBe(2);
    expect(result[0].categories["Housing"]).toBe(1);
  });
});
