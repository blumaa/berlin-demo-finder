export type Locale =
  | "en"
  | "de"
  | "fr"
  | "tr"
  | "ar"
  | "pl"
  | "uk"
  | "vi"
  | "es"
  | "it"
  | "pt"
  | "hu";

export const SUPPORTED_LOCALES: Locale[] = [
  "en",
  "de",
  "fr",
  "tr",
  "ar",
  "pl",
  "uk",
  "vi",
  "es",
  "it",
  "pt",
  "hu",
];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  tr: "Türkçe",
  ar: "العربية",
  pl: "Polski",
  uk: "Українська",
  vi: "Tiếng Việt",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  hu: "Magyar",
};

const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export type TranslationKey =
  | "filters.title"
  | "filters.from"
  | "filters.to"
  | "filters.keyword"
  | "filters.keywordPlaceholder"
  | "filters.plz"
  | "filters.results"
  | "filters.clearAll"
  | "legend.label"
  | "legend.type"
  | "legend.category"
  | "legend.march"
  | "legend.rally"
  | "popover.close"
  | "popover.route"
  | "popover.share"
  | "popover.copied"
  | "popover.maps"
  | "analytics.title"
  | "analytics.weeklyPulse"
  | "analytics.thisWeek"
  | "analytics.topTopics"
  | "analytics.day"
  | "analytics.peakHours"
  | "analytics.topicTrends"
  | "analytics.surgeTitle"
  | "analytics.surgeLabel.surging"
  | "analytics.surgeLabel.moreActive"
  | "analytics.surgeLabel.normal"
  | "analytics.surgeLabel.quieter"
  | "analytics.surgeLabel.busier"
  | "analytics.demosByPlz"
  | "analytics.repeatLocations"
  | "analytics.low"
  | "analytics.high"
  | "category.Housing"
  | "category.Climate"
  | "category.InternationalSolidarity"
  | "category.AntiFascism"
  | "category.Labor"
  | "category.Commemoration"
  | "category.GenderLGBTQ"
  | "category.Other"
  | "days.mon"
  | "days.tue"
  | "days.wed"
  | "days.thu"
  | "days.fri"
  | "days.sat"
  | "days.sun"
  | "nav.language";

export type Dictionary = Record<TranslationKey, string>;
