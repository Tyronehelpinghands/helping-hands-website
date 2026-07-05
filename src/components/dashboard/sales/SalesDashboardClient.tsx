"use client";

import { useCallback, useState } from "react";
import SalesActionDialog from "@/components/dashboard/sales/SalesActionDialog";
import SalesFollowUpTasks from "@/components/dashboard/sales/SalesFollowUpTasks";
import HubSpotSyncCard from "@/components/dashboard/sales/HubSpotSyncCard";
import SalesKpiCards from "@/components/dashboard/sales/SalesKpiCards";
import SalesLeadsTable from "@/components/dashboard/sales/SalesLeadsTable";
import SalesPageToolbar from "@/components/dashboard/sales/SalesPageToolbar";
import SalesPipelineOverview from "@/components/dashboard/sales/SalesPipelineOverview";
import type {
  PipelineDeal,
  PipelineStage,
  SalesFollowUp,
  SalesKpi,
  SalesLead,
} from "@/data/salesMockData";
import { sanitizeHubSpotUiMessage } from "@/lib/sales-utils";

type DialogConfig = {
  title: string;
  description: string;
};

const dialogConfigs: Record<string, DialogConfig> = {
  lead: {
    title: "Nieuwe lead",
    description: "Voeg een nieuwe lead toe aan de pipeline.",
  },
  deal: {
    title: "Nieuwe deal",
    description: "Maak een nieuwe deal aan en koppel deze aan een lead.",
  },
  followup: {
    title: "Follow-up toevoegen",
    description: "Plan een opvolgtaak voor een lead of deal.",
  },
  view: {
    title: "Lead bekijken",
    description: "Bekijk leadgegevens en contacthistorie.",
  },
  edit: {
    title: "Lead bewerken",
    description: "Wijzig leadgegevens, status of eigenaar.",
  },
  sync: {
    title: "Naar HubSpot syncen",
    description: "Synchroniseer deze lead met HubSpot.",
  },
  convert: {
    title: "Omzetten naar deal",
    description: "Zet deze lead om naar een actieve deal in de pipeline.",
  },
};

type SalesDashboardClientProps = {
  kpiCards: SalesKpi[];
  pipeline: PipelineStage[];
  deals: PipelineDeal[];
  leads: SalesLead[];
  followUps: SalesFollowUp[];
  hubspotConfigured: boolean;
};

export default function SalesDashboardClient({
  kpiCards,
  pipeline,
  deals,
  leads,
  followUps,
  hubspotConfigured,
}: SalesDashboardClientProps) {
  const [dialogKey, setDialogKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSyncHubSpot = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/hubspot/sync-all", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        window.dispatchEvent(
          new CustomEvent("hubspot-sync-result", {
            detail: {
              ok: false,
              message: sanitizeHubSpotUiMessage(data.error),
            },
          }),
        );
        return;
      }

      window.dispatchEvent(
        new CustomEvent("hubspot-sync-result", {
          detail: {
            ok: true,
            synced: data.synced ?? 0,
            failed: data.failed ?? 0,
          },
        }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("hubspot-sync-result", {
          detail: {
            ok: false,
            message: "HubSpot koppeling mislukt. Controleer token of scopes.",
          },
        }),
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  const activeDialog = dialogKey ? dialogConfigs[dialogKey] : null;

  return (
    <div className="space-y-6">
      <SalesPageToolbar
        onNewLead={() => setDialogKey("lead")}
        onNewDeal={() => setDialogKey("deal")}
        onNewFollowUp={() => setDialogKey("followup")}
        onSyncHubSpot={handleSyncHubSpot}
        syncing={syncing}
      />

      <SalesKpiCards cards={kpiCards} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SalesPipelineOverview stages={pipeline} deals={deals} />
        <HubSpotSyncCard initialConfigured={hubspotConfigured} />
      </div>

      <SalesLeadsTable
        leads={leads}
        onAction={(action) => {
          const key =
            action === "deal"
              ? "convert"
              : action === "sync"
                ? "sync"
                : action;
          setDialogKey(key);
        }}
      />

      <SalesFollowUpTasks tasks={followUps} />

      {activeDialog && (
        <SalesActionDialog
          open={dialogKey !== null}
          onOpenChange={(open) => {
            if (!open) setDialogKey(null);
          }}
          title={activeDialog.title}
          description={activeDialog.description}
        />
      )}
    </div>
  );
}
