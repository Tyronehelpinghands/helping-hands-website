"use client";

/**
 * Opdrachtgeversportaal uren — alleen bekijken en opmerkingen doorgeven.
 *
 * TODO: Opdrachtgever mag alleen eigen projecturen bekijken
 * TODO: Opdrachtgever mag geen uren goedkeuren
 * TODO: Goedkeuring gebeurt intern via /dashboard/intern/urenregistratie
 * TODO: Later afdwingen met Supabase Auth + Row Level Security
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
import { DEMO_CLIENT_HOURS, formatClientDate } from "@/lib/clientPortal";
import { formatCurrency } from "@/lib/dashboardHelpers";

export default function ClientHoursOverview({
  entries = DEMO_CLIENT_HOURS,
}: {
  entries?: ClientHoursSummary[];
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
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Urenstatus per project</CardTitle>
          <CardDescription>
            Uren worden gecontroleerd door Helping Hands. Neem contact op als je iets wilt doorgeven.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Totaal uren</TableHead>
                <TableHead>Facturabel</TableHead>
                <TableHead>Reiskosten</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-semibold text-[#0B1F4D]">{entry.projectName}</TableCell>
                  <TableCell>{formatClientDate(entry.date)}</TableCell>
                  <TableCell>{entry.totalHours} u</TableCell>
                  <TableCell>{entry.billableHours} u</TableCell>
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
                {selected.travelCost > 0 ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Reiskosten</dt>
                    <dd className="text-[#0B1F4D]">{formatCurrency(selected.travelCost)}</dd>
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
              Je opmerking wordt in demo-modus lokaal verwerkt. Later via contactkoppeling.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <textarea
              rows={4}
              placeholder="Beschrijf je vraag of opmerking over de uren..."
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
          Opmerking voorbereid. Later wordt dit gekoppeld aan Gmail, HubSpot of WhatsApp Business.
        </p>
      ) : null}
    </>
  );
}
