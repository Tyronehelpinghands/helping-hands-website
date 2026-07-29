"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvailabilityForm from "@/components/employee-portal/AvailabilityForm";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeAvailability } from "@/lib/employeePortal";
import { formatShiftDate } from "@/lib/employeePortal";
import { saveCrewAvailabilityAction } from "@/lib/employee-portal/mutations";

type AvailabilityPanelProps = {
  initial?: EmployeeAvailability[];
};

export default function AvailabilityPanel({
  initial = [],
}: AvailabilityPanelProps) {
  const [entries, setEntries] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave(entry: Omit<EmployeeAvailability, "id"> & { id?: string }) {
    setError(null);
    startTransition(async () => {
      const result = await saveCrewAvailabilityAction({
        date: entry.date,
        availability: entry.availability,
        startTime: entry.startTime,
        endTime: entry.endTime,
        notes: entry.notes,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const saved: EmployeeAvailability = {
        id: result.data.id || `av-${entry.date}`,
        date: entry.date,
        availability: entry.availability,
        startTime: entry.startTime,
        endTime: entry.endTime,
        notes: entry.notes,
      };
      setEntries((prev) => {
        const without = prev.filter((e) => e.date !== saved.date);
        return [...without, saved].sort((a, b) => a.date.localeCompare(b.date));
      });
    });
  }

  return (
    <div className="space-y-6">
      <AvailabilityForm onSave={handleSave} saving={pending} />
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Weekoverzicht</CardTitle>
          <CardDescription>
            Je doorgegeven beschikbaarheid vanaf deze week.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nog geen beschikbaarheid doorgegeven. Gebruik het formulier hierboven.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-[#0B1F4D]">
                    {formatShiftDate(entry.date)}
                  </p>
                  {entry.startTime && entry.endTime ? (
                    <p className="text-sm text-slate-600">
                      {entry.startTime} – {entry.endTime}
                    </p>
                  ) : null}
                  {entry.notes ? (
                    <p className="text-sm text-slate-500">{entry.notes}</p>
                  ) : null}
                </div>
                <EmployeeStatusBadge
                  status={entry.availability}
                  variant="availability"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
