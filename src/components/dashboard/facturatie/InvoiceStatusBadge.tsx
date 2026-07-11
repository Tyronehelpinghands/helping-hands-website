import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/invoicing";

const statusStyles: Record<InvoiceStatus, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  "Klaar voor Moneybird": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  "Aangemaakt in Moneybird": "border-green-200 bg-green-50 text-green-700",
  Verzonden: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Betaald: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
  className?: string;
};

export default function InvoiceStatusBadge({
  status,
  className,
}: InvoiceStatusBadgeProps) {
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
