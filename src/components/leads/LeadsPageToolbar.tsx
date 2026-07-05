"use client";

import { Loader2, RefreshCw, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadsPageToolbarProps = {
  onNewLead: () => void;
  onImport: () => void;
  onSyncHubSpot: () => void;
  onExport: () => void;
  syncing?: boolean;
};

export default function LeadsPageToolbar({
  onNewLead,
  onImport,
  onSyncHubSpot,
  onExport,
  syncing = false,
}: LeadsPageToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        type="button"
        size="sm"
        onClick={onNewLead}
        className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Nieuwe lead
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onImport}
        className="border-slate-200/80 bg-white"
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        Importeren
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onExport}
        className="border-slate-200/80 bg-white"
      >
        Exporteren
      </Button>
    </div>
  );
}
