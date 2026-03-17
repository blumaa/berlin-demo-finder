"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Locale, TranslationKey } from "@/i18n/types";
import { getDictionary, loadDictionary, isRTL, SUPPORTED_LOCALES } from "@/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "locale";

function detectClientLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  const browserLang = navigator.language.split("-")[0];
  if (SUPPORTED_LOCALES.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dict, setDict] = useState(() => getDictionary("en"));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      const clientLocale = detectClientLocale();
      if (clientLocale !== "en") {
        setLocaleState(clientLocale);
      }
      setHydrated(true);
    }
  }, [hydrated]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  useEffect(() => {
    loadDictionary(locale).then(setDict);
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey): string => dict[key] ?? key,
    [dict]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}

/** @deprecated Use useTranslation() instead */
export function useLanguage(): { language: Locale; setLanguage: (l: Locale) => void } {
  const { locale, setLocale } = useTranslation();
  return { language: locale, setLanguage: setLocale };
}
