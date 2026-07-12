/** Centrale tarieven en reiskosten — één bron voor alle modules. */

export const DEFAULT_VAT_RATE = 21;
export const DEFAULT_TRAVEL_RATE_PER_KM = 0.25;
export const DEFAULT_CLIENT_HOURLY_RATE = 35.0;
export const DEFAULT_CREW_HOURLY_RATE = 25.0;
export const DEFAULT_CURRENCY = "EUR" as const;

export type RoleRateEntry = {
  role: string;
  clientRate: number;
  crewRate?: number;
  active: boolean;
};

export const ROLE_CLIENT_RATES: Record<string, number> = {
  Eventmedewerker: 31.5,
  "Horeca support": 31.5,
  Stagehand: 35.0,
  "Productie assistent": 34.5,
  "Logistiek medewerker": 35.0,
  Teamcaptain: 42.5,
  "Zelfstandig werkend kok": 40.0,
  "Hulp kok / keukenhulp": 32.5,
  Bartender: 34.5,
  Barback: 30.5,
  "Runner / bediening support": 29.5,
};

export const DEFAULT_ROLE_RATES: RoleRateEntry[] = Object.entries(
  ROLE_CLIENT_RATES,
).map(([role, clientRate]) => ({
  role,
  clientRate,
  active: true,
}));

export function getClientRateForRole(role: string): number {
  return ROLE_CLIENT_RATES[role] ?? DEFAULT_CLIENT_HOURLY_RATE;
}
