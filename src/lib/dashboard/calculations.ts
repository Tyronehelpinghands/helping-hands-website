import { DEFAULT_TRAVEL_RATE_PER_KM, DEFAULT_VAT_RATE } from "@/lib/rates";

/** Parse "HH:MM" or "HH:MM:SS" into minutes since midnight. */
export function timeToMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  const parts = time.split(":");
  if (parts.length < 2) return null;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/** Worked hours from start/end minus break (minutes). Never negative. */
export function calculateWorkedHours(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
  breakMinutes = 0,
): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null) return 0;
  let diff = end - start;
  if (diff < 0) diff += 24 * 60; // overnight
  const worked = Math.max(0, diff - Math.max(0, breakMinutes));
  return Math.round((worked / 60) * 100) / 100;
}

export function calculateTravelCosts(
  kilometers: number,
  ratePerKm: number = DEFAULT_TRAVEL_RATE_PER_KM,
): number {
  return Math.round(Math.max(0, kilometers) * ratePerKm * 100) / 100;
}

export type InvoiceTotalsInput = {
  hours: number;
  hourlyRate: number;
  kilometers?: number;
  kmRate?: number;
  travelTimeHours?: number;
  travelTimeRate?: number;
  vatPercent?: number;
};

export type InvoiceTotals = {
  laborAmount: number;
  travelCosts: number;
  travelTimeAmount: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
};

export function calculateInvoiceTotals(input: InvoiceTotalsInput): InvoiceTotals {
  const vatPercent = input.vatPercent ?? DEFAULT_VAT_RATE;
  const kmRate = input.kmRate ?? DEFAULT_TRAVEL_RATE_PER_KM;
  const travelTimeRate = input.travelTimeRate ?? input.hourlyRate;

  const laborAmount =
    Math.round(Math.max(0, input.hours) * Math.max(0, input.hourlyRate) * 100) /
    100;
  const travelCosts = calculateTravelCosts(input.kilometers ?? 0, kmRate);
  const travelTimeAmount =
    Math.round(
      Math.max(0, input.travelTimeHours ?? 0) * Math.max(0, travelTimeRate) * 100,
    ) / 100;
  const subtotal =
    Math.round((laborAmount + travelCosts + travelTimeAmount) * 100) / 100;
  const vatAmount =
    Math.round(subtotal * (vatPercent / 100) * 100) / 100;
  const totalAmount = Math.round((subtotal + vatAmount) * 100) / 100;

  return {
    laborAmount,
    travelCosts,
    travelTimeAmount,
    subtotal,
    vatAmount,
    totalAmount,
  };
}

/** Simple margin: revenue − crew cost. */
export function calculateMarginEstimate(
  revenue: number,
  crewCost: number,
): { margin: number; marginPercent: number | null } {
  const margin = Math.round((revenue - crewCost) * 100) / 100;
  if (revenue <= 0) return { margin, marginPercent: null };
  return {
    margin,
    marginPercent: Math.round((margin / revenue) * 1000) / 10,
  };
}

export function startOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date = new Date()): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
