"use client";

import {
  ArrowRightLeft,
  CalendarPlus,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Lead } from "@/data/leadsMockData";
import {
  formatLeadCurrency,
  leadPriorityLabels,
  leadPriorityStyles,
  leadSourceLabels,
  leadSourceStyles,
  leadStatusLabels,
  leadStatusStyles,
} from "@/lib/leads-utils";
import { cn } from "@/lib/utils";

type LeadDetailDrawerProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
  onFollowUp: (lead: Lead) => void;
  onSync: (lead: Lead) => void;
  onConvertDeal: (lead: Lead) => void;
};

export default function LeadDetailDrawer({
  lead,
  open,
  onOpenChange,
  onEdit,
  onFollowUp,
  onSync,
  onConvertDeal,
}: LeadDetailDrawerProps) {
  if (!lead) return null;

  const hubspotLabel =
    lead.hubspotSyncStatus === "gesynchroniseerd"
      ? "Gesynchroniseerd"
      : lead.hubspotSyncStatus === "fout"
        ? "Sync mislukt"
        : "Niet gesynchroniseerd";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{lead.bedrijf}</SheetTitle>
          <SheetDescription>{lead.contact}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn("font-semibold", leadStatusStyles[lead.status])}
            >
              {leadStatusLabels[lead.status]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-semibold", leadPriorityStyles[lead.prioriteit])}
            >
              {leadPriorityLabels[lead.prioriteit]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-semibold", leadSourceStyles[lead.bron])}
            >
              {leadSourceLabels[lead.bron]}
            </Badge>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Bedrijfsgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Bedrijf</dt>
              <dd className="font-medium text-[#0B1F4D]">{lead.bedrijf}</dd>
              {lead.website && (
                <>
                  <dt className="text-[#101828]/55">Website</dt>
                  <dd className="truncate text-[#173A8A]">{lead.website}</dd>
                </>
              )}
              <dt className="text-[#101828]/55">Waarde</dt>
              <dd className="font-bold text-[#173A8A]">
                {formatLeadCurrency(lead.waarde)}
              </dd>
              <dt className="text-[#101828]/55">Eigenaar</dt>
              <dd>{lead.eigenaar}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Contactgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Contact</dt>
              <dd>{lead.contact}</dd>
              <dt className="text-[#101828]/55">E-mail</dt>
              <dd className="truncate">{lead.email}</dd>
              <dt className="text-[#101828]/55">Telefoon</dt>
              <dd>{lead.telefoon}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Opvolging
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Laatste contact</dt>
              <dd>{lead.laatsteContact}</dd>
              <dt className="text-[#101828]/55">Volgende actie</dt>
              <dd>{lead.volgendeActie}</dd>
              {lead.volgendeActieDatum && (
                <>
                  <dt className="text-[#101828]/55">Deadline</dt>
                  <dd>{lead.volgendeActieDatum}</dd>
                </>
              )}
            </dl>
          </section>

          {lead.notities && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Notities
              </h3>
              <p className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 p-3 text-sm text-[#101828]/75">
                {lead.notities}
              </p>
            </section>
          )}

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              HubSpot
            </h3>
            <p className="text-sm font-medium text-[#0B1F4D]">{hubspotLabel}</p>
            {lead.hubspotContactId && (
              <p className="text-xs text-[#101828]/55">
                Contact ID: {lead.hubspotContactId.slice(0, 12)}…
              </p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Tijdlijn
            </h3>
            <div className="space-y-2">
              {(lead.activityLog ?? []).length > 0 ? (
                lead.activityLog!.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-[#0B1F4D]">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-[#101828]/55">{item.description}</p>
                    )}
                    <p className="mt-1 text-[10px] text-[#101828]/45">
                      {new Date(item.timestamp).toLocaleString("nl-NL")}
                      {item.user ? ` · ${item.user}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#101828]/55">Nog geen activiteit.</p>
              )}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row flex-wrap gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(lead)}>
            <Pencil className="h-4 w-4" />
            Bewerken
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onFollowUp(lead)}>
            <CalendarPlus className="h-4 w-4" />
            Follow-up
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onSync(lead)}>
            <RefreshCw className="h-4 w-4" />
            Sync HubSpot
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
            onClick={() => onConvertDeal(lead)}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Naar deal
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
