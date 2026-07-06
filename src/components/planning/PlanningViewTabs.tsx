"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlanningView } from "@/data/planningMockData";

type PlanningViewTabsProps = {
  view: PlanningView;
  onChange: (view: PlanningView) => void;
  children: Record<PlanningView, React.ReactNode>;
};

const views: { id: PlanningView; label: string }[] = [
  { id: "dag", label: "Dagoverzicht" },
  { id: "week", label: "Weekoverzicht" },
  { id: "project", label: "Projectoverzicht" },
  { id: "crew", label: "Crew overzicht" },
  { id: "open", label: "Open diensten" },
];

export default function PlanningViewTabs({ view, onChange, children }: PlanningViewTabsProps) {
  return (
    <Tabs value={view} onValueChange={(v) => onChange((v ?? "week") as PlanningView)}>
      <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-[#F5F7FA] p-1">
        {views.map((v) => (
          <TabsTrigger
            key={v.id}
            value={v.id}
            className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#173A8A] sm:text-sm"
          >
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {views.map((v) => (
        <TabsContent key={v.id} value={v.id} className="mt-0">
          {children[v.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
