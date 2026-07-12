import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MessageStats } from "@/lib/messages";

export default function MessageStatsCards({ stats }: { stats: MessageStats }) {
  const cards = [
    { id: "concept", title: "Concepten", value: stats.concepts, icon: FileText, accent: "text-slate-600", bar: "bg-slate-400" },
    { id: "ready", title: "Klaar om te versturen", value: stats.readyToSend, icon: Send, accent: "text-[#0284c7]", bar: "bg-[#38bdf8]" },
    { id: "wait", title: "Wacht op reactie", value: stats.waitingForReply, icon: Clock, accent: "text-orange-700", bar: "bg-orange-500" },
    { id: "sent", title: "Verzonden deze week", value: stats.sentThisWeek, icon: CheckCircle, accent: "text-green-700", bar: "bg-green-500" },
    { id: "urgent", title: "Spoedberichten", value: stats.urgent, icon: Zap, accent: "text-red-700", bar: "bg-red-500" },
    { id: "follow", title: "Openstaande opvolging", value: stats.openFollowUp, icon: AlertCircle, accent: "text-[#173A8A]", bar: "bg-[#F28C28]" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.id} className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className={`text-2xl font-black ${card.accent}`}>{card.value}</p>
              </div>
              <CardTitle className="mt-2 text-sm font-bold text-[#0B1F4D]">{card.title}</CardTitle>
              <CardDescription className="text-xs">Demo-data</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`h-1 w-10 rounded-full ${card.bar}`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
