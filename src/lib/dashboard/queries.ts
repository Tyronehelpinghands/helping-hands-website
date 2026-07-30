import { createClient } from "@/lib/supabase/server";
import {
  endOfWeek,
  startOfWeek,
  toDateString,
} from "@/lib/dashboard/calculations";
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
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("relation") ||
    msg.includes("Could not find the table")
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

export async function getTimeEntries(): Promise<TimeEntry[]> {
  const supabase = await createClient();
  const result = await safeSelect<TimeEntry>(() =>
    supabase
      .from("time_entries")
      .select(
        "*, projects(id, project_name, default_hourly_rate, client_id), crew_members(id, full_name, hourly_cost, shiftbase_user_id)",
      )
      .order("work_date", { ascending: false }),
  );
  return result.data;
}

export async function getApprovedUninvoicedTimeEntries(): Promise<TimeEntry[]> {
  const entries = await getTimeEntries();
  return entries.filter((e) => e.status === "approved");
}

export async function getInvoiceDrafts(): Promise<InvoiceDraft[]> {
  const supabase = await createClient();
  const result = await safeSelect<InvoiceDraft>(() =>
    supabase
      .from("invoice_drafts")
      .select(
        "*, clients(id, company_name), projects(id, project_name), invoice_draft_lines(*)",
      )
      .order("created_at", { ascending: false }),
  );
  return result.data;
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

export async function getFinanceSummary(): Promise<FinanceSummary> {
  const [drafts, entries, rates] = await Promise.all([
    getInvoiceDrafts(),
    getTimeEntries(),
    getRateSettings(),
  ]);

  const activeDrafts = drafts.filter((d) => d.status !== "cancelled");
  const draftRevenue = activeDrafts
    .filter((d) => d.status === "draft")
    .reduce((sum, d) => sum + Number(d.total_amount || 0), 0);
  const readyRevenue = activeDrafts
    .filter((d) => d.status === "ready" || d.status === "sent")
    .reduce((sum, d) => sum + Number(d.total_amount || 0), 0);
  const paidRevenue = activeDrafts
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + Number(d.total_amount || 0), 0);

  const approvedOrInvoiced = entries.filter((e) =>
    ["approved", "invoiced"].includes(e.status),
  );
  const totalHours = approvedOrInvoiced.reduce(
    (sum, e) => sum + Number(e.hours || 0),
    0,
  );
  const travelCosts = approvedOrInvoiced.reduce(
    (sum, e) =>
      sum + Number(e.kilometers || 0) * Number(rates.km_rate || 0.25),
    0,
  );
  const crewCostEstimate = approvedOrInvoiced.reduce((sum, e) => {
    const cost = Number(e.crew_members?.hourly_cost || 0);
    return sum + cost * Number(e.hours || 0);
  }, 0);

  const revenue = draftRevenue + readyRevenue + paidRevenue;
  const marginEstimate = Math.round((revenue - crewCostEstimate) * 100) / 100;
  const marginPercent =
    revenue > 0 ? Math.round((marginEstimate / revenue) * 1000) / 10 : null;

  return {
    draftRevenue: Math.round(draftRevenue * 100) / 100,
    readyRevenue: Math.round(readyRevenue * 100) / 100,
    paidRevenue: Math.round(paidRevenue * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    travelCosts: Math.round(travelCosts * 100) / 100,
    crewCostEstimate: Math.round(crewCostEstimate * 100) / 100,
    marginEstimate,
    marginPercent,
    openDraftCount: drafts.filter((d) =>
      ["draft", "ready"].includes(d.status),
    ).length,
  };
}
