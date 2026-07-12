"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeMessage } from "@/lib/employeePortal";
import { DEMO_EMPLOYEE_MESSAGES } from "@/lib/employeePortal";
import { formatDateTime } from "@/lib/dashboardHelpers";

type EmployeeMessagesProps = {
  messages?: EmployeeMessage[];
  compact?: boolean;
};

export default function EmployeeMessages({
  messages = DEMO_EMPLOYEE_MESSAGES,
  compact = false,
}: EmployeeMessagesProps) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [selected, setSelected] = useState<EmployeeMessage | null>(null);
  const [open, setOpen] = useState(false);

  const display = compact ? localMessages.slice(0, 4) : localMessages;

  function openMessage(msg: EmployeeMessage) {
    setSelected(msg);
    setOpen(true);
    if (msg.status === "Nieuw") {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "Gelezen" as const } : m)),
      );
      setSelected({ ...msg, status: "Gelezen" });
    }
  }

  function markRead() {
    if (!selected) return;
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === selected.id ? { ...m, status: "Gelezen" as const } : m)),
    );
    setSelected({ ...selected, status: "Gelezen" });
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              {compact ? "Laatste berichten" : "Berichten"}
            </CardTitle>
            <CardDescription>
              {compact
                ? "Updates van planning en administratie"
                : "Briefings, uren reminders en document updates"}
            </CardDescription>
          </div>
          {compact ? (
            <Link
              href="/portaal/medewerkers/berichten"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Alles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-2">
          {!compact ? (
            <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Berichten worden later gekoppeld aan WhatsApp Business, Gmail of interne
              notificaties.
            </p>
          ) : null}
          {display.map((msg) => (
            <button
              key={msg.id}
              type="button"
              onClick={() => openMessage(msg)}
              className="flex w-full items-start justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-[#173A8A]/30 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[#0B1F4D]">{msg.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{msg.body}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {msg.type} · {formatDateTime(msg.createdAt)}
                </p>
              </div>
              <EmployeeStatusBadge status={msg.status} variant="message" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selected.title}</SheetTitle>
                <SheetDescription className="text-left">
                  {selected.type} · {formatDateTime(selected.createdAt)}
                </SheetDescription>
                <EmployeeStatusBadge status={selected.status} variant="message" />
              </SheetHeader>
              <div className="flex-1 py-4">
                <p className="text-sm leading-relaxed text-slate-700">{selected.body}</p>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button type="button" variant="outline" className="w-full" onClick={markRead}>
                  <Mail className="mr-2 h-4 w-4" />
                  Markeer als gelezen
                </Button>
                {selected.relatedShiftId ? (
                  <Link
                    href="/portaal/medewerkers/planning"
                    className={buttonVariants({ variant: "secondary", className: "w-full" })}
                  >
                    Naar planning
                  </Link>
                ) : null}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
