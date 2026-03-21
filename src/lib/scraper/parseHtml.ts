import * as cheerio from "cheerio";
import { RawScrapedDemo } from "@/lib/types";

function convertDate(dateStr: string): string {
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}`;
}

const MAX_FIELD_LENGTH = 500;

function sanitize(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .slice(0, MAX_FIELD_LENGTH);
}

export function parseHtml(html: string): RawScrapedDemo[] {
  if (!html) return [];

  const $ = cheerio.load(html);
  const rows = $("table tbody tr");

  if (rows.length === 0) return [];

  const demos: RawScrapedDemo[] = [];

  rows.each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 7) return;

    const dateRaw = $(cells[0]).text().trim();
    const timeFrom = $(cells[1]).text().trim();
    const timeTo = $(cells[2]).text().trim();
    const topic = sanitize($(cells[3]).text().trim());
    const plz = $(cells[4]).text().trim();
    const location = sanitize($(cells[5]).text().trim());
    const routeText = $(cells[6]).text().trim();

    if (!dateRaw || !timeFrom || !topic) return;

    demos.push({
      date: convertDate(dateRaw),
      time_from: timeFrom,
      time_to: timeTo || null,
      topic,
      plz,
      location,
      route_text: routeText || null,
    });
  });

  return demos;
}
