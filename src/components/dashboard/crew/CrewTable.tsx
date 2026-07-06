"use client";

import Link from "next/link";
import {
  Clock,
  Eye,
  MoreHorizontal,
  Pencil,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import CrewSkillBadge from "@/components/dashboard/crew/CrewSkillBadge";
import CrewStatusBadge from "@/components/dashboard/crew/CrewStatusBadge";
import type { CrewMember } from "@/lib/crew";
import { Car, Check, X } from "lucide-react";

export type CrewTableAction = "view" | "edit" | "planning" | "hours";

type CrewTableProps = {
  members: CrewMember[];
  onAction: (action: CrewTableAction, member: CrewMember) => void;
};

function VehicleIcons({ license, car }: { license: boolean; car: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#101828]/65">
      <span className="flex items-center gap-0.5" title="Rijbewijs">
        {license ? (
          <Check className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <X className="h-3.5 w-3.5 text-slate-400" />
        )}
        Rijbewijs
      </span>
      <span className="flex items-center gap-0.5" title="Auto">
        <Car className={`h-3.5 w-3.5 ${car ? "text-[#173A8A]" : "text-slate-400"}`} />
        Auto
      </span>
    </div>
  );
}

function CrewMobileCard({
  member,
  onAction,
}: {
  member: CrewMember;
  onAction: (action: CrewTableAction, member: CrewMember) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#0B1F4D]">{member.displayName}</p>
          <p className="text-xs text-[#101828]/60">{member.city} · {member.primaryRole}</p>
        </div>
        <CrewStatusBadge status={member.status} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {member.roles.slice(0, 3).map((r) => (
          <CrewSkillBadge key={r} label={r} variant="role" />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => onAction("view", member)}>
          Bekijken
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onAction("edit", member)}>
          Bewerken
        </Button>
      </div>
    </div>
  );
}

export default function CrewTable({ members, onAction }: CrewTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {members.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#101828]/55">
            Geen crewleden gevonden. Pas filters aan.
          </p>
        ) : (
          members.map((m) => <CrewMobileCard key={m.id} member={m} onAction={onAction} />)
        )}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-6 lg:block">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Naam</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Woonplaats</TableHead>
              <TableHead>Hoofdfunctie</TableHead>
              <TableHead>Functies/skills</TableHead>
              <TableHead>Dienstverband</TableHead>
              <TableHead>Certificaten</TableHead>
              <TableHead>Rijbewijs / auto</TableHead>
              <TableHead>Shiftbase</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-sm text-[#101828]/55">
                  Geen crewleden gevonden. Pas filters aan of voeg een crewlid toe.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                    {member.displayName}
                  </TableCell>
                  <TableCell>
                    <CrewStatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-[#101828]/75">{member.city}</TableCell>
                  <TableCell className="text-sm">{member.primaryRole}</TableCell>
                  <TableCell>
                    <div className="flex max-w-[180px] flex-wrap gap-1">
                      {member.roles.slice(0, 2).map((r) => (
                        <CrewSkillBadge key={r} label={r} variant="role" />
                      ))}
                      {member.skills.slice(0, 1).map((s) => (
                        <CrewSkillBadge key={s} label={s} variant="skill" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {member.employmentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-[140px] flex-wrap gap-1">
                      {member.certificates
                        .filter((c) => c !== "Geen certificaten")
                        .slice(0, 2)
                        .map((c) => (
                          <CrewSkillBadge key={c} label={c} variant="cert" />
                        ))}
                      {member.certificates.includes("Geen certificaten") && (
                        <span className="text-xs text-[#101828]/45">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <VehicleIcons license={member.hasDriversLicense} car={member.hasCar} />
                  </TableCell>
                  <TableCell>
                    {member.shiftbaseEmployeeId ? (
                      <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
                        Gekoppeld
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-[#101828]/55">
                        Niet gekoppeld
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-[#173A8A]"
                            aria-label={`Acties voor ${member.displayName}`}
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onAction("view", member)}>
                          <Eye className="h-4 w-4" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("edit", member)}>
                          <Pencil className="h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          render={<Link href="/dashboard/intern/planning" />}
                        >
                          <CalendarDays className="h-4 w-4" />
                          Planning
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          render={<Link href="/dashboard/intern/urenregistratie" />}
                        >
                          <Clock className="h-4 w-4" />
                          Uren
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
