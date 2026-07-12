import { cn } from "@/lib/utils";
import type { MessageAudience } from "@/lib/messages";

const styles: Record<MessageAudience, string> = {
  Crew: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  Opdrachtgever: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Intern: "border-slate-200 bg-slate-100 text-slate-700",
  Sollicitant: "border-pink-200 bg-pink-50 text-pink-700",
  Lead: "border-orange-200 bg-orange-50 text-orange-700",
  Projectgroep: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export default function MessageAudienceBadge({
  audience,
  className,
}: {
  audience: MessageAudience;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[audience],
        className,
      )}
    >
      {audience}
    </span>
  );
}
