import type { PlanningShift } from "@/data/planningMockData";
import { buildShiftbaseDescription } from "@/lib/planning-utils";

type ShiftbaseDescriptionPreviewProps = {
  shift: PlanningShift | null;
};

export default function ShiftbaseDescriptionPreview({ shift }: ShiftbaseDescriptionPreviewProps) {
  if (!shift) return null;

  const description = buildShiftbaseDescription(shift);

  return (
    <div className="rounded-lg border border-slate-200 bg-[#F5F7FA]/60 p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#101828]/50">
        Shiftbase omschrijving preview
      </p>
      <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-[#101828]/75">
        {description}
      </pre>
    </div>
  );
}
