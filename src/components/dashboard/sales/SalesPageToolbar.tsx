"use client";

import {
  Briefcase,
  CalendarPlus,
  Loader2,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SalesPageToolbarProps = {
  onNewLead: () => void;
  onNewDeal: () => void;
  onNewFollowUp: () => void;
  onSyncHubSpot: () => void;
  syncing?: boolean;
};

export default function SalesPageToolbar({
  onNewLead,
  onNewDeal,
  onNewFollowUp,
  onSyncHubSpot,
  syncing = false,
}: SalesPageToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNewLead}
        className="border-slate-200/80 bg-white"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Nieuwe lead
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNewDeal}
        className="border-slate-200/80 bg-white"
      >
        <Briefcase className="h-4 w-4" aria-hidden="true" />
        Nieuwe deal
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNewFollowUp}
        className="border-slate-200/80 bg-white"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Follow-up toevoegen
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onSyncHubSpot}
        disabled={syncing}
        className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
      >
        {syncing ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        )}
        Sync met HubSpot
      </Button>
    </div>
  );
}
