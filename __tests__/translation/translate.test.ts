import { translateTexts } from "@/lib/translation/translate";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("translateTexts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY = "test-api-key";
  });

  afterEach(() => {
    delete process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;
  });

  it("returns translated texts on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          translations: [
            { translatedText: "Housing protest" },
            { translatedText: "Climate march" },
          ],
        },
      }),
    });

    const result = await translateTexts(
      ["Wohnungsprotest", "Klimamarsch"],
      "en"
    );

    expect(result).toEqual(["Housing protest", "Climate march"]);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("translate/v2");
    expect(url).toContain("key=test-api-key");

    const body = JSON.parse(options.body);
    expect(body.q).toEqual(["Wohnungsprotest", "Klimamarsch"]);
    expect(body.target).toBe("en");
    expect(body.source).toBe("de");
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

  it("returns original texts when API key is missing", async () => {
    delete process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;

    const result = await translateTexts(["Wohnungsprotest"], "en");
    expect(result).toEqual(["Wohnungsprotest"]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns empty array for empty input", async () => {
    const result = await translateTexts([], "en");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
