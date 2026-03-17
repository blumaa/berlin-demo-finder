"use client";

import { ALL_CATEGORIES, CATEGORY_CONFIG, TopicCategory, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import type { TranslationKey } from "@/i18n/types";

interface FilterFormFieldsProps {
  categories: TopicCategory[];
  dateFrom: string;
  dateTo: string;
  keyword: string;
  plz: string;
  allSelected: boolean;
  activeFilterCount: number;
  onToggleCategory: (cat: TopicCategory) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onPlzChange: (value: string) => void;
  onClearAll: () => void;
  t: (key: TranslationKey) => string;
  compact?: boolean;
}

function CategoryChips({
  categories,
  t,
  onToggle,
}: {
  categories: TopicCategory[];
  t: (key: TranslationKey) => string;
  onToggle: (cat: TopicCategory) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {ALL_CATEGORIES.map((cat) => {
        const config = CATEGORY_CONFIG[cat];
        const active = categories.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] focus-visible:ring-2 focus-visible:ring-blue-600 ${
              active
                ? "text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={active ? { backgroundColor: config.color } : undefined}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: active ? "white" : config.color }}
            />
            {t(CATEGORY_TRANSLATION_KEYS[cat])}
          </button>
        );
      })}
    </div>
  );
}

export function FilterFormFields({
  categories,
  dateFrom,
  dateTo,
  keyword,
  plz,
  allSelected,
  activeFilterCount,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  onDateFromChange,
  onDateToChange,
  onKeywordChange,
  onPlzChange,
  onClearAll,
  t,
  compact = false,
}: FilterFormFieldsProps) {
  const inputClass = compact
    ? "mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-blue-600"
    : "mt-0.5 block w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm min-h-[44px]";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <CategoryChips categories={categories} t={t} onToggle={onToggleCategory} />
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="shrink-0 text-[10px] font-medium text-gray-500 hover:text-gray-700 transition-colors px-1.5 py-0.5"
        >
          {allSelected ? "−" : "+"} All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs text-gray-700">{t("filters.from")}</span>
          <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-xs text-gray-700">{t("filters.to")}</span>
          <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-gray-700">{t("filters.keyword")}</span>
        <input type="text" value={keyword} onChange={(e) => onKeywordChange(e.target.value)} placeholder={t("filters.keywordPlaceholder")} className={inputClass} />
      </label>
      <label className="block">
        <span className="text-xs text-gray-700">{t("filters.plz")}</span>
        <input type="text" value={plz} onChange={(e) => onPlzChange(e.target.value)} placeholder="10115" maxLength={5} className={inputClass} />
      </label>
      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className={compact
            ? "w-full text-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            : "w-full text-center text-sm font-medium text-gray-700 bg-gray-100 active:bg-gray-200 rounded-lg py-2.5 min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
          }
        >
          {t("filters.clearAll")}
        </button>
      )}
    </div>
  );
}
