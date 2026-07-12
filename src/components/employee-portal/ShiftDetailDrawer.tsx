"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Shirt,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeShift } from "@/lib/employeePortal";
import {
  formatShiftDate,
  formatShiftTimeRange,
  getGoogleMapsUrl,
} from "@/lib/employeePortal";

type ShiftDetailDrawerProps = {
  shift: EmployeeShift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShiftDetailDrawer({
  shift,
  open,
  onOpenChange,
}: ShiftDetailDrawerProps) {
  if (!shift) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="pr-8 text-left text-xl font-black text-[#0B1F4D]">
            {shift.projectName}
          </SheetTitle>
          <SheetDescription className="text-left">
            {shift.clientName ?? shift.locationName}
          </SheetDescription>
          <div className="pt-2">
            <EmployeeStatusBadge status={shift.status} variant="shift" />
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 py-4">
          <DetailRow icon={Calendar} label="Datum" value={formatShiftDate(shift.date)} />
          <DetailRow
            icon={Clock}
            label="Tijden"
            value={formatShiftTimeRange(shift.startTime, shift.endTime)}
          />
          <DetailRow icon={MapPin} label="Locatie" value={shift.locationName} />
          <DetailRow icon={MapPin} label="Adres" value={shift.locationAddress} />
          <DetailRow icon={User} label="Functie" value={shift.role} />
          {shift.meetingPoint ? (
            <DetailRow icon={Clock} label="Meldtijd / meeting point" value={shift.meetingPoint} />
          ) : null}
          {shift.contactPerson ? (
            <DetailRow icon={User} label="Contactpersoon" value={shift.contactPerson} />
          ) : null}
          {shift.clothing ? (
            <DetailRow icon={Shirt} label="Kleding" value={shift.clothing} />
          ) : null}
          {shift.briefing ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Briefing</p>
              <p className="mt-2 text-sm text-slate-700">{shift.briefing}</p>
            </div>
          ) : null}
          {shift.travelInfo ? (
            <DetailRow icon={Navigation} label="Reisinfo" value={shift.travelInfo} />
          ) : null}
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="w-full bg-[#173A8A] hover:bg-[#0B1F4D]"
            onClick={() => {
              /* UI-only bevestiging */
            }}
          >
            Bevestig beschikbaarheid
          </Button>
          <Button type="button" variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Ik heb een vraag
          </Button>
          <a
            href={getGoogleMapsUrl(shift.locationAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", className: "w-full" })}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Google Maps
          </a>
          <Link
            href="/portaal/medewerkers/uren"
            className={buttonVariants({ variant: "secondary", className: "w-full" })}
          >
            Naar uren
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#173A8A]" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}
