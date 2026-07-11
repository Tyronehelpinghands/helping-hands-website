"use client";

import Link from "next/link";
import { Check, ExternalLink, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FinanceStatusBadge from "@/components/dashboard/financien/FinanceStatusBadge";
import { formatCurrency, type FinanceInvoice } from "@/lib/finance";

type OpenInvoicesTableProps = {
  invoices: FinanceInvoice[];
  onMarkPaid: (invoice: FinanceInvoice) => void;
  onView: (invoice: FinanceInvoice) => void;
};

function InvoiceMobileCard({
  invoice,
  onMarkPaid,
  onView,
}: {
  invoice: FinanceInvoice;
  onMarkPaid: (invoice: FinanceInvoice) => void;
  onView: (invoice: FinanceInvoice) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#0B1F4D]">{invoice.invoiceNumber}</p>
          <p className="text-xs text-[#101828]/60">
            {invoice.clientName} · {invoice.projectName}
          </p>
        </div>
        <FinanceStatusBadge status={invoice.status} />
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-1 text-xs">
        <dt className="text-[#101828]/55">Incl. btw</dt>
        <dd className="font-medium">{formatCurrency(invoice.amountInclVat)}</dd>
        <dt className="text-[#101828]/55">Vervaldatum</dt>
        <dd>{invoice.dueDate}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => onView(invoice)}>
          Bekijken
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          render={<Link href="/dashboard/intern/facturatie" />}
        >
          Naar facturatie
        </Button>
      </div>
    </div>
  );
}

export default function OpenInvoicesTable({
  invoices,
  onMarkPaid,
  onView,
}: OpenInvoicesTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {invoices.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#101828]/55">
            Geen facturen in deze selectie.
          </p>
        ) : (
          invoices.map((inv) => (
            <InvoiceMobileCard
              key={inv.id}
              invoice={inv}
              onMarkPaid={onMarkPaid}
              onView={onView}
            />
          ))
        )}
      </div>

      <div className="-mx-4 hidden overflow-x-auto sm:-mx-6 lg:block">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Factuurnummer</TableHead>
              <TableHead>Klant</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Factuurdatum</TableHead>
              <TableHead>Vervaldatum</TableHead>
              <TableHead>Bedrag excl.</TableHead>
              <TableHead>Btw</TableHead>
              <TableHead>Bedrag incl.</TableHead>
              <TableHead>Betaald</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-10 text-center text-sm text-[#101828]/55"
                >
                  Geen facturen gevonden.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell>{inv.clientName}</TableCell>
                  <TableCell className="text-sm">{inv.projectName}</TableCell>
                  <TableCell className="text-sm">{inv.invoiceDate}</TableCell>
                  <TableCell className="text-sm">{inv.dueDate}</TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(inv.amountExVat)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(inv.vatAmount)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCurrency(inv.amountInclVat)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(inv.paidAmount)}
                  </TableCell>
                  <TableCell>
                    <FinanceStatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onView(inv)}
                        aria-label="Bekijken"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        render={<Link href="/dashboard/intern/facturatie" />}
                        aria-label="Naar facturatie"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onMarkPaid(inv)}
                        aria-label="Markeer betaald"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      {inv.moneybirdInvoiceId && (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          render={
                            <a
                              href="https://moneybird.com"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                          aria-label="Open Moneybird"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
