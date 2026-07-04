"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CrewAvailability } from "@/data/dashboardMockData";

type CrewAvailabilityCardProps = {
  data: CrewAvailability[];
};

export default function CrewAvailabilityCard({ data }: CrewAvailabilityCardProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Crew beschikbaarheid
          </CardTitle>
          <CardDescription>Nog geen crewdata beschikbaar.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Crew beschikbaarheid
        </CardTitle>
        <CardDescription>
          Huidige verdeling over beschikbaar, ingepland en niet beschikbaar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {data.map((item) => {
          const percentage = Math.round((item.count / total) * 100);
          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0B1F4D]">{item.label}</span>
                <span className="font-bold text-[#173A8A]">
                  {item.count}{" "}
                  <span className="text-xs font-medium text-[#101828]/50">
                    ({percentage}%)
                  </span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.fill,
                  }}
                />
              </div>
            </div>
          );
        })}
        <p className="border-t border-slate-100 pt-3 text-center text-sm font-bold text-[#0B1F4D]">
          Totaal: {total} crewleden
        </p>
      </CardContent>
    </Card>
  );
}
