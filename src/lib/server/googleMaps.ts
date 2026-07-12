// Server-only Google Maps helper. Niet importeren in client components.

const DISTANCE_MATRIX_URL =
  "https://maps.googleapis.com/maps/api/distancematrix/json";

export function getGoogleMapsApiKey(): string | undefined {
  const raw = process.env.GOOGLE_MAPS_API_KEY?.trim();
  return raw || undefined;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

type DistanceMatrixResponse = {
  status: string;
  error_message?: string;
  rows?: Array<{
    elements?: Array<{
      status: string;
      distance?: { value: number; text: string };
      duration?: { value: number; text: string };
    }>;
  }>;
};

export async function testGoogleMapsConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  message: string;
}> {
  const key = getGoogleMapsApiKey();
  if (!key) {
    return {
      ok: false,
      configured: false,
      message:
        "GOOGLE_MAPS_API_KEY is niet geconfigureerd op de server (Vercel env).",
    };
  }

  try {
    const url = new URL(DISTANCE_MATRIX_URL);
    url.searchParams.set("origins", "Arnhem, Nederland");
    url.searchParams.set("destinations", "Amsterdam, Nederland");
    url.searchParams.set("key", key);
    url.searchParams.set("language", "nl");

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    const data = (await res.json()) as DistanceMatrixResponse;

    if (data.status === "OK") {
      return {
        ok: true,
        configured: true,
        message: "Google Maps Distance Matrix API is bereikbaar.",
      };
    }

    if (data.status === "REQUEST_DENIED") {
      return {
        ok: false,
        configured: true,
        message:
          data.error_message ??
          "Google Maps API key geweigerd. Controleer key en ingeschakelde APIs.",
      };
    }

    return {
      ok: false,
      configured: true,
      message: `Google Maps API status: ${data.status}`,
    };
  } catch {
    return {
      ok: false,
      configured: true,
      message: "Verbinding met Google Maps API mislukt.",
    };
  }
}

export async function calculateKilometersBetween(
  fromAddress: string,
  toAddress: string,
): Promise<{
  ok: boolean;
  kilometers?: number;
  oneWayKm?: number;
  returnKm?: number;
  message?: string;
}> {
  const key = getGoogleMapsApiKey();
  if (!key) {
    return {
      ok: false,
      message: "GOOGLE_MAPS_API_KEY is niet geconfigureerd.",
    };
  }

  const from = fromAddress.trim();
  const to = toAddress.trim();
  if (!from || !to) {
    return {
      ok: false,
      message: "Vertrek- en bestemmingsadres zijn verplicht.",
    };
  }

  try {
    const url = new URL(DISTANCE_MATRIX_URL);
    url.searchParams.set("origins", from);
    url.searchParams.set("destinations", to);
    url.searchParams.set("key", key);
    url.searchParams.set("language", "nl");
    url.searchParams.set("units", "metric");

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    const data = (await res.json()) as DistanceMatrixResponse;

    if (data.status !== "OK") {
      return {
        ok: false,
        message:
          data.error_message ?? `Google Maps API: ${data.status}`,
      };
    }

    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK" || !element.distance) {
      return {
        ok: false,
        message: "Geen route gevonden tussen de opgegeven adressen.",
      };
    }

    const oneWayKm = Math.round((element.distance.value / 1000) * 10) / 10;
    const returnKm = Math.round(oneWayKm * 2 * 10) / 10;

    return {
      ok: true,
      kilometers: oneWayKm,
      oneWayKm,
      returnKm,
      message: `${oneWayKm} km (enkele reis)`,
    };
  } catch {
    return {
      ok: false,
      message: "Kilometerberekening via Google Maps mislukt.",
    };
  }
}
