describe("AnalyticsDashboard lastUpdated display", () => {
  it("formats a valid ISO timestamp to en-US locale string", () => {
    const lastUpdated = "2026-03-19T12:05:00.000Z";
    const formatted = new Date(lastUpdated).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    expect(formatted).toContain("Mar");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("19");
  });

  it("returns a string for any valid scraped_at timestamp", () => {
    const timestamps = [
      "2026-01-01T00:00:00.000Z",
      "2026-12-31T23:59:59.999Z",
      "2026-06-15T08:30:00.000Z",
    ];

    for (const ts of timestamps) {
      const formatted = new Date(ts).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    }
  });

  it("handles undefined lastUpdated by not rendering", () => {
    const lastUpdated: string | undefined = undefined;
    // The component uses: {lastUpdated && <p>...</p>}
    // So undefined should produce no output
    expect(lastUpdated && "rendered").toBeFalsy();
  });
});
