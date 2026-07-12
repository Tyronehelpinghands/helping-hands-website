import { cn } from "@/lib/utils";
import type { IntegrationStatusType } from "@/lib/settings";

const styles: Record<IntegrationStatusType, string> = {
  "Niet gekoppeld": "border-slate-200 bg-slate-100 text-slate-600",
  Voorbereid: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Actief: "border-green-200 bg-green-50 text-green-700",
  Fout: "border-red-200 bg-red-50 text-red-700",
  Binnenkort: "border-orange-200 bg-orange-50 text-orange-700",
};

export default function SettingsStatusBadge({
  status,
  className,
}: {
  status: IntegrationStatusType | string;
  className?: string;
}) {
  const style =
    styles[status as IntegrationStatusType] ??
    "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
}
