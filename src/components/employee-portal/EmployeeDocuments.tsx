"use client";

import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeDocument } from "@/lib/employeePortal";
import { formatDate } from "@/lib/dashboardHelpers";

type EmployeeDocumentsProps = {
  documents?: EmployeeDocument[];
  compact?: boolean;
};

export default function EmployeeDocuments({
  documents = [],
  compact = false,
}: EmployeeDocumentsProps) {
  const display = compact
    ? documents
        .filter(
          (d) =>
            d.status === "Niet ingeleverd" || d.status === "Verloopt binnenkort",
        )
        .slice(0, 4)
    : documents;

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          {compact ? "Documentstatus" : "Mijn documenten"}
        </CardTitle>
        <CardDescription>
          {compact
            ? "Certificaten en documenten op je crewlid-profiel"
            : "Certificaten uit je crewprofiel. Upload van ID/contract volgt later veilig."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {display.length === 0 ? (
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#173A8A]" />
            <p>
              {compact
                ? "Geen openstaande documentacties."
                : "Er staan nog geen documenten of certificaten op je profiel. Planning kan certificaten toevoegen via crewbeheer."}
            </p>
          </div>
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
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
