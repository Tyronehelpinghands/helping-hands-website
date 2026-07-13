import { cn } from "@/lib/utils";

const requestStyles: Record<string, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Ingediend: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  "In behandeling": "border-orange-200 bg-orange-50 text-orange-700",
  Bevestigd: "border-green-200 bg-green-50 text-green-700",
  Afgewezen: "border-red-200 bg-red-50 text-red-700",
  Geannuleerd: "border-red-200 bg-red-50 text-red-700",
};

const projectStyles: Record<string, string> = {
  Aanvraag: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Gepland: "border-orange-200 bg-orange-50 text-orange-700",
  Bevestigd: "border-green-200 bg-green-50 text-green-700",
  "In uitvoering": "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Afgerond: "border-green-200 bg-green-50 text-green-700",
  Geannuleerd: "border-red-200 bg-red-50 text-red-700",
};

const briefingStyles: Record<string, string> = {
  Ontbreekt: "border-red-200 bg-red-50 text-red-700",
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Ingediend: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
  "Aanvulling nodig": "border-orange-200 bg-orange-50 text-orange-700",
};

const invoiceStyles: Record<string, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  Verzonden: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Openstaand: "border-orange-200 bg-orange-50 text-orange-700",
  "Te laat": "border-red-200 bg-red-50 text-red-700",
  Betaald: "border-green-200 bg-green-50 text-green-700",
};

const planningStyles: Record<string, string> = {
  Open: "border-slate-200 bg-slate-100 text-slate-600",
  "Gedeeltelijk gepland": "border-orange-200 bg-orange-50 text-orange-700",
  "Volledig gepland": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Bevestigd: "border-green-200 bg-green-50 text-green-700",
};

const hoursStyles: Record<string, string> = {
  "Nog niet beschikbaar": "border-slate-200 bg-slate-100 text-slate-600",
  "Te controleren": "border-orange-200 bg-orange-50 text-orange-700",
  "Nog te controleren": "border-orange-200 bg-orange-50 text-orange-700",
  "Goedgekeurd door planning": "border-green-200 bg-green-50 text-green-700",
  Gefactureerd: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
};

const documentStyles: Record<string, string> = {
  Beschikbaar: "border-green-200 bg-green-50 text-green-700",
  "Nog te uploaden": "border-red-200 bg-red-50 text-red-700",
  "In controle": "border-orange-200 bg-orange-50 text-orange-700",
  Goedgekeurd: "border-green-200 bg-green-50 text-green-700",
};

export type ClientStatusBadgeVariant =
  | "request"
  | "project"
  | "briefing"
  | "invoice"
  | "planning"
  | "hours"
  | "document";

const variantMaps: Record<ClientStatusBadgeVariant, Record<string, string>> = {
  request: requestStyles,
  project: projectStyles,
  briefing: briefingStyles,
  invoice: invoiceStyles,
  planning: planningStyles,
  hours: hoursStyles,
  document: documentStyles,
};

const allStyles = {
  ...requestStyles,
  ...projectStyles,
  ...briefingStyles,
  ...invoiceStyles,
  ...planningStyles,
  ...hoursStyles,
  ...documentStyles,
};

export default function ClientStatusBadge({
  status,
  variant,
  className,
}: {
  status: string;
  variant?: ClientStatusBadgeVariant;
  className?: string;
}) {
  const style = variant
    ? (variantMaps[variant][status] ?? "border-slate-200 bg-slate-100 text-slate-600")
    : (allStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600");

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
