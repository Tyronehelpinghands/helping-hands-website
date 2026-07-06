import { mockProjects, type Project } from "@/data/projectsMockData";
import { createClient } from "@/lib/supabase/server";
import {
  computeCrewStatus,
  type ProjectsDataSource,
  type ProjectsPageData,
} from "@/lib/projects-utils";

type ProjectRow = {
  id: string;
  title: string;
  client_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  project_type: string | null;
  status: string;
  crew_needed: number;
  crew_planned: number;
  customer_hourly_rate: number | null;
  travel_fee_per_km: number | null;
  expected_revenue: number | null;
  notes: string | null;
  crew_briefing: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};

function mapRowToProject(row: ProjectRow): Project {
  const crewNodig = Number(row.crew_needed) || 0;
  const crewIngepland = Number(row.crew_planned) || 0;

  return {
    id: row.id,
    naam: row.title,
    opdrachtgever: row.client_name ?? "—",
    contact: row.contact_name ?? "",
    email: row.contact_email ?? "",
    telefoon: row.contact_phone ?? "",
    locatie: row.location ?? "",
    startDatum: row.start_date ?? "",
    eindDatum: row.end_date ?? undefined,
    startTijd: row.start_time?.slice(0, 5) ?? "08:00",
    eindTijd: row.end_time?.slice(0, 5) ?? "17:00",
    type: (row.project_type ?? "overig") as Project["type"],
    status: row.status as Project["status"],
    planner: row.profiles?.full_name ?? "—",
    crewNodig,
    crewIngepland,
    crewStatus: computeCrewStatus(crewNodig, crewIngepland),
    uurtarief: row.customer_hourly_rate ? Number(row.customer_hourly_rate) : undefined,
    reiskostenPerKm: row.travel_fee_per_km ? Number(row.travel_fee_per_km) : 0.25,
    verwachteOmzet: Number(row.expected_revenue) || 0,
    notities: row.notes ?? undefined,
    crewBriefing: row.crew_briefing ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getProjectsPageData(): Promise<ProjectsPageData> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        profiles:planner_id ( full_name )
      `,
      )
      .order("start_date", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.message.includes("does not exist") ||
        error.message.includes("relation")
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Projecten] projects tabel niet gevonden — mock data wordt gebruikt. Voer supabase/projects-module.sql uit.",
          );
        }
        return { projects: mockProjects, source: "mock", error: null };
      }

      if (process.env.NODE_ENV === "development") {
        console.warn("[Projecten] Supabase fout — mock data fallback:", error.message);
      }
      return { projects: mockProjects, source: "mock", error: null };
    }

    if (!data || data.length === 0) {
      return { projects: mockProjects, source: "mock", error: null };
    }

    return {
      projects: (data as ProjectRow[]).map(mapRowToProject),
      source: "supabase",
      error: null,
    };
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Projecten] Supabase niet beschikbaar — mock data wordt gebruikt.");
    }
    return { projects: mockProjects, source: "mock", error: null };
  }
}
