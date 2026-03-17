import { Demo } from "@/lib/types";

export interface SurgeData {
  plz: string;
  recentCount: number;
  avgCount: number;
  zScore: number;
}

export function computeSurgeDetection(
  demos: Demo[],
  recentDays: number = 30,
  baselineDays: number = 180,
  referenceDate: Date = new Date()
): SurgeData[] {
  const recentCutoff = new Date(referenceDate);
  recentCutoff.setDate(recentCutoff.getDate() - recentDays);

  const baselineCutoff = new Date(referenceDate);
  baselineCutoff.setDate(baselineCutoff.getDate() - baselineDays);

  // Count per PLZ for recent and baseline periods
  const recentCounts = new Map<string, number>();
  const baselineCounts = new Map<string, number>();

  for (const demo of demos) {
    const date = new Date(demo.date);
    if (!demo.plz) continue;

    if (date >= recentCutoff && date <= referenceDate) {
      recentCounts.set(demo.plz, (recentCounts.get(demo.plz) || 0) + 1);
    }
    if (date >= baselineCutoff && date < recentCutoff) {
      baselineCounts.set(demo.plz, (baselineCounts.get(demo.plz) || 0) + 1);
    }
  }

  const allPlzs = new Set([...recentCounts.keys(), ...baselineCounts.keys()]);
  const baselineMonths = (baselineDays - recentDays) / 30;

  const results: SurgeData[] = [];

  for (const plz of allPlzs) {
    const recent = recentCounts.get(plz) || 0;
    const baseline = baselineCounts.get(plz) || 0;
    const avgPerMonth = baselineMonths > 0 ? baseline / baselineMonths : 0;
    const avgForPeriod = avgPerMonth * (recentDays / 30);

    // Simple z-score: (observed - expected) / sqrt(expected) for Poisson-like data
    const stdDev = Math.sqrt(Math.max(avgForPeriod, 1));
    const zScore =
      avgForPeriod > 0 ? (recent - avgForPeriod) / stdDev : recent > 0 ? 2 : 0;

    results.push({
      plz,
      recentCount: recent,
      avgCount: Math.round(avgForPeriod * 10) / 10,
      zScore: Math.round(zScore * 100) / 100,
    });
  }

  return results.sort((a, b) => b.zScore - a.zScore);
}
