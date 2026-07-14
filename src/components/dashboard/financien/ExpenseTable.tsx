"use client";

import { AlertCircle, Check, Eye } from "lucide-react";
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
import { formatCurrency, type FinanceExpense } from "@/lib/finance";

type ExpenseTableProps = {
  expenses: FinanceExpense[];
  onMarkPaid: (expense: FinanceExpense) => void;
  onReview: (expense: FinanceExpense) => void;
  onView: (expense: FinanceExpense) => void;
};

function ExpenseMobileCard({
  expense,
  onView,
}: {
  expense: FinanceExpense;
  onView: (expense: FinanceExpense) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-[#0B1F4D]">{expense.supplier}</p>
          <p className="text-xs text-[#101828]/60">
            {expense.category} · {expense.date}
          </p>
        </div>
        <FinanceStatusBadge status={expense.status} />
      </div>
      <p className="mt-2 text-sm text-[#101828]/75">{expense.description}</p>
      <p className="mt-1 text-sm font-medium">
        {formatCurrency(expense.amountInclVat)} incl.
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3"
        onClick={() => onView(expense)}
      >
        Bekijken
      </Button>
    </div>
  );
}

export default function ExpenseTable({
  expenses,
  onMarkPaid,
  onReview,
  onView,
}: ExpenseTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {expenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#101828]/55">
            Geen kosten in deze selectie.
          </p>
        ) : (
          expenses.map((exp) => (
            <ExpenseMobileCard key={exp.id} expense={exp} onView={onView} />
          ))
        )}
      </div>

      <div className="hidden w-full max-w-full overflow-x-auto lg:block">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Datum</TableHead>
              <TableHead>Leverancier</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Omschrijving</TableHead>
              <TableHead>Bedrag excl.</TableHead>
              <TableHead>Btw</TableHead>
              <TableHead>Bedrag incl.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-sm text-[#101828]/55"
                >
                  Geen kosten gevonden.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="pl-6 text-sm">{exp.date}</TableCell>
                  <TableCell className="font-medium">{exp.supplier}</TableCell>
                  <TableCell className="text-sm">{exp.category}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-sm">
                    {exp.description}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(exp.amountExVat)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatCurrency(exp.vatAmount)}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCurrency(exp.amountInclVat)}
                  </TableCell>
                  <TableCell>
                    <FinanceStatusBadge status={exp.status} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onView(exp)}
                        aria-label="Bekijken"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onMarkPaid(exp)}
                        aria-label="Markeer betaald"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onReview(exp)}
                        aria-label="Te controleren"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
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
