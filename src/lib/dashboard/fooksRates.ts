/**
 * Fooks payrolling factors (sales voorstel R.E.R Productions).
 * Inclusive of vakantiegeld, vakantiedagen, sociale lasten, verzuim.
 *
 * Cost is derived from employment_type (not a separate WW select):
 * - vast / payroll → WW Laag 1,580 × bruto
 * - freelance → WW Hoog 1,635 × bruto
 * - zzp → fixed €25 excl. BTW
 * - other → manual hourly_cost
 */

import type { EmploymentType, FooksWwTariff } from "@/lib/dashboard/types";

export type { FooksWwTariff };

/** WW Laag factor from Fooks sales proposal. */
export const FOOKS_WW_LAAG = 1.58;

/** WW Hoog factor from Fooks sales proposal. */
export const FOOKS_WW_HOOG = 1.635;

/** Fixed ZZP uurkost (excl. BTW). */
export const FOOKS_ZZP_HOURLY_COST = 25;

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
 * WW tariff implied by employment type (stored for audit).
 * zzp / other → null
 */
export function getWwTariffForEmploymentType(
  employmentType: string | null | undefined,
): FooksWwTariff | null {
  switch (employmentType) {
    case "vast":
    case "payroll":
      return "laag";
    case "freelance":
      return "hoog";
    default:
      return null;
  }
}

/**
 * Cost factor for bruto × factor types; null when not applicable (zzp/other).
 */
export function getCostFactorForEmploymentType(
  employmentType: string | null | undefined,
): number | null {
  const tariff = getWwTariffForEmploymentType(employmentType);
  return tariff == null ? null : fooksWwFactor(tariff);
}

/**
 * Employment types that use bruto × Fooks WW factor.
 */
export function usesBrutoFactor(
  employmentType: string | null | undefined,
): boolean {
  return (
    employmentType === "vast" ||
    employmentType === "payroll" ||
    employmentType === "freelance"
  );
}

export function isZzpEmploymentType(
  employmentType: string | null | undefined,
): boolean {
  return employmentType === "zzp";
}

/** @deprecated Prefer usesBrutoFactor / calculateCrewHourlyCost. */
export function isFooksEmploymentType(
  employmentType: string | null | undefined,
): boolean {
  return usesBrutoFactor(employmentType);
}

/**
 * Calculate employer hourly cost (uurkost) from bruto × WW factor.
 */
export function calculateFooksHourlyCost(
  bruto: number,
  wwTariff: FooksWwTariff,
): number {
  if (!Number.isFinite(bruto) || bruto < 0) return 0;
  const factor = fooksWwFactor(wwTariff);
  return Math.round(bruto * factor * 100) / 100;
}

/**
 * Derive crew hourly_cost from employment type (+ bruto when needed).
 */
export function calculateCrewHourlyCost(input: {
  employmentType: EmploymentType | string | null | undefined;
  bruto?: number | null;
}): number | null {
  const type = input.employmentType;

  if (isZzpEmploymentType(type)) {
    return FOOKS_ZZP_HOURLY_COST;
  }

  const tariff = getWwTariffForEmploymentType(type);
  if (tariff != null) {
    const bruto = input.bruto;
    if (bruto == null || !Number.isFinite(bruto)) return null;
    return calculateFooksHourlyCost(bruto, tariff);
  }

  return null;
}

export function parseFooksWwTariff(
  value: string | null | undefined,
): FooksWwTariff {
  return value === "hoog" ? "hoog" : "laag";
}
