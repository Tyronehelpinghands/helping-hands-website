"use client";

import {
  ArrowRightLeft,
  CalendarPlus,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
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
import type { Lead } from "@/data/leadsMockData";
import {
  formatLeadCurrency,
  leadPriorityLabels,
  leadPriorityStyles,
  leadSourceLabels,
  leadSourceStyles,
  leadStatusLabels,
  leadStatusStyles,
} from "@/lib/leads-utils";
import { cn } from "@/lib/utils";
import ResponsiveTable from "@/components/dashboard/shared/ResponsiveTable";

export type LeadTableAction =
  | "view"
  | "edit"
  | "followup"
  | "sync"
  | "deal"
  | "lost"
  | "delete";

type LeadsTableProps = {
  leads: Lead[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onAction: (action: LeadTableAction, lead: Lead) => void;
};

export default function LeadsTable({
  leads,
  selectedIds,
  onSelectionChange,
  onAction,
}: LeadsTableProps) {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.has(l.id));

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(leads.map((l) => l.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  }

  return (
    <ResponsiveTable tableMinWidthClass="min-w-[1100px]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 pl-6">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Selecteer alle leads"
                className="h-4 w-4 rounded border-slate-300 text-[#173A8A] focus:ring-[#173A8A]"
              />
            </TableHead>
            <TableHead>Bedrijf</TableHead>
            <TableHead>Contactpersoon</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefoon</TableHead>
            <TableHead>Bron</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioriteit</TableHead>
            <TableHead>Waarde</TableHead>
            <TableHead>Eigenaar</TableHead>
            <TableHead>Laatste contact</TableHead>
            <TableHead>Volgende actie</TableHead>
            <TableHead className="pr-6 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={13}
                className="py-12 text-center text-sm text-[#101828]/55"
              >
                Geen leads gevonden. Pas filters aan of voeg een nieuwe lead toe.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-[#F5F7FA]/40">
                <TableCell className="pl-6">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(lead.id)}
                    onChange={() => toggleOne(lead.id)}
                    aria-label={`Selecteer ${lead.bedrijf}`}
                    className="h-4 w-4 rounded border-slate-300 text-[#173A8A] focus:ring-[#173A8A]"
                  />
                </TableCell>
                <TableCell className="font-semibold text-[#0B1F4D]">
                  {lead.bedrijf}
                </TableCell>
                <TableCell className="text-[#101828]">{lead.contact}</TableCell>
                <TableCell className="text-xs text-[#101828]/70">{lead.email}</TableCell>
                <TableCell className="text-xs text-[#101828]/70">
                  {lead.telefoon}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold", leadSourceStyles[lead.bron])}
                  >
                    {leadSourceLabels[lead.bron]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold", leadStatusStyles[lead.status])}
                  >
                    {leadStatusLabels[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold",
                      leadPriorityStyles[lead.prioriteit],
                    )}
                  >
                    {leadPriorityLabels[lead.prioriteit]}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-[#173A8A]">
                  {formatLeadCurrency(lead.waarde)}
                </TableCell>
                <TableCell className="text-[#101828]/75">{lead.eigenaar}</TableCell>
                <TableCell className="text-xs text-[#101828]/65">
                  {lead.laatsteContact}
                </TableCell>
                <TableCell className="max-w-[140px] truncate text-xs text-[#101828]/65">
                  {lead.volgendeActie}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-[#173A8A]"
                          aria-label={`Acties voor ${lead.bedrijf}`}
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => onAction("view", lead)}>
                        <Eye className="h-4 w-4" />
                        Bekijken
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("edit", lead)}>
                        <Pencil className="h-4 w-4" />
                        Bewerken
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAction("followup", lead)}>
                        <CalendarPlus className="h-4 w-4" />
                        Follow-up toevoegen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("sync", lead)}>
                        <RefreshCw className="h-4 w-4" />
                        Naar HubSpot syncen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("deal", lead)}>
                        <ArrowRightLeft className="h-4 w-4" />
                        Omzetten naar deal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAction("lost", lead)}>
                        <XCircle className="h-4 w-4" />
                        Markeren als verloren
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAction("delete", lead)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ResponsiveTable>
  );
}
