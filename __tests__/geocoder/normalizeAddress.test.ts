import { normalizeAddress } from "@/lib/geocoder/normalizeAddress";

describe("normalizeAddress", () => {
  it("combines street and PLZ into normalized key", () => {
    expect(normalizeAddress("Alexanderplatz", "10115")).toBe(
      "alexanderplatz, 10115 berlin, germany"
    );
  });

  it("trims whitespace", () => {
    expect(normalizeAddress("  Unter den Linden  ", "10117")).toBe(
      "unter den linden, 10117 berlin, germany"
    );
  });

  it("lowercases the result", () => {
    expect(normalizeAddress("Karl-Marx-Allee", "10243")).toBe(
      "karl-marx-allee, 10243 berlin, germany"
    );
  });

  it("handles location without PLZ", () => {
    expect(normalizeAddress("Brandenburger Tor", "")).toBe(
      "brandenburger tor, berlin, germany"
    );
  });
});
