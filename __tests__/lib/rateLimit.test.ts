import { checkRateLimit, resetRateLimits } from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests under the limit", () => {
    const result = checkRateLimit("192.168.1.1", 60, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it("blocks requests over the limit", () => {
    for (let i = 0; i < 60; i++) {
      checkRateLimit("192.168.1.1", 60, 60_000);
    }
    const result = checkRateLimit("192.168.1.1", 60, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks different IPs independently", () => {
    for (let i = 0; i < 60; i++) {
      checkRateLimit("192.168.1.1", 60, 60_000);
    }
    const result = checkRateLimit("192.168.1.2", 60, 60_000);
    expect(result.allowed).toBe(true);
  });

  it("resets after the window expires", () => {
    jest.useFakeTimers();

    for (let i = 0; i < 60; i++) {
      checkRateLimit("192.168.1.1", 60, 60_000);
    }
    expect(checkRateLimit("192.168.1.1", 60, 60_000).allowed).toBe(false);

    jest.advanceTimersByTime(60_001);

    expect(checkRateLimit("192.168.1.1", 60, 60_000).allowed).toBe(true);

    jest.useRealTimers();
  });
});
