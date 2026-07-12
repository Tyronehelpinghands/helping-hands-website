import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  ListTodo,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RiskStats } from "@/lib/riskActions";

export default function RiskActionStatsCards({ stats }: { stats: RiskStats }) {
  const cards = [
    {
      id: "open",
      title: "Open acties",
      value: String(stats.openActions),
      detail: "Nieuw, open of in behandeling",
      icon: ListTodo,
      accent: "text-[#0B1F4D]",
      bar: "bg-[#173A8A]",
    },
    {
      id: "critical",
      title: "Kritieke risico's",
      value: String(stats.criticalRisks),
      detail: "Risiconiveau kritiek",
      icon: AlertTriangle,
      accent: "text-red-700",
      bar: "bg-red-500",
    },
    {
      id: "overdue",
      title: "Te laat",
      value: String(stats.overdue),
      detail: "Deadline verstreken",
      icon: Clock,
      accent: stats.overdue > 0 ? "text-red-700" : "text-green-700",
      bar: stats.overdue > 0 ? "bg-red-500" : "bg-green-500",
    },
    {
      id: "waiting",
      title: "Wacht op reactie",
      value: String(stats.waitingForResponse),
      detail: "Externe opvolging nodig",
      icon: AlertTriangle,
      accent: "text-orange-700",
      bar: "bg-orange-500",
    },
    {
      id: "done",
      title: "Afgerond deze maand",
      value: String(stats.completedThisMonth),
      detail: "Afgeronde acties",
      icon: CheckCircle,
      accent: "text-green-700",
      bar: "bg-green-500",
    },
    {
      id: "week",
      title: "Acties deze week",
      value: String(stats.dueThisWeek),
      detail: "Deadline deze week",
      icon: Calendar,
      accent: "text-[#173A8A]",
      bar: "bg-[#F28C28]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className={`text-2xl font-black ${card.accent}`}>
                  {card.value}
                </p>
              </div>
              <CardTitle className="mt-2 text-sm font-bold text-[#0B1F4D]">
                {card.title}
              </CardTitle>
              <CardDescription className="text-xs">{card.detail}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`h-1 w-10 rounded-full ${card.bar}`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
