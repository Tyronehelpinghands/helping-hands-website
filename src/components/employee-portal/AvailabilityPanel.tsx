"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvailabilityForm from "@/components/employee-portal/AvailabilityForm";
import EmployeeShiftbasePanel from "@/components/employee-portal/EmployeeShiftbasePanel";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeAvailability } from "@/lib/employeePortal";
import { DEMO_EMPLOYEE_AVAILABILITY, formatShiftDate } from "@/lib/employeePortal";

type AvailabilityPanelProps = {
  initial?: EmployeeAvailability[];
};

export default function AvailabilityPanel({
  initial = DEMO_EMPLOYEE_AVAILABILITY,
}: AvailabilityPanelProps) {
  const [entries, setEntries] = useState(initial);

  return (
    <div className="space-y-6">
      <AvailabilityForm
        onSave={(entry) =>
          setEntries((prev) =>
            [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)),
          )
        }
      />
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Weekoverzicht</CardTitle>
          <CardDescription>Je ingegeven beschikbaarheid (demo + lokaal opgeslagen).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-[#0B1F4D]">{formatShiftDate(entry.date)}</p>
                {entry.startTime && entry.endTime ? (
                  <p className="text-sm text-slate-600">
                    {entry.startTime} – {entry.endTime}
                  </p>
                ) : null}
                {entry.notes ? <p className="text-sm text-slate-500">{entry.notes}</p> : null}
              </div>
              <EmployeeStatusBadge status={entry.availability} variant="availability" />
            </div>
          ))}
        </CardContent>
      </Card>
      <EmployeeShiftbasePanel />
    </div>
  );
}
