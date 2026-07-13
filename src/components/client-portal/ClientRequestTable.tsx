"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
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
import ClientRequestStatusBadge from "@/components/client-portal/ClientRequestStatusBadge";
import type { ClientRequest } from "@/lib/clientPortal";
import { DEMO_CLIENT_REQUESTS, formatClientDate } from "@/lib/clientPortal";

export default function ClientRequestTable({
  requests: initialRequests = DEMO_CLIENT_REQUESTS,
  compact = false,
}: {
  requests?: ClientRequest[];
  compact?: boolean;
}) {
  const [requests] = useState(initialRequests);
  const [selected, setSelected] = useState<ClientRequest | null>(null);
  const [open, setOpen] = useState(false);

  const displayRequests = compact ? requests.slice(0, 3) : requests;

  function openRequest(request: ClientRequest) {
    setSelected(request);
    setOpen(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            {compact ? "Lopende aanvragen" : "Mijn aanvragen"}
          </CardTitle>
          {!compact ? (
            <CardDescription>Status en details van ingediende aanvragen.</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Locatie</TableHead>
                <TableHead>Personen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    Geen aanvragen gevonden.
                  </TableCell>
                </TableRow>
              ) : (
                displayRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-[200px] font-semibold text-[#0B1F4D]">
                      {request.title}
                      {request.urgent ? (
                        <span className="ml-2 text-xs font-bold text-red-600">Spoed</span>
                      ) : null}
                    </TableCell>
                    <TableCell>{formatClientDate(request.eventDate)}</TableCell>
                    <TableCell>{request.locationName}</TableCell>
                    <TableCell>{request.numberOfPeople}</TableCell>
                    <TableCell>
                      <ClientRequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openRequest(request)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Bekijken
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
                  {selected.title}
                </SheetTitle>
                <SheetDescription className="text-left">
                  <ClientRequestStatusBadge status={selected.status} />
                </SheetDescription>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Evenementdatum</dt>
                  <dd className="text-[#0B1F4D]">{formatClientDate(selected.eventDate)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Tijd</dt>
                  <dd className="text-[#0B1F4D]">
                    {selected.startTime} — {selected.endTime}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Locatie</dt>
                  <dd className="text-[#0B1F4D]">
                    {selected.locationName}
                    {selected.locationAddress ? `, ${selected.locationAddress}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Aantal personen</dt>
                  <dd className="text-[#0B1F4D]">{selected.numberOfPeople}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Functies</dt>
                  <dd className="text-[#0B1F4D]">{selected.rolesNeeded.join(", ")}</dd>
                </div>
                {selected.deploymentType ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Type inzet</dt>
                    <dd className="text-[#0B1F4D]">{selected.deploymentType}</dd>
                  </div>
                ) : null}
                {selected.notes ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Opmerkingen</dt>
                    <dd className="text-[#0B1F4D]">{selected.notes}</dd>
                  </div>
                ) : null}
              </dl>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
