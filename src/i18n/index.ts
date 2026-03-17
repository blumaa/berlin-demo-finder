import type { Locale, Dictionary } from "./types";
import en from "./dictionaries/en";
import de from "./dictionaries/de";

export { type Locale, type Dictionary, type TranslationKey } from "./types";
export { SUPPORTED_LOCALES, LOCALE_NAMES, isRTL } from "./types";

const dictionaries: Record<string, Dictionary> = { en, de };

let lazyDictionaries: Record<string, () => Promise<{ default: Dictionary }>> | null = null;

function getLazyDictionaries(): Record<string, () => Promise<{ default: Dictionary }>> {
  if (!lazyDictionaries) {
    lazyDictionaries = {
      fr: () => import("./dictionaries/fr"),
      tr: () => import("./dictionaries/tr"),
      ar: () => import("./dictionaries/ar"),
      pl: () => import("./dictionaries/pl"),
      uk: () => import("./dictionaries/uk"),
      vi: () => import("./dictionaries/vi"),
      es: () => import("./dictionaries/es"),
      it: () => import("./dictionaries/it"),
      pt: () => import("./dictionaries/pt"),
      hu: () => import("./dictionaries/hu"),
    };
  }
  return lazyDictionaries;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  if (dictionaries[locale]) return dictionaries[locale];

  const lazy = getLazyDictionaries();
  const loader = lazy[locale];
  if (loader) {
    const mod = await loader();
    dictionaries[locale] = mod.default;
    return mod.default;
  }

  return en;
}
