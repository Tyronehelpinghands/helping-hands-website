"use client";

import { Check, Clock, Eye, MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import RiskCategoryBadge from "@/components/dashboard/risico-acties/RiskCategoryBadge";
import RiskPriorityBadge from "@/components/dashboard/risico-acties/RiskPriorityBadge";
import RiskStatusBadge from "@/components/dashboard/risico-acties/RiskStatusBadge";
import type { RiskAction } from "@/lib/riskActions";

export type RiskTableAction =
  | "view"
  | "edit"
  | "in_progress"
  | "completed"
  | "waiting"
  | "delete";

export default function RiskActionTable({
  actions,
  onAction,
}: {
  actions: RiskAction[];
  onAction: (action: RiskTableAction, item: RiskAction) => void;
}) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {actions.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#101828]/55">Geen acties gevonden.</p>
        ) : (
          actions.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[#0B1F4D]">{item.title}</p>
                <RiskStatusBadge status={item.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <RiskCategoryBadge category={item.category} />
                <RiskPriorityBadge priority={item.priority} />
              </div>
              <p className="mt-2 text-xs text-[#101828]/60">{item.owner} · {item.dueDate ?? "Geen deadline"}</p>
              <div className="mt-3 flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onAction("view", item)}>Bekijken</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onAction("edit", item)}>Bewerken</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-6 lg:block">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Titel</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Prioriteit</TableHead>
              <TableHead>Risico</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Eigenaar</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Klant/project</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actie vereist</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-12 text-center text-sm text-[#101828]/55">
                  Geen acties gevonden. Pas filters aan of maak een nieuwe actie.
                </TableCell>
              </TableRow>
            ) : (
              actions.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 font-semibold text-[#0B1F4D]">{item.title}</TableCell>
                  <TableCell><RiskCategoryBadge category={item.category} /></TableCell>
                  <TableCell><RiskPriorityBadge priority={item.priority} /></TableCell>
                  <TableCell className="text-sm">{item.riskLevel}</TableCell>
                  <TableCell><RiskStatusBadge status={item.status} /></TableCell>
                  <TableCell className="text-sm">{item.owner}</TableCell>
                  <TableCell className="text-sm">{item.relatedModule ?? "—"}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm">
                    {[item.relatedClient, item.relatedProject].filter(Boolean).join(" · ") || "—"}
                  </TableCell>
                  <TableCell className="text-sm">{item.dueDate ?? "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{item.actionRequired}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon-sm" aria-label="Acties" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction("view", item)}><Eye className="h-4 w-4" />Bekijken</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("edit", item)}><Pencil className="h-4 w-4" />Bewerken</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAction("in_progress", item)}><Clock className="h-4 w-4" />Markeer in behandeling</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("waiting", item)}><MessageSquare className="h-4 w-4" />Wacht op reactie</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("completed", item)}><Check className="h-4 w-4" />Markeer afgerond</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAction("delete", item)}><Trash2 className="h-4 w-4 text-red-600" />Verwijderen</DropdownMenuItem>
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
