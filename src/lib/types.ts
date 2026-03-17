export interface Demo {
  id: string;
  date: string; // YYYY-MM-DD
  time_from: string; // HH:MM
  time_to: string | null;
  topic: string;
  plz: string;
  location: string;
  lat: number | null;
  lng: number | null;
  route_text: string | null;
  route_json: RouteJson | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface RawScrapedDemo {
  date: string; // YYYY-MM-DD
  time_from: string; // HH:MM
  time_to: string | null;
  topic: string;
  plz: string;
  location: string;
  route_text: string | null;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

export interface DemoTranslation {
  demo_id: string;
  locale: string;
  topic: string;
}

export interface GeocodeCacheEntry {
  id: string;
  address_key: string;
  lat: number;
  lng: number;
  formatted_address: string;
  created_at: string;
}

export interface RouteWaypoint {
  type: "AP" | "ZK" | "EP" | "unknown";
  street: string;
  lat?: number;
  lng?: number;
}

export interface RouteJson {
  waypoints: RouteWaypoint[];
  encoded_polyline: string | null;
}

export type EventType = "march" | "rally";

export type TopicCategory =
  | "Housing"
  | "Climate"
  | "International Solidarity"
  | "Anti-Fascism"
  | "Labor"
  | "Commemoration"
  | "Gender & LGBTQ+"
  | "Other";

export interface CategoryConfig {
  color: string;
  icon: string;
}

export const CATEGORY_CONFIG: Record<TopicCategory, CategoryConfig> = {
  Housing: {
    color: "#CC2936",
    icon: "M3 10.5L12 3l9 7.5V21H3V10.5Z",
  },
  Climate: {
    color: "#06D6A0",
    icon: "M17 8C8 10 5.9 16.09 3.82 18.18M8.5 2.5s4.5 5 2.5 10c-2 5-7 6-7 6",
  },
  "International Solidarity": {
    color: "#1D4ED8",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z",
  },
  "Anti-Fascism": {
    color: "#7B2D8E",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  },
  Labor: {
    color: "#F77F00",
    icon: "M16 20V4H8v16M2 20h20M6 12h2M6 8h2",
  },
  Commemoration: {
    color: "#4A4E69",
    icon: "M12 2v8m0 0c-1.5 0-4 1-4 4v8h8v-8c0-3-2.5-4-4-4Z",
  },
  "Gender & LGBTQ+": {
    color: "#D946A8",
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z",
  },
  Other: {
    color: "#6C757D",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
  },
};

import type { TranslationKey } from "@/i18n/types";

export const CATEGORY_TRANSLATION_KEYS: Record<TopicCategory, TranslationKey> = {
  Housing: "category.Housing",
  Climate: "category.Climate",
  "International Solidarity": "category.InternationalSolidarity",
  "Anti-Fascism": "category.AntiFascism",
  Labor: "category.Labor",
  Commemoration: "category.Commemoration",
  "Gender & LGBTQ+": "category.GenderLGBTQ",
  Other: "category.Other",
};

export const ALL_CATEGORIES: TopicCategory[] = [
  "Housing",
  "Climate",
  "International Solidarity",
  "Anti-Fascism",
  "Labor",
  "Commemoration",
  "Gender & LGBTQ+",
  "Other",
];
