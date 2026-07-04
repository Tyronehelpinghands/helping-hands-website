import {
  Briefcase,
  Euro,
  FolderKanban,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KpiCard } from "@/data/dashboardMockData";
import { cn } from "@/lib/utils";

const iconMap: Record<KpiCard["icon"], LucideIcon> = {
  revenue: Euro,
  invoices: Briefcase,
  projects: FolderKanban,
  crew: Users,
  leads: TrendingUp,
};

type StatCardProps = {
  card: KpiCard;
  className?: string;
};

export default function StatCard({ card, className }: StatCardProps) {
  const Icon = iconMap[card.icon];

  return (
    <Card
      className={cn(
        "border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md",
        className,
      )}
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
        <CardDescription className="text-xs leading-5">{card.detail}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-1 w-10 rounded-full bg-[#F28C28]/80" />
      </CardContent>
    </Card>
  );
}

type StatCardsGridProps = {
  cards: KpiCard[];
};

export function StatCardsGrid({ cards }: StatCardsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  );
}
