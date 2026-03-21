"use client";

import { Suspense, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Demo, TopicCategory, EventType, CATEGORY_CONFIG, ALL_CATEGORIES, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import { MapPageClient } from "@/components/map/MapPageClient";
import { AnalyticsDashboard } from "@/app/analytics/AnalyticsDashboard";
import { Nav } from "@/components/ui/Nav";
import { useTranslation } from "@/contexts/LanguageContext";
import { FilterProvider, useFilterState, useFilterActions } from "@/contexts/FilterContext";
import { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "@/i18n";
import { GlobeIcon, ChevronUpIcon, LayersIcon, EllipsisVerticalIcon } from "@/components/ui/icons";
import Link from "next/link";

interface AppShellProps {
  allDemos: Demo[];
  lastUpdated?: string;
  cutoffDate: string;
}

export function AppShell({ allDemos, lastUpdated, cutoffDate }: AppShellProps) {
  return (
    <FilterProvider>
      <AppShellInner allDemos={allDemos} lastUpdated={lastUpdated} cutoffDate={cutoffDate} />
    </FilterProvider>
  );
}

function AppShellInner({ allDemos, lastUpdated, cutoffDate }: AppShellProps) {
  const pathname = usePathname();
  const isAnalytics = pathname === "/analytics";
  const isLogo = pathname === "/logo";
  const isStandalonePage = pathname === "/about" || pathname === "/privacy";
  const { locale, setLocale, t } = useTranslation();
  const { categories, eventTypes } = useFilterState();
  const { toggleCategory, toggleEventType } = useFilterActions();

  const mapDemos = useMemo(() => {
    return allDemos.filter((d) => d.date >= cutoffDate);
  }, [allDemos, cutoffDate]);

  const filterCount = categories.length + eventTypes.length;

  const showMap = !isAnalytics && !isLogo && !isStandalonePage;
  const showAnalytics = isAnalytics && !isLogo;
  const showLegend = showMap;

  return (
    <>
      <Nav>
        {/* Language picker */}
        <LanguagePicker locale={locale} setLocale={setLocale} />

        {/* Info menu */}
        <InfoMenu />

        {/* Legend toggle — only on map view */}
        {showLegend && <LegendDropdown t={t} filterCount={filterCount} categories={categories} eventTypes={eventTypes} toggleCategory={toggleCategory} toggleEventType={toggleEventType} />}
      </Nav>

      <div className={showMap ? "contents" : "hidden"}>
        <MapPageClient demos={mapDemos} />
      </div>
      <div className={showAnalytics ? "contents" : "hidden"}>
        <Suspense>
          <AnalyticsDashboard demos={allDemos} lastUpdated={lastUpdated} />
        </Suspense>
      </div>
      {isLogo && (
        <div className="flex items-center justify-center min-h-screen pt-12">
          <img src="/icon.svg" alt="Berlin Demo Finder logo" className="w-64 h-auto" />
        </div>
      )}
    </>
  );
}

function LanguagePicker({
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

function LegendDropdown({
  t,
  filterCount,
  categories,
  eventTypes,
  toggleCategory,
  toggleEventType,
}: {
  t: (key: import("@/i18n/types").TranslationKey) => string;
  filterCount: number;
  categories: TopicCategory[];
  eventTypes: EventType[];
  toggleCategory: (cat: TopicCategory) => void;
  toggleEventType: (type: EventType) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={t("legend.label")}
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <LayersIcon />
        {filterCount > 0 && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold">
            {filterCount}
          </span>
        )}
        <ChevronUpIcon size={10} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2.5 min-w-[160px] z-50">
          {/* Event type */}
          <div className="space-y-0.5 mb-2">
            <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
              {t("legend.type")}
            </span>
            {(["march", "rally"] as const).map((type) => {
              const isActive = eventTypes.length === 0 || eventTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  aria-pressed={eventTypes.includes(type)}
                  className={`flex items-center gap-2 w-full text-start rounded px-1.5 py-0.5 transition-opacity hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive ? "opacity-100" : "opacity-40"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
                    {type === "march" ? (
                      <rect x="4" y="4" width="16" height="16" rx="2" fill="#6B7280" stroke="white" strokeWidth="1.5" transform="rotate(45 12 12)" />
                    ) : (
                      <circle cx="12" cy="12" r="9" fill="#6B7280" stroke="white" strokeWidth="1.5" />
                    )}
                  </svg>
                  <span className="text-xs text-gray-700">
                    {type === "march" ? t("legend.march") : t("legend.rally")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div className="border-t border-gray-200 pt-1.5 space-y-0.5">
            <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
              {t("legend.category")}
            </span>
            {ALL_CATEGORIES.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const isActive = categories.length === 0 || categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={categories.includes(cat)}
                  className={`flex items-center gap-2 w-full text-start rounded px-1.5 py-0.5 transition-opacity hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive ? "opacity-100" : "opacity-40"}`}
                >
                  <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                  <span className="text-xs text-gray-700">
                    {t(CATEGORY_TRANSLATION_KEYS[cat])}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
        aria-label="More info"
        className="flex items-center justify-center px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <EllipsisVerticalIcon size={16} />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px] z-50">
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block w-full text-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="block w-full text-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center"
          >
            {t("nav.privacy")}
          </Link>
        </div>
      )}
    </div>
  );
}
