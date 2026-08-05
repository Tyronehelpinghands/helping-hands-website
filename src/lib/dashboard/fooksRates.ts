/**
 * Fooks payrolling factors (sales voorstel R.E.R Productions).
 * Inclusive of vakantiegeld, vakantiedagen, sociale lasten, verzuim.
 *
 * Formula: hourly_cost (uurkost werkgever) = round(bruto * factor, 2)
 */

import type { FooksWwTariff } from "@/lib/dashboard/types";

export type { FooksWwTariff };

/** WW Laag factor from Fooks sales proposal. */
export const FOOKS_WW_LAAG = 1.58;

/** WW Hoog factor from Fooks sales proposal. */
export const FOOKS_WW_HOOG = 1.635;

export const FOOKS_WW_FACTORS: Record<FooksWwTariff, number> = {
  laag: FOOKS_WW_LAAG,
  hoog: FOOKS_WW_HOOG,
};

export function fooksWwFactor(tariff: FooksWwTariff): number {
  return FOOKS_WW_FACTORS[tariff];
}

/** Format factor for Dutch UI (e.g. 1,580 / 1,635). */
export function formatFooksFactor(tariff: FooksWwTariff): string {
  return fooksWwFactor(tariff).toFixed(3).replace(".", ",");
}

/**
 * Calculate employer hourly cost (uurkost) from bruto uurloon × Fooks WW factor.
 */
export function calculateFooksHourlyCost(
  bruto: number,
  wwTariff: FooksWwTariff,
): number {
  if (!Number.isFinite(bruto) || bruto < 0) return 0;
  const factor = fooksWwFactor(wwTariff);
  return Math.round(bruto * factor * 100) / 100;
}

export function isFooksEmploymentType(
  employmentType: string | null | undefined,
): boolean {
  return employmentType === "payroll" || employmentType === "vast";
}

export function parseFooksWwTariff(
  value: string | null | undefined,
): FooksWwTariff {
  return value === "hoog" ? "hoog" : "laag";
}
