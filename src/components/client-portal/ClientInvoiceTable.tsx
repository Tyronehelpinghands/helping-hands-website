"use client";

import { useState } from "react";
import { Download, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientInvoice } from "@/lib/clientPortal";
import {
  DEMO_CLIENT_INVOICES,
  formatClientDate,
  formatInvoiceAmounts,
} from "@/lib/clientPortal";

export default function ClientInvoiceTable({
  invoices = DEMO_CLIENT_INVOICES,
}: {
  invoices?: ClientInvoice[];
}) {
  const [selected, setSelected] = useState<ClientInvoice | null>(null);
  const [open, setOpen] = useState(false);

  function openInvoice(invoice: ClientInvoice) {
    setSelected(invoice);
    setOpen(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Facturen</CardTitle>
          <CardDescription>Overzicht van facturen en betaalstatus.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factuurnummer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Factuurdatum</TableHead>
                <TableHead>Vervaldatum</TableHead>
                <TableHead>Excl. btw</TableHead>
                <TableHead>Btw</TableHead>
                <TableHead>Totaal incl.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const amounts = formatInvoiceAmounts(invoice);
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-semibold text-[#0B1F4D]">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.projectName}</TableCell>
                    <TableCell>{formatClientDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{formatClientDate(invoice.dueDate)}</TableCell>
                    <TableCell>{amounts.exVat}</TableCell>
                    <TableCell>{amounts.vat}</TableCell>
                    <TableCell className="font-semibold">{amounts.inclVat}</TableCell>
                    <TableCell>
                      <ClientStatusBadge status={invoice.status} variant="invoice" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openInvoice(invoice)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Bekijken
                        </Button>
                        <Button type="button" variant="ghost" size="sm" disabled>
                          <Download className="mr-1 h-4 w-4" />
                          Binnenkort
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {invoices.map((invoice) => {
              const amounts = formatInvoiceAmounts(invoice);
              return (
                <div
                  key={invoice.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#0B1F4D]">{invoice.invoiceNumber}</p>
                      <p className="truncate text-sm text-slate-600">{invoice.projectName}</p>
                    </div>
                    <ClientStatusBadge status={invoice.status} variant="invoice" />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Factuurdatum</dt>
                      <dd className="font-medium">{formatClientDate(invoice.invoiceDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Vervaldatum</dt>
                      <dd className="font-medium">{formatClientDate(invoice.dueDate)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500">Totaal incl. btw</dt>
                      <dd className="text-lg font-bold text-[#173A8A]">{amounts.inclVat}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 w-full"
                      onClick={() => openInvoice(invoice)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Bekijken
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-black text-[#0B1F4D]">
                  {selected.invoiceNumber}
                </SheetTitle>
                <SheetDescription className="text-left">
                  <ClientStatusBadge status={selected.status} variant="invoice" />
                </SheetDescription>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Project</dt>
                  <dd className="text-[#0B1F4D]">{selected.projectName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Factuurdatum</dt>
                  <dd className="text-[#0B1F4D]">{formatClientDate(selected.invoiceDate)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Vervaldatum</dt>
                  <dd className="text-[#0B1F4D]">{formatClientDate(selected.dueDate)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Bedrag excl. btw</dt>
                  <dd className="text-[#0B1F4D]">{formatInvoiceAmounts(selected).exVat}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Btw</dt>
                  <dd className="text-[#0B1F4D]">{formatInvoiceAmounts(selected).vat}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Totaal incl. btw</dt>
                  <dd className="text-lg font-bold text-[#0B1F4D]">
                    {formatInvoiceAmounts(selected).inclVat}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-2">
                <Button type="button" variant="outline" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF — Binnenkort
                </Button>
                <Button type="button" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Vraag stellen
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
