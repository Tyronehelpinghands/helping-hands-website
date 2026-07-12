"use client";

import { useCallback, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CashflowPanel from "@/components/dashboard/financien/CashflowPanel";
import ExpenseTable from "@/components/dashboard/financien/ExpenseTable";
import FinanceActionList from "@/components/dashboard/financien/FinanceActionList";
import FinanceFiltersBar from "@/components/dashboard/financien/FinanceFilters";
import FinanceOverviewCards from "@/components/dashboard/financien/FinanceOverviewCards";
import FinanceStatsCards from "@/components/dashboard/financien/FinanceStats";
import MarginAnalysisPanel from "@/components/dashboard/financien/MarginAnalysisPanel";
import MoneybirdFinanceSyncPanel from "@/components/dashboard/financien/MoneybirdFinanceSyncPanel";
import OpenInvoicesTable from "@/components/dashboard/financien/OpenInvoicesTable";
import RevenueExpenseChart from "@/components/dashboard/financien/RevenueExpenseChart";
import VatSummaryPanel from "@/components/dashboard/financien/VatSummaryPanel";
import IntegrationHealthPanel from "@/components/dashboard/shared/IntegrationHealthPanel";
import {
  buildFinanceActions,
  calculateFinanceMetrics,
  calculateMargin,
  calculateProjectMargins,
  calculateVatSummary,
  defaultFinanceFilters,
  demoFinanceExpenses,
  demoFinanceInvoices,
  downloadFinanceCsv,
  exportFinanceCsv,
  filterFinanceExpenses,
  filterFinanceInvoices,
  formatCurrency,
  getChartData,
  getOutstandingAmount,
  type FinanceExpense,
  type FinanceFilters,
  type FinanceInvoice,
} from "@/lib/finance";

export default function FinanceDashboardClient() {
  const [invoices, setInvoices] = useState<FinanceInvoice[]>(demoFinanceInvoices);
  const [expenses, setExpenses] = useState<FinanceExpense[]>(demoFinanceExpenses);
  const [filters, setFilters] = useState<FinanceFilters>(defaultFinanceFilters);
  const [toast, setToast] = useState<string | null>(null);

  const filteredInvoices = useMemo(
    () => filterFinanceInvoices(invoices, filters),
    [invoices, filters],
  );
  const filteredExpenses = useMemo(
    () => filterFinanceExpenses(expenses, filters),
    [expenses, filters],
  );

  const metrics = useMemo(
    () => calculateFinanceMetrics(filteredInvoices, filteredExpenses),
    [filteredInvoices, filteredExpenses],
  );

  const outstandingAmount = useMemo(
    () => getOutstandingAmount(filteredInvoices),
    [filteredInvoices],
  );

  const vatSummary = useMemo(
    () =>
      calculateVatSummary(invoices, expenses, filters.period),
    [invoices, expenses, filters.period],
  );

  const marginSummary = useMemo(
    () => calculateMargin(filteredInvoices, filteredExpenses),
    [filteredInvoices, filteredExpenses],
  );

  const projectMargins = useMemo(
    () => calculateProjectMargins(filteredInvoices),
    [filteredInvoices],
  );

  const chartData = useMemo(
    () => getChartData(invoices, expenses),
    [invoices, expenses],
  );

  const actions = useMemo(
    () => buildFinanceActions(invoices, expenses),
    [invoices, expenses],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const handleExport = useCallback(() => {
    const csv = exportFinanceCsv(filteredInvoices, filteredExpenses, metrics);
    downloadFinanceCsv(csv);
    showToast("Financieel rapport geëxporteerd (demo CSV).");
  }, [filteredInvoices, filteredExpenses, metrics, showToast]);

  const handleMarkInvoicePaid = useCallback(
    (invoice: FinanceInvoice) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoice.id
            ? {
                ...inv,
                status: "Betaald" as const,
                paidAmount: inv.amountInclVat,
              }
            : inv,
        ),
      );
      showToast(`${invoice.invoiceNumber} gemarkeerd als betaald (demo).`);
    },
    [showToast],
  );

  const handleMarkExpensePaid = useCallback(
    (expense: FinanceExpense) => {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expense.id ? { ...exp, status: "Betaald" as const } : exp,
        ),
      );
      showToast(`Kostenregel gemarkeerd als betaald (demo).`);
    },
    [showToast],
  );

  const handleReviewExpense = useCallback(
    (expense: FinanceExpense) => {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expense.id
            ? { ...exp, status: "Te controleren" as const }
            : exp,
        ),
      );
      showToast(`Kostenregel gemarkeerd voor controle (demo).`);
    },
    [showToast],
  );

  const handleViewInvoice = useCallback(
    (invoice: FinanceInvoice) => {
      showToast(
        `${invoice.invoiceNumber}: ${formatCurrency(invoice.amountInclVat)} incl. — ${invoice.status}`,
      );
    },
    [showToast],
  );

  const handleViewExpense = useCallback(
    (expense: FinanceExpense) => {
      showToast(
        `${expense.supplier}: ${formatCurrency(expense.amountInclVat)} incl. — ${expense.status}`,
      );
    },
    [showToast],
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          Periode: {filters.period} · {filteredInvoices.length} facturen ·{" "}
          {filteredExpenses.length} kostenregels
        </p>
        <Button type="button" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Financieel rapport exporteren
        </Button>
      </div>

      <MoneybirdFinanceSyncPanel />

      <FinanceFiltersBar filters={filters} onChange={setFilters} />

      <FinanceStatsCards
        metrics={metrics}
        outstandingAmount={outstandingAmount}
      />

      <FinanceOverviewCards
        metrics={metrics}
        outstandingAmount={outstandingAmount}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <CashflowPanel metrics={metrics} invoices={filteredInvoices} />
        <RevenueExpenseChart data={chartData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <VatSummaryPanel summary={vatSummary} />
        <FinanceActionList actions={actions} />
      </div>

      <MarginAnalysisPanel summary={marginSummary} projects={projectMargins} />

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Openstaande facturen
          </CardTitle>
          <CardDescription>
            Debiteurenoverzicht met status en acties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OpenInvoicesTable
            invoices={filteredInvoices}
            onMarkPaid={handleMarkInvoicePaid}
            onView={handleViewInvoice}
          />
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Kosten
          </CardTitle>
          <CardDescription>
            Crewkosten, reiskosten, software, payroll en overige uitgaven.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable
            expenses={filteredExpenses}
            onMarkPaid={handleMarkExpensePaid}
            onReview={handleReviewExpense}
            onView={handleViewExpense}
          />
        </CardContent>
      </Card>

      <IntegrationHealthPanel compact title="Integratiestatus" />
    </div>
  );
}
