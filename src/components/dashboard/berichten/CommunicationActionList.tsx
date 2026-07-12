"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CommunicationAction, MessagePriority } from "@/lib/messages";

function priorityClass(p: MessagePriority): string {
  switch (p) {
    case "Spoed":
      return "border-red-200 bg-red-50 text-red-700";
    case "Hoog":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "Laag":
      return "border-slate-200 bg-slate-50 text-slate-600";
    default:
      return "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]";
  }
}

function formatDeadline(value?: string): string {
  if (!value) return "Geen deadline";
  return new Date(value).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
  });
}

export default function CommunicationActionList({
  actions,
}: {
  actions: CommunicationAction[];
}) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Openstaande communicatie
        </CardTitle>
        <CardDescription>
          Acties die opvolging nodig hebben voor crew, opdrachtgevers en interne planning.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#101828]/55">
            Geen openstaande acties.
          </p>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${priorityClass(action.priority)}`}
                  >
                    {action.priority}
                  </span>
                  {action.relatedModule && (
                    <span className="text-xs text-[#101828]/55">
                      {action.relatedModule}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-[#0B1F4D]">{action.title}</p>
                <p className="text-xs text-[#101828]/55">
                  Deadline: {formatDeadline(action.deadline)}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                render={<Link href={action.href} />}
              >
                Openen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
