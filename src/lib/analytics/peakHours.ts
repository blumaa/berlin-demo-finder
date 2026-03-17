import { Demo } from "@/lib/types";

export interface PeakHoursData {
  /** 7 rows (Mon-Sun) × 24 cols (0-23h), values = count */
  grid: number[][];
  maxCount: number;
}

export function computePeakHours(demos: Demo[]): PeakHoursData {
  // 7 days × 24 hours
  const grid: number[][] = Array.from({ length: 7 }, () =>
    new Array(24).fill(0)
  );

  for (const demo of demos) {
    const date = new Date(demo.date);
    const dayOfWeek = (date.getDay() + 6) % 7; // Monday=0, Sunday=6
    const hour = parseInt(demo.time_from.split(":")[0], 10);
    if (!isNaN(hour) && hour >= 0 && hour < 24) {
      grid[dayOfWeek][hour]++;
    }
  }

  const maxCount = Math.max(...grid.flat());
  return { grid, maxCount };
}
