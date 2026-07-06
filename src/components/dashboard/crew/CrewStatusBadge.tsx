import { cn } from "@/lib/utils";
import type { CrewStatus } from "@/lib/crew";

const statusStyles: Record<CrewStatus, string> = {
  Actief: "border-green-200 bg-green-50 text-green-700",
  Beschikbaar: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Inactief: "border-slate-200 bg-slate-100 text-slate-600",
  Onboarding: "border-amber-200 bg-amber-50 text-amber-700",
  Geblokkeerd: "border-red-200 bg-red-50 text-red-700",
};

type CrewStatusBadgeProps = {
  status: CrewStatus;
  className?: string;
};

export default function CrewStatusBadge({ status, className }: CrewStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
