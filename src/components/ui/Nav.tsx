"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { formatLastUpdated } from "@/lib/format";

interface NavProps {
  children?: ReactNode;
  lastUpdated?: string;
  locale?: string;
}

export function Nav({ children, lastUpdated, locale = "en" }: NavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.97] border-b border-gray-200">
      <div className="px-3 flex items-center justify-between h-11 md:px-4 md:h-12 md:max-w-7xl md:mx-auto">
        <div className="flex flex-col justify-center">
          <Link href="/" className="font-semibold text-gray-900 text-sm leading-tight">
            Berlin Demo Finder
          </Link>
          {lastUpdated && (
            <span className="text-[9px] text-gray-400 leading-tight">
              last update: {formatLastUpdated(lastUpdated, locale)}
            </span>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-1.5">
            {children}
          </div>
        )}
      </div>
    </nav>
  );
}
