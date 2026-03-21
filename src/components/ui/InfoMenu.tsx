"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";
import { EllipsisVerticalIcon } from "@/components/ui/icons";

export function InfoMenu() {
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
