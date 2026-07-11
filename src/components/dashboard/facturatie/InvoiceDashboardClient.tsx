"use client";

import { useCallback, useMemo, useState } from "react";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InvoiceBuilderModal from "@/components/dashboard/facturatie/InvoiceBuilderModal";
import InvoiceDraftDrawer from "@/components/dashboard/facturatie/InvoiceDraftDrawer";
import InvoiceDraftTable, {
  type InvoiceTableAction,
} from "@/components/dashboard/facturatie/InvoiceDraftTable";
import InvoiceFiltersBar from "@/components/dashboard/facturatie/InvoiceFilters";
import InvoiceStatsCards from "@/components/dashboard/facturatie/InvoiceStats";
import MoneybirdSyncPanel from "@/components/dashboard/facturatie/MoneybirdSyncPanel";
import {
  computeInvoiceStats,
  defaultInvoiceFilters,
  demoInvoiceDrafts,
  draftToFormData,
  draftToMoneybirdPayload,
  filterInvoiceDrafts,
  recalculateInvoiceDraft,
  type InvoiceDraft,
  type InvoiceFilters,
} from "@/lib/invoicing";

export default function InvoiceDashboardClient() {
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(demoInvoiceDrafts);
  const [filters, setFilters] = useState<InvoiceFilters>(defaultInvoiceFilters);
  const [detailDraft, setDetailDraft] = useState<InvoiceDraft | null>(null);
  const [editDraft, setEditDraft] = useState<InvoiceDraft | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDraft, setConfirmDraft] = useState<InvoiceDraft | null>(null);
  const [sending, setSending] = useState(false);

  const filtered = useMemo(
    () => filterInvoiceDrafts(drafts, filters),
    [drafts, filters],
  );

  const stats = useMemo(() => computeInvoiceStats(drafts), [drafts]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const updateDraft = useCallback((id: string, patch: Partial<InvoiceDraft>) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return recalculateInvoiceDraft({ ...d, ...patch });
      }),
    );
    setDetailDraft((prev) =>
      prev?.id === id ? recalculateInvoiceDraft({ ...prev, ...patch }) : prev,
    );
  }, []);

  const handleSave = useCallback(
    (draft: InvoiceDraft) => {
      if (editDraft) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === editDraft.id ? { ...draft, id: editDraft.id } : d)),
        );
        setEditDraft(null);
        showToast("Factuurconcept bijgewerkt (demo).");
      } else {
        setDrafts((prev) => [draft, ...prev]);
        showToast(
          "Factuurconcept voorbereid. Koppel dit later aan Supabase of stuur naar Moneybird.",
        );
      }
    },
    [editDraft, showToast],
  );

  const sendToMoneybird = useCallback(
    async (draft: InvoiceDraft) => {
      if (!draft.contactId?.trim()) {
        showToast("Selecteer eerst een Moneybird contact (contactId ontbreekt).");
        return;
      }
      if (draft.lines.length === 0) {
        showToast("Voeg minimaal één factuurregel toe.");
        return;
      }

      setSending(true);
      try {
        const payload = draftToMoneybirdPayload(draft);
        const res = await fetch("/api/moneybird/sales-invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          updateDraft(draft.id, {
            status: "Aangemaakt in Moneybird",
            moneybirdInvoiceId:
              data.invoice?.invoice_id ?? data.invoice?.id ?? `MB-${Date.now()}`,
          });
          setConfirmDraft(null);
          setDetailDraft(null);
          showToast("Conceptfactuur aangemaakt in Moneybird.");
        } else {
          showToast(data.error ?? "Moneybird-fout bij aanmaken conceptfactuur.");
        }
      } catch {
        showToast("Verbinding met Moneybird mislukt.");
      } finally {
        setSending(false);
      }
    },
    [showToast, updateDraft],
  );

  const handleAction = useCallback(
    (action: InvoiceTableAction, draft: InvoiceDraft) => {
      switch (action) {
        case "view":
          setDetailDraft(draft);
          break;
        case "edit":
          setEditDraft(draft);
          setFormOpen(true);
          break;
        case "send":
          setConfirmDraft(draft);
          break;
        case "mark_sent":
          updateDraft(draft.id, { status: "Verzonden" });
          showToast("Gemarkeerd als verzonden (demo).");
          break;
        case "mark_paid":
          updateDraft(draft.id, { status: "Betaald" });
          showToast("Gemarkeerd als betaald (demo).");
          break;
        case "csv":
          break;
      }
    },
    [showToast, updateDraft],
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

      <InvoiceStatsCards stats={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          {filtered.length} van {drafts.length} factuurconcepten
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditDraft(null);
            setFormOpen(true);
          }}
        >
          <FilePlus className="h-4 w-4" />
          Factuurconcept maken
        </Button>
      </div>

      <MoneybirdSyncPanel />

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Factuurconcepten
          </CardTitle>
          <CardDescription>
            Maak factuurconcepten op basis van goedgekeurde uren, reiskosten en
            projectafspraken.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceFiltersBar filters={filters} onChange={setFilters} />
          <InvoiceDraftTable drafts={filtered} onAction={handleAction} />
        </CardContent>
      </Card>

      <InvoiceDraftDrawer
        draft={detailDraft}
        open={detailDraft !== null}
        onOpenChange={(open) => {
          if (!open) setDetailDraft(null);
        }}
        onEdit={(draft) => {
          setDetailDraft(null);
          setEditDraft(draft);
          setFormOpen(true);
        }}
        onSend={(draft) => setConfirmDraft(draft)}
      />

      <InvoiceBuilderModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditDraft(null);
        }}
        onSave={handleSave}
        initialData={editDraft ? draftToFormData(editDraft) : undefined}
        existingId={editDraft?.id}
        mode={editDraft ? "edit" : "create"}
      />

      <Dialog
        open={confirmDraft !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDraft(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">
              Conceptfactuur naar Moneybird
            </DialogTitle>
            <DialogDescription>
              Weet je zeker dat je dit factuurconcept als conceptfactuur in
              Moneybird wilt aanmaken? De factuur wordt niet automatisch
              verzonden.
            </DialogDescription>
          </DialogHeader>
          {confirmDraft && (
            <p className="text-sm text-[#101828]/75">
              <strong>{confirmDraft.reference}</strong> ·{" "}
              {confirmDraft.clientName} · {confirmDraft.lines.length} regels
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDraft(null)}
              disabled={sending}
            >
              Annuleren
            </Button>
            <Button
              type="button"
              onClick={() => confirmDraft && void sendToMoneybird(confirmDraft)}
              disabled={sending}
            >
              {sending ? "Bezig…" : "Bevestigen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
