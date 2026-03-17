"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { type TopicCategory, type EventType, ALL_CATEGORIES } from "@/lib/types";

interface FilterState {
  categories: TopicCategory[];
  eventTypes: EventType[];
  dateFrom: string;
  dateTo: string;
  keyword: string;
  plz: string;
}

interface FilterActions {
  toggleCategory: (cat: TopicCategory) => void;
  toggleEventType: (type: EventType) => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  setKeyword: (value: string) => void;
  setPlz: (value: string) => void;
  clearAll: () => void;
}

type FilterContextValue = FilterState & FilterActions;

const FilterStateContext = createContext<FilterState | null>(null);
const FilterActionsContext = createContext<FilterActions | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [plz, setPlz] = useState("");

  const toggleCategory = useCallback((cat: TopicCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleEventType = useCallback((type: EventType) => {
    setEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const selectAllCategories = useCallback(() => {
    setCategories([...ALL_CATEGORIES]);
  }, []);

  const deselectAllCategories = useCallback(() => {
    setCategories([]);
  }, []);

  const clearAll = useCallback(() => {
    setCategories([]);
    setEventTypes([]);
    setDateFrom("");
    setDateTo("");
    setKeyword("");
    setPlz("");
  }, []);

  const state = useMemo<FilterState>(() => ({
    categories,
    eventTypes,
    dateFrom,
    dateTo,
    keyword,
    plz,
  }), [categories, eventTypes, dateFrom, dateTo, keyword, plz]);

  const actions = useMemo<FilterActions>(() => ({
    toggleCategory,
    toggleEventType,
    selectAllCategories,
    deselectAllCategories,
    setDateFrom,
    setDateTo,
    setKeyword,
    setPlz,
    clearAll,
  }), [toggleCategory, toggleEventType, selectAllCategories, deselectAllCategories, clearAll]);

  return (
    <FilterStateContext.Provider value={state}>
      <FilterActionsContext.Provider value={actions}>
        {children}
      </FilterActionsContext.Provider>
    </FilterStateContext.Provider>
  );
}

export function useFilterState(): FilterState {
  const ctx = useContext(FilterStateContext);
  if (!ctx) throw new Error("useFilterState must be used within FilterProvider");
  return ctx;
}

export function useFilterActions(): FilterActions {
  const ctx = useContext(FilterActionsContext);
  if (!ctx) throw new Error("useFilterActions must be used within FilterProvider");
  return ctx;
}

/** Combined hook for backward compatibility */
export function useFilters(): FilterContextValue {
  const state = useFilterState();
  const actions = useFilterActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
