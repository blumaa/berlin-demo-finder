import { GeocodeResult } from "@/lib/types";
import { geocode } from "./geocode";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeAddress } from "./normalizeAddress";

export async function geocodeWithCache(
  location: string,
  plz: string
): Promise<GeocodeResult | null> {
  const addressKey = normalizeAddress(location, plz);
  const supabase = createAdminClient();

  // Check cache first
  const { data: cached } = await supabase
    .from("geocode_cache")
    .select("lat, lng, formatted_address")
    .eq("address_key", addressKey)
    .single() as { data: { lat: number; lng: number; formatted_address: string } | null };

  if (cached) {
    return {
      lat: cached.lat,
      lng: cached.lng,
      formatted_address: cached.formatted_address,
    };
  }

  // Call Google API
  const result = await geocode(addressKey);
  if (!result) return null;

  // Store in cache
  await supabase.from("geocode_cache").upsert({
    address_key: addressKey,
    lat: result.lat,
    lng: result.lng,
    formatted_address: result.formatted_address,
  } as never);

  return result;
}
