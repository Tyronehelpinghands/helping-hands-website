"use server";

import { revalidatePath } from "next/cache";
import { clientRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { resolveClientIdForUser } from "@/lib/client-portal/data";
import type { ActionResult } from "@/lib/dashboard/types";
import { createClient } from "@/lib/supabase/server";

function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export type ClientRequestInput = {
  title: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  locationAddress?: string;
  numberOfPeople?: number;
  rolesNeeded?: string[];
  deploymentType?: string;
  clothing?: string;
  onSiteContact?: string;
  onSitePhone?: string;
  notes?: string;
  urgent?: boolean;
  asDraft?: boolean;
};

export async function createClientRequestAction(
  input: ClientRequestInput,
): Promise<ActionResult<{ id: string }>> {
  const profile = await requireRole(clientRoles, {
    redirectTo: "/portaal/opdrachtgevers",
  });

  const title = input.title?.trim();
  if (!title) return fail("Titel is verplicht.");

  const supabase = await createClient();
  const clientId = await resolveClientIdForUser(profile.id, profile.email);

  const { data, error } = await supabase
    .from("client_requests")
    .insert({
      client_id: clientId,
      created_by: profile.id,
      title,
      event_date: input.eventDate || null,
      start_time: input.startTime || null,
      end_time: input.endTime || null,
      location_name: input.locationName || null,
      location_address: input.locationAddress || null,
      number_of_people: input.numberOfPeople ?? 1,
      roles_needed: input.rolesNeeded ?? [],
      deployment_type: input.deploymentType || null,
      clothing: input.clothing || null,
      on_site_contact: input.onSiteContact || null,
      on_site_phone: input.onSitePhone || null,
      notes: input.notes || null,
      urgent: Boolean(input.urgent),
      status: input.asDraft ? "draft" : "submitted",
    })
    .select("id")
    .single();

  if (error) {
    if (
      error.code === "42P01" ||
      error.message?.includes("Could not find the table")
    ) {
      return fail(
        "Aanvragentabel ontbreekt. Voer supabase/helping-hands-app.sql uit in Supabase.",
      );
    }
    return fail(error.message);
  }

  // Notify internal planners (best-effort)
  const { data: planners } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["owner", "admin", "planner"]);

  if (planners?.length) {
    await supabase.from("app_notifications").insert(
      planners.map((p) => ({
        user_id: p.id,
        title: input.asDraft ? "Concept-aanvraag opgeslagen" : "Nieuwe klantaanvraag",
        body: title,
        category: "request",
        link: "/dashboard/intern/projecten",
        meta: { client_request_id: data.id },
      })),
    );
  }

  revalidatePath("/portaal/opdrachtgevers");
  revalidatePath("/portaal/opdrachtgevers/aanvragen");
  revalidatePath("/dashboard/intern");
  return ok({ id: data.id });
}

export async function listClientRequestsAction(): Promise<
  ActionResult<
    Array<{
      id: string;
      title: string;
      event_date: string | null;
      location_name: string | null;
      number_of_people: number;
      roles_needed: string[];
      status: string;
      urgent: boolean;
      created_at: string;
      start_time: string | null;
      end_time: string | null;
      notes: string | null;
    }>
  >
> {
  const profile = await requireRole(clientRoles, {
    redirectTo: "/portaal/opdrachtgevers",
  });
  const supabase = await createClient();
  const clientId = await resolveClientIdForUser(profile.id, profile.email);

  let query = supabase
    .from("client_requests")
    .select(
      "id, title, event_date, location_name, number_of_people, roles_needed, status, urgent, created_at, start_time, end_time, notes",
    )
    .order("created_at", { ascending: false });

  if (clientId) {
    query = query.or(`client_id.eq.${clientId},created_by.eq.${profile.id}`);
  } else {
    query = query.eq("created_by", profile.id);
  }

  const { data, error } = await query;
  if (error) {
    if (
      error.code === "42P01" ||
      error.message?.includes("Could not find the table")
    ) {
      return ok([]);
    }
    return fail(error.message);
  }
  return ok(data ?? []);
}
