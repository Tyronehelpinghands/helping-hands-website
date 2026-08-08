"use client";

/**
 * Opdrachtgeversportaal uren — read-only view of approved/submitted/invoiced
 * hours + kilometers from the same time_entries table as intern / medewerkers.
 */

import { useState } from "react";
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientHoursSummary } from "@/lib/clientPortal";
import { formatClientDate } from "@/lib/clientPortal";
import { formatCurrency } from "@/lib/dashboardHelpers";
import { formatKilometersNl } from "@/lib/time-entries/shared";

export default function ClientHoursOverview({
  entries = [],
  errorMessage = null,
  kmRate,
}: {
  entries?: ClientHoursSummary[];
  errorMessage?: string | null;
  kmRate?: number;
}) {
  const [selected, setSelected] = useState<ClientHoursSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);

  function openView(entry: ClientHoursSummary) {
    setSelected(entry);
    setOpen(true);
  }

  function submitNote() {
    setNoteSent(true);
    setNoteOpen(false);
    setNote("");
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Uren & kilometers per project
          </CardTitle>
          <CardDescription>
            Live registraties van Helping Hands. Goedkeuring en facturatie gebeuren
            intern — hier zie je goedgekeurde en gefactureerde uren inclusief kilometers.
            {kmRate != null ? (
              <>
                {" "}
                Km-vergoeding: €{kmRate.toFixed(2).replace(".", ",")}/km.
              </>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {errorMessage ? (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {errorMessage}
            </p>
          ) : null}
          {entries.length === 0 && !errorMessage ? (
            <p className="text-sm text-slate-500">
              Nog geen uren of kilometers zichtbaar voor jouw projecten. Zodra planning
              uren goedkeurt of factureert, verschijnen ze hier.
            </p>
          ) : entries.length === 0 ? null : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Totaal uren</TableHead>
                  <TableHead>Facturabel</TableHead>
                  <TableHead>Kilometers</TableHead>
                  <TableHead>Reiskosten</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-semibold text-[#0B1F4D]">
                      {entry.projectName}
                    </TableCell>
                    <TableCell>{formatClientDate(entry.date)}</TableCell>
                    <TableCell>{entry.totalHours} u</TableCell>
                    <TableCell>{entry.billableHours} u</TableCell>
                    <TableCell>
                      {formatKilometersNl(entry.totalKilometers ?? 0)}
                    </TableCell>
                    <TableCell>
                      {entry.travelCost > 0 ? formatCurrency(entry.travelCost) : "—"}
                    </TableCell>
                    <TableCell>
                      <ClientStatusBadge status={entry.status} variant="hours" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openView(entry)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Bekijken
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelected(entry);
                            setNoteOpen(true);
                          }}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Opmerking
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-black text-[#0B1F4D]">
                  {selected.projectName}
                </SheetTitle>
                <SheetDescription className="text-left">
                  <ClientStatusBadge status={selected.status} variant="hours" />
                </SheetDescription>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Datum</dt>
                  <dd className="text-[#0B1F4D]">{formatClientDate(selected.date)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Totaal gewerkte uren</dt>
                  <dd className="text-[#0B1F4D]">{selected.totalHours} uur</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Facturabele uren</dt>
                  <dd className="text-[#0B1F4D]">{selected.billableHours} uur</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Kilometers</dt>
                  <dd className="text-[#0B1F4D]">
                    {formatKilometersNl(selected.totalKilometers ?? 0)}
                  </dd>
                </div>
                {selected.travelCost > 0 ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Reiskosten (km)</dt>
                    <dd className="text-[#0B1F4D]">
                      {formatCurrency(selected.travelCost)}
                    </dd>
                  </div>
                ) : null}
                {selected.entryCount ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Registraties</dt>
                    <dd className="text-[#0B1F4D]">{selected.entryCount}</dd>
                  </div>
                ) : null}
                {selected.notes ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Opmerking</dt>
                    <dd className="text-[#0B1F4D]">{selected.notes}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                Interne crewkosten, uurtarieven en marges worden niet getoond in het
                opdrachtgeversportaal.
              </p>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet open={noteOpen} onOpenChange={setNoteOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Opmerking doorgeven</SheetTitle>
            <SheetDescription>
              Noteer je vraag over uren of kilometers. Neem bij spoed contact op via het
              contactportaal — koppeling naar berichten volgt.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <textarea
              rows={4}
              placeholder="Beschrijf je vraag of opmerking over de uren of kilometers..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
            />
            <Button
              type="button"
              className="w-full bg-[#173A8A] hover:bg-[#0B1F4D]"
              onClick={submitNote}
            >
              Opmerking versturen
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {noteSent ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Opmerking genoteerd. Neem bij spoed contact op via Contact — later koppelen we
          dit aan Gmail, HubSpot of WhatsApp Business.
        </p>
      ) : null}
    </>
  );
}
