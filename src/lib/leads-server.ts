import {
  mockLeadFollowUps,
  mockLeads,
  type Lead,
  type LeadFollowUp,
} from "@/data/leadsMockData";
import { createClient } from "@/lib/supabase/server";

import type { LeadsDataSource, LeadsPageData } from "@/lib/leads-utils";

type SalesLeadRow = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  source: string | null;
  status: string;
  priority: string;
  estimated_value: number;
  owner_id: string | null;
  last_contact_at: string | null;
  next_action: string | null;
  next_action_date: string | null;
  notes: string | null;
  hubspot_contact_id: string | null;
  hubspot_company_id: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};

function mapRowToLead(row: SalesLeadRow): Lead {
  const bron = (row.source ?? "handmatig") as Lead["bron"];
  const status = row.status as Lead["status"];
  const prioriteit = row.priority as Lead["prioriteit"];

  let hubspotSyncStatus: Lead["hubspotSyncStatus"] = "niet_gesynchroniseerd";
  if (row.hubspot_contact_id) {
    hubspotSyncStatus = "gesynchroniseerd";
  }

  const lastContactDate = row.last_contact_at
    ? new Date(row.last_contact_at)
    : null;

  return {
    id: row.id,
    bedrijf: row.company_name,
    contact: row.contact_name ?? "",
    email: row.email ?? "",
    telefoon: row.phone ?? "",
    website: row.website ?? undefined,
    bron,
    status,
    prioriteit,
    waarde: Number(row.estimated_value) || 0,
    eigenaar: row.profiles?.full_name ?? "—",
    laatsteContact: lastContactDate
      ? lastContactDate.toLocaleDateString("nl-NL")
      : "—",
    laatsteContactAt: row.last_contact_at ?? undefined,
    volgendeActie: row.next_action ?? "—",
    volgendeActieDatum: row.next_action_date ?? undefined,
    notities: row.notes ?? undefined,
    hubspotContactId: row.hubspot_contact_id ?? undefined,
    hubspotCompanyId: row.hubspot_company_id ?? undefined,
    hubspotSyncStatus,
    createdAt: row.created_at,
  };
}

export async function getLeadsPageData(): Promise<LeadsPageData> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sales_leads")
      .select(
        `
        *,
        profiles:owner_id ( full_name )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.message.includes("does not exist") ||
        error.message.includes("relation")
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Leads] sales_leads tabel niet gevonden — mock data wordt gebruikt. Voer supabase/sales-leads.sql uit.",
          );
        }
        return {
          leads: mockLeads,
          followUps: mockLeadFollowUps,
          source: "mock",
          error: null,
        };
      }

      if (process.env.NODE_ENV === "development") {
        console.warn("[Leads] Supabase fout — mock data fallback:", error.message);
      }

      return {
        leads: mockLeads,
        followUps: mockLeadFollowUps,
        source: "mock",
        error: null,
      };
    }

    if (!data || data.length === 0) {
      return {
        leads: mockLeads,
        followUps: mockLeadFollowUps,
        source: "mock",
        error: null,
      };
    }

    return {
      leads: (data as SalesLeadRow[]).map(mapRowToLead),
      followUps: mockLeadFollowUps,
      source: "supabase",
      error: null,
    };
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Leads] Supabase niet beschikbaar — mock data wordt gebruikt.",
      );
    }

    return {
      leads: mockLeads,
      followUps: mockLeadFollowUps,
      source: "mock",
      error: null,
    };
  }
}
