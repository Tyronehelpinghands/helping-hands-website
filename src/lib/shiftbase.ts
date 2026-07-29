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

/** Alternate bases — Shiftbase docs use /api; some accounts expect /api/v1. */
const SHIFTBASE_BASE_URL_CANDIDATES = [
  "https://api.shiftbase.com/api",
  "https://api.shiftbase.com/api/v1",
] as const;

/** Configureerbare endpoints — pas aan indien jouw account afwijkende routes gebruikt */
export const SHIFTBASE_ENDPOINTS = {
  employees: process.env.SHIFTBASE_ENDPOINT_EMPLOYEES ?? "/employees",
  employee: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_EMPLOYEE ?? "/employees/{id}").replace(
      "{id}",
      id,
    ),
  shifts: process.env.SHIFTBASE_ENDPOINT_SHIFTS ?? "/shifts",
  shift: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_SHIFT ?? "/shifts/{id}").replace("{id}", id),
  timesheets: process.env.SHIFTBASE_ENDPOINT_TIMESHEETS ?? "/timesheets",
  test: process.env.SHIFTBASE_ENDPOINT_TEST ?? "/employees?limit=1",
} as const;

/** Probe paths used only for connection healthchecks */
const SHIFTBASE_TEST_PATHS = [
  SHIFTBASE_ENDPOINTS.test,
  "/employees?limit=1",
  "/Employees?limit=1",
  "/employee?limit=1",
  "/departments?limit=1",
  "/Departments?limit=1",
  "/locations?limit=1",
  "/accounts",
] as const;

export type ShiftbaseEmployeeAddress = {
  shiftbaseEmployeeId: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

export type ShiftbaseEmployeeStatus = "active" | "inactive" | "onboarding";

export type ShiftbaseEmployee = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  city?: string;
  roleType?: string;
  /** Mapped ops status when Shiftbase exposes one; omit if unknown. */
  status?: ShiftbaseEmployeeStatus;
  hourlyCost?: number;
  skills?: string[];
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
  // Prefer SHIFTBASE_API_TOKEN; also accept SHIFTBASE_API_KEY (common Vercel naming).
  const raw =
    process.env.SHIFTBASE_API_TOKEN?.trim() ||
    process.env.SHIFTBASE_API_KEY?.trim();
  if (!raw) return undefined;
  const token = raw.replace(/^['"]|['"]$/g, "").trim();
  return token || undefined;
}

export function getShiftbaseApiBaseUrl(): string {
  const raw = process.env.SHIFTBASE_API_BASE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return DEFAULT_BASE_URL;
}

export function getShiftbaseBaseUrlCandidates(): string[] {
  const preferred = getShiftbaseApiBaseUrl();
  const list = [preferred, ...SHIFTBASE_BASE_URL_CANDIDATES];
  return list
    .map((url) => url.replace(/\/$/, ""))
    .filter((url, index, all) => all.indexOf(url) === index);
}

export function resolveShiftbaseUrl(endpoint: string, baseUrl?: string): string {
  const base = (baseUrl ?? getShiftbaseApiBaseUrl()).replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

export function isShiftbaseConfigured(): boolean {
  return Boolean(getShiftbaseApiToken());
}

export function formatShiftbaseError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("401") || msg.includes("403")) {
      return "Shiftbase authenticatie mislukt. Controleer SHIFTBASE_API_TOKEN of SHIFTBASE_API_KEY (Settings → App center → Public API).";
    }
    if (msg.includes("429")) {
      return "Shiftbase rate limit bereikt. Probeer later opnieuw.";
    }
    if (msg.includes("niet geconfigureerd")) {
      return "SHIFTBASE_API_TOKEN of SHIFTBASE_API_KEY is niet geconfigureerd op de server.";
    }
    if (msg.includes("404") || msg.includes("geen geldig endpoint")) {
      return msg;
    }
    if (msg.includes("Shiftbase API fout") || msg.includes("Shiftbase endpoint")) {
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

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = resolveShiftbaseUrl(endpoint);

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
    throw new Error(`Shiftbase API fout (${response.status}) op ${path}`);
  }

  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

/**
 * Shiftbase list items are often wrapped: `{ User: { ... } }` or `{ Employee: { ... } }`.
 * Flatten known wrappers so field mapping stays consistent.
 */
function unwrapEmployeeRecord(raw: Record<string, unknown>): Record<string, unknown> {
  for (const key of ["User", "Employee", "user", "employee"] as const) {
    const nested = raw[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const n = nested as Record<string, unknown>;
      if (
        n.id != null ||
        n.employee_id != null ||
        n.user_id != null ||
        n.first_name != null ||
        n.firstName != null ||
        n.email != null
      ) {
        return { ...raw, ...n };
      }
    }
  }
  return raw;
}

function pickString(
  raw: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (value == null || value === "") continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return undefined;
}

function mapEmployeeStatus(
  raw: Record<string, unknown>,
): ShiftbaseEmployeeStatus | undefined {
  const rawStatus = raw.status ?? raw.employee_status ?? raw.user_status;
  const activeFlag = raw.active ?? raw.is_active ?? raw.isActive;

  if (activeFlag === false || activeFlag === 0 || activeFlag === "0") {
    return "inactive";
  }
  if (activeFlag === true || activeFlag === 1 || activeFlag === "1") {
    return "active";
  }

  if (rawStatus == null) return undefined;
  const s = String(rawStatus).trim().toLowerCase();
  if (["0", "inactive", "blocked", "deleted", "archived", "disabled"].includes(s)) {
    return "inactive";
  }
  if (["onboarding", "pending", "invited", "new"].includes(s)) {
    return "onboarding";
  }
  if (["1", "active", "employed", "enabled"].includes(s)) {
    return "active";
  }
  return undefined;
}

function mapSkills(raw: Record<string, unknown>): string[] | undefined {
  const value = raw.skills ?? raw.skill_names ?? raw.competences;
  if (Array.isArray(value)) {
    const skills = value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const o = item as Record<string, unknown>;
          return String(o.name ?? o.title ?? o.skill ?? "").trim();
        }
        return "";
      })
      .filter(Boolean);
    return skills.length ? skills : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

function mapEmployee(rawInput: Record<string, unknown>): ShiftbaseEmployee {
  const raw = unwrapEmployeeRecord(rawInput);
  const id = String(
    raw.id ?? raw.employee_id ?? raw.user_id ?? raw.ID ?? "",
  );
  const firstName = pickString(raw, ["first_name", "firstName", "firstname"]) ?? "";
  const lastName = pickString(raw, ["last_name", "lastName", "lastname"]) ?? "";
  const fullName =
    pickString(raw, ["full_name", "fullName", "name", "display_name"]) ||
    `${firstName} ${lastName}`.trim() ||
    id;

  const addressRaw = (
    (raw.address && typeof raw.address === "object"
      ? raw.address
      : raw.home_address && typeof raw.home_address === "object"
        ? raw.home_address
        : {}) as Record<string, unknown>
  );

  const city =
    pickString(raw, ["city", "woonplaats", "residence_city"]) ??
    (addressRaw.city ? String(addressRaw.city) : undefined);

  const phone = pickString(raw, [
    "phone",
    "mobile",
    "cellphone",
    "cell_phone",
    "mobile_phone",
    "phone_number",
    "telephone",
  ]);

  const hourlyRaw =
    raw.hourly_cost ??
    raw.hourly_wage ??
    raw.hour_rate ??
    raw.hourly_rate ??
    raw.wage;
  const hourlyCost =
    hourlyRaw != null && hourlyRaw !== ""
      ? Number(hourlyRaw)
      : undefined;

  const roleType = pickString(raw, [
    "role",
    "role_name",
    "job_title",
    "function",
    "function_name",
    "department_name",
    "default_department",
    "position",
  ]);

  return {
    id,
    fullName,
    email: pickString(raw, ["email", "email_address", "mail"]),
    phone,
    city,
    roleType,
    status: mapEmployeeStatus(raw),
    hourlyCost: Number.isFinite(hourlyCost) ? hourlyCost : undefined,
    skills: mapSkills(raw),
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
      city: addressRaw.city ? String(addressRaw.city) : city,
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
      obj.data ??
      obj.employees ??
      obj.users ??
      obj.shifts ??
      obj.timesheets ??
      obj.results ??
      obj.items;
    if (Array.isArray(list)) {
      return list.map((item) => mapper(item as Record<string, unknown>));
    }
  }
  return [];
}

async function probeShiftbaseEndpoint(
  endpoint: string,
  baseUrl: string,
): Promise<{
  ok: boolean;
  status: number;
  path: string;
  baseUrl: string;
}> {
  const token = getShiftbaseApiToken();
  if (!token) {
    throw new Error("SHIFTBASE_API_TOKEN is niet geconfigureerd");
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = resolveShiftbaseUrl(endpoint, baseUrl);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `API ${token}`,
    },
    cache: "no-store",
  });

  return { ok: response.ok, status: response.status, path, baseUrl };
}

export async function testShiftbaseConnection(): Promise<{
  ok: boolean;
  message: string;
  endpoint?: string;
  baseUrl?: string;
  attempts?: Array<{ baseUrl: string; path: string; status: number }>;
}> {
  const customTest = process.env.SHIFTBASE_ENDPOINT_TEST?.trim();
  const paths = [
    ...(customTest ? [customTest] : []),
    ...SHIFTBASE_TEST_PATHS,
  ].filter((value, index, all) => all.indexOf(value) === index);

  const bases = getShiftbaseBaseUrlCandidates();
  const attempts: Array<{ baseUrl: string; path: string; status: number }> =
    [];
  let lastStatus = 0;
  let lastPath = paths[0] ?? "/employees";
  let lastBase = bases[0] ?? getShiftbaseApiBaseUrl();

  for (const baseUrl of bases) {
    for (const endpoint of paths) {
      const result = await probeShiftbaseEndpoint(endpoint, baseUrl);
      attempts.push({
        baseUrl: result.baseUrl,
        path: result.path,
        status: result.status,
      });
      lastStatus = result.status;
      lastPath = result.path;
      lastBase = result.baseUrl;

      if (result.ok) {
        return {
          ok: true,
          message: `Shiftbase API bereikbaar (${result.baseUrl}${result.path}).`,
          endpoint: result.path,
          baseUrl: result.baseUrl,
          attempts,
        };
      }

      if (result.status === 401 || result.status === 403) {
        throw new Error(
          `Shiftbase authenticatie mislukt (${result.status}) op ${result.baseUrl}${result.path}. ` +
            `Token wordt wel ontvangen, maar geweigerd. Maak/controleer een token via App center → Public API en plak die exact in SHIFTBASE_API_KEY.`,
        );
      }

      if (result.status === 429) {
        throw new Error(
          `Shiftbase rate limit bereikt (429) op ${result.baseUrl}${result.path}`,
        );
      }
    }
  }

  const sample = attempts
    .slice(0, 6)
    .map((a) => `${a.status}:${a.baseUrl}${a.path}`)
    .join(" · ");

  throw new Error(
    `Shiftbase gaf geen geldig endpoint (laatste ${lastStatus} op ${lastBase}${lastPath}). ` +
      `Samples: ${sample}. ` +
      `Zet in Vercel SHIFTBASE_API_BASE_URL=https://api.shiftbase.com/api (zonder /v1), redeploy, en test opnieuw. ` +
      `Premium/App Center Plus is OK — het gaat om de juiste base URL + Public API-tokenwaarde.`,
  );
}

/**
 * Haalt medewerkers op via GET /employees (configureerbaar).
 * Filtert lege records zonder id én zonder bruikbare naam/e-mail.
 */
export async function getShiftbaseEmployees(): Promise<ShiftbaseEmployee[]> {
  const data = await shiftbaseRequest(SHIFTBASE_ENDPOINTS.employees);
  return extractList(data, mapEmployee).filter(
    (e) => e.id || e.email || (e.fullName && e.fullName.trim().length > 0),
  );
}

/** Alias — zelfde als getShiftbaseEmployees. */
export async function fetchShiftbaseEmployees(): Promise<ShiftbaseEmployee[]> {
  return getShiftbaseEmployees();
}

export async function getShiftbaseEmployeeById(id: string): Promise<ShiftbaseEmployee> {
  const data = await shiftbaseRequest<Record<string, unknown>>(
    SHIFTBASE_ENDPOINTS.employee(id),
  );
  const employee = (data.data ?? data.employee ?? data.User ?? data.user ?? data) as Record<
    string,
    unknown
  >;
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
