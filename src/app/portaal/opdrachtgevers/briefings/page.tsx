"use client";

import { useState } from "react";
import ClientBriefingForm from "@/components/client-portal/ClientBriefingForm";
import ClientBriefingTable from "@/components/client-portal/ClientBriefingTable";
import type { ClientBriefing } from "@/lib/clientPortal";
import { DEMO_CLIENT_BRIEFINGS } from "@/lib/clientPortal";

export default function ClientBriefingsPage() {
  const [briefings, setBriefings] = useState<ClientBriefing[]>(DEMO_CLIENT_BRIEFINGS);

  function handleSubmit(briefing: ClientBriefing) {
    setBriefings((prev) => {
      const existing = prev.findIndex((b) => b.projectId === briefing.projectId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = briefing;
        return next;
      }
      return [briefing, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <ClientBriefingForm onSubmit={handleSubmit} />
      <ClientBriefingTable briefings={briefings} />
    </div>
  );
}
