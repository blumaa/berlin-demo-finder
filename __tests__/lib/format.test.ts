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
  it("formats an ISO timestamp deterministically using UTC", () => {
    const result = formatLastUpdated("2025-03-15T14:30:00Z");
    expect(result).toBe("Mar 15, 14:30 UTC");
  });

  it("handles single-digit days without leading zero", () => {
    const result = formatLastUpdated("2025-01-05T09:05:00Z");
    expect(result).toBe("Jan 5, 09:05 UTC");
  });

  it("produces identical output regardless of locale argument", () => {
    const iso = "2025-06-20T08:15:00Z";
    expect(formatLastUpdated(iso, "en")).toBe(formatLastUpdated(iso, "de"));
  });
});
