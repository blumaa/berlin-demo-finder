const DEFAULT_URL =
  "https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/";

export async function fetchHtml(): Promise<string> {
  const targetUrl = process.env.BERLIN_DEMO_URL || DEFAULT_URL;
  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "BerlinDemoFinder/1.0 (educational project)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return response.text();
}
