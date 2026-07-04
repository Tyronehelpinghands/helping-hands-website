import Link from "next/link";
import {
  Clock,
  FileText,
  FolderPlus,
  PlusCircle,
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
import type { QuickAction } from "@/data/dashboardMockData";

const iconMap: Record<QuickAction["icon"], typeof PlusCircle> = {
  request: PlusCircle,
  crew: UserPlus,
  project: FolderPlus,
  lead: Users,
  hours: Clock,
  invoice: FileText,
};

type QuickActionsProps = {
  actions: QuickAction[];
};

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Snelle acties
        </CardTitle>
        <CardDescription>
          Direct naar veelgebruikte taken en modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = iconMap[action.icon];
            return (
              <Link
                key={action.id}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/50 p-4 transition hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F28C28]/10 text-[#F28C28] transition group-hover:bg-[#F28C28] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-[#0B1F4D]">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
