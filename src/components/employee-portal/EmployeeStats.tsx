import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Inbox, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployeePortalStats } from "@/lib/employeePortal";

const statConfig = [
  {
    key: "upcomingShifts" as const,
    label: "Aankomende diensten",
    icon: CalendarDays,
    href: "/portaal/medewerkers/planning",
    format: (v: number) => String(v),
  },
  {
    key: "hoursThisWeek" as const,
    label: "Uren deze week",
    icon: Clock,
    href: "/portaal/medewerkers/uren",
    format: (v: number) => `${v.toFixed(1)} u`,
  },
  {
    key: "openActions" as const,
    label: "Openstaande acties",
    icon: ListChecks,
    href: "/portaal/medewerkers/berichten",
    format: (v: number) => String(v),
  },
  {
    key: "newMessages" as const,
    label: "Nieuwe berichten",
    icon: Inbox,
    href: "/portaal/medewerkers/berichten",
    format: (v: number) => String(v),
  },
];

export default function EmployeeStats() {
  const stats = getEmployeePortalStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        return (
          <Link key={item.key} href={item.href} className="group">
            <Card className="h-full border-slate-200/80 bg-white shadow-sm transition hover:border-[#173A8A]/20 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="text-sm font-semibold text-slate-600">
                  {item.label}
                </CardDescription>
                <Icon className="h-4 w-4 text-[#173A8A]" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl font-black text-[#0B1F4D]">
                  {item.format(value)}
                </CardTitle>
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#173A8A] opacity-0 transition group-hover:opacity-100">
                  Bekijken
                  <ArrowRight className="h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
