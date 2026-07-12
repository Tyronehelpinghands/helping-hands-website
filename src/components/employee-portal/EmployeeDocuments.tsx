"use client";

import { AlertTriangle, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeDocument } from "@/lib/employeePortal";
import { DEMO_EMPLOYEE_DOCUMENTS } from "@/lib/employeePortal";
import { formatDate } from "@/lib/dashboardHelpers";

type EmployeeDocumentsProps = {
  documents?: EmployeeDocument[];
  compact?: boolean;
};

export default function EmployeeDocuments({
  documents = DEMO_EMPLOYEE_DOCUMENTS,
  compact = false,
}: EmployeeDocumentsProps) {
  const display = compact
    ? documents.filter(
        (d) => d.status === "Niet ingeleverd" || d.status === "Verloopt binnenkort",
      ).slice(0, 4)
    : documents;

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          {compact ? "Documentstatus" : "Mijn documenten"}
        </CardTitle>
        <CardDescription>
          {compact
            ? "Documenten die aandacht nodig hebben"
            : "Contracten, certificaten en verificaties"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!compact ? (
          <>
            <p className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Uploadfunctie wordt later gekoppeld aan veilige opslag. Upload geen echte
              ID-documenten zolang dit demo is.
            </p>
          </>
        ) : null}

        {display.length === 0 ? (
          <p className="text-sm text-slate-500">Geen openstaande documentacties.</p>
        ) : (
          display.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[#0B1F4D]">{doc.title}</p>
                  <p className="text-sm text-slate-500">{doc.type}</p>
                </div>
                <EmployeeStatusBadge status={doc.status} variant="document" />
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                {doc.uploadedAt ? <span>Upload: {formatDate(doc.uploadedAt)}</span> : null}
                {doc.expiresAt ? <span>Verloopt: {formatDate(doc.expiresAt)}</span> : null}
              </div>
              {!compact ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Uploaden
                  </Button>
                  <Button type="button" variant="ghost" size="sm" disabled>
                    <Eye className="mr-2 h-4 w-4" />
                    Bekijken (demo)
                  </Button>
                  <Button type="button" variant="ghost" size="sm">
                    Vervangen
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
