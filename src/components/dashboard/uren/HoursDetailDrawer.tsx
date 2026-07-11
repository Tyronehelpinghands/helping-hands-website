"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  FileCheck,
  Pencil,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import HoursStatusBadge from "@/components/dashboard/uren/HoursStatusBadge";
import { formatEuro, type HoursEntry } from "@/lib/hours";

type HoursDetailDrawerProps = {
  entry: HoursEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (entry: HoursEntry) => void;
  onApprove: (entry: HoursEntry) => void;
  onReject: (entry: HoursEntry) => void;
  onInvoice: (entry: HoursEntry) => void;
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt className="text-[#101828]/55">{label}</dt>
      <dd className="font-medium text-[#0B1F4D]">{value}</dd>
    </>
  );
}

export default function HoursDetailDrawer({
  entry,
  open,
  onOpenChange,
  onEdit,
  onApprove,
  onReject,
  onInvoice,
}: HoursDetailDrawerProps) {
  if (!entry) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{entry.projectName}</SheetTitle>
          <SheetDescription>
            {entry.clientName} · {entry.locationName} · {entry.date}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <HoursStatusBadge status={entry.status} />

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Projectgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label="Project" value={entry.projectName} />
              <DetailRow label="Klant" value={entry.clientName} />
              <DetailRow label="Locatie" value={entry.locationName} />
              {entry.locationAddress && (
                <DetailRow label="Adres" value={entry.locationAddress} />
              )}
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Crewgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label="Crewlid" value={entry.crewMemberName} />
              <DetailRow label="Functie" value={entry.role} />
              <DetailRow label="Dienstverband" value={entry.employmentType} />
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Uren & tarieven
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label="Datum" value={entry.date} />
              <DetailRow label="Week" value={`Week ${entry.weekNumber}`} />
              <DetailRow label="Starttijd" value={entry.startTime} />
              <DetailRow label="Eindtijd" value={entry.endTime} />
              <DetailRow label="Pauze" value={`${entry.breakMinutes} min`} />
              <DetailRow label="Gewerkte uren" value={`${entry.workedHours} u`} />
              <DetailRow
                label="Facturabele uren"
                value={`${entry.billableHours} u`}
              />
              <DetailRow
                label="Kilometers"
                value={`${entry.kilometers} km`}
              />
              <DetailRow
                label="Reiskosten"
                value={formatEuro(entry.travelCost)}
              />
              <DetailRow
                label="Klanttarief"
                value={`${formatEuro(entry.clientHourlyRate)}/u`}
              />
              <DetailRow
                label="Crewtarief"
                value={
                  entry.crewHourlyRate
                    ? `${formatEuro(entry.crewHourlyRate)}/u`
                    : "—"
                }
              />
              <DetailRow label="Omzet" value={formatEuro(entry.revenueAmount)} />
              <DetailRow
                label="Kosten"
                value={formatEuro(entry.crewCostAmount)}
              />
              <DetailRow
                label="Marge"
                value={formatEuro(entry.marginAmount)}
              />
              <DetailRow label="Bron" value={entry.source} />
            </dl>
          </section>

          {(entry.shiftbaseShiftId || entry.moneybirdInvoiceId) && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Koppelingen
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {entry.shiftbaseShiftId && (
                  <DetailRow
                    label="Shiftbase shift ID"
                    value={entry.shiftbaseShiftId}
                  />
                )}
                {entry.moneybirdInvoiceId && (
                  <DetailRow
                    label="Moneybird factuur ID"
                    value={entry.moneybirdInvoiceId}
                  />
                )}
              </dl>
            </section>
          )}

          {entry.notes && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Notities
              </h3>
              <p className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2 text-sm text-[#101828]/80">
                {entry.notes}
              </p>
            </section>
          )}

          {entry.approvedBy && (
            <p className="text-xs text-[#101828]/55">
              Goedgekeurd door {entry.approvedBy}
              {entry.approvedAt
                ? ` op ${new Date(entry.approvedAt).toLocaleString("nl-NL")}`
                : ""}
            </p>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 border-t border-slate-200/80 px-4 py-4 sm:flex-col">
          <div className="flex w-full flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => onEdit(entry)}>
              <Pencil className="h-4 w-4" />
              Bewerken
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onApprove(entry)}
              disabled={entry.status === "Goedgekeurd"}
            >
              <Check className="h-4 w-4" />
              Goedkeuren
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onReject(entry)}
              disabled={entry.status === "Afgekeurd"}
            >
              <X className="h-4 w-4" />
              Afkeuren
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onInvoice(entry)}
              disabled={entry.status === "Gefactureerd"}
            >
              <FileCheck className="h-4 w-4" />
              Markeer als gefactureerd
            </Button>
          </div>
          <div className="flex w-full flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              render={<Link href="/dashboard/intern/projecten" />}
            >
              <ExternalLink className="h-4 w-4" />
              Naar project
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              render={<Link href="/dashboard/intern/crew" />}
            >
              <Users className="h-4 w-4" />
              Naar crewlid
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
