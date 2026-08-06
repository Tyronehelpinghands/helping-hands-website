/** UI + sync: lokaal concept wijkt af van Moneybird na urenwijziging. */
export const OUTDATED_MONEYBIRD_DRAFT_MSG =
  "Concept verouderd — vernieuw vanuit uren";

/** Grootboekcategorieën voor Moneybird factuurregels. */
export type MoneybirdLedgerCategory = "sitecrew" | "horeca" | "km" | "default";

/**
 * Bepaalt grootboekcategorie op basis van factuurregel-omschrijving / roltekst.
 * Sitecrew: stagehands, site crew, event crew, productie, logistiek, arbeidsuren.
 * Horeca: horeca, bar, keuken, hospitality, restaurant.
 * KM: kilometervergoeding.
 */
export function detectMoneybirdLedgerCategory(
  text: string,
): MoneybirdLedgerCategory {
  const hay = text.toLowerCase().replace(/\s+/g, " ");

  if (
    hay.includes("kilometervergoeding") ||
    hay.includes("kilometer vergoeding") ||
    /\b\d+([.,]\d+)?\s*km\b/.test(hay) ||
    (hay.includes("kilometer") && hay.includes("vergoeding"))
  ) {
    return "km";
  }

  if (
    hay.includes("horeca") ||
    hay.includes("hospitality") ||
    /\bbar\b/.test(hay) ||
    hay.includes("keuken") ||
    hay.includes("restaurant")
  ) {
    return "horeca";
  }

  if (
    hay.includes("sitecrew") ||
    hay.includes("site crew") ||
    hay.includes("stagehand") ||
    hay.includes("event crew") ||
    hay.includes("productie") ||
    hay.includes("logistiek") ||
    hay.includes("arbeidsuren") ||
    hay.includes("reistijd")
  ) {
    return "sitecrew";
  }

  return "default";
}
