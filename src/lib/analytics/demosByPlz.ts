import { Demo } from "@/lib/types";

export interface PlzCount {
  plz: string;
  count: number;
}

export function computeDemosByPlz(demos: Demo[], topN: number = 20): PlzCount[] {
  const counts = new Map<string, number>();

  for (const demo of demos) {
    if (demo.plz) {
      counts.set(demo.plz, (counts.get(demo.plz) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([plz, count]) => ({ plz, count }));
}
