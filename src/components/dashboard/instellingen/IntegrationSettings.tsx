"use client";

import IntegrationHealthPanel from "@/components/dashboard/shared/IntegrationHealthPanel";

export default function IntegrationSettingsPanel() {
  return (
    <IntegrationHealthPanel
      title="Koppelingen"
      description="Overzicht van externe integraties. API-tokens blijven server-side in Vercel."
    />
  );
}
