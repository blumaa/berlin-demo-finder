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

  it("strips HTML tags from cell content", () => {
    const html = `<table><tbody><tr>
      <td>15.03.2026</td>
      <td>10:00</td>
      <td>18:00</td>
      <td>Test <script>alert('xss')</script> topic</td>
      <td>10115</td>
      <td>Some <b>bold</b> place</td>
      <td></td>
    </tr></tbody></table>`;
    const result = parseHtml(html);
    expect(result[0].topic).not.toContain("<script>");
    expect(result[0].topic).not.toContain("<b>");
    expect(result[0].location).not.toContain("<b>");
  });

  it("strips control characters from cell content", () => {
    const html = `<table><tbody><tr>
      <td>15.03.2026</td>
      <td>10:00</td>
      <td>18:00</td>
      <td>Topic\x00with\x08control\x0Bchars</td>
      <td>10115</td>
      <td>Place</td>
      <td></td>
    </tr></tbody></table>`;
    const result = parseHtml(html);
    expect(result[0].topic).toBe("Topicwithcontrolchars");
  });

  it("truncates topic and location to 500 characters", () => {
    const longText = "A".repeat(600);
    const html = `<table><tbody><tr>
      <td>15.03.2026</td>
      <td>10:00</td>
      <td>18:00</td>
      <td>${longText}</td>
      <td>10115</td>
      <td>${longText}</td>
      <td></td>
    </tr></tbody></table>`;
    const result = parseHtml(html);
    expect(result[0].topic.length).toBeLessThanOrEqual(500);
    expect(result[0].location.length).toBeLessThanOrEqual(500);
  });
});
