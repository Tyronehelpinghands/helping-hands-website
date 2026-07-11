"use client";

import { Download, ExternalLink, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import InvoiceStatusBadge from "@/components/dashboard/facturatie/InvoiceStatusBadge";
import {
  downloadInvoiceCsv,
  formatCurrency,
  type InvoiceDraft,
} from "@/lib/invoicing";

type InvoiceDraftDrawerProps = {
  draft: InvoiceDraft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (draft: InvoiceDraft) => void;
  onSend: (draft: InvoiceDraft) => void;
};

export default function InvoiceDraftDrawer({
  draft,
  open,
  onOpenChange,
  onEdit,
  onSend,
}: InvoiceDraftDrawerProps) {
  if (!draft) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{draft.reference}</SheetTitle>
          <SheetDescription>
            {draft.clientName} · {draft.invoiceDate} → {draft.dueDate}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <InvoiceStatusBadge status={draft.status} />

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Factuurgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Klant</dt>
              <dd className="font-medium">{draft.clientName}</dd>
              <dt className="text-[#101828]/55">Contact ID</dt>
              <dd>{draft.contactId || "—"}</dd>
              <dt className="text-[#101828]/55">Referentie</dt>
              <dd>{draft.reference}</dd>
              <dt className="text-[#101828]/55">Factuurdatum</dt>
              <dd>{draft.invoiceDate}</dd>
              <dt className="text-[#101828]/55">Vervaldatum</dt>
              <dd>{draft.dueDate}</dd>
              <dt className="text-[#101828]/55">Moneybird ID</dt>
              <dd>{draft.moneybirdInvoiceId ?? "—"}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Factuurregels ({draft.lines.length})
            </h3>
            <div className="space-y-2">
              {draft.lines.map((line) => (
                <div
                  key={line.id}
                  className="rounded-lg border border-slate-200/80 bg-[#F5F7FA]/60 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-[#0B1F4D]">{line.description}</p>
                  <p className="mt-1 text-xs text-[#101828]/65">
                    {line.quantity} {line.unit} × {formatCurrency(line.price)} ={" "}
                    {formatCurrency(line.totalExVat)} excl. · btw {line.vatRate}%
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Totalen
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Subtotaal excl.</dt>
              <dd className="font-medium">
                {formatCurrency(draft.subtotalExVat)}
              </dd>
              <dt className="text-[#101828]/55">Btw 21%</dt>
              <dd className="font-medium">{formatCurrency(draft.vatAmount)}</dd>
              <dt className="text-[#101828]/55">Totaal incl.</dt>
              <dd className="font-bold text-[#0B1F4D]">
                {formatCurrency(draft.totalInclVat)}
              </dd>
            </dl>
          </section>

          {draft.notes && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Notities
              </h3>
              <p className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2 text-sm text-[#101828]/80">
                {draft.notes}
              </p>
            </section>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 border-t border-slate-200/80 px-4 py-4 sm:flex-col">
          <div className="flex w-full flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => onEdit(draft)}>
              <Pencil className="h-4 w-4" />
              Bewerken
            </Button>
            <Button type="button" size="sm" onClick={() => onSend(draft)}>
              <Send className="h-4 w-4" />
              Naar Moneybird sturen
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => downloadInvoiceCsv(draft)}
            >
              <Download className="h-4 w-4" />
              CSV downloaden
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              render={
                <a
                  href="https://moneybird.com"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="h-4 w-4" />
              Open Moneybird
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
