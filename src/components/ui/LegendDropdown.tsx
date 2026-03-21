"use client";

import { useState } from "react";
import { TopicCategory, EventType, CATEGORY_CONFIG, ALL_CATEGORIES, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import { LayersIcon, ChevronUpIcon } from "@/components/ui/icons";
import type { TranslationKey } from "@/i18n/types";

interface LegendDropdownProps {
  t: (key: TranslationKey) => string;
  filterCount: number;
  categories: TopicCategory[];
  eventTypes: EventType[];
  toggleCategory: (cat: TopicCategory) => void;
  toggleEventType: (type: EventType) => void;
}

export function LegendDropdown({
  t,
  filterCount,
  categories,
  eventTypes,
  toggleCategory,
  toggleEventType,
}: LegendDropdownProps) {
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
