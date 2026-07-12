"use client";

import {
  Check,
  Clock,
  Copy,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MessageAudienceBadge from "@/components/dashboard/berichten/MessageAudienceBadge";
import MessageChannelBadge from "@/components/dashboard/berichten/MessageChannelBadge";
import MessageStatusBadge from "@/components/dashboard/berichten/MessageStatusBadge";
import type { MessageItem, MessagePriority } from "@/lib/messages";

export type MessageTableAction =
  | "view"
  | "edit"
  | "duplicate"
  | "answered"
  | "waiting"
  | "delete";

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

function priorityClass(p: MessagePriority): string {
  switch (p) {
    case "Spoed":
      return "text-red-700 font-bold";
    case "Hoog":
      return "text-orange-700 font-semibold";
    case "Laag":
      return "text-slate-500";
    default:
      return "text-[#0B1F4D]";
  }
}

export default function MessageInboxTable({
  messages,
  onAction,
}: {
  messages: MessageItem[];
  onAction: (action: MessageTableAction, item: MessageItem) => void;
}) {
  const scheduledOrSent = (m: MessageItem) =>
    m.sentAt ? formatDt(m.sentAt) : m.scheduledAt ? formatDt(m.scheduledAt) : "—";

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#101828]/55">
            Geen berichten gevonden.
          </p>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[#0B1F4D]">{item.subject}</p>
                <MessageStatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm text-[#101828]/70">{item.recipientName}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <MessageAudienceBadge audience={item.audience} />
                <MessageChannelBadge channel={item.channel} />
              </div>
              <p className="mt-2 text-xs text-[#101828]/60">
                {item.relatedProject ?? item.relatedClient ?? "—"} ·{" "}
                <span className={priorityClass(item.priority)}>{item.priority}</span>
              </p>
              <p className="text-xs text-[#101828]/50">
                {item.owner} · {formatDt(item.createdAt)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onAction("view", item)}
                >
                  Bekijken
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onAction("edit", item)}
                >
                  Bewerken
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-6 lg:block">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Onderwerp</TableHead>
              <TableHead>Ontvanger</TableHead>
              <TableHead>Doelgroep</TableHead>
              <TableHead>Kanaal</TableHead>
              <TableHead>Project / klant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioriteit</TableHead>
              <TableHead>Eigenaar</TableHead>
              <TableHead>Aangemaakt</TableHead>
              <TableHead>Gepland/verzonden</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-10 text-center text-sm text-[#101828]/55">
                  Geen berichten gevonden.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[220px] pl-6 font-medium text-[#0B1F4D]">
                    <span className="line-clamp-2">{item.subject}</span>
                  </TableCell>
                  <TableCell>{item.recipientName}</TableCell>
                  <TableCell>
                    <MessageAudienceBadge audience={item.audience} />
                  </TableCell>
                  <TableCell>
                    <MessageChannelBadge channel={item.channel} />
                  </TableCell>
                  <TableCell className="max-w-[160px] text-sm text-[#101828]/70">
                    {item.relatedProject ?? item.relatedClient ?? "—"}
                  </TableCell>
                  <TableCell>
                    <MessageStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className={priorityClass(item.priority)}>
                    {item.priority}
                  </TableCell>
                  <TableCell className="text-sm">{item.owner}</TableCell>
                  <TableCell className="text-sm text-[#101828]/60">
                    {formatDt(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-[#101828]/60">
                    {scheduledOrSent(item)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button type="button" variant="ghost" size="icon-sm" aria-label="Acties" />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction("view", item)}>
                          <Eye className="h-4 w-4" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("edit", item)}>
                          <Pencil className="h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("duplicate", item)}>
                          <Copy className="h-4 w-4" />
                          Dupliceer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAction("answered", item)}>
                          <Check className="h-4 w-4" />
                          Markeer beantwoord
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("waiting", item)}>
                          <Clock className="h-4 w-4" />
                          Markeer wacht op reactie
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onAction("delete", item)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Verwijder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
