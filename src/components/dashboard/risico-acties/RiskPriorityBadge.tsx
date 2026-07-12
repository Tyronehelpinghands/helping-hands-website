import { cn } from "@/lib/utils";
import type { RiskPriority } from "@/lib/riskActions";

const styles: Record<RiskPriority, string> = {
  Laag: "border-slate-200 bg-slate-100 text-slate-600",
  Normaal: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Hoog: "border-orange-200 bg-orange-50 text-orange-700",
  Kritiek: "border-red-200 bg-red-50 text-red-700",
};

export default function RiskPriorityBadge({
  priority,
  className,
}: {
  priority: RiskPriority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}
