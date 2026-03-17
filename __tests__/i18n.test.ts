import en from "../src/i18n/dictionaries/en";
import de from "../src/i18n/dictionaries/de";
import { getDictionary, isRTL, SUPPORTED_LOCALES, LOCALE_NAMES } from "../src/i18n";
import type { TranslationKey } from "../src/i18n/types";

describe("i18n dictionaries", () => {
  const enKeys = Object.keys(en) as TranslationKey[];
  const deKeys = Object.keys(de) as TranslationKey[];

  it("English and German dictionaries have the same keys", () => {
    expect(enKeys.toSorted()).toEqual(deKeys.toSorted());
  });

  it("no empty values in English dictionary", () => {
    for (const key of enKeys) {
      expect(en[key]).toBeTruthy();
    }
  });

  it("no empty values in German dictionary", () => {
    for (const key of deKeys) {
      expect(de[key]).toBeTruthy();
    }
  });

  it("getDictionary returns English for 'en'", () => {
    expect(getDictionary("en")).toBe(en);
  });

  it("getDictionary returns German for 'de'", () => {
    expect(getDictionary("de")).toBe(de);
  });

  it("getDictionary falls back to English for unknown locale", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getDictionary("zz" as any)).toBe(en);
  });
});

describe("isRTL", () => {
  it("returns true for Arabic", () => {
    expect(isRTL("ar")).toBe(true);
  });

  it("returns false for LTR locales", () => {
    expect(isRTL("en")).toBe(false);
    expect(isRTL("de")).toBe(false);
    expect(isRTL("fr")).toBe(false);
    expect(isRTL("tr")).toBe(false);
  });
});

describe("SUPPORTED_LOCALES", () => {
  it("contains 12 locales", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(12);
  });

  it("every locale has an endonym in LOCALE_NAMES", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(LOCALE_NAMES[locale]).toBeTruthy();
    }
  });
});
