"use client";

import {
  Check,
  Download,
  Eye,
  FileCheck,
  MoreHorizontal,
  Pencil,
  Send,
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
import InvoiceStatusBadge from "@/components/dashboard/facturatie/InvoiceStatusBadge";
import { downloadInvoiceCsv, formatCurrency, type InvoiceDraft } from "@/lib/invoicing";

export type InvoiceTableAction =
  | "view"
  | "edit"
  | "send"
  | "csv"
  | "mark_sent"
  | "mark_paid";

type InvoiceDraftTableProps = {
  drafts: InvoiceDraft[];
  onAction: (action: InvoiceTableAction, draft: InvoiceDraft) => void;
};

function InvoiceMobileCard({
  draft,
  onAction,
}: {
  draft: InvoiceDraft;
  onAction: (action: InvoiceTableAction, draft: InvoiceDraft) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#0B1F4D]">{draft.reference}</p>
          <p className="text-xs text-[#101828]/60">
            {draft.clientName} · {draft.invoiceDate}
          </p>
        </div>
        <InvoiceStatusBadge status={draft.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-[#101828]/55">Totaal incl.</dt>
        <dd className="font-medium">{formatCurrency(draft.totalInclVat)}</dd>
        <dt className="text-[#101828]/55">Regels</dt>
        <dd>{draft.lines.length}</dd>
        <dt className="text-[#101828]/55">Moneybird ID</dt>
        <dd>{draft.moneybirdInvoiceId ?? "—"}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => onAction("view", draft)}>
          Bekijken
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onAction("send", draft)}>
          Naar Moneybird
        </Button>
      </div>
    </div>
  );
}

export default function InvoiceDraftTable({
  drafts,
  onAction,
}: InvoiceDraftTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {drafts.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#101828]/55">
            Geen factuurconcepten gevonden.
          </p>
        ) : (
          drafts.map((draft) => (
            <InvoiceMobileCard key={draft.id} draft={draft} onAction={onAction} />
          ))
        )}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-6 lg:block">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Referentie</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Factuurdatum</TableHead>
              <TableHead>Vervaldatum</TableHead>
              <TableHead>Regels</TableHead>
              <TableHead>Subtotaal excl.</TableHead>
              <TableHead>Btw</TableHead>
              <TableHead>Totaal incl.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Moneybird ID</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-12 text-center text-sm text-[#101828]/55"
                >
                  Geen factuurconcepten gevonden. Maak een concept aan.
                </TableCell>
              </TableRow>
            ) : (
              drafts.map((draft) => (
                <TableRow key={draft.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                    {draft.reference}
                  </TableCell>
                  <TableCell>{draft.clientName}</TableCell>
                  <TableCell className="text-sm">{draft.invoiceDate}</TableCell>
                  <TableCell className="text-sm">{draft.dueDate}</TableCell>
                  <TableCell className="text-sm">{draft.lines.length}</TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(draft.subtotalExVat)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(draft.vatAmount)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCurrency(draft.totalInclVat)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={draft.status} />
                  </TableCell>
                  <TableCell className="text-sm text-[#101828]/70">
                    {draft.moneybirdInvoiceId ?? "—"}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Acties"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction("view", draft)}>
                          <Eye className="h-4 w-4" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("edit", draft)}>
                          <Pencil className="h-4 w-4" />
                          Bewerken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("send", draft)}>
                          <Send className="h-4 w-4" />
                          Naar Moneybird sturen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            downloadInvoiceCsv(draft);
                            onAction("csv", draft);
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download concept CSV
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAction("mark_sent", draft)}>
                          <FileCheck className="h-4 w-4" />
                          Markeer als verzonden
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("mark_paid", draft)}>
                          <Check className="h-4 w-4" />
                          Markeer als betaald
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
