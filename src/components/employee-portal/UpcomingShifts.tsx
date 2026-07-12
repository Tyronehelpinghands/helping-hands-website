"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import ShiftDetailDrawer from "@/components/employee-portal/ShiftDetailDrawer";
import type { EmployeeShift } from "@/lib/employeePortal";
import {
  DEMO_EMPLOYEE_SHIFTS,
  formatShiftDate,
  formatShiftTimeRange,
  getGoogleMapsUrl,
  getUpcomingShifts,
} from "@/lib/employeePortal";
import { cn } from "@/lib/utils";

type UpcomingShiftsProps = {
  shifts?: EmployeeShift[];
  compact?: boolean;
  showFilters?: boolean;
  title?: string;
  description?: string;
};

export default function UpcomingShifts({
  shifts = DEMO_EMPLOYEE_SHIFTS,
  compact = false,
  showFilters = false,
  title = "Aankomende planning",
  description = "Je eerstvolgende diensten en projecten",
}: UpcomingShiftsProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedShift, setSelectedShift] = useState<EmployeeShift | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const upcoming = useMemo(() => getUpcomingShifts(shifts), [shifts]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return upcoming;
    return upcoming.filter((s) => s.status === statusFilter);
  }, [upcoming, statusFilter]);

  const displayShifts = compact ? filtered.slice(0, 3) : filtered;

  function openShift(shift: EmployeeShift) {
    setSelectedShift(shift);
    setDrawerOpen(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showFilters ? (
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="Aangevraagd">Aangevraagd</SelectItem>
                <SelectItem value="Bevestigd">Bevestigd</SelectItem>
                <SelectItem value="In uitvoering">In uitvoering</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {displayShifts.length === 0 ? (
            <p className="text-sm text-slate-500">Geen diensten gevonden voor dit filter.</p>
          ) : (
            displayShifts.map((shift) => (
              <button
                key={shift.id}
                type="button"
                onClick={() => openShift(shift)}
                className={cn(
                  "w-full rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 text-left transition hover:border-[#173A8A]/30 hover:bg-white",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#0B1F4D]">{shift.projectName}</p>
                    <p className="mt-1 text-sm text-slate-600">{shift.locationName}</p>
                  </div>
                  <EmployeeStatusBadge status={shift.status} variant="shift" />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#173A8A]" />
                    {formatShiftDate(shift.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#173A8A]" />
                    {formatShiftTimeRange(shift.startTime, shift.endTime)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#173A8A]" />
                    {shift.role}
                  </span>
                </div>
              </button>
            ))
          )}
          {compact && filtered.length > 3 ? (
            <Link
              href="/portaal/medewerkers/planning"
              className={buttonVariants({ variant: "outline", className: "w-full" })}
            >
              Alle diensten bekijken
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <ShiftDetailDrawer
        shift={selectedShift}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}

export function NextShiftHighlight({ shift }: { shift: EmployeeShift }) {
  return (
    <Card className="border-[#173A8A]/20 bg-gradient-to-br from-white to-[#173A8A]/5 shadow-sm">
      <CardHeader>
        <CardDescription className="font-semibold uppercase tracking-wider text-[#173A8A]">
          Eerstvolgende dienst
        </CardDescription>
        <CardTitle className="text-xl font-black text-[#0B1F4D]">{shift.projectName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm text-slate-700">
          <span>{formatShiftDate(shift.date)}</span>
          <span>{formatShiftTimeRange(shift.startTime, shift.endTime)}</span>
          <EmployeeStatusBadge status={shift.status} variant="shift" />
        </div>
        <p className="text-sm text-slate-600">
          <MapPin className="mr-1 inline h-4 w-4" />
          {shift.locationAddress}
        </p>
        {shift.meetingPoint ? (
          <p className="text-sm text-slate-600">Meldtijd: {shift.meetingPoint}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={getGoogleMapsUrl(shift.locationAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "bg-[#173A8A] text-white hover:bg-[#0B1F4D]")}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Open in Google Maps
          </a>
          <Link
            href="/portaal/medewerkers/planning"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
