export const siteConfig = {
  name: "Helping Hands Agency",
  shortName: "Helping Hands",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://helpinghandsagency.nl",
  /** Publiek contact voor aanvragen en algemene vragen */
  email: "info@helpinghandsagency.nl" as string,
  applicationsEmail: "aanmeldingen@helpinghandsagency.nl" as string,
  /** Direct contact (eigenaar / operationeel) */
  ownerEmail: "tyrone@helpinghandsagency.nl" as string,
  /** Raw NL mobile digits for formatting helpers */
  phone: "0686349036" as string,
  phoneDisplay: "06 8634 9036" as string,
  phoneTel: "+31686349036" as string,
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
  defaultOgImage: "/images/brand/helping-hands-logo.png",
  description:
    "Huur event crew, stagehands en horecapersoneel in voor festivals, stadions, beurzen, concerten en restaurants. Helping Hands Agency: snelle planning, heldere briefing, één aanspreekpunt.",
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
