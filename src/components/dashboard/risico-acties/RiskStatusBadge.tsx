import { cn } from "@/lib/utils";
import type { RiskStatus } from "@/lib/riskActions";

const styles: Record<RiskStatus, string> = {
  Nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Open: "border-amber-200 bg-amber-50 text-amber-700",
  "In behandeling": "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  "Wacht op reactie": "border-orange-200 bg-orange-50 text-orange-700",
  Afgerond: "border-green-200 bg-green-50 text-green-700",
  Geparkeerd: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function RiskStatusBadge({
  status,
  className,
}: {
  status: RiskStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
