"use client";

import Link from "next/link";
import { CalendarDays, FileText, MapPin, MessageSquare, Receipt } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientProject } from "@/lib/clientPortal";
import { DEMO_CLIENT_DOCUMENTS, formatClientDate } from "@/lib/clientPortal";
import { cn } from "@/lib/utils";

export default function ClientProjectDrawer({
  project,
  open,
  onOpenChange,
}: {
  project: ClientProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  const docs = DEMO_CLIENT_DOCUMENTS.filter((d) => d.projectName === project.projectName);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-black text-[#0B1F4D]">
            {project.projectName}
          </SheetTitle>
          <SheetDescription className="text-left">
            <ClientStatusBadge status={project.status} variant="project" />
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold text-[#0B1F4D]">{project.locationName}</p>
                {project.locationAddress ? <p>{project.locationAddress}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarDays className="h-4 w-4 shrink-0" />
              {formatClientDate(project.startDate)}
              {project.endDate ? ` — ${formatClientDate(project.endDate)}` : ""}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-[#0B1F4D]">Crew & functies</h3>
            <p className="mt-1 text-sm text-slate-600">
              {project.crewCount} personen · {project.roles.join(", ")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Crewnamen en privégegevens worden niet getoond in het opdrachtgeversportaal.
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Briefing</p>
              <ClientStatusBadge status={project.briefingStatus} variant="briefing" className="mt-1" />
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Urenstatus</p>
              <ClientStatusBadge status={project.hoursStatus} variant="hours" className="mt-1" />
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Factuur</p>
              <ClientStatusBadge status={project.invoiceStatus} variant="invoice" className="mt-1" />
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Contact</p>
              <p className="mt-1 text-sm font-semibold text-[#0B1F4D]">
                {project.contactPerson ?? "Demo Contactpersoon"}
              </p>
            </div>
          </section>

          {docs.length > 0 ? (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#0B1F4D]">
                <FileText className="h-4 w-4" />
                Documenten
              </h3>
              <ul className="mt-2 space-y-2">
                {docs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <span>{doc.title}</span>
                    <ClientStatusBadge status={doc.status} variant="document" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/portaal/opdrachtgevers/briefings"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Briefing bekijken
            </Link>
            <Link
              href="/portaal/opdrachtgevers/planning"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Planning bekijken
            </Link>
            <Link
              href="/portaal/opdrachtgevers/uren"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              Urenstatus
            </Link>
            <Link
              href="/portaal/opdrachtgevers/contact"
              className={cn(buttonVariants(), "w-full bg-[#173A8A] text-white hover:bg-[#0B1F4D] sm:w-auto")}
            >
              Contact opnemen
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
