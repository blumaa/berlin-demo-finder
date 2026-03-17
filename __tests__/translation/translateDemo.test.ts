import { translateDemoTopics } from "@/lib/translation/translateDemo";
import { translateTexts } from "@/lib/translation/translate";
import type { Locale } from "@/i18n/types";

jest.mock("@/lib/translation/translate");
const mockTranslateTexts = translateTexts as jest.MockedFunction<
  typeof translateTexts
>;

describe("translateDemoTopics", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const demos = [
    { id: "demo-1", topic: "Wohnungsprotest" },
    { id: "demo-2", topic: "Klimamarsch" },
  ];

  it("translates topics for all non-de locales", async () => {
    mockTranslateTexts.mockImplementation(async (texts, targetLang) => {
      if (targetLang === "en")
        return ["Housing protest", "Climate march"];
      if (targetLang === "fr")
        return ["Protestation de logement", "Marche climatique"];
      return texts;
    });

    const locales: Locale[] = ["de", "en", "fr"];
    const result = await translateDemoTopics(demos, locales);

    expect(result).toHaveLength(4); // 2 demos × 2 non-de locales
    expect(result).toContainEqual({
      demo_id: "demo-1",
      locale: "en",
      topic: "Housing protest",
    });
    expect(result).toContainEqual({
      demo_id: "demo-2",
      locale: "en",
      topic: "Climate march",
    });
    expect(result).toContainEqual({
      demo_id: "demo-1",
      locale: "fr",
      topic: "Protestation de logement",
    });
    expect(result).toContainEqual({
      demo_id: "demo-2",
      locale: "fr",
      topic: "Marche climatique",
    });
  });

  it("skips de locale", async () => {
    mockTranslateTexts.mockResolvedValue(["translated"]);

    const locales: Locale[] = ["de"];
    const result = await translateDemoTopics(demos, locales);

    expect(result).toHaveLength(0);
    expect(mockTranslateTexts).not.toHaveBeenCalled();
  });

  it("makes one API call per locale with all topics batched", async () => {
    mockTranslateTexts.mockResolvedValue(["t1", "t2"]);

    const locales: Locale[] = ["en", "fr", "de"];
    await translateDemoTopics(demos, locales);

    // Should call translateTexts twice (en + fr, skipping de)
    expect(mockTranslateTexts).toHaveBeenCalledTimes(2);
    // Each call should include both topics
    expect(mockTranslateTexts).toHaveBeenCalledWith(
      ["Wohnungsprotest", "Klimamarsch"],
      "en",
      "de"
    );
    expect(mockTranslateTexts).toHaveBeenCalledWith(
      ["Wohnungsprotest", "Klimamarsch"],
      "fr",
      "de"
    );
  });

  it("returns empty array for empty demos", async () => {
    const result = await translateDemoTopics([], ["en", "fr"]);
    expect(result).toHaveLength(0);
    expect(mockTranslateTexts).not.toHaveBeenCalled();
  });

  it("falls back to original text on translation error", async () => {
    mockTranslateTexts.mockResolvedValue([
      "Wohnungsprotest",
      "Klimamarsch",
    ]);

    const locales: Locale[] = ["en"];
    const result = await translateDemoTopics(demos, locales);

    expect(result).toHaveLength(2);
    expect(result[0].topic).toBe("Wohnungsprotest");
    expect(result[1].topic).toBe("Klimamarsch");
  });
});
