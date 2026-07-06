import { Award, Car, Users, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CrewStats } from "@/lib/crew";

type CrewStatsProps = {
  stats: CrewStats;
};

export default function CrewStatsCards({ stats }: CrewStatsProps) {
  const cards = [
    {
      id: "total",
      title: "Totaal crewleden",
      value: String(stats.total),
      detail: "Geregistreerd in systeem",
      icon: Users,
    },
    {
      id: "available",
      title: "Actief beschikbaar",
      value: String(stats.availableThisWeek),
      detail: "Actief of beschikbaar",
      icon: UserCheck,
    },
    {
      id: "employment",
      title: "Dienstverband",
      value: `${stats.zzp} / ${stats.loondienst} / ${stats.payroll}`,
      detail: "ZZP / Loondienst / Payroll",
      icon: Car,
    },
    {
      id: "certs",
      title: "Met certificaat",
      value: String(stats.withCertificate),
      detail: "VCA, HACCP, heftruck, etc.",
      icon: Award,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-2xl font-black tracking-tight text-[#0B1F4D]">
                  {card.value}
                </p>
              </div>
              <CardTitle className="mt-3 text-sm font-bold text-[#0B1F4D]">
                {card.title}
              </CardTitle>
              <CardDescription className="text-xs leading-5">
                {card.detail}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-1 w-10 rounded-full bg-[#F28C28]/80" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
