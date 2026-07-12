import { cn } from "@/lib/utils";
import type { MessageStatus } from "@/lib/messages";

const styles: Record<MessageStatus, string> = {
  Concept: "border-slate-200 bg-slate-100 text-slate-600",
  "Klaar om te versturen": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Verzonden: "border-green-200 bg-green-50 text-green-700",
  "Wacht op reactie": "border-orange-200 bg-orange-50 text-orange-700",
  Beantwoord: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Mislukt: "border-red-200 bg-red-50 text-red-700",
  Gepland: "border-violet-200 bg-violet-50 text-violet-700",
};

export default function MessageStatusBadge({
  status,
  className,
}: {
  status: MessageStatus;
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
