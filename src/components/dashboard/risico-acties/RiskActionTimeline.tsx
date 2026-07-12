import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RiskTimelineEvent } from "@/lib/riskActions";

const typeStyles: Record<RiskTimelineEvent["type"], string> = {
  created: "bg-[#38bdf8]/10 text-[#0284c7]",
  status: "bg-[#0B1F4D]/10 text-[#0B1F4D]",
  deadline: "bg-amber-50 text-amber-700",
  completed: "bg-green-50 text-green-700",
  waiting: "bg-orange-50 text-orange-700",
};

export default function RiskActionTimeline({
  events,
}: {
  events: RiskTimelineEvent[];
}) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Tijdlijn
        </CardTitle>
        <CardDescription>
          Recente gebeurtenissen uit risico&apos;s en acties.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-[#101828]/55">Geen recente gebeurtenissen.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex gap-3 rounded-lg border border-slate-200/80 bg-[#F5F7FA]/40 px-3 py-2"
            >
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#0B1F4D]">
                    {event.title}
                  </p>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeStyles[event.type]}`}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="text-xs text-[#101828]/65">{event.description}</p>
                <p className="mt-1 text-[10px] text-[#101828]/45">
                  {new Date(event.timestamp).toLocaleString("nl-NL")}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
