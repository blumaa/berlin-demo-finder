"use client";

import { useQuery } from "@tanstack/react-query";
import type { Demo } from "@/lib/types";

interface DemosResponse {
  demos: Demo[];
  lastUpdated: string;
  cutoffDate: string;
}

async function fetchDemos(): Promise<DemosResponse> {
  const res = await fetch("/api/demos");
  if (!res.ok) throw new Error("Failed to fetch demos");
  return res.json();
}

export function useDemos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["demos"],
    queryFn: fetchDemos,
  });

  return {
    demos: data?.demos ?? [],
    lastUpdated: data?.lastUpdated ?? "",
    cutoffDate: data?.cutoffDate ?? "",
    isLoading,
    error,
  };
}
