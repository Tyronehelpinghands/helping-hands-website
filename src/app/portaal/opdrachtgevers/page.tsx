import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  ListChecks,
  MessageSquare,
  Receipt,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClientContactPanel from "@/components/client-portal/ClientContactPanel";
import ClientDocuments from "@/components/client-portal/ClientDocuments";
import ClientIntegrationStatus from "@/components/client-portal/ClientIntegrationStatus";
import ClientPlanningOverview from "@/components/client-portal/ClientPlanningOverview";
import ClientRequestTable from "@/components/client-portal/ClientRequestTable";
import ClientStats from "@/components/client-portal/ClientStats";
import { NextProjectHighlight } from "@/components/client-portal/ClientProjectCards";
import { getClientPendingActions, getNextClientProject } from "@/lib/clientPortal";
import { cn } from "@/lib/utils";

export default function ClientPortalOverviewPage() {
  const nextProject = getNextClientProject();
  const actions = getClientPendingActions();

  return (
    <div className="space-y-6">
      <ClientStats />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {nextProject ? <NextProjectHighlight project={nextProject} /> : null}
          <ClientRequestTable compact />
          <ClientPlanningOverview compact />
        </div>
        <div className="space-y-6">
          <Card className="border-slate-200/80 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-black text-[#0B1F4D]">
                <ListChecks className="h-5 w-5 text-[#F28C28]" />
                Openstaande acties
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
          <ClientContactPanel compact />
        </div>
      </div>

      <ClientDocuments compact />

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Snelle acties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/portaal/opdrachtgevers/aanvragen"
            className={cn(
              buttonVariants(),
              "min-h-11 w-full justify-center bg-[#173A8A] text-white hover:bg-[#0B1F4D] sm:w-auto",
            )}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Nieuwe aanvraag doen
          </Link>
          <Link
            href="/portaal/opdrachtgevers/briefings"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Briefing aanleveren
          </Link>
          <Link
            href="/portaal/opdrachtgevers/planning"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Planning bekijken
          </Link>
          <Link
            href="/portaal/opdrachtgevers/facturen"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Facturen bekijken
          </Link>
          <Link
            href="/portaal/opdrachtgevers/contact"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 w-full justify-center sm:w-auto")}
          >
            Contact opnemen
          </Link>
        </CardContent>
      </Card>

      <ClientIntegrationStatus />
    </div>
  );
}
