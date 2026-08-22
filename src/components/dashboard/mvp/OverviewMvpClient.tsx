"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  FileText,
  FolderKanban,
  Link2,
  MessageSquare,
  UserCog,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IntegrationHealthPanel from "@/components/dashboard/shared/IntegrationHealthPanel";
import { DASHBOARD_ROUTES } from "@/lib/dashboardNavigation";
import { getRoleLabel } from "@/lib/auth/roles";
import type { DashboardStats, Project, Task, TimeEntry } from "@/lib/dashboard/types";
import type { UserRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate, projectStatusLabel, taskPriorityLabel } from "@/lib/dashboard/formatters";

export function OverviewMvpClient({
  stats,
  profileName,
  profileRole,
  upcomingProjects,
  pendingHours,
  openTasks,
}: {
  stats: DashboardStats;
  profileName: string | null;
  profileRole: UserRole;
  upcomingProjects: Project[];
  pendingHours: TimeEntry[];
  openTasks: Task[];
}) {
  const kpis = [
    {
      title: "Open projecten",
      value: String(stats.openProjects),
      detail: "draft / confirmed / lopend",
      href: DASHBOARD_ROUTES.projecten,
      icon: FolderKanban,
    },
    {
      title: "Beschikbare crew",
      value: String(stats.availableCrew),
      detail: "status actief",
      href: DASHBOARD_ROUTES.crew,
      icon: UserCog,
    },
    {
      title: "Shifts deze week",
      value: String(stats.shiftsThisWeek),
      detail: "niet-geannuleerd",
      href: DASHBOARD_ROUTES.planning,
      icon: Users,
    },
    {
      title: "Uren ter controle",
      value: String(stats.openHoursReview),
      detail: "status submitted",
      href: DASHBOARD_ROUTES.urenregistratie,
      icon: Clock,
    },
    {
      title: "Factuurconcepten",
      value: String(stats.invoiceDrafts),
      detail: "draft / klaar",
      href: DASHBOARD_ROUTES.facturatie,
      icon: FileText,
    },
    {
      title: "Openstaande acties",
      value: String(stats.openTasks),
      detail: "open / bezig",
      href: DASHBOARD_ROUTES.risicoActies,
      icon: AlertTriangle,
    },
    {
      title: "Nieuwe leads",
      value: String(stats.newLeads),
      detail: "status nieuw",
      href: DASHBOARD_ROUTES.leads,
      icon: MessageSquare,
    },
    {
      title: "Integraties",
      value: "Hub",
      detail: "API-status & koppelingen",
      href: DASHBOARD_ROUTES.integraties,
      icon: Link2,
    },
  ];

  const quick = [
    { label: "Nieuwe opdrachtgever", href: DASHBOARD_ROUTES.sales },
    { label: "Nieuwe lead", href: DASHBOARD_ROUTES.leads },
    { label: "Nieuw project", href: DASHBOARD_ROUTES.projecten },
    { label: "Crew toevoegen", href: DASHBOARD_ROUTES.crew },
    { label: "Uren invoeren", href: DASHBOARD_ROUTES.urenregistratie },
    { label: "Vraag OpenClaw", href: DASHBOARD_ROUTES.openclaw },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0B1F4D]">
          Welkom{profileName ? `, ${profileName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[#101828]/60">
          Rol: {getRoleLabel(profileRole)} · operationeel overzicht
        </p>
      </div>

      {!stats.tablesReady ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {stats.errorMessage ||
            "Database-tabellen nog niet aangemaakt. Voer docs/internal-dashboard-database.md uit in Supabase SQL Editor."}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              href={kpi.href}
              className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-black text-[#0B1F4D]">{kpi.value}</p>
              </div>
              <p className="mt-3 text-sm font-bold text-[#0B1F4D]">{kpi.title}</p>
              <p className="mt-1 text-xs text-[#101828]/55">{kpi.detail}</p>
              <div className="mt-3 h-1 w-10 rounded-full bg-[#F28C28]/80" />
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {quick.map((q) => (
          <Link
            key={q.href + q.label}
            href={q.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-slate-200",
            )}
          >
            {q.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Komende projecten
            </CardTitle>
            <CardDescription>Open / lopende projecten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingProjects.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nog geen projecten aangemaakt. Maak je eerste project aan.
              </p>
            ) : (
              upcomingProjects.map((p) => (
                <Link
                  key={p.id}
                  href={DASHBOARD_ROUTES.projecten}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-[#F5F7FA]"
                >
                  <span className="font-semibold text-[#0B1F4D]">
                    {p.project_name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {projectStatusLabel(p.status)} · {formatDate(p.start_date)}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Uren ter controle
            </CardTitle>
            <CardDescription>Status submitted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingHours.length === 0 ? (
              <p className="text-sm text-slate-500">
                Geen openstaande uren ter controle.
              </p>
            ) : (
              pendingHours.map((h) => (
                <Link
                  key={h.id}
                  href={DASHBOARD_ROUTES.urenregistratie}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-[#F5F7FA]"
                >
                  <span className="font-semibold text-[#0B1F4D]">
                    {h.crew_members?.full_name || "Crew"} ·{" "}
                    {h.projects?.project_name || "Project"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(h.work_date)} · {h.hours ?? 0} u
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Open acties
            </CardTitle>
            <CardDescription>Risico & follow-ups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {openTasks.length === 0 ? (
              <p className="text-sm text-slate-500">Geen openstaande acties.</p>
            ) : (
              openTasks.map((t) => (
                <Link
                  key={t.id}
                  href={DASHBOARD_ROUTES.risicoActies}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-[#F5F7FA]"
                >
                  <span className="font-semibold text-[#0B1F4D]">{t.title}</span>
                  <span className="text-xs text-slate-500">
                    {taskPriorityLabel(t.priority)}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Integratiestatus
            </CardTitle>
            <CardDescription>Eerlijke statuschecks</CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationHealthPanel />
            <Link
              href={DASHBOARD_ROUTES.integraties}
              className="mt-3 inline-block text-sm font-semibold text-[#173A8A] hover:underline"
            >
              Naar integratiehub →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
