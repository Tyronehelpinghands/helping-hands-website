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
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IntegrationHealthPanel from "@/components/dashboard/shared/IntegrationHealthPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import {
  buildAttentionItems,
  buildCockpitKpis,
  type CockpitKpi,
} from "@/lib/dashboardOverview";
import { quickActions } from "@/data/dashboardMockData";
import { cn } from "@/lib/utils";

const iconMap: Record<CockpitKpi["icon"], typeof FolderKanban> = {
  projects: FolderKanban,
  crew: UserCog,
  hours: Clock,
  invoice: FileText,
  finance: Wallet,
  risk: AlertTriangle,
  messages: MessageSquare,
  integrations: Link2,
};

function priorityClass(priority: string): string {
  switch (priority) {
    case "Kritiek":
      return "border-red-200 bg-red-50 text-red-700";
    case "Hoog":
      return "border-orange-200 bg-orange-50 text-orange-700";
    default:
      return "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]";
  }
}

export default function InternDashboardOverview() {
  const kpis = buildCockpitKpis();
  const attention = buildAttentionItems();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon];
          return (
            <Link
              key={kpi.id}
              href={kpi.href}
              className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A] transition group-hover:bg-[#173A8A] group-hover:text-white">
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

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Vandaag aandacht nodig
            </CardTitle>
            <CardDescription>
              Openstaande taken uit demo-modules — later gekoppeld aan Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attention.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-3 transition hover:bg-white hover:shadow-sm"
              >
                <div className="min-w-0">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
                      priorityClass(item.priority),
                    )}
                  >
                    {item.priority}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-[#0B1F4D]">
                    {item.title}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#173A8A]">
                  Openen →
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <IntegrationHealthPanel compact autoCheck />
      </div>

      <QuickActions actions={quickActions} />
    </div>
  );
}
