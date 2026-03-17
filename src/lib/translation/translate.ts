const TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

export async function translateTexts(
  texts: string[],
  targetLang: string,
  sourceLang: string = "de"
): Promise<string[]> {
  if (texts.length === 0) return [];

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_CLOUD_TRANSLATION_API_KEY not set, skipping translation");
    return texts;
  }

  try {
    const response = await fetch(`${TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        source: sourceLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      console.error(
        `Translation API error: ${response.status} ${response.statusText}`
      );
      return texts;
    }

    const json = await response.json();
    const translations: { translatedText: string }[] =
      json.data.translations;

    return translations.map((t) => t.translatedText);
  } catch (error) {
    console.error("Translation failed:", error);
    return texts;
  }
}
