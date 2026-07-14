"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CalendarPlus,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SalesLead } from "@/data/salesMockData";
import {
  formatSalesCurrency,
  getLeadFilterOptions,
  leadStatusLabels,
  leadStatusStyles,
} from "@/lib/sales-utils";
import { cn } from "@/lib/utils";
import ResponsiveTable from "@/components/dashboard/shared/ResponsiveTable";

export type LeadAction =
  | "view"
  | "edit"
  | "sync"
  | "deal"
  | "followup";

type SalesLeadsTableProps = {
  leads: SalesLead[];
  onAction?: (action: LeadAction, lead: SalesLead) => void;
};

export default function SalesLeadsTable({ leads, onAction }: SalesLeadsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filterOptions = useMemo(() => getLeadFilterOptions(leads), [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (ownerFilter !== "all" && lead.eigenaar !== ownerFilter) return false;
      if (sourceFilter !== "all" && lead.bron !== sourceFilter) return false;

      if (!query) return true;

      return (
        lead.bedrijf.toLowerCase().includes(query) ||
        lead.contact.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    });
  }, [leads, search, statusFilter, ownerFilter, sourceFilter]);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">Leads</CardTitle>
        <CardDescription>
          Actieve en recente sales leads met eigenaar en status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Zoek op bedrijf, contact…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border-slate-200/80 bg-[#F5F7FA]/60 sm:col-span-2 lg:col-span-1"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              {filterOptions.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {leadStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={ownerFilter}
            onValueChange={(value) => setOwnerFilter(value ?? "all")}
          >
            <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
              <SelectValue placeholder="Eigenaar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle eigenaren</SelectItem>
              {filterOptions.owners.map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sourceFilter}
            onValueChange={(value) => setSourceFilter(value ?? "all")}
          >
            <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
              <SelectValue placeholder="Bron" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle bronnen</SelectItem>
              {filterOptions.sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResponsiveTable tableMinWidthClass="min-w-[880px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Bedrijf</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bron</TableHead>
                <TableHead>Waarde</TableHead>
                <TableHead>Eigenaar</TableHead>
                <TableHead>Laatste contact</TableHead>
                <TableHead className="pr-6 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-[#101828]/55"
                  >
                    Geen leads gevonden voor deze filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                      {lead.bedrijf}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#101828]">{lead.contact}</p>
                        <p className="text-xs text-[#101828]/55">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-semibold", leadStatusStyles[lead.status])}
                      >
                        {leadStatusLabels[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#101828]/75">{lead.bron}</TableCell>
                    <TableCell className="font-semibold text-[#173A8A]">
                      {formatSalesCurrency(lead.waarde)}
                    </TableCell>
                    <TableCell className="text-[#101828]/75">
                      {lead.eigenaar}
                    </TableCell>
                    <TableCell className="text-[#101828]/75">
                      {lead.laatsteContact}
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
                          <DropdownMenuItem onClick={() => onAction?.("view", lead)}>
                            <Eye className="h-4 w-4" />
                            Bekijken
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction?.("edit", lead)}>
                            <Pencil className="h-4 w-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onAction?.("sync", lead)}>
                            <RefreshCw className="h-4 w-4" />
                            Naar HubSpot syncen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction?.("deal", lead)}>
                            <ArrowRightLeft className="h-4 w-4" />
                            Omzetten naar deal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAction?.("followup", lead)}>
                            <CalendarPlus className="h-4 w-4" />
                            Follow-up toevoegen
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
      </CardContent>
    </Card>
  );
}
