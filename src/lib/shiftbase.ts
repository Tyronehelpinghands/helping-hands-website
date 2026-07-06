/**
 * Shiftbase API — server-side only.
 * Docs: https://developer.shiftbase.com/
 * Auth: Authorization: API {token}
 *
 * Endpoint paths zijn configureerbaar via env vars als jouw account
 * afwijkende routes gebruikt.
 */

import type { PlanningShift } from "@/data/planningMockData";
import { buildShiftbaseDescription } from "@/lib/planning-utils";

const DEFAULT_BASE_URL = "https://api.shiftbase.com/api";

/** Configureerbare endpoints — pas aan indien Shiftbase andere paths gebruikt */
export const SHIFTBASE_ENDPOINTS = {
  employees: process.env.SHIFTBASE_ENDPOINT_EMPLOYEES ?? "/employees",
  employee: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_EMPLOYEE ?? "/employees/{id}").replace("{id}", id),
  shifts: process.env.SHIFTBASE_ENDPOINT_SHIFTS ?? "/shifts",
  shift: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_SHIFT ?? "/shifts/{id}").replace("{id}", id),
  timesheets: process.env.SHIFTBASE_ENDPOINT_TIMESHEETS ?? "/timesheets",
  test: process.env.SHIFTBASE_ENDPOINT_TEST ?? "/account",
} as const;

export type ShiftbaseEmployeeAddress = {
  shiftbaseEmployeeId: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

export type ShiftbaseEmployee = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: ShiftbaseEmployeeAddress;
  raw?: Record<string, unknown>;
};

export type ShiftbaseShiftPayload = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  locationName?: string;
  roleName?: string;
  employeeIds?: string[];
};

export type TravelCalculationResult = {
  status: "berekend" | "adres_ontbreekt" | "locatieadres_ontbreekt" | "niet_berekend";
  oneWayKm: number | null;
  returnKm: number | null;
  feePerKm: number;
  totalFee: number | null;
  homeCity?: string;
};

export function getShiftbaseApiToken(): string | undefined {
  const raw = process.env.SHIFTBASE_API_TOKEN;
  if (!raw) return undefined;
  const token = raw.trim().replace(/^['"]|['"]$/g, "");
  return token || undefined;
}

export function getShiftbaseApiBaseUrl(): string {
  const raw = process.env.SHIFTBASE_API_BASE_URL?.trim();
  return (raw || DEFAULT_BASE_URL).replace(/\/$/, "");
}

export function isShiftbaseConfigured(): boolean {
  return Boolean(getShiftbaseApiToken());
}

export function formatShiftbaseError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("401") || msg.includes("403")) {
      return "Shiftbase authenticatie mislukt. Controleer SHIFTBASE_API_TOKEN.";
    }
    if (msg.includes("429")) {
      return "Shiftbase rate limit bereikt. Probeer later opnieuw.";
    }
    if (msg.includes("niet geconfigureerd")) {
      return "SHIFTBASE_API_TOKEN is niet geconfigureerd op de server.";
    }
    if (msg.includes("Shiftbase API fout")) {
      return msg;
    }
  }
  return "Shiftbase koppeling mislukt. Controleer token en API-toegang.";
}

export function sanitizeShiftbaseUiMessage(message: unknown): string {
  if (typeof message !== "string" || !message.trim()) {
    return "Shiftbase koppeling mislukt. Controleer token of API-toegang.";
  }
  const safe = message
    .replace(/API\s+[A-Za-z0-9_-]{8,}/gi, "[token]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "[token]")
    .replace(/Authorization[:\s]+[^\s]+/gi, "Authorization: [verborgen]");
  return safe.length > 200 ? `${safe.slice(0, 200)}…` : safe;
}

type ShiftbaseRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function shiftbaseRequest<T = unknown>(
  endpoint: string,
  options: ShiftbaseRequestOptions = {},
): Promise<T> {
  const token = getShiftbaseApiToken();
  if (!token) {
    throw new Error("SHIFTBASE_API_TOKEN is niet geconfigureerd");
  }

  const baseUrl = getShiftbaseApiBaseUrl();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `API ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(
      "[Shiftbase] Request failed:",
      response.status,
      path,
      body.slice(0, 500),
    );
    throw new Error(`Shiftbase API fout (${response.status})`);
  }

  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

function mapEmployee(raw: Record<string, unknown>): ShiftbaseEmployee {
  const id = String(raw.id ?? raw.employee_id ?? raw.user_id ?? "");
  const firstName = String(raw.first_name ?? raw.firstName ?? "");
  const lastName = String(raw.last_name ?? raw.lastName ?? "");
  const fullName =
    String(raw.full_name ?? raw.name ?? `${firstName} ${lastName}`.trim()) || id;

  const addressRaw = (raw.address ?? raw.home_address ?? {}) as Record<string, unknown>;

  return {
    id,
    fullName,
    email: raw.email ? String(raw.email) : undefined,
    phone: raw.phone ? String(raw.phone) : raw.mobile ? String(raw.mobile) : undefined,
    address: {
      shiftbaseEmployeeId: id,
      street: addressRaw.street ? String(addressRaw.street) : undefined,
      houseNumber: addressRaw.house_number
        ? String(addressRaw.house_number)
        : addressRaw.houseNumber
          ? String(addressRaw.houseNumber)
          : undefined,
      postalCode: addressRaw.postal_code
        ? String(addressRaw.postal_code)
        : addressRaw.postalCode
          ? String(addressRaw.postalCode)
          : undefined,
      city: addressRaw.city ? String(addressRaw.city) : undefined,
      country: addressRaw.country ? String(addressRaw.country) : "NL",
    },
    raw,
  };
}

function extractList<T>(data: unknown, mapper: (item: Record<string, unknown>) => T): T[] {
  if (Array.isArray(data)) {
    return data.map((item) => mapper(item as Record<string, unknown>));
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const list =
      obj.data ?? obj.employees ?? obj.shifts ?? obj.timesheets ?? obj.results ?? obj.items;
    if (Array.isArray(list)) {
      return list.map((item) => mapper(item as Record<string, unknown>));
    }
  }
  return [];
}

export async function testShiftbaseConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  await shiftbaseRequest(SHIFTBASE_ENDPOINTS.test);
  return { ok: true, message: "Shiftbase koppeling actief." };
}

export async function getShiftbaseEmployees(): Promise<ShiftbaseEmployee[]> {
  const data = await shiftbaseRequest(SHIFTBASE_ENDPOINTS.employees);
  return extractList(data, mapEmployee);
}

export async function getShiftbaseEmployeeById(id: string): Promise<ShiftbaseEmployee> {
  const data = await shiftbaseRequest<Record<string, unknown>>(
    SHIFTBASE_ENDPOINTS.employee(id),
  );
  const employee = (data.data ?? data.employee ?? data) as Record<string, unknown>;
  return mapEmployee(employee);
}

export async function getShiftbaseShifts(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<unknown[]> {
  const search = new URLSearchParams();
  if (params?.startDate) search.set("start_date", params.startDate);
  if (params?.endDate) search.set("end_date", params.endDate);
  const qs = search.toString();
  const endpoint = qs
    ? `${SHIFTBASE_ENDPOINTS.shifts}?${qs}`
    : SHIFTBASE_ENDPOINTS.shifts;
  const data = await shiftbaseRequest(endpoint);
  return extractList(data, (item) => item);
}

export async function createShiftbaseShift(
  payload: ShiftbaseShiftPayload,
): Promise<{ id: string }> {
  const body = {
    title: payload.title,
    name: payload.title,
    description: payload.description,
    notes: payload.description,
    start_time: payload.startTime,
    end_time: payload.endTime,
    start: payload.startTime,
    end: payload.endTime,
    break_minutes: payload.breakMinutes ?? 0,
    location: payload.locationName,
    position: payload.roleName,
    employee_ids: payload.employeeIds,
  };

  const data = await shiftbaseRequest<Record<string, unknown>>(SHIFTBASE_ENDPOINTS.shifts, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const id = String(data.id ?? data.shift_id ?? data.data ?? "");
  return { id };
}

export async function updateShiftbaseShift(
  id: string,
  payload: Partial<ShiftbaseShiftPayload>,
): Promise<void> {
  const body: Record<string, unknown> = {};
  if (payload.title) {
    body.title = payload.title;
    body.name = payload.title;
  }
  if (payload.description) {
    body.description = payload.description;
    body.notes = payload.description;
  }
  if (payload.startTime) body.start_time = payload.startTime;
  if (payload.endTime) body.end_time = payload.endTime;
  if (payload.breakMinutes !== undefined) body.break_minutes = payload.breakMinutes;

  await shiftbaseRequest(SHIFTBASE_ENDPOINTS.shift(id), {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function getShiftbaseTimesheets(params?: {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}): Promise<unknown[]> {
  const search = new URLSearchParams();
  if (params?.startDate) search.set("start_date", params.startDate);
  if (params?.endDate) search.set("end_date", params.endDate);
  if (params?.employeeId) search.set("employee_id", params.employeeId);
  const qs = search.toString();
  const endpoint = qs
    ? `${SHIFTBASE_ENDPOINTS.timesheets}?${qs}`
    : SHIFTBASE_ENDPOINTS.timesheets;
  const data = await shiftbaseRequest(endpoint);
  return extractList(data, (item) => item);
}

/**
 * Haalt thuisadres op voor kilometerberekening.
 * AVG: sla volledig adres alleen op indien nodig; toon in UI bij voorkeur woonplaats.
 */
export async function getEmployeeHomeAddressFromShiftbase(
  employeeId: string,
): Promise<ShiftbaseEmployeeAddress | null> {
  const employee = await getShiftbaseEmployeeById(employeeId);
  return employee.address ?? null;
}

/** Placeholder afstand — vervang later door Google/OSRM/OpenRouteService */
function estimateDistanceKm(cityA: string, cityB: string): number {
  if (!cityA || !cityB) return 0;
  if (cityA.toLowerCase() === cityB.toLowerCase()) return 5;
  let hash = 0;
  const key = `${cityA}-${cityB}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return 8 + (Math.abs(hash) % 45);
}

function extractCityFromAddress(address: string): string {
  const parts = address.split(",");
  const last = parts[parts.length - 1]?.trim() ?? address;
  const match = last.match(/\d{4}\s*[A-Z]{0,2}\s+(.+)/i);
  return match?.[1]?.trim() ?? last;
}

export function calculateTravelKilometers(
  homeAddress: ShiftbaseEmployeeAddress | { city?: string } | null,
  projectAddress: string | null,
  feePerKm = 0.25,
): TravelCalculationResult {
  const homeCity = homeAddress?.city?.trim();

  if (!homeCity) {
    return {
      status: "adres_ontbreekt",
      oneWayKm: null,
      returnKm: null,
      feePerKm,
      totalFee: null,
    };
  }

  if (!projectAddress?.trim()) {
    return {
      status: "locatieadres_ontbreekt",
      oneWayKm: null,
      returnKm: null,
      feePerKm,
      totalFee: null,
      homeCity,
    };
  }

  const projectCity = extractCityFromAddress(projectAddress);
  const oneWayKm = estimateDistanceKm(homeCity, projectCity);
  const returnKm = oneWayKm * 2;
  const totalFee = Math.round(returnKm * feePerKm * 100) / 100;

  return {
    status: "berekend",
    oneWayKm,
    returnKm,
    feePerKm,
    totalFee,
    homeCity,
  };
}

export async function syncShiftToShiftbase(
  shift: PlanningShift,
): Promise<{ shiftbaseShiftId: string }> {
  const description = buildShiftbaseDescription(shift);

  if (shift.shiftbaseShiftId) {
    await updateShiftbaseShift(shift.shiftbaseShiftId, {
      title: shift.title,
      description,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakMinutes: shift.breakMinutes,
      locationName: shift.locationName,
      roleName: shift.roleName,
    });
    return { shiftbaseShiftId: shift.shiftbaseShiftId };
  }

  const created = await createShiftbaseShift({
    title: shift.title,
    description,
    startTime: shift.startTime,
    endTime: shift.endTime,
    breakMinutes: shift.breakMinutes,
    locationName: shift.locationName,
    roleName: shift.roleName,
  });

  return { shiftbaseShiftId: created.id };
}

export async function syncHoursFromShiftbase(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<{ count: number; items: unknown[] }> {
  const items = await getShiftbaseTimesheets(params);
  return { count: items.length, items };
}
