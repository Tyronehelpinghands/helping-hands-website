export const siteConfig = {
  name: "Helping Hands Agency",
  shortName: "Helping Hands",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.helpinghandsagency.nl",
  /** Algemene vragen */
  email: "info@helpinghandsagency.nl" as string,
  /** Personeels- / crewaanvragen (opdrachtgevers) */
  planningEmail: "planning@helpinghandsagency.nl" as string,
  /** Planner (Mesbah) — planning & inzet */
  plannerEmail: "mesbah@helpinghandsagency.nl" as string,
  /** Crewaanmeldingen & sollicitaties */
  applicationsEmail: "aanmeldingen@helpinghandsagency.nl" as string,
  /** H&R-manager (Marieke) — HR / personeelszaken */
  hrEmail: "marieke@helpinghandsagency.nl" as string,
  /** Direct contact (eigenaar / operationeel) */
  ownerEmail: "tyrone@helpinghandsagency.nl" as string,
  /** Primary Helping Hands mobile (WhatsApp-capable) */
  phone: "0657416338" as string,
  phoneDisplay: "06 5741 6338" as string,
  phoneTel: "+31657416338" as string,
  /** WhatsApp deep link for primary mobile */
  whatsappUrl: "https://wa.me/31657416338" as string,
  /** Vaste lijn (Hilversum) */
  phoneLandline: "0357857307" as string,
  phoneLandlineDisplay: "035 785 7307" as string,
  phoneLandlineTel: "+31357857307" as string,
  phoneLandlineDisplayIntl: "+31 35 785 7307" as string,
  address: {
    street: "Wandelpad 30",
    postalCode: "1211 GN",
    city: "Hilversum",
    country: "Nederland",
    countryCode: "NL",
  },
  kvk: "88091333" as string,
  vat: "NL004540573B46" as string,
  /** Alleen tonen in footer/contact legal — niet op marketing-hero */
  iban: "NL59 INGB 0107 7286 13" as string,
  locale: "nl_NL",
  /** Organization / LocalBusiness logo in JSON-LD — not the social share image. */
  logo: "/images/brand/helping-hands-logo.png",
  /** Default Open Graph / Twitter image (1200×630 crop). */
  defaultOgImage: "/images/crew/concert-globe-stage.webp",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  description:
    "Helping Hands Agency: event crew, stagehands en horecapersoneel inhuren voor festivals, stadions, beurzen, concerten en horeca. Snelle planning, heldere briefing, één aanspreekpunt vanuit Hilversum.",
  /** Google Maps search URL for NAP / GBP support (no fake reviews). */
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Helping%20Hands%20Agency%20Wandelpad%2030%20Hilversum" as string,
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatAddressSingleLine(
  address = siteConfig.address,
): string {
  return `${address.street}, ${address.postalCode} ${address.city}`;
}
