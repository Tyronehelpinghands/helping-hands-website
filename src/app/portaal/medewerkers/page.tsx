import Link from "next/link";
import { redirect } from "next/navigation";
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
import EmployeeMessages from "@/components/employee-portal/EmployeeMessages";
import EmployeeStats from "@/components/employee-portal/EmployeeStats";
import HoursSummary from "@/components/employee-portal/HoursSummary";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import UpcomingShifts, {
  NextShiftHighlight,
} from "@/components/employee-portal/UpcomingShifts";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";
import { cn } from "@/lib/utils";

export default async function EmployeePortalOverviewPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");

  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  const { nextShift, pendingActions: actions, shifts, hours, messages, documents, stats } =
    bundle;

  return (
    <div className="space-y-6">
      <EmployeeStats stats={stats} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {nextShift ? <NextShiftHighlight shift={nextShift} /> : (
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-black text-[#0B1F4D]">
                  Geen aankomende dienst
                </CardTitle>
                <CardDescription>
                  Zodra planning een shift aan jou toewijst, verschijnt die hier.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          <UpcomingShifts shifts={shifts} compact />
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
                    className="block min-h-11 rounded-lg border border-slate-200 px-3 py-3 text-sm transition hover:border-[#173A8A]/30 hover:bg-slate-50"
                  >
                    <p className="font-semibold text-[#0B1F4D]">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.type}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
          <HoursSummary hours={hours} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmployeeMessages messages={messages} compact />
        <EmployeeDocuments documents={documents} compact />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Snelle acties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/portaal/medewerkers/planning"
            className={cn(
              buttonVariants(),
              "min-h-11 w-full justify-center bg-[#173A8A] text-white hover:bg-[#0B1F4D] sm:w-auto",
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Mijn planning bekijken
          </Link>
          <Link
            href="/portaal/medewerkers/beschikbaarheid"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            Beschikbaarheid doorgeven
          </Link>
          <Link
            href="/portaal/medewerkers/uren"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Uren controleren
          </Link>
          <Link
            href="/portaal/medewerkers/documenten"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Documenten bekijken
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
