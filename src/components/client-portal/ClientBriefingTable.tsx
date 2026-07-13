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
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientBriefing } from "@/lib/clientPortal";
import { DEMO_CLIENT_BRIEFINGS, formatClientDate } from "@/lib/clientPortal";

export default function ClientBriefingTable({
  briefings = DEMO_CLIENT_BRIEFINGS,
}: {
  briefings?: ClientBriefing[];
}) {
  const [selected, setSelected] = useState<ClientBriefing | null>(null);
  const [open, setOpen] = useState(false);

  function openBriefing(briefing: ClientBriefing) {
    setSelected(briefing);
    setOpen(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Briefings per project</CardTitle>
          <CardDescription>Status en details van projectbriefings.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Meeting point</TableHead>
                <TableHead>Bijgewerkt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {briefings.map((briefing) => (
                <TableRow key={briefing.id}>
                  <TableCell className="font-semibold text-[#0B1F4D]">
                    {briefing.projectName}
                  </TableCell>
                  <TableCell>{briefing.contactPerson}</TableCell>
                  <TableCell>{briefing.meetingPoint}</TableCell>
                  <TableCell>{formatClientDate(briefing.updatedAt.slice(0, 10))}</TableCell>
                  <TableCell>
                    <ClientStatusBadge status={briefing.status} variant="briefing" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openBriefing(briefing)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Bekijken
                    </Button>
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
                  <ClientStatusBadge status={selected.status} variant="briefing" />
                </SheetDescription>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Contactpersoon</dt>
                  <dd className="text-[#0B1F4D]">
                    {selected.contactPerson}
                    {selected.contactPhone ? ` · ${selected.contactPhone}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Adres</dt>
                  <dd className="text-[#0B1F4D]">{selected.locationAddress}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Meeting point</dt>
                  <dd className="text-[#0B1F4D]">{selected.meetingPoint}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Kleding</dt>
                  <dd className="text-[#0B1F4D]">{selected.clothing}</dd>
                </div>
                {selected.parkingInfo ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Parkeren</dt>
                    <dd className="text-[#0B1F4D]">{selected.parkingInfo}</dd>
                  </div>
                ) : null}
                {selected.loadingInfo ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Laad/los</dt>
                    <dd className="text-[#0B1F4D]">{selected.loadingInfo}</dd>
                  </div>
                ) : null}
                {selected.safetyInfo ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Veiligheid</dt>
                    <dd className="text-[#0B1F4D]">{selected.safetyInfo}</dd>
                  </div>
                ) : null}
                {selected.notes ? (
                  <div>
                    <dt className="font-semibold text-slate-500">Bijzonderheden</dt>
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
