import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { geocodeWithCache } from "@/lib/geocoder/geocodeWithCache";
import { getDirectionsPolyline } from "@/lib/geocoder/directions";
import { parseRoute } from "@/lib/scraper/parseRoute";
import { verifyBearerToken } from "@/lib/auth/verifyBearerToken";
import { RouteJson } from "@/lib/types";

export const maxDuration = 60;

const BATCH_SIZE = 10;
const GEOCODE_CONCURRENCY = 5;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!verifyBearerToken(authHeader, process.env.CRON_SECRET ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch batch of ungeocoded demos
  const { data: ungeocodedDemos } = await supabase
    .from("demos")
    .select("id, location, plz, route_text")
    .is("lat", null)
    .neq("location", "")
    .limit(BATCH_SIZE) as {
    data: {
      id: string;
      location: string;
      plz: string;
      route_text: string | null;
    }[] | null;
  };

  if (!ungeocodedDemos || ungeocodedDemos.length === 0) {
    return NextResponse.json({ geocoded: 0, remaining: 0 });
  }

  // Count total remaining (including this batch)
  const { data: allUngeocoded } = await supabase
    .from("demos")
    .select("id")
    .is("lat", null)
    .neq("location", "") as { data: { id: string }[] | null; error: unknown };

  const totalRemaining = allUngeocoded?.length ?? 0;

  let geocoded = 0;
  const errors: string[] = [];

  // Process in sub-batches for concurrency control
  for (let i = 0; i < ungeocodedDemos.length; i += GEOCODE_CONCURRENCY) {
    const batch = ungeocodedDemos.slice(i, i + GEOCODE_CONCURRENCY);
    await Promise.all(
      batch.map(async (demo) => {
        try {
          const geo = await geocodeWithCache(demo.location, demo.plz);
          if (!geo) return;

          geocoded++;

          // Parse and geocode route if present
          let routeJson: RouteJson | null = null;
          if (demo.route_text) {
            const waypoints = parseRoute(demo.route_text);
            if (waypoints && waypoints.length >= 2) {
              const geocodedWaypoints = await Promise.all(
                waypoints.map(async (wp) => {
                  const wpGeo = await geocodeWithCache(wp.street, demo.plz);
                  return { ...wp, lat: wpGeo?.lat, lng: wpGeo?.lng };
                })
              );

              const validCoords = geocodedWaypoints.filter(
                (wp) => wp.lat != null && wp.lng != null
              );
              let encodedPolyline: string | null = null;
              if (validCoords.length >= 2) {
                encodedPolyline = await getDirectionsPolyline(
                  validCoords.map((wp) => ({ lat: wp.lat!, lng: wp.lng! }))
                );
              }

              routeJson = {
                waypoints: geocodedWaypoints,
                encoded_polyline: encodedPolyline,
              };
            }
          }

          const { error } = await supabase
            .from("demos")
            .update({
              lat: geo.lat,
              lng: geo.lng,
              route_json: routeJson,
            } as never)
            .eq("id", demo.id);

          if (error) {
            errors.push(`Geocode update error: ${error.message}`);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown geocode error";
          errors.push(`Geocode error for ${demo.id}: ${message}`);
        }
      })
    );
  }

  return NextResponse.json({
    geocoded,
    remaining: totalRemaining - geocoded,
    errors: errors.length > 0 ? errors : undefined,
  });
}
