import { verifyBearerToken } from "@/lib/auth/verifyBearerToken";

describe("verifyBearerToken", () => {
  it("returns true for correct token", () => {
    expect(verifyBearerToken("Bearer test-secret", "test-secret")).toBe(true);
  });

  it("returns false for wrong token", () => {
    expect(verifyBearerToken("Bearer wrong-secret", "test-secret")).toBe(false);
  });

  it("returns false for null header", () => {
    expect(verifyBearerToken(null, "test-secret")).toBe(false);
  });

  it("returns false for empty string header", () => {
    expect(verifyBearerToken("", "test-secret")).toBe(false);
  });

  it("returns false for header without Bearer prefix", () => {
    expect(verifyBearerToken("test-secret", "test-secret")).toBe(false);
  });

  it("returns false for empty secret", () => {
    expect(verifyBearerToken("Bearer ", "")).toBe(false);
  });

  it("returns false for different length tokens", () => {
    expect(verifyBearerToken("Bearer short", "much-longer-secret")).toBe(false);
  });
});
