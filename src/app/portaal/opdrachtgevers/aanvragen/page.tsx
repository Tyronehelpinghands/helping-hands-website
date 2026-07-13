"use client";

import { useState } from "react";
import ClientRequestForm from "@/components/client-portal/ClientRequestForm";
import ClientRequestTable from "@/components/client-portal/ClientRequestTable";
import type { ClientRequest } from "@/lib/clientPortal";
import { DEMO_CLIENT_REQUESTS } from "@/lib/clientPortal";

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState<ClientRequest[]>(DEMO_CLIENT_REQUESTS);

  function handleSubmit(request: ClientRequest) {
    setRequests((prev) => [request, ...prev]);
  }

  function handleSaveDraft(request: ClientRequest) {
    setRequests((prev) => [request, ...prev]);
  }

  return (
    <div className="space-y-6">
      <ClientRequestForm onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} />
      <ClientRequestTable requests={requests} />
    </div>
  );
}
