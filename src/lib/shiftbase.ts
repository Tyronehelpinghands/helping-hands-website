/**
 * Shiftbase API — server-side only.
 * Docs: https://developer.shiftbase.com/
 * Auth: Authorization: API {token}  (NOT Bearer)
 *
 * Medewerkers: GET /users (niet /employees — die route bestaat niet in de Public API).
 */

import type { PlanningShift } from "@/data/planningMockData";
import { buildShiftbaseDescription } from "@/lib/planning-utils";

const DEFAULT_BASE_URL = "https://api.shiftbase.com/api";

/** Alternate bases — Shiftbase docs use /api; some accounts expect /api/v1. */
const SHIFTBASE_BASE_URL_CANDIDATES = [
  "https://api.shiftbase.com/api",
  "https://api.shiftbase.com/api/v1",
] as const;

/**
 * Endpoints voor medewerkers-sync.
 * Probeer /users eerst; /employees is onjuist en geeft 404.
 */
export const SHIFTBASE_EMPLOYEE_ENDPOINTS = [
  process.env.SHIFTBASE_ENDPOINT_USERS?.trim() || "/users",
  "/users?active=true",
] as const;

/** Configureerbare endpoints — medewerkers via /users, niet /employees */
export const SHIFTBASE_ENDPOINTS = {
  /** @deprecated Gebruik users — alias voor backwards compatibility */
  employees: SHIFTBASE_EMPLOYEE_ENDPOINTS[0],
  users: SHIFTBASE_EMPLOYEE_ENDPOINTS[0],
  employee: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_USER ?? "/users/{id}").replace("{id}", id),
  user: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_USER ?? "/users/{id}").replace("{id}", id),
  shifts: process.env.SHIFTBASE_ENDPOINT_SHIFTS ?? "/shifts",
  shift: (id: string) =>
    (process.env.SHIFTBASE_ENDPOINT_SHIFT ?? "/shifts/{id}").replace("{id}", id),
  timesheets: process.env.SHIFTBASE_ENDPOINT_TIMESHEETS ?? "/timesheets",
  test: process.env.SHIFTBASE_ENDPOINT_TEST ?? "/users",
} as const;

/** Probe paths used only for connection healthchecks — nooit /employees */
const SHIFTBASE_TEST_PATHS = [
  SHIFTBASE_ENDPOINTS.test,
  "/users",
  "/users?active=true",
  "/accounts",
] as const;

export const SHIFTBASE_SYNC_NOTES = "Gesynchroniseerd vanuit Shiftbase";

export const SHIFTBASE_404_EMPLOYEES_HINT =
  "Endpoint /employees bestaat niet in de Shiftbase Public API. Gebruik /users. " +
  "Controleer de documentatie op developer.shiftbase.com. " +
  "Actie: Controleer Public API token, App Center Plus en endpoint.";

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
  // Prefer SHIFTBASE_API_KEY; accept SHIFTBASE_API_TOKEN as alias.
  const raw =
    process.env.SHIFTBASE_API_KEY?.trim() ||
    process.env.SHIFTBASE_API_TOKEN?.trim();
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

/** Opt-in flag. Default off — planning draait op Supabase. */
export function isShiftbaseEnabled(): boolean {
  return process.env.SHIFTBASE_ENABLED?.trim().toLowerCase() === "true";
}

export class ShiftbaseApiError extends Error {
  readonly status: number;
  readonly path: string;
  readonly body: string;

  constructor(status: number, path: string, body = "") {
    const snippet = body.trim().slice(0, 200);
    super(
      snippet
        ? `Shiftbase API fout (${status}) op ${path}: ${snippet}`
        : `Shiftbase API fout (${status}) op ${path}`,
    );
    this.name = "ShiftbaseApiError";
    this.status = status;
    this.path = path;
    this.body = body;
  }
}

export function formatShiftbaseError(error: unknown): string {
  const status =
    error instanceof ShiftbaseApiError
      ? error.status
      : typeof error === "object" &&
          error &&
          "status" in error &&
          typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : undefined;
  const path =
    error instanceof ShiftbaseApiError
      ? error.path
      : typeof error === "object" &&
          error &&
          "path" in error &&
          typeof (error as { path: unknown }).path === "string"
        ? (error as { path: string }).path
        : undefined;

  if (status === 401 || status === 403) {
    return (
      `Shiftbase authenticatie mislukt (${status})${path ? ` op ${path}` : ""}. ` +
      `Controleer SHIFTBASE_API_KEY (Settings → App center → Public API). ` +
      `Actie: Controleer Public API token, App Center Plus en endpoint.`
    );
  }
  if (status === 404) {
    return (
      `Shiftbase endpoint niet gevonden (404)${path ? ` op ${path}` : ""}. ` +
      SHIFTBASE_404_EMPLOYEES_HINT
    );
  }

  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("401") || msg.includes("403")) {
      return (
        "Shiftbase authenticatie mislukt. Controleer SHIFTBASE_API_KEY " +
        "(Settings → App center → Public API). " +
        "Actie: Controleer Public API token, App Center Plus en endpoint."
      );
    }
    if (msg.includes("429")) {
      return "Shiftbase rate limit bereikt. Probeer later opnieuw.";
    }
    if (msg.includes("niet geconfigureerd")) {
      return "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd op de server.";
    }
    if (msg.includes("404") || msg.includes("geen geldig endpoint")) {
      return msg.includes("/employees") || msg.includes("404")
        ? msg.includes("developer.shiftbase.com")
          ? msg
          : `${msg} ${SHIFTBASE_404_EMPLOYEES_HINT}`
        : msg;
    }
    if (msg.includes("Shiftbase API fout") || msg.includes("Shiftbase endpoint")) {
      return msg;
    }
  }
  return (
    "Shiftbase koppeling mislukt. " +
    "Actie: Controleer Public API token, App Center Plus en endpoint."
  );
}

export function sanitizeShiftbaseUiMessage(message: unknown): string {
  if (typeof message !== "string" || !message.trim()) {
    return "Shiftbase koppeling mislukt. Controleer token of API-toegang.";
  }
  const safe = message
    .replace(/API\s+[A-Za-z0-9_-]{8,}/gi, "[token]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "[token]")
    .replace(/Authorization[:\s]+[^\s]+/gi, "Authorization: [verborgen]");
  return safe.length > 400 ? `${safe.slice(0, 400)}…` : safe;
}

type ShiftbaseRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/**
 * Server-side Shiftbase HTTP helper.
 * Auth: `Authorization: API ${key}` — nooit Bearer. Logt nooit de token.
 */
export async function shiftbaseRequest<T = unknown>(
  path: string,
  options: ShiftbaseRequestOptions = {},
): Promise<T> {
  const token = getShiftbaseApiToken();
  if (!token) {
    throw new Error(
      "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd",
    );
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = resolveShiftbaseUrl(cleanPath);

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `API ${token}`,
      ...options.headers,
    },
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(
      "[Shiftbase] Request failed:",
      response.status,
      cleanPath,
      body.slice(0, 500),
    );
    throw new ShiftbaseApiError(response.status, cleanPath, body);
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
      obj.users ??
      obj.employees ??
      obj.result ??
      obj.records ??
      obj.results ??
      obj.shifts ??
      obj.timesheets ??
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
    throw new Error(
      "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd",
    );
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
  statusCode?: number;
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
  let lastPath = paths[0] ?? "/users";
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
          statusCode: result.status,
          attempts,
        };
      }

      if (result.status === 401 || result.status === 403) {
        throw new ShiftbaseApiError(
          result.status,
          result.path,
          `Token geweigerd op ${result.baseUrl}${result.path}`,
        );
      }

      if (result.status === 429) {
        throw new ShiftbaseApiError(
          429,
          result.path,
          `Rate limit op ${result.baseUrl}${result.path}`,
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
      `Gebruik /users (niet /employees). ` +
      `Zet in Vercel SHIFTBASE_API_BASE_URL=${DEFAULT_BASE_URL}, redeploy, en test opnieuw. ` +
      SHIFTBASE_404_EMPLOYEES_HINT,
  );
}

/**
 * Haalt medewerkers op via GET /users (fallback /users?active=true).
 * Probeert nooit /employees — die route bestaat niet in de Public API.
 */
export async function getShiftbaseEmployees(): Promise<{
  employees: ShiftbaseEmployee[];
  endpointUsed: string;
}> {
  let lastError: unknown;

  for (const endpoint of SHIFTBASE_EMPLOYEE_ENDPOINTS) {
    try {
      const data = await shiftbaseRequest(endpoint);
      const employees = extractList(data, mapEmployee).filter(
        (e) => e.id || e.email || (e.fullName && e.fullName.trim().length > 0),
      );
      return { employees, endpointUsed: endpoint };
    } catch (err) {
      lastError = err;
      if (err instanceof ShiftbaseApiError && err.status === 404) {
        // Probeer volgende endpoint; na alle 404's duidelijke fout.
        continue;
      }
      throw err;
    }
  }

  if (lastError instanceof ShiftbaseApiError && lastError.status === 404) {
    throw new ShiftbaseApiError(
      404,
      lastError.path,
      SHIFTBASE_404_EMPLOYEES_HINT,
    );
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Shiftbase medewerkers ophalen mislukt");
}

/** Alias — zelfde als getShiftbaseEmployees (retourneert alleen de lijst). */
export async function fetchShiftbaseEmployees(): Promise<ShiftbaseEmployee[]> {
  const { employees } = await getShiftbaseEmployees();
  return employees;
}

/**
 * Zelfde als getShiftbaseEmployees, met endpoint metadata voor sync/status UI.
 */
export async function fetchShiftbaseEmployeesWithMeta(): Promise<{
  employees: ShiftbaseEmployee[];
  endpointUsed: string;
}> {
  return getShiftbaseEmployees();
}

export async function getShiftbaseEmployeeById(id: string): Promise<ShiftbaseEmployee> {
  const data = await shiftbaseRequest<Record<string, unknown>>(
    SHIFTBASE_ENDPOINTS.user(id),
  );
  const employee = (data.data ?? data.user ?? data.User ?? data.employee ?? data) as Record<
    string,
    unknown
  >;
  return mapEmployee(employee);
}

/** Safe status probe — GET /users, never returns the token. */
export async function probeShiftbaseUsersStatus(): Promise<{
  connected: boolean;
  statusCode: number | null;
  endpointUsed: string;
  message: string;
}> {
  if (!isShiftbaseConfigured()) {
    return {
      connected: false,
      statusCode: null,
      endpointUsed: "/users",
      message:
        "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN ontbreekt op de server.",
    };
  }

  const endpoint = SHIFTBASE_EMPLOYEE_ENDPOINTS[0];
  try {
    await shiftbaseRequest(endpoint);
    return {
      connected: true,
      statusCode: 200,
      endpointUsed: endpoint,
      message: `Shiftbase verbonden via ${endpoint}.`,
    };
  } catch (err) {
    if (err instanceof ShiftbaseApiError) {
      return {
        connected: false,
        statusCode: err.status,
        endpointUsed: err.path || endpoint,
        message: formatShiftbaseError(err),
      };
    }
    return {
      connected: false,
      statusCode: null,
      endpointUsed: endpoint,
      message: formatShiftbaseError(err),
    };
  }
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
