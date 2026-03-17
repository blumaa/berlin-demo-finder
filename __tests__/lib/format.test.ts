import { formatDate, formatTime, formatLastUpdated } from "@/lib/format";

describe("formatDate", () => {
  it("formats a date string with locale", () => {
    const result = formatDate("2025-03-15", "en");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats with German locale", () => {
    const result = formatDate("2025-03-15", "de");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });
});

describe("formatTime", () => {
  it("formats time from only", () => {
    expect(formatTime("10:00:00", null)).toBe("10:00");
  });

  it("formats time range", () => {
    expect(formatTime("10:00:00", "12:30:00")).toBe("10:00\u201312:30");
  });

  it("strips seconds from both times", () => {
    expect(formatTime("09:15:45", "14:30:22")).toBe("09:15\u201314:30");
  });
});

describe("formatLastUpdated", () => {
  it("formats an ISO timestamp", () => {
    const result = formatLastUpdated("2025-03-15T14:30:00Z");
    // Should contain month and day at minimum
    expect(result).toContain("15");
  });
});
