"use client";

import { WEEK_DAYS } from "@/data/planningMockData";
import type { PlanningShift } from "@/data/planningMockData";
import { groupShiftsByWeekDay } from "@/lib/planning-utils";
import PlanningShiftCard, { type ShiftCardAction } from "@/components/planning/PlanningShiftCard";

type WeekPlanningBoardProps = {
  shifts: PlanningShift[];
  onAction: (action: ShiftCardAction, shift: PlanningShift) => void;
};

export default function WeekPlanningBoard({ shifts, onAction }: WeekPlanningBoardProps) {
  const grouped = groupShiftsByWeekDay(shifts);

  return (
    <div className="-mx-2 overflow-x-auto pb-2">
      <div className="flex min-w-[900px] gap-3 px-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="min-w-[130px] flex-1">
            <div className="mb-2 rounded-lg bg-[#173A8A]/10 px-2 py-1.5 text-center">
              <p className="text-xs font-bold text-[#173A8A]">{day}</p>
              <p className="text-[10px] text-[#101828]/50">
                {grouped[day]?.length ?? 0} shifts
              </p>
            </div>
            <div className="space-y-2">
              {(grouped[day] ?? []).length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 px-2 py-4 text-center text-[10px] text-[#101828]/40">
                  Geen shifts
                </p>
              ) : (
                grouped[day].map((shift) => (
                  <PlanningShiftCard
                    key={shift.id}
                    shift={shift}
                    onAction={onAction}
                    compact
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
