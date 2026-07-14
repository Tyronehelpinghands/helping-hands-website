"use client";

import {
  Check,
  Eye,
  FileCheck,
  MoreHorizontal,
  Pencil,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HoursStatusBadge from "@/components/dashboard/uren/HoursStatusBadge";
import { formatEuro, type HoursEntry } from "@/lib/hours";

export type HoursTableAction =
  | "view"
  | "edit"
  | "approve"
  | "reject"
  | "invoice";

type HoursTableProps = {
  entries: HoursEntry[];
  onAction: (action: HoursTableAction, entry: HoursEntry) => void;
};

function HoursMobileCard({
  entry,
  onAction,
}: {
  entry: HoursEntry;
  onAction: (action: HoursTableAction, entry: HoursEntry) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#0B1F4D]">{entry.projectName}</p>
          <p className="text-xs text-[#101828]/60">
            {entry.date} · Wk {entry.weekNumber} · {entry.crewMemberName}
          </p>
        </div>
        <HoursStatusBadge status={entry.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-[#101828]/55">Uren</dt>
        <dd className="font-medium">{entry.workedHours} u</dd>
        <dt className="text-[#101828]/55">Omzet</dt>
        <dd className="font-medium">{formatEuro(entry.revenueAmount)}</dd>
        <dt className="text-[#101828]/55">Marge</dt>
        <dd className="font-medium">{formatEuro(entry.marginAmount)}</dd>
        <dt className="text-[#101828]/55">Bron</dt>
        <dd>{entry.source}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onAction("view", entry)}
        >
          Bekijken
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onAction("edit", entry)}
        >
          Bewerken
        </Button>
      </div>
    </div>
  );
}

export default function HoursTable({ entries, onAction }: HoursTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#101828]/55">
            Geen urenregels gevonden. Pas filters aan.
          </p>
        ) : (
          entries.map((entry) => (
            <HoursMobileCard key={entry.id} entry={entry} onAction={onAction} />
          ))
        )}
      </div>

      <div className="hidden w-full max-w-full overflow-x-auto lg:block">
        <Table className="min-w-[2200px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Datum</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Locatie</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead>Functie</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>Eind</TableHead>
              <TableHead>Pauze</TableHead>
              <TableHead>Uren</TableHead>
              <TableHead>Facturabele uren</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>Reiskosten</TableHead>
              <TableHead>Klanttarief</TableHead>
              <TableHead>Omzet</TableHead>
              <TableHead>Crewkosten</TableHead>
              <TableHead>Marge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bron</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={21}
                  className="py-12 text-center text-sm text-[#101828]/55"
                >
                  Geen urenregels gevonden. Pas filters aan of voeg uren toe.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 text-sm">{entry.date}</TableCell>
                  <TableCell className="text-sm">{entry.weekNumber}</TableCell>
                  <TableCell className="font-semibold text-[#0B1F4D]">
                    {entry.projectName}
                  </TableCell>
                  <TableCell className="text-sm">{entry.clientName}</TableCell>
                  <TableCell className="text-sm">{entry.locationName}</TableCell>
                  <TableCell className="text-sm">{entry.crewMemberName}</TableCell>
                  <TableCell className="text-sm">{entry.role}</TableCell>
                  <TableCell className="text-sm">{entry.startTime}</TableCell>
                  <TableCell className="text-sm">{entry.endTime}</TableCell>
                  <TableCell className="text-sm">{entry.breakMinutes} m</TableCell>
                  <TableCell className="text-sm font-medium">
                    {entry.workedHours}
                  </TableCell>
                  <TableCell className="text-sm">{entry.billableHours}</TableCell>
                  <TableCell className="text-sm">{entry.kilometers}</TableCell>
                  <TableCell className="text-sm">
                    {formatEuro(entry.travelCost)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatEuro(entry.clientHourlyRate)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatEuro(entry.revenueAmount)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatEuro(entry.crewCostAmount)}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-[#173A8A]">
                    {formatEuro(entry.marginAmount)}
                  </TableCell>
                  <TableCell>
                    <HoursStatusBadge status={entry.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {entry.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Acties"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onAction("view", entry)}
                        >
                          <Eye className="h-4 w-4" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("edit", entry)}
                        >
                          <Pencil className="h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onAction("approve", entry)}
                          disabled={entry.status === "Goedgekeurd"}
                        >
                          <Check className="h-4 w-4" />
                          Goedkeuren
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("reject", entry)}
                          disabled={entry.status === "Afgekeurd"}
                        >
                          <X className="h-4 w-4" />
                          Afkeuren
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("invoice", entry)}
                          disabled={entry.status === "Gefactureerd"}
                        >
                          <FileCheck className="h-4 w-4" />
                          Markeer als gefactureerd
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
