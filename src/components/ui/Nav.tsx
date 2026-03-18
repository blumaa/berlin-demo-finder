"use client";

import Link from "next/link";
import { ReactNode, useCallback, useMemo } from "react";
import { useFilterState, useFilterActions } from "@/contexts/FilterContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { getToday, getWeekRange } from "@/lib/datePresets";


interface NavProps {
  children?: ReactNode;
}

export function Nav({ children }: NavProps) {
  const { dateFrom, dateTo } = useFilterState();
  const { setDateFrom, setDateTo } = useFilterActions();
  const { t } = useTranslation();

  const today = useMemo(() => getToday(), []);
  const week = useMemo(() => getWeekRange(), []);

  const isTodayActive = dateFrom === today && dateTo === today;
  const isWeekActive = dateFrom === week.from && dateTo === week.to;

  const handleToday = useCallback(() => {
    if (isTodayActive) {
      setDateFrom("");
      setDateTo("");
    } else {
      setDateFrom(today);
      setDateTo(today);
    }
  }, [isTodayActive, today, setDateFrom, setDateTo]);

  const handleWeek = useCallback(() => {
    if (isWeekActive) {
      setDateFrom("");
      setDateTo("");
    } else {
      setDateFrom(week.from);
      setDateTo(week.to);
    }
  }, [isWeekActive, week, setDateFrom, setDateTo]);

  const todayButton = (active: boolean, floating?: boolean) => (
    <button
      onClick={handleToday}
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : `border border-gray-300 text-gray-600 active:bg-gray-100 ${floating ? "bg-white" : ""}`
      } ${floating ? "shadow-sm" : ""}`}
    >
      {t("nav.today")}
    </button>
  );

  const weekButton = (active: boolean, floating?: boolean) => (
    <button
      onClick={handleWeek}
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : `border border-gray-300 text-gray-600 active:bg-gray-100 ${floating ? "bg-white" : ""}`
      } ${floating ? "shadow-sm" : ""}`}
    >
      {t("nav.thisWeek")}
    </button>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.97] border-b border-gray-200">
        <div className="flex items-center justify-between h-11 px-3 md:px-6 md:h-12">
          <Link href="/" className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm leading-none whitespace-nowrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" className="w-4 h-6 shrink-0" aria-hidden="true" />
            Berlin Demo Finder
          </Link>
          <div className="flex items-center gap-1.5">
            {children}
          </div>
        </div>
      </nav>
      {/* Mobile only: pills floating over the map */}
      <div className="fixed top-[54px] left-3 z-40 flex items-center gap-1.5 md:hidden">
        {todayButton(isTodayActive, true)}
        {weekButton(isWeekActive, true)}
      </div>
    </>
  );
}
