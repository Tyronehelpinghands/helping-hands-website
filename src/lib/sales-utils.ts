import type { SalesLead } from "@/data/salesMockData";

export function formatSalesCurrency(value: number) {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function sanitizeHubSpotUiMessage(error?: string): string {
  if (!error) {
    return "HubSpot koppeling mislukt. Controleer token of scopes.";
  }

  if (
    error.includes("HTTP-Code") ||
    error.includes("Headers:") ||
    error.includes("correlationId") ||
    error.length > 180
  ) {
    return "HubSpot koppeling mislukt. Controleer token of scopes.";
  }

  return error;
}

export function getLeadFilterOptions(leads: SalesLead[]) {
  return {
    statuses: Array.from(new Set(leads.map((lead) => lead.status))),
    owners: Array.from(new Set(leads.map((lead) => lead.eigenaar))).sort(),
    sources: Array.from(new Set(leads.map((lead) => lead.bron))).sort(),
  };
}

export const leadStatusLabels: Record<SalesLead["status"], string> = {
  nieuw: "Nieuw",
  contact: "Contact",
  offerte: "Offerte",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
};

export const leadStatusStyles: Record<SalesLead["status"], string> = {
  nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  contact: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  offerte: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  gewonnen: "border-green-200 bg-green-50 text-green-700",
  verloren: "border-slate-200 bg-slate-100 text-slate-600",
};
