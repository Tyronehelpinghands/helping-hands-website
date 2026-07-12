import { cn } from "@/lib/utils";
import type { MessageChannel } from "@/lib/messages";

const styles: Record<MessageChannel, string> = {
  "E-mail": "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  WhatsApp: "border-green-200 bg-green-50 text-green-700",
  SMS: "border-violet-200 bg-violet-50 text-violet-700",
  Intern: "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  HubSpot: "border-orange-200 bg-orange-50 text-orange-700",
  Mailchimp: "border-amber-200 bg-amber-50 text-amber-800",
};

export default function MessageChannelBadge({
  channel,
  className,
}: {
  channel: MessageChannel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[channel],
        className,
      )}
    >
      {channel}
    </span>
  );
}
