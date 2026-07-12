import { cn } from "@/lib/utils";

const shiftStyles: Record<string, string> = {
  Aangevraagd: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Bevestigd: "border-green-200 bg-green-50 text-green-700",
  "In uitvoering": "border-orange-200 bg-orange-50 text-orange-700",
  Afgerond: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Geannuleerd: "border-red-200 bg-red-50 text-red-700",
};

const hoursStyles: Record<string, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Ingediend: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
  Afgekeurd: "border-red-200 bg-red-50 text-red-700",
  Gefactureerd: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
};

const documentStyles: Record<string, string> = {
  "Niet ingeleverd": "border-red-200 bg-red-50 text-red-700",
  Ingeleverd: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
  Afgekeurd: "border-red-200 bg-red-50 text-red-700",
  "Verloopt binnenkort": "border-orange-200 bg-orange-50 text-orange-700",
};

const messageStyles: Record<string, string> = {
  Nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Gelezen: "border-slate-200 bg-slate-100 text-slate-600",
  "Actie nodig": "border-orange-200 bg-orange-50 text-orange-700",
};

const availabilityStyles: Record<string, string> = {
  Beschikbaar: "border-green-200 bg-green-50 text-green-700",
  "Niet beschikbaar": "border-red-200 bg-red-50 text-red-700",
  Misschien: "border-orange-200 bg-orange-50 text-orange-700",
};

const allStyles = {
  ...shiftStyles,
  ...hoursStyles,
  ...documentStyles,
  ...messageStyles,
  ...availabilityStyles,
};

export type EmployeeStatusBadgeVariant =
  | "shift"
  | "hours"
  | "document"
  | "message"
  | "availability";

function getStyleForStatus(status: string, variant?: EmployeeStatusBadgeVariant): string {
  if (variant === "shift") return shiftStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
  if (variant === "hours") return hoursStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
  if (variant === "document") return documentStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
  if (variant === "message") return messageStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
  if (variant === "availability") return availabilityStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
  return allStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600";
}

export default function EmployeeStatusBadge({
  status,
  variant,
  className,
}: {
  status: string;
  variant?: EmployeeStatusBadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        getStyleForStatus(status, variant),
        className,
      )}
    >
      {status}
    </span>
  );
}
