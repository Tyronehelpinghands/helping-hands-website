"use client";

import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { ClientDocument } from "@/lib/clientPortal";
import { DEMO_CLIENT_DOCUMENTS, formatClientDate } from "@/lib/clientPortal";

export default function ClientDocuments({
  documents = DEMO_CLIENT_DOCUMENTS,
  compact = false,
}: {
  documents?: ClientDocument[];
  compact?: boolean;
}) {
  const displayDocs = compact ? documents.slice(0, 4) : documents;

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            {compact ? "Laatste documenten" : "Documenten"}
          </CardTitle>
          <CardDescription>
            Offertes, bevestigingen, briefings en facturen per project.
          </CardDescription>
        </div>
        {!compact ? (
          <Button type="button" variant="outline" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Upload — Binnenkort
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayDocs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-semibold text-[#0B1F4D]">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#173A8A]" />
                    {doc.title}
                  </span>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.projectName ?? "—"}</TableCell>
                <TableCell>{formatClientDate(doc.createdAt)}</TableCell>
                <TableCell>
                  <ClientStatusBadge status={doc.status} variant="document" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!compact ? (
          <p className="mt-4 text-xs text-slate-500">
            Documentupload wordt later gekoppeld aan veilige opslag.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
