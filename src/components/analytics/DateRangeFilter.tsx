"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

export function DateRangeFilter() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateFrom = searchParams.get("from") || "";
  const dateTo = searchParams.get("to") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label className="flex items-center gap-1 text-sm text-gray-700">
        <span>{t("filters.from")}</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => updateParam("from", e.target.value)}
          className="rounded border border-gray-200 px-2 py-1.5 text-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
        />
      </label>
      <label className="flex items-center gap-1 text-sm text-gray-700">
        <span>{t("filters.to")}</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => updateParam("to", e.target.value)}
          className="rounded border border-gray-200 px-2 py-1.5 text-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
        />
      </label>
    </div>
  );
}
