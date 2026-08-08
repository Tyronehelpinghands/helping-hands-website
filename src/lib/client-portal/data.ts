/**
 * Opdrachtgeversportaal — live hours + km from the same time_entries table.
 */

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createClient } from "@/lib/supabase/server";
import type { ClientHoursSummary } from "@/lib/clientPortal";
import { DEFAULT_TRAVEL_RATE_PER_KM } from "@/lib/rates";
import type { TimeEntryStatus } from "@/lib/dashboard/types";
import {
  CLIENT_VISIBLE_STATUSES,
  computeKmTravelCost,
  mapTimeEntryStatusToClientNl,
  normalizeKilometers,
} from "@/lib/time-entries/shared";

export type ClientPortalHoursBundle = {
  clientId: string | null;
  hours: ClientHoursSummary[];
  kmRate: number;
  errorMessage: string | null;
};

function isMissingTableError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false;
  const msg = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("Could not find the table")
  );
}

export async function resolveClientIdForUser(
  userId: string,
  email: string | null | undefined,
): Promise<string | null> {
  const supabase = await createClient();
  const { data: byProfile } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();
  if (byProfile?.id) return byProfile.id;

  if (email?.trim()) {
    const { data: byEmail } = await supabase
      .from("clients")
      .select("id")
      .ilike("email", email.trim())
      .maybeSingle();
    if (byEmail?.id) return byEmail.id;
  }
  return null;
}

async function getKmRate(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_settings")
    .select("value")
    .eq("key", "rates")
    .maybeSingle();
  const rates = (data?.value ?? {}) as { km_rate?: number };
  const rate = Number(rates.km_rate);
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_TRAVEL_RATE_PER_KM;
}

type RawEntry = {
  id: string;
  project_id: string | null;
  work_date: string;
  hours: number | null;
  kilometers: number | null;
  status: TimeEntryStatus;
  projects?: { id: string; project_name: string; client_id: string | null } | null;
};

/**
 * Aggregate time_entries by project + date for the opdrachtgever view.
 * Same rows intern uses for approve → invoice (incl. kilometers).
 */
export function aggregateClientHours(
  entries: RawEntry[],
  kmRate: number,
): ClientHoursSummary[] {
  const groups = new Map<
    string,
    {
      projectId: string;
      projectName: string;
      date: string;
      totalHours: number;
      totalKilometers: number;
      statuses: TimeEntryStatus[];
      ids: string[];
    }
  >();

  for (const entry of entries) {
    if (!entry.project_id || !CLIENT_VISIBLE_STATUSES.includes(entry.status)) {
      continue;
    }
    const key = `${entry.project_id}|${entry.work_date}`;
    const existing = groups.get(key);
    const hours = Number(entry.hours) || 0;
    const km = normalizeKilometers(entry.kilometers);
    const projectName = entry.projects?.project_name ?? "Project";

    if (!existing) {
      groups.set(key, {
        projectId: entry.project_id,
        projectName,
        date: entry.work_date,
        totalHours: hours,
        totalKilometers: km,
        statuses: [entry.status],
        ids: [entry.id],
      });
    } else {
      existing.totalHours += hours;
      existing.totalKilometers += km;
      existing.statuses.push(entry.status);
      existing.ids.push(entry.id);
    }
  }

  const rank: Record<TimeEntryStatus, number> = {
    draft: 0,
    rejected: 0,
    submitted: 1,
    approved: 2,
    invoiced: 3,
  };

  return Array.from(groups.values())
    .map((g) => {
      const topStatus = g.statuses.reduce((best, s) =>
        rank[s] > rank[best] ? s : best,
      );
      const roundedHours = Math.round(g.totalHours * 100) / 100;
      const billable =
        topStatus === "approved" || topStatus === "invoiced"
          ? roundedHours
          : 0;
      return {
        id: g.ids.sort().join("+").slice(0, 64),
        projectId: g.projectId,
        projectName: g.projectName,
        date: g.date,
        totalHours: roundedHours,
        billableHours: billable,
        totalKilometers: Math.round(g.totalKilometers * 100) / 100,
        travelCost: computeKmTravelCost(g.totalKilometers, kmRate),
        status: mapTimeEntryStatusToClientNl(topStatus),
        entryCount: g.ids.length,
        notes:
          topStatus === "submitted"
            ? "Uren worden gecontroleerd door Helping Hands."
            : undefined,
      } satisfies ClientHoursSummary;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getClientPortalHoursBundle = cache(
  async (): Promise<ClientPortalHoursBundle> => {
    const { user, profile } = await getCurrentUser();
    if (!user || !profile) {
      return {
        clientId: null,
        hours: [],
        kmRate: DEFAULT_TRAVEL_RATE_PER_KM,
        errorMessage: "Niet ingelogd.",
      };
    }

    const clientId = await resolveClientIdForUser(
      user.id,
      profile.email ?? user.email,
    );
    const kmRate = await getKmRate();

    if (!clientId) {
      return {
        clientId: null,
        hours: [],
        kmRate,
        errorMessage:
          "Geen opdrachtgeverprofiel gekoppeld. Vraag Helping Hands om je account te koppelen.",
      };
    }

    const supabase = await createClient();
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, project_name, client_id")
      .eq("client_id", clientId);

    if (projectsError) {
      if (isMissingTableError(projectsError)) {
        return { clientId, hours: [], kmRate, errorMessage: null };
      }
      if (
        projectsError.code === "42501" ||
        projectsError.message?.toLowerCase().includes("row-level security") ||
        projectsError.message?.toLowerCase().includes("permission")
      ) {
        return {
          clientId,
          hours: [],
          kmRate,
          errorMessage:
            "Geen leesrechten op projecten/uren. Voer supabase/hours-km-ecosystem.sql uit in Supabase.",
        };
      }
      return {
        clientId,
        hours: [],
        kmRate,
        errorMessage: projectsError.message,
      };
    }

    const projectRows = projects ?? [];
    if (projectRows.length === 0) {
      return { clientId, hours: [], kmRate, errorMessage: null };
    }

    const projectIds = projectRows.map((p) => p.id);
    const projectNameById = new Map(
      projectRows.map((p) => [p.id, p.project_name] as const),
    );

    const { data, error } = await supabase
      .from("time_entries")
      .select("id, project_id, work_date, hours, kilometers, status")
      .in("project_id", projectIds)
      .in("status", [...CLIENT_VISIBLE_STATUSES])
      .order("work_date", { ascending: false })
      .limit(500);

    if (error) {
      if (isMissingTableError(error)) {
        return { clientId, hours: [], kmRate, errorMessage: null };
      }
      if (
        error.code === "42501" ||
        error.message?.toLowerCase().includes("row-level security") ||
        error.message?.toLowerCase().includes("permission")
      ) {
        return {
          clientId,
          hours: [],
          kmRate,
          errorMessage:
            "Geen leesrechten op uren. Voer supabase/hours-km-ecosystem.sql uit in Supabase.",
        };
      }
      console.error("[client-portal] time_entries:", error.message);
      return {
        clientId,
        hours: [],
        kmRate,
        errorMessage: error.message,
      };
    }

    const rows: RawEntry[] = (data ?? []).map((row) => ({
      ...(row as Omit<RawEntry, "projects">),
      projects: row.project_id
        ? {
            id: row.project_id,
            project_name: projectNameById.get(row.project_id) ?? "Project",
            client_id: clientId,
          }
        : null,
    }));

    return {
      clientId,
      hours: aggregateClientHours(rows, kmRate),
      kmRate,
      errorMessage: null,
    };
  },
);
