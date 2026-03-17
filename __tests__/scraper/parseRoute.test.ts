import { parseRoute } from "@/lib/scraper/parseRoute";

describe("parseRoute", () => {
  it("parses AP/ZK/EP format into typed waypoints", () => {
    const result = parseRoute(
      "AP: Alexanderplatz, ZK: Karl-Marx-Allee, EP: Frankfurter Tor"
    );
    expect(result).toEqual([
      { type: "AP", street: "Alexanderplatz" },
      { type: "ZK", street: "Karl-Marx-Allee" },
      { type: "EP", street: "Frankfurter Tor" },
    ]);
  });

  it("parses route with multiple ZK waypoints", () => {
    const result = parseRoute(
      "AP: Unter den Linden, ZK: Friedrichstraße, ZK: Leipziger Straße, EP: Potsdamer Platz"
    );
    expect(result).toHaveLength(4);
    expect(result![1].type).toBe("ZK");
    expect(result![2].type).toBe("ZK");
  });

  it("parses plain comma-separated streets as unknown type", () => {
    const result = parseRoute(
      "Oranienstraße, Kottbusser Damm, Hermannplatz"
    );
    expect(result).toEqual([
      { type: "unknown", street: "Oranienstraße" },
      { type: "unknown", street: "Kottbusser Damm" },
      { type: "unknown", street: "Hermannplatz" },
    ]);
  });

  it("returns null for empty string", () => {
    expect(parseRoute("")).toBeNull();
  });

  it("returns null for null input", () => {
    expect(parseRoute(null)).toBeNull();
  });

  it("strips noise phrases like '-> alle X Stunden'", () => {
    const result = parseRoute(
      "AP: Alexanderplatz -> alle 2 Stunden, EP: Brandenburger Tor"
    );
    expect(result).toEqual([
      { type: "AP", street: "Alexanderplatz" },
      { type: "EP", street: "Brandenburger Tor" },
    ]);
  });

  it("strips 'im Wechsel' noise", () => {
    const result = parseRoute("AP: Platz A im Wechsel, EP: Platz B");
    expect(result).toEqual([
      { type: "AP", street: "Platz A" },
      { type: "EP", street: "Platz B" },
    ]);
  });
});
