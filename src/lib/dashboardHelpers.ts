import { DEFAULT_TRAVEL_RATE_PER_KM, DEFAULT_VAT_RATE } from "@/lib/rates";

/** Gedeelde dashboard helpers — gebruik in uren, facturatie, financiën en risico. */

export function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/** Alias voor formatCurrency — backwards compatible met uren/settings. */
export const formatEuro = formatCurrency;

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHours(hours: number): string {
  return `${roundToTwo(hours).toFixed(2)} u`;
}

export function formatPercentage(value: number): string {
  return `${roundToTwo(value).toFixed(1)}%`;
}

export function calculateVat(subtotalExVat: number, rate = DEFAULT_VAT_RATE): number {
  return roundToTwo(subtotalExVat * (rate / 100));
}

export function calculateMargin(
  clientRate: number,
  crewRate: number,
): { margin: number; marginPercent: number } | null {
  if (crewRate <= 0 || clientRate <= 0) return null;
  const margin = roundToTwo(clientRate - crewRate);
  const marginPercent = roundToTwo((margin / clientRate) * 100);
  return { margin, marginPercent };
}

export function calculateTravelCost(
  kilometers: number,
  ratePerKm = DEFAULT_TRAVEL_RATE_PER_KM,
  returnTrip = false,
): number {
  const km = returnTrip ? kilometers * 2 : kilometers;
  return roundToTwo(km * ratePerKm);
}

export type StatusColorClasses = {
  badge: string;
};

/**
 * Consistente statuskleuren per module.
 * Concept=grijs, Open/Ingediend=blauw, Goedgekeurd/Betaald/Afgerond=groen,
 * Afgekeurd/Mislukt/Te laat/Kritiek=rood, Wacht op reactie=oranje, Gepland=paars.
 */
export function getStatusColor(status: string): StatusColorClasses {
  const map: Record<string, string> = {
    // Grijs — concept / nieuw
    Concept: "border-slate-200 bg-slate-100 text-slate-600",
    Nieuw: "border-slate-200 bg-slate-100 text-slate-600",
    Geparkeerd: "border-slate-200 bg-slate-100 text-slate-600",
    // Blauw — open / ingediend / klaar
    Open: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    Ingediend: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    "In behandeling": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    "Klaar om te versturen": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    "Klaar voor Moneybird": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    Bevestigd: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    Verzonden: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    // Groen — afgerond / goedgekeurd / betaald
    Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
    Afgerond: "border-green-200 bg-green-50 text-green-700",
    Betaald: "border-green-200 bg-green-50 text-green-700",
    Beantwoord: "border-green-200 bg-green-50 text-green-700",
    Gefactureerd: "border-green-200 bg-green-50 text-green-700",
    Actief: "border-green-200 bg-green-50 text-green-700",
    // Rood — fout / afgekeurd / kritiek
    Afgekeurd: "border-red-200 bg-red-50 text-red-700",
    Mislukt: "border-red-200 bg-red-50 text-red-700",
    "Te laat": "border-red-200 bg-red-50 text-red-700",
    Kritiek: "border-red-200 bg-red-50 text-red-700",
    Geblokkeerd: "border-red-200 bg-red-50 text-red-700",
    Geannuleerd: "border-red-200 bg-red-50 text-red-700",
    // Oranje — wacht op reactie
    "Wacht op reactie": "border-orange-200 bg-orange-50 text-orange-700",
    Openstaand: "border-orange-200 bg-orange-50 text-orange-700",
    // Paars / donkerblauw — gepland / voorbereid
    Gepland: "border-violet-200 bg-violet-50 text-violet-700",
    Voorbereid: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
    "In uitvoering": "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
    "Aangemaakt in Moneybird": "border-violet-200 bg-violet-50 text-violet-700",
  };

  return {
    badge: map[status] ?? "border-slate-200 bg-slate-100 text-slate-600",
  };
}

export function getPriorityColor(priority: string): StatusColorClasses {
  const map: Record<string, string> = {
    Laag: "border-slate-200 bg-slate-100 text-slate-600",
    Normaal: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
    Hoog: "border-orange-200 bg-orange-50 text-orange-700",
    Spoed: "border-red-200 bg-red-50 text-red-700",
    Kritiek: "border-red-200 bg-red-50 text-red-700",
  };
  return {
    badge: map[priority] ?? "border-slate-200 bg-slate-100 text-slate-600",
  };
}
