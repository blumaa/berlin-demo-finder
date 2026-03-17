import { readFileSync } from "fs";
import { join } from "path";
import { parseHtml } from "@/lib/scraper/parseHtml";
import { RawScrapedDemo } from "@/lib/types";

const fixture = readFileSync(
  join(__dirname, "../fixtures/demos-page.html"),
  "utf-8"
);

describe("parseHtml", () => {
  let demos: RawScrapedDemo[];

  beforeAll(() => {
    demos = parseHtml(fixture);
  });

  it("parses the correct number of rows", () => {
    expect(demos).toHaveLength(5);
  });

  it("converts DD.MM.YYYY dates to YYYY-MM-DD", () => {
    expect(demos[0].date).toBe("2026-03-15");
    expect(demos[2].date).toBe("2026-03-16");
  });

  it("extracts time_from correctly", () => {
    expect(demos[0].time_from).toBe("10:00");
    expect(demos[3].time_from).toBe("08:00");
  });

  it("extracts time_to or null for empty", () => {
    expect(demos[0].time_to).toBe("18:00");
    expect(demos[3].time_to).toBeNull();
  });

  it("extracts topic with special characters decoded", () => {
    expect(demos[3].topic).toBe(
      "Gegen Rechtsextremismus & für Demokratie"
    );
  });

  it("extracts PLZ", () => {
    expect(demos[0].plz).toBe("10115");
  });

  it("extracts location", () => {
    expect(demos[0].location).toBe("Alexanderplatz");
  });

  it("extracts route_text or null for empty", () => {
    expect(demos[0].route_text).toBe(
      "AP: Alexanderplatz, ZK: Karl-Marx-Allee, EP: Frankfurter Tor"
    );
    expect(demos[1].route_text).toBeNull();
  });

  it("returns empty array for HTML with no table", () => {
    expect(parseHtml("<html><body>No table here</body></html>")).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseHtml("")).toEqual([]);
  });
});
