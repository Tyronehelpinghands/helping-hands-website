"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Pencil,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MessageAudienceBadge from "@/components/dashboard/berichten/MessageAudienceBadge";
import MessageChannelBadge from "@/components/dashboard/berichten/MessageChannelBadge";
import MessageStatusBadge from "@/components/dashboard/berichten/MessageStatusBadge";
import {
  getModuleLink,
  type MessageItem,
  type MessageStatus,
} from "@/lib/messages";

type MessageDetailDrawerProps = {
  message: MessageItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (message: MessageItem) => void;
  onDuplicate: (message: MessageItem) => void;
  onStatusChange: (message: MessageItem, status: MessageStatus) => void;
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt className="text-[#101828]/55">{label}</dt>
      <dd className="font-medium text-[#0B1F4D]">{value}</dd>
    </>
  );
}

function formatDt(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageDetailDrawer({
  message,
  open,
  onOpenChange,
  onEdit,
  onDuplicate,
  onStatusChange,
}: MessageDetailDrawerProps) {
  if (!message) return null;

  const moduleLink = getModuleLink(message.relatedModule);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{message.subject}</SheetTitle>
          <SheetDescription>
            {message.recipientName} · {message.channel}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <MessageStatusBadge status={message.status} />
            <MessageChannelBadge channel={message.channel} />
            <MessageAudienceBadge audience={message.audience} />
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Ontvanger & context
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label="Ontvanger" value={message.recipientName} />
              {message.recipientEmail && (
                <DetailRow label="E-mail" value={message.recipientEmail} />
              )}
              {message.recipientPhone && (
                <DetailRow label="Telefoon" value={message.recipientPhone} />
              )}
              <DetailRow label="Prioriteit" value={message.priority} />
              <DetailRow label="Project" value={message.relatedProject ?? "—"} />
              <DetailRow label="Klant" value={message.relatedClient ?? "—"} />
              <DetailRow label="Module" value={message.relatedModule ?? "—"} />
              <DetailRow label="Eigenaar" value={message.owner} />
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Bericht
            </h3>
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#F5F7FA]/60 p-4 text-sm text-[#0B1F4D]">
              {message.body}
            </pre>
          </section>

          {message.tags.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {message.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {message.notes && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Interne notities
              </h3>
              <p className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3 text-sm text-[#0B1F4D]">
                {message.notes}
              </p>
            </section>
          )}

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Tijdlijn
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label="Aangemaakt" value={formatDt(message.createdAt)} />
              <DetailRow label="Gepland" value={formatDt(message.scheduledAt)} />
              <DetailRow label="Verzonden" value={formatDt(message.sentAt)} />
              <DetailRow label="Laatste reactie" value={formatDt(message.lastReplyAt)} />
            </dl>
          </section>
        </div>

        <SheetFooter className="flex-col gap-2 border-t border-slate-200/80 pt-4 sm:flex-col">
          <div className="flex w-full flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => onEdit(message)}>
              <Pencil className="h-4 w-4" />
              Bewerken
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onDuplicate(message)}>
              <Copy className="h-4 w-4" />
              Dupliceer
            </Button>
            {moduleLink && (
              <Button type="button" size="sm" variant="outline" render={<Link href={moduleLink} />}>
                <ExternalLink className="h-4 w-4" />
                Naar module
              </Button>
            )}
          </div>
          <div className="flex w-full flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(message, "Klaar om te versturen")}
            >
              <Send className="h-4 w-4" />
              Klaar om te versturen
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(message, "Verzonden")}
            >
              Verzonden
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(message, "Wacht op reactie")}
            >
              <Clock className="h-4 w-4" />
              Wacht op reactie
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(message, "Beantwoord")}
            >
              <Check className="h-4 w-4" />
              Beantwoord
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
