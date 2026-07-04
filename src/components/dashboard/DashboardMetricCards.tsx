import { BrandLogoImage } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardCard } from "@/lib/portals";

type DashboardMetricCardsProps = {
  cards: DashboardCard[];
};

export default function DashboardMetricCards({ cards }: DashboardMetricCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <BrandLogoImage
                  variant="mark"
                  imageClassName="mt-0.5 h-7 w-7 shrink-0 opacity-50"
                />
                <div className="min-w-0">
                  <CardTitle className="text-base font-black text-[#0B1F4D]">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="mt-1 leading-6">
                    {card.detail}
                  </CardDescription>
                </div>
              </div>
              <Badge className="shrink-0 border-[#173A8A]/15 bg-[#F5F7FA] px-3 py-1 text-sm font-black text-[#173A8A] hover:bg-[#173A8A] hover:text-white">
                {card.value}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-1 w-10 rounded-full bg-[#F28C28]/80" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
