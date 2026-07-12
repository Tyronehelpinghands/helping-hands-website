import Link from "next/link";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  FileText,
  ListChecks,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmployeeDocuments from "@/components/employee-portal/EmployeeDocuments";
import EmployeeIntegrationStatus from "@/components/employee-portal/EmployeeIntegrationStatus";
import EmployeeMessages from "@/components/employee-portal/EmployeeMessages";
import EmployeeStats from "@/components/employee-portal/EmployeeStats";
import HoursSummary from "@/components/employee-portal/HoursSummary";
import UpcomingShifts, { NextShiftHighlight } from "@/components/employee-portal/UpcomingShifts";
import { getNextShift, getPendingActions } from "@/lib/employeePortal";
import { cn } from "@/lib/utils";

export default function EmployeePortalOverviewPage() {
  const nextShift = getNextShift();
  const actions = getPendingActions();

  return (
    <div className="space-y-6">
      <EmployeeStats />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {nextShift ? <NextShiftHighlight shift={nextShift} /> : null}
          <UpcomingShifts compact />
        </div>
        <div className="space-y-6">
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-black text-[#0B1F4D]">
                <ListChecks className="h-5 w-5 text-[#F28C28]" />
                Acties
              </CardTitle>
              <CardDescription>Onderdelen die aandacht nodig hebben</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {actions.length === 0 ? (
                <p className="text-sm text-slate-500">Geen openstaande acties.</p>
              ) : (
                actions.map((action) => (
                  <Link
                    key={`${action.type}-${action.label}`}
                    href={action.href}
                    className="block rounded-lg border border-slate-200 px-3 py-2.5 text-sm transition hover:border-[#173A8A]/30 hover:bg-slate-50"
                  >
                    <p className="font-semibold text-[#0B1F4D]">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.type}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
          <HoursSummary />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmployeeMessages compact />
        <EmployeeDocuments compact />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Snelle acties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/portaal/medewerkers/planning"
            className={cn(buttonVariants(), "bg-[#173A8A] text-white hover:bg-[#0B1F4D]")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Mijn planning bekijken
          </Link>
          <Link
            href="/portaal/medewerkers/beschikbaarheid"
            className={buttonVariants({ variant: "outline" })}
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            Beschikbaarheid doorgeven
          </Link>
          <Link
            href="/portaal/medewerkers/uren"
            className={buttonVariants({ variant: "outline" })}
          >
            <Clock className="mr-2 h-4 w-4" />
            Uren controleren
          </Link>
          <Link
            href="/portaal/medewerkers/documenten"
            className={buttonVariants({ variant: "outline" })}
          >
            <FileText className="mr-2 h-4 w-4" />
            Documenten bekijken
          </Link>
        </CardContent>
      </Card>

      <EmployeeIntegrationStatus />
    </div>
  );
}
