"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ClientRequestForm from "@/components/client-portal/ClientRequestForm";
import ClientRequestTable from "@/components/client-portal/ClientRequestTable";
import type { ClientRequest } from "@/lib/clientPortal";
import { createClientRequestAction } from "@/lib/client-portal/mutations";

function mapDbStatus(
  status: string,
): ClientRequest["status"] {
  switch (status) {
    case "draft":
      return "Concept";
    case "submitted":
      return "Ingediend";
    case "in_progress":
      return "In behandeling";
    case "confirmed":
      return "Bevestigd";
    case "rejected":
      return "Afgewezen";
    case "cancelled":
      return "Geannuleerd";
    default:
      return "Ingediend";
  }
}

function toClientRequest(row: {
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
}): ClientRequest {
  return {
    id: row.id,
    title: row.title,
    requestedDate: row.created_at.slice(0, 10),
    eventDate: row.event_date ?? "",
    locationName: row.location_name ?? "",
    rolesNeeded: row.roles_needed ?? [],
    numberOfPeople: row.number_of_people,
    startTime: row.start_time ?? "",
    endTime: row.end_time ?? "",
    urgent: row.urgent,
    notes: row.notes ?? undefined,
    status: mapDbStatus(row.status),
    createdAt: row.created_at,
  };
}

export default function ClientRequestsPageClient({
  initialRequests,
}: {
  initialRequests: Array<{
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
  }>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<ClientRequest[]>([]);

  const requests = useMemo(() => {
    const mapped = initialRequests.map(toClientRequest);
    return [...optimistic, ...mapped];
  }, [initialRequests, optimistic]);

  async function persist(request: ClientRequest, asDraft: boolean) {
    setError(null);
    const res = await createClientRequestAction({
      title: request.title,
      eventDate: request.eventDate,
      startTime: request.startTime,
      endTime: request.endTime,
      locationName: request.locationName,
      locationAddress: request.locationAddress,
      numberOfPeople: request.numberOfPeople,
      rolesNeeded: request.rolesNeeded,
      deploymentType: request.deploymentType,
      clothing: request.clothing,
      onSiteContact: request.onSiteContact,
      onSitePhone: request.onSitePhone,
      notes: request.notes,
      urgent: request.urgent,
      asDraft,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setOptimistic((prev) => [
      { ...request, id: res.data.id, status: asDraft ? "Concept" : "Ingediend" },
      ...prev,
    ]);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <ClientRequestForm
        onSubmit={(request) => void persist(request, false)}
        onSaveDraft={(request) => void persist(request, true)}
      />
      <ClientRequestTable requests={requests} />
    </div>
  );
}
