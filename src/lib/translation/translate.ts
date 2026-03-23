const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

async function translateOne(
  text: string,
  targetLang: string,
  sourceLang: string,
  email?: string
): Promise<string> {
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
      return text;
    }

    const json = await response.json();

    if (json.responseStatus !== 200) {
      console.error(`Translation response error: status ${json.responseStatus}`);
      return text;
    }

    return json.responseData.translatedText;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
}

export async function translateTexts(
  texts: string[],
  targetLang: string,
  sourceLang: string = "de"
): Promise<string[]> {
  if (texts.length === 0) return [];

  const email = process.env.MYMEMORY_EMAIL;

  return Promise.all(
    texts.map((text) => translateOne(text, targetLang, sourceLang, email))
  );
}
