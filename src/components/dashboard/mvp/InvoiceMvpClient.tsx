"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  MvpBadge,
  MvpEmptyState,
  MvpFormDialog,
  MvpPageHeader,
  MvpTableShell,
  MvpToast,
  TextSelect,
  useToast,
} from "@/components/dashboard/mvp/MvpShared";
import {
  createInvoiceDraftFromApprovedHoursAction,
  updateInvoiceDraftStatusAction,
} from "@/lib/dashboard/mutations";
import {
  formatCurrency,
  formatHours,
  invoiceDraftToCsv,
  invoiceStatusLabel,
} from "@/lib/dashboard/formatters";
import type {
  InvoiceDraft,
  InvoiceDraftStatus,
  Project,
  TimeEntry,
} from "@/lib/dashboard/types";

export function InvoiceMvpClient({
  drafts,
  projects,
  approvedEntries,
  tablesReady,
}: {
  drafts: InvoiceDraft[];
  projects: Project[];
  approvedEntries: TimeEntry[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const projectsWithApproved = useMemo(() => {
    const ids = new Set(
      approvedEntries.map((e) => e.project_id).filter(Boolean) as string[],
    );
    return projects.filter((p) => ids.has(p.id));
  }, [projects, approvedEntries]);

  function downloadCsv(draft: InvoiceDraft) {
    const csv = invoiceDraftToCsv(draft);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.invoice_number || draft.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV gedownload.");
  }

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Facturatie"
        description="Factuurconcepten uit goedgekeurde uren, met CSV-export."
        notice={
          tablesReady
            ? "Moneybird-verzending is nog niet gekoppeld — concepten blijven in Supabase."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <Button
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={() => setOpen(true)}
            disabled={projectsWithApproved.length === 0}
          >
            <FilePlus className="mr-1 h-4 w-4" /> Concept uit uren
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-[#0B1F4D]">
          Goedgekeurde uren klaar voor factuur: {approvedEntries.length}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Kies een project met goedgekeurde (nog niet gefactureerde) uren.
        </p>
      </div>

      {drafts.length === 0 ? (
        <MvpEmptyState
          title="Nog geen factuurconcepten"
          description="Keur eerst uren goed en maak daarna een concept per project."
          action={
            projectsWithApproved.length > 0 ? (
              <Button onClick={() => setOpen(true)}>Concept maken</Button>
            ) : undefined
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Nummer</th>
              <th className="px-3 py-2">Klant / project</th>
              <th className="px-3 py-2">Uren</th>
              <th className="px-3 py-2">Totaal</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {drafts.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                  {d.invoice_number || "—"}
                </td>
                <td className="px-3 py-2">
                  <div>{d.clients?.company_name || "—"}</div>
                  <div className="text-xs text-slate-500">
                    {d.projects?.project_name || "—"}
                  </div>
                </td>
                <td className="px-3 py-2">{formatHours(d.total_hours)}</td>
                <td className="px-3 py-2">
                  <div className="font-semibold">
                    {formatCurrency(d.total_amount)}
                  </div>
                  <div className="text-xs text-slate-500">
                    excl. {formatCurrency(d.subtotal)} · btw{" "}
                    {formatCurrency(d.vat_amount)}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <TextSelect
                    value={d.status}
                    onChange={(e) => {
                      startTransition(async () => {
                        const res = await updateInvoiceDraftStatusAction(
                          d.id,
                          e.target.value as InvoiceDraftStatus,
                        );
                        showToast(res.ok ? "Status bijgewerkt." : res.error);
                        router.refresh();
                      });
                    }}
                  >
                    {(["draft", "ready", "sent", "paid", "cancelled"] as const).map(
                      (s) => (
                        <option key={s} value={s}>
                          {invoiceStatusLabel(s)}
                        </option>
                      ),
                    )}
                  </TextSelect>
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCsv(d)}
                  >
                    <Download className="mr-1 h-3.5 w-3.5" /> CSV
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </MvpTableShell>
      )}

      {drafts[0]?.invoice_draft_lines?.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-bold text-[#0B1F4D]">
            Regels laatste concept ({drafts[0].invoice_number})
          </p>
          <ul className="space-y-1 text-sm text-slate-700">
            {drafts[0].invoice_draft_lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-3">
                <span>{line.description}</span>
                <span className="font-semibold">
                  {formatCurrency(line.line_total)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-xl border border-dashed border-slate-300 bg-[#F5F7FA]/50 p-4 text-sm text-slate-600">
        <MvpBadge tone="warn">Moneybird — handmatig</MvpBadge>
        <p className="mt-2">
          Concepten worden in Supabase bewaard. Exporteer als CSV of verwerk
          handmatig in Moneybird; automatische verzending volgt later.
        </p>
      </div>

      <MvpFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Factuurconcept uit goedgekeurde uren"
        pending={pending}
        submitLabel="Concept maken"
        onSubmit={async (fd) => {
          startTransition(async () => {
            const res = await createInvoiceDraftFromApprovedHoursAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast("Factuurconcept aangemaakt.");
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Project" name="project_id">
          <TextSelect name="project_id" required defaultValue="">
            <option value="" disabled>
              Kies project
            </option>
            {projectsWithApproved.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </TextSelect>
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
