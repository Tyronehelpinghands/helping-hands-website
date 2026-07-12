import { cn } from "@/lib/utils";
import type { RiskCategory } from "@/lib/riskActions";

const styles: Record<RiskCategory, string> = {
  Planning: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  Crew: "border-violet-200 bg-violet-50 text-violet-700",
  Financieel: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Facturatie: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Veiligheid: "border-red-200 bg-red-50 text-red-700",
  Klant: "border-amber-200 bg-amber-50 text-amber-800",
  Contract: "border-slate-200 bg-slate-100 text-slate-700",
  Compliance: "border-orange-200 bg-orange-50 text-orange-800",
  Operationeel: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Marketing: "border-pink-200 bg-pink-50 text-pink-700",
  Systeem: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function RiskCategoryBadge({
  category,
  className,
}: {
  category: RiskCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[category],
        className,
      )}
    >
      {category}
    </span>
  );
}
