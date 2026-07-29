import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import { formatShiftDate } from "@/lib/employeePortal";

export default function HoursSummary({
  hours = [],
}: {
  hours?: EmployeeHoursEntry[];
}) {
  const recent = hours.slice(0, 3);
  const pending = hours.filter(
    (h) =>
      h.status === "Ingediend" ||
      h.status === "Concept" ||
      h.status === "Afgekeurd" ||
      h.status === "Correctie aangevraagd",
  ).length;

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Urenstatus</CardTitle>
          <CardDescription>
            {pending > 0
              ? `${pending} registratie(s) wachten op beoordeling door planning`
              : "Geen openstaande urenwijzigingen"}
          </CardDescription>
        </div>
        <Link
          href="/portaal/medewerkers/uren"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Bekijk alles
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">Nog geen uren geregistreerd.</p>
        ) : (
          recent.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0B1F4D]">
                  {entry.projectName}
                </p>
                <p className="text-xs text-slate-500">
                  {formatShiftDate(entry.date)} · {entry.workedHours.toFixed(2)} u
                </p>
              </div>
              <EmployeeStatusBadge status={entry.status} variant="hours" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
