import {
  Bell,
  FileText,
  FolderKanban,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardNotification } from "@/data/dashboardMockData";

const typeIcons: Record<DashboardNotification["type"], typeof Bell> = {
  lead: Users,
  project: FolderKanban,
  invoice: FileText,
  crew: UserPlus,
  request: Bell,
};

type NotificationsListProps = {
  notifications: DashboardNotification[];
};

export default function NotificationsList({
  notifications,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Laatste meldingen
          </CardTitle>
          <CardDescription>Geen recente meldingen.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Laatste meldingen
        </CardTitle>
        <CardDescription>Recente updates uit sales, planning en administratie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl border border-slate-100 bg-[#F5F7FA]/60 p-3 transition hover:border-[#38bdf8]/30 hover:bg-white"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173A8A]/10 text-[#173A8A]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0B1F4D]">{item.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-[#101828]/65">
                  {item.description}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#38bdf8]">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
