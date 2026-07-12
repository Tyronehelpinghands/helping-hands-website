"use client";

import { Eye, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MessageAudienceBadge from "@/components/dashboard/berichten/MessageAudienceBadge";
import MessageChannelBadge from "@/components/dashboard/berichten/MessageChannelBadge";
import type { MessageTemplate } from "@/lib/messages";

export default function MessageTemplatePanel({
  templates,
  onUse,
  onPreview,
}: {
  templates: MessageTemplate[];
  onUse: (template: MessageTemplate) => void;
  onPreview: (template: MessageTemplate) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          {templates.length} standaard templates voor crew, opdrachtgevers en opvolging.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled
          title="Binnenkort beschikbaar"
        >
          <Plus className="h-4 w-4" />
          Nieuwe template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-1">
                <MessageChannelBadge channel={tpl.channel} />
                <MessageAudienceBadge audience={tpl.audience} />
              </div>
              <CardTitle className="mt-2 text-base font-bold text-[#0B1F4D]">
                {tpl.title}
              </CardTitle>
              <CardDescription>{tpl.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm font-medium text-[#0B1F4D]">{tpl.subject}</p>
              <div className="flex flex-wrap gap-1">
                {tpl.variables.map((v) => (
                  <span
                    key={v}
                    className="rounded-md border border-[#F28C28]/30 bg-[#F28C28]/10 px-2 py-0.5 text-xs font-mono text-[#0B1F4D]"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => onUse(tpl)}>
                  <FileText className="h-4 w-4" />
                  Gebruik template
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(tpl)}
                >
                  <Eye className="h-4 w-4" />
                  Bekijk
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
