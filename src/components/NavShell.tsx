"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/ui/Nav";
import { useTranslation } from "@/contexts/LanguageContext";
import { useFilterState, useFilterActions } from "@/contexts/FilterContext";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import { LegendDropdown } from "@/components/ui/LegendDropdown";
import { InfoMenu } from "@/components/ui/InfoMenu";

export function NavShell() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useTranslation();
  const { categories, eventTypes } = useFilterState();
  const { toggleCategory, toggleEventType } = useFilterActions();

  const showMap = pathname === "/" || pathname === "";
  const filterCount = categories.length + eventTypes.length;

  return (
    <Nav>
      <LanguagePicker locale={locale} setLocale={setLocale} />
      <InfoMenu />
      {showMap && (
        <LegendDropdown
          t={t}
          filterCount={filterCount}
          categories={categories}
          eventTypes={eventTypes}
          toggleCategory={toggleCategory}
          toggleEventType={toggleEventType}
        />
      )}
    </Nav>
  );
}
