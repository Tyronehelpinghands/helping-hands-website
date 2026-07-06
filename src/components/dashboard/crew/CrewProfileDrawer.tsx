"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Pencil,
  Route,
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
import CrewSkillBadge from "@/components/dashboard/crew/CrewSkillBadge";
import CrewStatusBadge from "@/components/dashboard/crew/CrewStatusBadge";
import type { CrewMember } from "@/lib/crew";

type CrewProfileDrawerProps = {
  member: CrewMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (member: CrewMember) => void;
  onCalculateKm?: (member: CrewMember) => void;
};

export default function CrewProfileDrawer({
  member,
  open,
  onOpenChange,
  onEdit,
  onCalculateKm,
}: CrewProfileDrawerProps) {
  const [kmMessage, setKmMessage] = useState<string | null>(null);
  const [kmLoading, setKmLoading] = useState(false);

  if (!member) return null;

  async function handleCalculateKm() {
    if (!member) return;
    setKmLoading(true);
    setKmMessage(null);
    try {
      const res = await fetch("/api/shiftbase/calculate-kilometers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeCity: member.city,
          projectAddress: "Demo projectlocatie, 1012 AB Amsterdam",
          feePerKm: member.travelRatePerKm,
        }),
      });
      const data = await res.json();
      if (data.ok && data.status === "berekend") {
        setKmMessage(
          `Geschatte retour: ${data.returnKm} km · Vergoeding: €${data.totalFee?.toFixed(2) ?? "—"}`,
        );
        onCalculateKm?.(member);
      } else {
        setKmMessage("Kilometers kunnen nog niet berekend worden — adres ontbreekt.");
      }
    } catch {
      setKmMessage("Kilometerberekening niet beschikbaar.");
    } finally {
      setKmLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{member.displayName}</SheetTitle>
          <SheetDescription>{member.primaryRole} · {member.city}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <CrewStatusBadge status={member.status} />

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Contactgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">E-mail</dt>
              <dd className="truncate">{member.email}</dd>
              <dt className="text-[#101828]/55">Telefoon</dt>
              <dd>{member.phone}</dd>
              <dt className="text-[#101828]/55">Woonplaats</dt>
              <dd>{member.city}</dd>
              <dt className="text-[#101828]/55">Dienstverband</dt>
              <dd>{member.employmentType}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Functies & skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {member.roles.map((r) => (
                <CrewSkillBadge key={r} label={r} variant="role" />
              ))}
            </div>
            {member.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {member.skills.map((s) => (
                  <CrewSkillBadge key={s} label={s} variant="skill" />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Certificaten
            </h3>
            <div className="flex flex-wrap gap-1">
              {member.certificates.map((c) => (
                <CrewSkillBadge key={c} label={c} variant="cert" />
              ))}
            </div>
          </section>

          {member.availability.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Beschikbaarheid
              </h3>
              <p className="text-sm text-[#101828]/75">{member.availability.join(", ")}</p>
            </section>
          )}

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Voertuig
            </h3>
            <p className="text-sm">
              Rijbewijs: {member.hasDriversLicense ? "Ja" : "Nee"} · Auto:{" "}
              {member.hasCar ? "Ja" : "Nee"}
            </p>
          </section>

          <section className="space-y-2 rounded-lg border border-slate-100 bg-[#F5F7FA]/60 p-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Reiskosten
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Woonplaats</dt>
              <dd>{member.city}</dd>
              {member.address && (
                <>
                  <dt className="text-[#101828]/55">Adres</dt>
                  <dd className="text-xs">{member.address}</dd>
                </>
              )}
              <dt className="text-[#101828]/55">Vergoeding</dt>
              <dd>€{member.travelRatePerKm.toFixed(2)}/km</dd>
            </dl>
            <p className="mt-2 text-xs text-[#101828]/55">
              Kilometers kunnen later automatisch worden berekend via de Google Maps
              koppeling.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => void handleCalculateKm()}
              disabled={kmLoading}
            >
              <Route className="h-4 w-4" />
              {kmLoading ? "Berekenen…" : "Kilometers berekenen"}
            </Button>
            {kmMessage && (
              <p className="mt-2 text-xs font-medium text-[#173A8A]">{kmMessage}</p>
            )}
          </section>

          {member.shiftbaseEmployeeId && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Shiftbase
              </h3>
              <p className="text-sm font-mono text-[#101828]/70">
                {member.shiftbaseEmployeeId}
              </p>
            </section>
          )}

          {member.notes && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Notities
              </h3>
              <p className="rounded-lg border border-slate-100 bg-white p-3 text-sm text-[#101828]/75">
                {member.notes}
              </p>
            </section>
          )}

          {member.lastWorkedAt && (
            <p className="text-xs text-[#101828]/50">
              Laatst gewerkt: {member.lastWorkedAt}
            </p>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={() => onEdit(member)}
            className="w-full bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            <Pencil className="h-4 w-4" />
            Bewerken
          </Button>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="button" variant="outline" render={<Link href="/dashboard/intern/planning" />}>
              <CalendarDays className="h-4 w-4" />
              Planning
            </Button>
            <Button
              type="button"
              variant="outline"
              render={<Link href="/dashboard/intern/urenregistratie" />}
            >
              <Clock className="h-4 w-4" />
              Uren
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            render={
              <a href="https://app.shiftbase.com" target="_blank" rel="noopener noreferrer" />
            }
          >
            <ExternalLink className="h-4 w-4" />
            Open Shiftbase
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
