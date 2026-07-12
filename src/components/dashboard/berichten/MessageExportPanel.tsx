"use client";

import { Calendar, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  downloadMessagesCsv,
  exportMessagesCsv,
  type MessageItem,
} from "@/lib/messages";

export default function MessageExportPanel({
  messages,
  onWeekOverview,
  onExport,
}: {
  messages: MessageItem[];
  onWeekOverview: () => void;
  onExport?: () => void;
}) {
  function handleCsvExport() {
    const csv = exportMessagesCsv(messages);
    downloadMessagesCsv(csv);
    onExport?.();
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Export & communicatieoverzicht
        </CardTitle>
        <CardDescription>
          Exporteer berichten en opvolging voor intern overleg.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button type="button" size="sm" variant="outline" onClick={handleCsvExport}>
          <Download className="h-4 w-4" />
          CSV exporteren
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onWeekOverview}>
          <Calendar className="h-4 w-4" />
          Weekoverzicht maken
        </Button>
        <Button type="button" size="sm" variant="outline" disabled title="Binnenkort">
          <Share2 className="h-4 w-4" />
          Communicatielog delen — Binnenkort
        </Button>
      </CardContent>
    </Card>
  );
}
