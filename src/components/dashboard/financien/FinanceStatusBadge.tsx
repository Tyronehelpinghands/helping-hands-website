import { cn } from "@/lib/utils";
import type { FinanceExpenseStatus, FinanceInvoiceStatus } from "@/lib/finance";

const invoiceStyles: Record<FinanceInvoiceStatus, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Verzonden: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Openstaand: "border-amber-200 bg-amber-50 text-amber-700",
  "Te laat": "border-red-200 bg-red-50 text-red-700",
  Betaald: "border-green-200 bg-green-50 text-green-700",
};

const expenseStyles: Record<FinanceExpenseStatus, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Ingeboekt: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Betaald: "border-green-200 bg-green-50 text-green-700",
  "Te controleren": "border-orange-200 bg-orange-50 text-orange-700",
};

type FinanceStatusBadgeProps = {
  status: FinanceInvoiceStatus | FinanceExpenseStatus;
  className?: string;
};

export default function FinanceStatusBadge({
  status,
  className,
}: FinanceStatusBadgeProps) {
  const style =
    status in invoiceStyles
      ? invoiceStyles[status as FinanceInvoiceStatus]
      : expenseStyles[status as FinanceExpenseStatus];

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
