interface LatLng {
  lat: number;
  lng: number;
}

export async function getDirectionsPolyline(
  waypoints: LatLng[]
): Promise<string | null> {
  if (waypoints.length < 2) return null;

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
    const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=walking&key=${apiKey}`;

    if (waypoints.length > 2) {
      const intermediate = waypoints
        .slice(1, -1)
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");
      url += `&waypoints=${encodeURIComponent(intermediate)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.routes?.length) {
      return null;
    }

    return data.routes[0].overview_polyline.points;
  } catch {
    return null;
  }
}
