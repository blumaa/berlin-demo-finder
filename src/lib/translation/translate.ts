const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const REQUEST_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function translateTexts(
  texts: string[],
  targetLang: string,
  sourceLang: string = "de"
): Promise<string[]> {
  if (texts.length === 0) return [];

  const results: string[] = [];
  const email = process.env.MYMEMORY_EMAIL;

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    if (i > 0) await delay(REQUEST_DELAY_MS);

    try {
      const params = new URLSearchParams({
        q: text,
        langpair: `${sourceLang}|${targetLang}`,
      });
      if (email) {
        params.set("de", email);
      }

      const response = await fetch(`${MYMEMORY_URL}?${params}`);

      if (!response.ok) {
        console.error(
          `Translation API error: ${response.status} ${response.statusText}`
        );
        results.push(text);
        continue;
      }

      const json = await response.json();

      if (json.responseStatus !== 200) {
        console.error(`Translation response error: status ${json.responseStatus}`);
        results.push(text);
        continue;
      }

      results.push(json.responseData.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      results.push(text);
    }
  }

  return results;
}
