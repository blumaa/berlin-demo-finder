"use client";

import { Demo, CATEGORY_CONFIG, TopicCategory, CATEGORY_TRANSLATION_KEYS } from "@/lib/types";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatDate, formatTime } from "@/lib/format";
import { CloseIcon, ClockIcon, MapPinIcon, NavigateIcon, ShareIcon, ExternalLinkIcon } from "@/components/ui/icons";

interface DemoPopoverProps {
  demo: Demo;
  category: TopicCategory;
  onClose: () => void;
  onShowRoute?: () => void;
}

export function DemoPopover({ demo, category, onClose, onShowRoute }: DemoPopoverProps) {
  const { locale, t } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const config = CATEGORY_CONFIG[category];

  useEffect(() => {
    closeRef.current?.focus();
  }, [demo.id]);

  const handleShare = useCallback(() => {
    const shareUrl = new URL(window.location.origin + "/");
    shareUrl.searchParams.set("demo", demo.id);

    const time = formatTime(demo.time_from, demo.time_to);
    const date = formatDate(demo.date, locale);
    const lines = [
      demo.topic,
      `${date} · ${time}`,
      `${demo.location}, ${demo.plz}`,
    ];
    if (demo.route_text) {
      lines.push(`${t("popover.route")}: ${demo.route_text}`);
    }
    lines.push("", shareUrl.toString());

    const text = lines.join("\n");

    if (navigator.share) {
      navigator.share({ title: demo.topic, text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [demo, locale, t]);

  const mapsUrl =
    demo.lat && demo.lng
      ? `https://www.google.com/maps/?q=${demo.lat},${demo.lng}`
      : null;

  return (
    <div
      className="relative w-full rounded-2xl bg-white shadow-xl border border-gray-200 p-4 md:w-80 md:rounded-lg md:p-3 md:shadow-none md:border-0"
      role="dialog"
      aria-label={demo.topic}
    >
      {/* Close button — 44x44 touch target */}
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-2 end-2 w-11 h-11 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label={t("popover.close")}
      >
        <CloseIcon />
      </button>

      {/* Category badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-xs font-medium text-gray-700">
          {t(CATEGORY_TRANSLATION_KEYS[category])}
        </span>
      </div>

      {/* Topic — full text, scrollable */}
      <h4 className="text-sm font-semibold text-gray-900 pe-10 mb-2 max-h-[30vh] overflow-y-auto">
        {demo.topic}
      </h4>

      {/* Date & time */}
      <p className="inline-flex items-center gap-1.5 text-sm text-amber-800 bg-amber-50 rounded-md px-2 py-0.5 mb-1">
        <ClockIcon />
        {formatDate(demo.date, locale)} · {formatTime(demo.time_from, demo.time_to)}
      </p>

      {/* Location */}
      <p className="inline-flex items-center gap-1.5 text-sm text-slate-700 bg-slate-100 rounded-md px-2 py-0.5 mb-1">
        <MapPinIcon />
        {demo.location}, {demo.plz}
      </p>

      {/* Route text */}
      {demo.route_text && (
        <p className="text-sm text-gray-600 mb-2 italic">{demo.route_text}</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        {onShowRoute && (
          <button
            onClick={onShowRoute}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-gray-100 active:bg-gray-200 rounded-lg px-3 py-2.5 text-gray-700 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 md:hover:bg-gray-200"
          >
            <NavigateIcon />
            {t("popover.route")}
          </button>
        )}

        <button
          onClick={handleShare}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2.5 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 bg-gray-100 active:bg-gray-200 text-gray-700 md:hover:bg-gray-200"
        >
          <ShareIcon />
          {t("popover.share")}
        </button>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-gray-100 active:bg-gray-200 rounded-lg px-3 py-2.5 text-gray-700 transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 md:hover:bg-gray-200"
          >
            <ExternalLinkIcon />
            {t("popover.maps")}
          </a>
        )}
      </div>
    </div>
  );
}
