import { createClient } from "@/lib/supabase/server";
import {
  endOfWeek,
  startOfWeek,
  toDateString,
} from "@/lib/dashboard/calculations";
import {
  aggregateFinanceOverview,
  resolveFinancePeriod,
  type FinanceOverview,
} from "@/lib/dashboard/financeOverview";
import type {
  Client,
  CompanySetting,
  CrewMember,
  DashboardStats,
  InternalMessage,
  InvoiceDraft,
  Lead,
  Project,
  RateSettingsValue,
  Shift,
  Task,
  TimeEntry,
} from "@/lib/dashboard/types";

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = error.message ?? "";
  // Column-missing errors also contain "does not exist" — do not treat those as
  // a missing table (that previously emptied time_entries and zeroed finance costs).
  if (/column\b/i.test(msg) && /does not exist|schema cache/i.test(msg)) {
    return false;
  }
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    msg.includes("Could not find the table") ||
    (/relation/i.test(msg) && /does not exist/i.test(msg)) ||
    (/Could not find the table/i.test(msg))
  );
}

function isMissingColumnError(message: string | null | undefined): boolean {
  if (!message) return false;
  return (
    (/column\b/i.test(message) || /schema cache/i.test(message)) &&
    (/does not exist/i.test(message) || /schema cache/i.test(message))
  );
}

async function safeSelect<T>(
  run: () => PromiseLike<{ data: T[] | null; error: { code?: string; message?: string } | null }>,
): Promise<{ data: T[]; missing: boolean; error: string | null }> {
  try {
    const { data, error } = await run();
    if (error) {
      if (isMissingTableError(error)) {
        return { data: [], missing: true, error: null };
      }
      return { data: [], missing: false, error: error.message ?? "Onbekende fout" };
    }
    return { data: (data ?? []) as T[], missing: false, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Onbekende fout";
    return { data: [], missing: true, error: message };
  }
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const result = await safeSelect<Client>(() =>
    supabase.from("clients").select("*").order("company_name", { ascending: true }),
  );
  return result.data;
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const result = await safeSelect<Lead>(() =>
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
  );
  return result.data;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const result = await safeSelect<Project>(() =>
    supabase
      .from("projects")
      .select("*, clients(id, company_name)")
      .order("start_date", { ascending: false, nullsFirst: false }),
  );
  return result.data;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function getCrewMembers(): Promise<CrewMember[]> {
  const supabase = await createClient();
  const result = await safeSelect<CrewMember>(() =>
    supabase.from("crew_members").select("*").order("full_name", { ascending: true }),
  );
  return result.data.map((row) => ({
    ...row,
    skills: row.skills ?? [],
    certificates: row.certificates ?? [],
  }));
}

export async function getShifts(options?: {
  from?: string;
  to?: string;
}): Promise<Shift[]> {
  const supabase = await createClient();
  let query = supabase
    .from("shifts")
    .select(
      "*, projects(id, project_name), crew_members(id, full_name)",
    )
    .order("shift_date", { ascending: true });

  if (options?.from) query = query.gte("shift_date", options.from);
  if (options?.to) query = query.lte("shift_date", options.to);

  const result = await safeSelect<Shift>(() => query);
  return result.data;
}

const TIME_ENTRY_SELECT_FULL =
  "*, projects(id, project_name, default_hourly_rate, client_id), crew_members(id, full_name, hourly_cost, gross_hourly_wage, employment_type, fooks_ww_tariff, shiftbase_user_id)";

const TIME_ENTRY_SELECT_BASIC =
  "*, projects(id, project_name, default_hourly_rate, client_id), crew_members(id, full_name, hourly_cost, employment_type, shiftbase_user_id)";

const TIME_ENTRY_SELECT_MINIMAL =
  "*, projects(id, project_name, default_hourly_rate, client_id), crew_members(id, full_name, hourly_cost, shiftbase_user_id)";

/**
 * Normalize nested crew embed (object | array) and optionally fill missing
 * cost fields from a crew_members map (same path as Crew UI).
 */
function attachCrewCostFields(
  entries: TimeEntry[],
  crewById?: Map<string, CrewMember>,
): TimeEntry[] {
  return entries.map((entry) => {
    // PostgREST may return a one-to-many embed as an array; normalize to object.
    const raw = entry.crew_members as
      | TimeEntry["crew_members"]
      | NonNullable<TimeEntry["crew_members"]>[]
      | null
      | undefined;
    const fromEmbed = Array.isArray(raw) ? (raw[0] ?? null) : (raw ?? null);
    const fromMap =
      entry.crew_member_id && crewById
        ? crewById.get(entry.crew_member_id)
        : undefined;

    if (!fromEmbed && !fromMap) {
      return { ...entry, crew_members: null };
    }

    const merged = {
      id: fromEmbed?.id ?? fromMap?.id ?? entry.crew_member_id ?? "",
      full_name: fromEmbed?.full_name ?? fromMap?.full_name ?? "Onbekende crew",
      hourly_cost: fromEmbed?.hourly_cost ?? fromMap?.hourly_cost ?? null,
      gross_hourly_wage:
        fromEmbed?.gross_hourly_wage ?? fromMap?.gross_hourly_wage ?? null,
      employment_type:
        fromEmbed?.employment_type ?? fromMap?.employment_type ?? "other",
      shiftbase_user_id:
        fromEmbed?.shiftbase_user_id ?? fromMap?.shiftbase_user_id ?? null,
    } satisfies NonNullable<TimeEntry["crew_members"]>;

    return { ...entry, crew_members: merged };
  });
}

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const supabase = await createClient();

  const full = await safeSelect<TimeEntry>(() =>
    supabase
      .from("time_entries")
      .select(TIME_ENTRY_SELECT_FULL)
      .order("work_date", { ascending: false }),
  );
  if (!full.error) {
    return attachCrewCostFields(full.data);
  }

  // Fooks columns may be absent until supabase/crew-fooks-columns.sql is run.
  if (isMissingColumnError(full.error)) {
    const basic = await safeSelect<TimeEntry>(() =>
      supabase
        .from("time_entries")
        .select(TIME_ENTRY_SELECT_BASIC)
        .order("work_date", { ascending: false }),
    );
    if (!basic.error) {
      return attachCrewCostFields(basic.data);
    }

    const minimal = await safeSelect<TimeEntry>(() =>
      supabase
        .from("time_entries")
        .select(TIME_ENTRY_SELECT_MINIMAL)
        .order("work_date", { ascending: false }),
    );
    if (!minimal.error) {
      return attachCrewCostFields(minimal.data);
    }
  }

  // Last resort: bare rows (caller/finance may still enrich via getCrewMembers).
  const bare = await safeSelect<TimeEntry>(() =>
    supabase
      .from("time_entries")
      .select("*")
      .order("work_date", { ascending: false }),
  );
  return attachCrewCostFields(bare.data);
}

export async function getApprovedUninvoicedTimeEntries(): Promise<TimeEntry[]> {
  const entries = await getTimeEntries();
  return entries.filter((e) => e.status === "approved");
}

const ACTIVE_INVOICE_DRAFT_STATUSES = new Set([
  "draft",
  "ready",
  "sent",
  "paid",
]);

/**
 * Factuurconcepten voor finance/owner/admin (RLS: is_internal_role).
 * Meerdere fallbacks: Moneybird-kolommen of geneste joins mogen ontbreken
 * zonder dat de lijst stil leeg blijft.
 */
export async function getInvoiceDrafts(): Promise<InvoiceDraft[]> {
  const result = await getInvoiceDraftsResult();
  return result.data;
}

export async function getInvoiceDraftsResult(): Promise<{
  data: InvoiceDraft[];
  error: string | null;
}> {
  const supabase = await createClient();

  const primary = await safeSelect<InvoiceDraft>(() =>
    supabase
      .from("invoice_drafts")
      .select(
        "*, clients(id, company_name, moneybird_contact_id), projects(id, project_name), invoice_draft_lines(*)",
      )
      .order("created_at", { ascending: false }),
  );
  if (!primary.error) {
    return { data: primary.data, error: null };
  }

  const needsMoneybirdFallback =
    /moneybird_/i.test(primary.error) &&
    (/column/i.test(primary.error) ||
      /schema cache/i.test(primary.error) ||
      /does not exist/i.test(primary.error));

  if (needsMoneybirdFallback) {
    const fallback = await safeSelect<InvoiceDraft>(() =>
      supabase
        .from("invoice_drafts")
        .select(
          "*, clients(id, company_name), projects(id, project_name), invoice_draft_lines(*)",
        )
        .order("created_at", { ascending: false }),
    );
    if (!fallback.error) {
      return { data: fallback.data, error: null };
    }
  }

  // Laatste fallback: platte drafts zonder embeds (RLS/join-fouten).
  const bare = await safeSelect<InvoiceDraft>(() =>
    supabase
      .from("invoice_drafts")
      .select("*")
      .order("created_at", { ascending: false }),
  );
  if (!bare.error) {
    return {
      data: bare.data.map((d) => ({
        ...d,
        invoice_draft_lines: d.invoice_draft_lines ?? [],
      })),
      error: null,
    };
  }

  return {
    data: [],
    error:
      primary.error ||
      bare.error ||
      "Factuurconcepten konden niet worden geladen (controleer RLS / is_internal_role).",
  };
}

/**
 * Gefactureerde uren zonder actief factuurconcept op hetzelfde project.
 * Ontstaat o.a. als concept is verwijderd/geannuleerd terwijl status `invoiced` bleef,
 * of als de drafts-query faalt terwijl uren wél als gefactureerd staan.
 */
export async function getInvoicedOrphanTimeEntries(
  drafts?: InvoiceDraft[],
): Promise<TimeEntry[]> {
  const [entries, draftRows] = await Promise.all([
    getTimeEntries(),
    drafts ? Promise.resolve(drafts) : getInvoiceDrafts(),
  ]);
  const projectsWithActiveDraft = new Set(
    draftRows
      .filter((d) => ACTIVE_INVOICE_DRAFT_STATUSES.has(d.status))
      .map((d) => d.project_id)
      .filter((id): id is string => Boolean(id)),
  );
  return entries.filter(
    (e) =>
      e.status === "invoiced" &&
      (!e.project_id || !projectsWithActiveDraft.has(e.project_id)),
  );
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const result = await safeSelect<Task>(() =>
    supabase.from("tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
  );
  return result.data;
}

export async function getInternalMessages(): Promise<InternalMessage[]> {
  const supabase = await createClient();
  const result = await safeSelect<InternalMessage>(() =>
    supabase
      .from("internal_messages")
      .select("*")
      .order("created_at", { ascending: false }),
  );
  return result.data;
}

export async function getCompanySettings(): Promise<CompanySetting[]> {
  const supabase = await createClient();
  const result = await safeSelect<CompanySetting>(() =>
    supabase.from("company_settings").select("*").order("key", { ascending: true }),
  );
  return result.data.map((row) => ({
    ...row,
    value: (row.value ?? {}) as Record<string, unknown>,
  }));
}

export async function getCompanySettingMap(): Promise<
  Record<string, Record<string, unknown>>
> {
  const rows = await getCompanySettings();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export const DEFAULT_RATE_SETTINGS: RateSettingsValue = {
  km_rate: 0.25,
  vat_percent: 21,
  site_crew: 31.5,
  horeca_allround: 31.5,
  keukenhulp: 32.5,
  zelfstandig_kok: 40,
  teamcaptain: 42.5,
};

export async function getRateSettings(): Promise<RateSettingsValue> {
  const map = await getCompanySettingMap();
  const rates = map.rates ?? {};
  return {
    km_rate: Number(rates.km_rate ?? DEFAULT_RATE_SETTINGS.km_rate),
    vat_percent: Number(rates.vat_percent ?? DEFAULT_RATE_SETTINGS.vat_percent),
    site_crew: Number(rates.site_crew ?? DEFAULT_RATE_SETTINGS.site_crew),
    horeca_allround: Number(
      rates.horeca_allround ?? DEFAULT_RATE_SETTINGS.horeca_allround,
    ),
    keukenhulp: Number(rates.keukenhulp ?? DEFAULT_RATE_SETTINGS.keukenhulp),
    zelfstandig_kok: Number(
      rates.zelfstandig_kok ?? DEFAULT_RATE_SETTINGS.zelfstandig_kok,
    ),
    teamcaptain: Number(rates.teamcaptain ?? DEFAULT_RATE_SETTINGS.teamcaptain),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();
    const weekFrom = toDateString(startOfWeek());
    const weekTo = toDateString(endOfWeek());

    const [
      projectsRes,
      crewRes,
      shiftsRes,
      hoursRes,
      invoicesRes,
      tasksRes,
      leadsRes,
    ] = await Promise.all([
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("projects").select("id, status"),
      ),
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("crew_members").select("id, status"),
      ),
      safeSelect<{ id: string }>(() =>
        supabase
          .from("shifts")
          .select("id")
          .gte("shift_date", weekFrom)
          .lte("shift_date", weekTo)
          .neq("status", "cancelled"),
      ),
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("time_entries").select("id, status"),
      ),
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("invoice_drafts").select("id, status"),
      ),
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("tasks").select("id, status"),
      ),
      safeSelect<{ id: string; status: string }>(() =>
        supabase.from("leads").select("id, status"),
      ),
    ]);

    const missing =
      projectsRes.missing ||
      crewRes.missing ||
      shiftsRes.missing ||
      hoursRes.missing ||
      invoicesRes.missing ||
      tasksRes.missing ||
      leadsRes.missing;

    const errorMessage =
      projectsRes.error ||
      crewRes.error ||
      shiftsRes.error ||
      hoursRes.error ||
      invoicesRes.error ||
      tasksRes.error ||
      leadsRes.error ||
      null;

    const openProjectStatuses = new Set(["draft", "confirmed", "in_progress"]);

    return {
      openProjects: projectsRes.data.filter((p) =>
        openProjectStatuses.has(p.status),
      ).length,
      availableCrew: crewRes.data.filter((c) => c.status === "active").length,
      shiftsThisWeek: shiftsRes.data.length,
      openHoursReview: hoursRes.data.filter((h) => h.status === "submitted")
        .length,
      invoiceDrafts: invoicesRes.data.filter((i) =>
        ["draft", "ready"].includes(i.status),
      ).length,
      openTasks: tasksRes.data.filter((t) =>
        ["open", "in_progress"].includes(t.status),
      ).length,
      newLeads: leadsRes.data.filter((l) => l.status === "new").length,
      tablesReady: !missing,
      errorMessage: missing
        ? "Database-tabellen nog niet aangemaakt. Voer docs/internal-dashboard-database.md uit in Supabase."
        : errorMessage,
    };
  } catch {
    return {
      openProjects: 0,
      availableCrew: 0,
      shiftsThisWeek: 0,
      openHoursReview: 0,
      invoiceDrafts: 0,
      openTasks: 0,
      newLeads: 0,
      tablesReady: false,
      errorMessage:
        "Database-tabellen nog niet aangemaakt. Voer docs/internal-dashboard-database.md uit in Supabase.",
    };
  }
}

export type {
  FinanceBreakdownRow,
  FinanceOverview,
  FinancePeriod,
  FinancePeriodKey,
} from "@/lib/dashboard/financeOverview";

export type FinanceSummary = {
  draftRevenue: number;
  readyRevenue: number;
  paidRevenue: number;
  totalHours: number;
  travelCosts: number;
  crewCostEstimate: number;
  marginEstimate: number;
  marginPercent: number | null;
  openDraftCount: number;
};

/**
 * Finance overview: omzet (facturen excl. BTW) − personeelskosten (uren × uurkost).
 * Facturen op `created_at`; uren via work_date in periode óf invoiced uren op
 * hetzelfde project als een verstuurde/betaalde factuur in die periode.
 * Crew-uurkost: hourly_cost > 0, anders bruto × Fooks (via crew map fallback).
 */
export async function getFinanceOverview(options?: {
  period?: string | null;
  from?: string | null;
  to?: string | null;
}): Promise<FinanceOverview> {
  const [drafts, entries, crew] = await Promise.all([
    getInvoiceDrafts(),
    getTimeEntries(),
    getCrewMembers(),
  ]);

  const crewById = new Map(crew.map((c) => [c.id, c]));
  const enriched = attachCrewCostFields(entries, crewById);

  const period = resolveFinancePeriod(
    options?.period,
    options?.from,
    options?.to,
  );
  return aggregateFinanceOverview(drafts, enriched, period);
}

/** @deprecated Prefer getFinanceOverview — kept for legacy KPI shapes. */
export async function getFinanceSummary(): Promise<FinanceSummary> {
  const overview = await getFinanceOverview({ period: "all" });
  const openDraftCount = (
    await getInvoiceDrafts()
  ).filter((d) => ["draft", "ready"].includes(d.status)).length;

  return {
    draftRevenue: overview.conceptOmzet,
    readyRevenue: overview.omzet - overview.betaaldeOmzet,
    paidRevenue: overview.betaaldeOmzet,
    totalHours: overview.totalHours,
    travelCosts: overview.gefactureerdeReiskosten,
    crewCostEstimate: overview.personeelskosten,
    marginEstimate: overview.marge,
    marginPercent: overview.margePercent,
    openDraftCount,
  };
}
