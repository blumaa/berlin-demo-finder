import { getToday, getWeekRange } from "@/lib/datePresets";

describe("getToday", () => {
  it("returns current date as YYYY-MM-DD", () => {
    const result = getToday();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns the correct date for a given reference", () => {
    const ref = new Date(2026, 2, 17); // March 17, 2026 (Tuesday)
    expect(getToday(ref)).toBe("2026-03-17");
  });
});

describe("getWeekRange", () => {
  it("returns Monday-Sunday range for a Tuesday", () => {
    const ref = new Date(2026, 2, 17); // Tuesday March 17, 2026
    const { from, to } = getWeekRange(ref);
    expect(from).toBe("2026-03-16"); // Monday
    expect(to).toBe("2026-03-22"); // Sunday
  });

  it("returns Monday-Sunday range when today is Monday", () => {
    const ref = new Date(2026, 2, 16); // Monday March 16, 2026
    const { from, to } = getWeekRange(ref);
    expect(from).toBe("2026-03-16");
    expect(to).toBe("2026-03-22");
  });

  it("returns Monday-Sunday range when today is Sunday", () => {
    const ref = new Date(2026, 2, 22); // Sunday March 22, 2026
    const { from, to } = getWeekRange(ref);
    expect(from).toBe("2026-03-16");
    expect(to).toBe("2026-03-22");
  });

  it("handles month boundaries", () => {
    const ref = new Date(2026, 3, 1); // Wednesday April 1, 2026
    const { from, to } = getWeekRange(ref);
    expect(from).toBe("2026-03-30"); // Monday in March
    expect(to).toBe("2026-04-05"); // Sunday in April
  });
});
