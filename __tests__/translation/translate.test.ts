import { translateTexts } from "@/lib/translation/translate";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("translateTexts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns translated texts on success", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseData: { translatedText: "Housing protest" },
          responseStatus: 200,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseData: { translatedText: "Climate march" },
          responseStatus: 200,
        }),
      });

    const result = await translateTexts(
      ["Wohnungsprotest", "Klimamarsch"],
      "en"
    );

    expect(result).toEqual(["Housing protest", "Climate march"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("api.mymemory.translated.net");
    expect(url).toContain("langpair=de%7Cen");
    expect(url).toContain("q=Wohnungsprotest");
  });

  it("translates all texts concurrently", async () => {
    const callOrder: number[] = [];
    mockFetch.mockImplementation(async (url: string) => {
      const callIndex = callOrder.length;
      callOrder.push(callIndex);
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 10));
      return {
        ok: true,
        json: async () => ({
          responseData: { translatedText: `translated-${callIndex}` },
          responseStatus: 200,
        }),
      };
    });

    const start = Date.now();
    await translateTexts(["text1", "text2", "text3"], "en");
    const elapsed = Date.now() - start;

    // All 3 calls should be made
    expect(mockFetch).toHaveBeenCalledTimes(3);
    // Should complete in roughly the time of 1 call, not 3 sequential
    expect(elapsed).toBeLessThan(500);
  });

  it("returns original texts on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const result = await translateTexts(["Wohnungsprotest"], "en");
    expect(result).toEqual(["Wohnungsprotest"]);
  });

  it("returns original texts on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await translateTexts(["Wohnungsprotest"], "en");
    expect(result).toEqual(["Wohnungsprotest"]);
  });

  it("returns empty array for empty input", async () => {
    const result = await translateTexts([], "en");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("includes email parameter when MYMEMORY_EMAIL is set", async () => {
    process.env.MYMEMORY_EMAIL = "test@example.com";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "Housing protest" },
        responseStatus: 200,
      }),
    });

    await translateTexts(["Wohnungsprotest"], "en");

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("de=test%40example.com");

    delete process.env.MYMEMORY_EMAIL;
  });

  it("does not include email parameter when MYMEMORY_EMAIL is not set", async () => {
    delete process.env.MYMEMORY_EMAIL;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "Housing protest" },
        responseStatus: 200,
      }),
    });

    await translateTexts(["Wohnungsprotest"], "en");

    const url = mockFetch.mock.calls[0][0];
    expect(url).not.toContain("de=");
  });

  it("returns original text when responseStatus is not 200", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responseData: { translatedText: "" },
        responseStatus: 403,
      }),
    });

    const result = await translateTexts(["Wohnungsprotest"], "en");
    expect(result).toEqual(["Wohnungsprotest"]);
  });
});
