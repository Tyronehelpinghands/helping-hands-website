import { cn } from "@/lib/utils";
import type { HoursStatus } from "@/lib/hours";

const statusStyles: Record<HoursStatus, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Ingediend: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
  Afgekeurd: "border-red-200 bg-red-50 text-red-700",
  Gefactureerd: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
};

type HoursStatusBadgeProps = {
  status: HoursStatus;
  className?: string;
};

export default function HoursStatusBadge({
  status,
  className,
}: HoursStatusBadgeProps) {
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
