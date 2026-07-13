"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientPlanningItem } from "@/lib/clientPortal";
import { DEMO_CLIENT_PLANNING, formatClientDate } from "@/lib/clientPortal";

export default function ClientPlanningOverview({
  items = DEMO_CLIENT_PLANNING,
  compact = false,
}: {
  items?: ClientPlanningItem[];
  compact?: boolean;
}) {
  const displayItems = compact ? items.slice(0, 3) : items;

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          {compact ? "Aankomende planning" : "Planning overzicht"}
        </CardTitle>
        <CardDescription>
          Geplande inzet per functie — geen crewnamen of interne tarieven.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        {displayItems.length === 0 ? (
          <p className="text-sm text-slate-500">Geen planning beschikbaar.</p>
        ) : (
          displayItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200">
              <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-[#0B1F4D]">{item.projectName}</p>
                  <p className="text-sm text-slate-600">
                    {formatClientDate(item.date)} · {item.startTime} — {item.endTime} ·{" "}
                    {item.locationName}
                  </p>
                </div>
                <ClientStatusBadge status={item.status} variant="planning" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Functie</TableHead>
                    <TableHead>Gevraagd</TableHead>
                    <TableHead>Gepland</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.roles.map((role) => {
                    const roleStatus =
                      role.planned === 0
                        ? "Open"
                        : role.planned < role.requested
                          ? "Gedeeltelijk gepland"
                          : role.planned === role.requested
                            ? "Volledig gepland"
                            : "Bevestigd";
                    return (
                      <TableRow key={`${item.id}-${role.role}`}>
                        <TableCell className="font-medium">{role.role}</TableCell>
                        <TableCell>{role.requested}</TableCell>
                        <TableCell>{role.planned}</TableCell>
                        <TableCell>
                          <ClientStatusBadge status={roleStatus} variant="planning" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
