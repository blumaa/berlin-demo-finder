"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/lib/types";
import { useTranslation } from "@/contexts/LanguageContext";
import { useFilterState, useFilterActions } from "@/contexts/FilterContext";
import { FilterFormFields } from "./FilterFormFields";
import { FilterIcon, ChevronUpIcon } from "@/components/ui/icons";

interface MapFiltersProps {
  onExpand: () => void;
  demoCount: number;
}

export function MapFilters({ onExpand, demoCount }: MapFiltersProps) {
  const { t } = useTranslation();
  const { categories, eventTypes, dateFrom, dateTo, keyword, plz } = useFilterState();
  const {
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    setDateFrom,
    setDateTo,
    setKeyword,
    setPlz,
    clearAll,
  } = useFilterActions();

  const allSelected = categories.length === ALL_CATEGORIES.length;
  const [expanded, setExpanded] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  const activeFilterCount =
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (keyword ? 1 : 0) +
    (plz ? 1 : 0) +
    categories.length +
    eventTypes.length;

  const formFieldsProps = {
    categories,
    dateFrom,
    dateTo,
    keyword,
    plz,
    allSelected,
    activeFilterCount,
    onToggleCategory: toggleCategory,
    onSelectAll: selectAllCategories,
    onDeselectAll: deselectAllCategories,
    onDateFromChange: setDateFrom,
    onDateToChange: setDateTo,
    onKeywordChange: setKeyword,
    onPlzChange: setPlz,
    onClearAll: clearAll,
    t,
  };

  return (
    <>
      {/* Mobile: bottom sheet */}
      <div
        className={`fixed bottom-0 inset-inline-0 bg-white/[0.97] border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden ${expanded ? "z-30 rounded-t-2xl" : "z-10"}`}
        role="region"
        aria-label={t("filters.title")}
      >
        <div className="w-full px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => {
              const next = !expanded;
              setExpanded(next);
              if (next) onExpand();
            }}
            aria-expanded={expanded}
            className="flex items-center gap-2 h-full pe-4 focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            <FilterIcon />
            <span className="text-sm font-medium text-gray-900">{t("filters.title")}</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronUpIcon size={16} className={`text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <span className="text-xs font-medium text-gray-700" role="status" aria-live="polite">
            {demoCount} {t("filters.results")}
          </span>
        </div>

        <div
          className={`transition-[grid-template-rows,opacity] duration-200 grid ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 overflow-y-auto max-h-[60vh]">
              <FilterFormFields {...formFieldsProps} />
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-[29] bg-black/20 md:hidden" onClick={() => setExpanded(false)} aria-hidden="true" />
      )}

      {/* Desktop: collapsible floating panel */}
      <div className="hidden md:block absolute top-16 start-4 z-10">
        <button
          onClick={() => {
            const next = !desktopExpanded;
            setDesktopExpanded(next);
            if (next) onExpand();
          }}
          aria-expanded={desktopExpanded}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.97] border border-gray-200 shadow-lg hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <FilterIcon />
          <span className="text-sm font-medium text-gray-900">{t("filters.title")}</span>
          <span className="text-xs text-gray-500">{demoCount}</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronUpIcon size={12} className={`text-gray-400 transition-transform ${desktopExpanded ? "rotate-180" : ""}`} />
        </button>

        {desktopExpanded && (
          <div className="mt-1.5 w-80 rounded-lg bg-white/[0.97] border border-gray-200 shadow-lg p-4">
            <FilterFormFields {...formFieldsProps} compact />
          </div>
        )}
      </div>
    </>
  );
}
