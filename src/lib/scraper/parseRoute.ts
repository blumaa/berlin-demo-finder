import { RouteWaypoint } from "@/lib/types";

const NOISE_PATTERNS = [
  /\s*->\s*alle\s+\d+\s+Stunden/gi,
  /\s*im\s+Wechsel/gi,
];

const PREFIX_REGEX = /^(AP|ZK|EP):\s*/;

export function parseRoute(routeText: string | null): RouteWaypoint[] | null {
  if (!routeText || routeText.trim() === "") return null;

  let cleaned = routeText;
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  const segments = cleaned
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (segments.length === 0) return null;

  return segments.map((segment) => {
    const prefixMatch = segment.match(PREFIX_REGEX);
    if (prefixMatch) {
      return {
        type: prefixMatch[1] as "AP" | "ZK" | "EP",
        street: segment.replace(PREFIX_REGEX, "").trim(),
      };
    }
    return { type: "unknown" as const, street: segment };
  });
}
