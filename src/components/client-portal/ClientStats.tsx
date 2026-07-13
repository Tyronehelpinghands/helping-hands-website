import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock,
  FolderKanban,
  MessageSquare,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClientPortalStats } from "@/lib/clientPortal";

const statConfig = [
  {
    key: "openRequests" as const,
    label: "Open aanvragen",
    icon: ClipboardList,
    href: "/portaal/opdrachtgevers/aanvragen",
    format: (v: number) => String(v),
  },
  {
    key: "activeProjects" as const,
    label: "Lopende projecten",
    icon: FolderKanban,
    href: "/portaal/opdrachtgevers/projecten",
    format: (v: number) => String(v),
  },
  {
    key: "briefingsNeeded" as const,
    label: "Briefings nodig",
    icon: MessageSquare,
    href: "/portaal/opdrachtgevers/briefings",
    format: (v: number) => String(v),
  },
  {
    key: "openInvoices" as const,
    label: "Openstaande facturen",
    icon: Receipt,
    href: "/portaal/opdrachtgevers/facturen",
    format: (v: number) => String(v),
  },
  {
    key: "upcomingDeployments" as const,
    label: "Aankomende inzet",
    icon: CalendarDays,
    href: "/portaal/opdrachtgevers/planning",
    format: (v: number) => String(v),
  },
  {
    key: "hoursPending" as const,
    label: "Urenstatus",
    icon: Clock,
    href: "/portaal/opdrachtgevers/uren",
    format: (v: number) => (v > 0 ? `${v} te controleren` : "Bijgewerkt"),
  },
];

export default function ClientStats() {
  const stats = getClientPortalStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                <CardTitle className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
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
