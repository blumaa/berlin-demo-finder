"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "@/i18n";
import { GlobeIcon, ChevronUpIcon } from "@/components/ui/icons";

export function LanguagePicker({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (l: Locale) => {
      setLocale(l);
      setOpen(false);
    },
    [setLocale]
  );

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={LOCALE_NAMES[locale]}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <GlobeIcon />
        <span className="text-xs font-medium text-gray-700">
          <span className="md:hidden">{locale.toUpperCase()}</span>
          <span className="hidden md:inline">{LOCALE_NAMES[locale]}</span>
        </span>
        <ChevronUpIcon size={10} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full end-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px] z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Language"
        >
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              lang={l}
              onClick={() => handleSelect(l)}
              className={`block w-full text-start px-3 py-2 text-sm min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
                l === locale
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
