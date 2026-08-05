"use client";

import { useMemo, useState, useTransition } from "react";
import {
  BadgeCheck,
  Download,
  FilePlus,
  RotateCcw,
  Send,
} from "lucide-react";
import Link from "next/link";
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
  TextInput,
  TextSelect,
  useToast,
} from "@/components/dashboard/mvp/MvpShared";
import {
  confirmInvoiceDraftInMoneybirdAction,
  createInvoiceDraftFromApprovedHoursAction,
  createInvoiceDraftFromInvoicedHoursAction,
  pushInvoiceDraftToMoneybirdAction,
  resetInvoicedTimeEntriesToApprovedAction,
  updateInvoiceDraftStatusAction,
} from "@/lib/dashboard/mutations";
import {
  formatCurrency,
  formatHours,
  invoiceDraftToCsv,
  invoiceStatusLabel,
} from "@/lib/dashboard/formatters";
import { OUTDATED_MONEYBIRD_DRAFT_MSG } from "@/lib/dashboard/moneybirdConstants";
import type {
  InvoiceDraft,
  InvoiceDraftStatus,
  Project,
  TimeEntry,
} from "@/lib/dashboard/types";

function isOutdatedMoneybirdDraft(d: InvoiceDraft): boolean {
  return Boolean(
    d.moneybird_invoice_id &&
      d.moneybird_sync_status !== "verzonden" &&
      (d.moneybird_sync_status === "niet_gesynct" ||
        d.moneybird_sync_error === OUTDATED_MONEYBIRD_DRAFT_MSG),
  );
}

export function InvoiceMvpClient({
  drafts,
  draftsError,
  projects,
  approvedEntries,
  orphanInvoicedEntries,
  tablesReady,
  moneybirdConfigured,
  moneybirdInvoiceReady,
}: {
  drafts: InvoiceDraft[];
  draftsError: string | null;
  projects: Project[];
  approvedEntries: TimeEntry[];
  orphanInvoicedEntries: TimeEntry[];
  tablesReady: boolean;
  moneybirdConfigured: boolean;
  moneybirdInvoiceReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [moneybirdDraft, setMoneybirdDraft] = useState<InvoiceDraft | null>(
    null,
  );
  const [confirmDraft, setConfirmDraft] = useState<InvoiceDraft | null>(null);

  const projectsWithApproved = useMemo(() => {
    const ids = new Set(
      approvedEntries.map((e) => e.project_id).filter(Boolean) as string[],
    );
    return projects.filter((p) => ids.has(p.id));
  }, [projects, approvedEntries]);

  const projectsWithOrphans = useMemo(() => {
    const ids = new Set(
      orphanInvoicedEntries
        .map((e) => e.project_id)
        .filter(Boolean) as string[],
    );
    return projects.filter((p) => ids.has(p.id));
  }, [projects, orphanInvoicedEntries]);

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

  const notice = !tablesReady
    ? "Voer docs/internal-dashboard-database.md uit in Supabase."
    : draftsError
      ? `Concepten laden mislukt: ${draftsError}`
      : moneybirdConfigured
        ? moneybirdInvoiceReady
          ? "Moneybird is gekoppeld — sync als concept, bevestig/verzenden is een aparte stap."
          : "Token werkt, maar BTW-tarief/omzetrekening kon niet automatisch worden bepaald. Zie docs/moneybird-integration.md of zet optioneel TAX/LEDGER IDs."
        : "Moneybird nog niet gekoppeld — concepten blijven in Supabase tot je Vercel-env zet.";

  const showOrphanBanner =
    orphanInvoicedEntries.length > 0 &&
    approvedEntries.length === 0 &&
    drafts.length === 0;

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Facturatie"
        description="Factuurconcepten uit goedgekeurde uren, met CSV-export en optionele Moneybird-sync."
        notice={notice}
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

      {orphanInvoicedEntries.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">
            {orphanInvoicedEntries.length} gefactureerde urenregel
            {orphanInvoicedEntries.length === 1 ? "" : "s"} zonder actief
            factuurconcept
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
            {showOrphanBanner
              ? "Daarom zie je 0 goedgekeurde uren en geen concepten: de status staat op Gefactureerd, maar er is geen concept meer gekoppeld (verwijderd/geannuleerd of query-fout)."
              : "Deze uren staan op Gefactureerd zonder draft/ready/sent/paid-concept op hetzelfde project."}{" "}
            Herstel een concept, of zet de status terug naar goedgekeurd om
            opnieuw te factureren.
          </p>
          <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-xs text-amber-950/90">
            {orphanInvoicedEntries.slice(0, 8).map((e) => (
              <li key={e.id}>
                {e.work_date} · {e.crew_members?.full_name || "—"} ·{" "}
                {e.projects?.project_name || "—"} · {formatHours(e.hours)}
              </li>
            ))}
            {orphanInvoicedEntries.length > 8 ? (
              <li>…en {orphanInvoicedEntries.length - 8} meer</li>
            ) : null}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
              disabled={projectsWithOrphans.length === 0 || pending}
              onClick={() => setRecoverOpen(true)}
            >
              <FilePlus className="mr-1 h-3.5 w-3.5" />
              Herstel / maak concept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  const res = await resetInvoicedTimeEntriesToApprovedAction(
                    orphanInvoicedEntries.map((e) => e.id),
                  );
                  if (res.ok) {
                    showToast(
                      `${res.data.count} urenregel(s) teruggezet naar goedgekeurd.`,
                    );
                    router.refresh();
                  } else showToast(res.error);
                });
              }}
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Status terugzetten naar goedgekeurd
            </Button>
            <Link
              href="/dashboard/intern/urenregistratie"
              className="inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold text-[#173A8A] underline-offset-2 hover:underline"
            >
              Naar urenregistratie
            </Link>
          </div>
        </div>
      ) : null}

      {drafts.length === 0 ? (
        <MvpEmptyState
          title="Nog geen factuurconcepten"
          description={
            draftsError
              ? "Concepten konden niet worden geladen. Controleer of je interne rol (owner/admin/finance/planner/sales) hebt en of RLS (`is_internal_role`) actief is."
              : orphanInvoicedEntries.length > 0
                ? "Er zijn wel gefactureerde uren zonder concept. Gebruik hierboven Herstel of Status terugzetten."
                : "Keur eerst uren goed en maak daarna een concept per project."
          }
          action={
            projectsWithApproved.length > 0 ? (
              <Button onClick={() => setOpen(true)}>Concept maken</Button>
            ) : orphanInvoicedEntries.length > 0 ? (
              <Button onClick={() => setRecoverOpen(true)}>
                Herstel concept
              </Button>
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
              <th className="px-3 py-2">Moneybird</th>
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
                        if (res.ok) {
                          const reset = res.data.resetEntries ?? 0;
                          showToast(
                            reset > 0
                              ? `Status bijgewerkt. ${reset} uren teruggezet naar goedgekeurd.`
                              : "Status bijgewerkt.",
                          );
                        } else showToast(res.error);
                        router.refresh();
                      });
                    }}
                  >
                    {(
                      ["draft", "ready", "sent", "paid", "cancelled"] as const
                    ).map((s) => (
                      <option key={s} value={s}>
                        {invoiceStatusLabel(s)}
                      </option>
                    ))}
                  </TextSelect>
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {isOutdatedMoneybirdDraft(d) ? (
                    <span
                      className="font-medium text-amber-700"
                      title={OUTDATED_MONEYBIRD_DRAFT_MSG}
                    >
                      {OUTDATED_MONEYBIRD_DRAFT_MSG}
                    </span>
                  ) : d.moneybird_invoice_id ? (
                    <span className="font-medium text-violet-700">
                      {d.moneybird_sync_status === "verzonden"
                        ? "Verzonden"
                        : "Concept"}{" "}
                      · {d.moneybird_invoice_id.slice(0, 8)}…
                    </span>
                  ) : d.moneybird_sync_status === "fout" ? (
                    <span
                      className="text-red-600"
                      title={d.moneybird_sync_error ?? ""}
                    >
                      Fout
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {moneybirdInvoiceReady &&
                    d.moneybird_sync_status !== "verzonden" &&
                    d.status !== "sent" &&
                    d.status !== "paid" &&
                    d.status !== "cancelled" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMoneybirdDraft(d)}
                        disabled={pending}
                        title={
                          d.moneybird_invoice_id
                            ? "Moneybird-concept bijwerken"
                            : "Als concept naar Moneybird"
                        }
                      >
                        <Send className="mr-1 h-3.5 w-3.5" />
                        {d.moneybird_invoice_id
                          ? "Vernieuw Moneybird"
                          : "Naar Moneybird als concept"}
                      </Button>
                    ) : null}
                    {moneybirdInvoiceReady &&
                    d.moneybird_invoice_id &&
                    d.moneybird_sync_status !== "verzonden" &&
                    d.status !== "sent" &&
                    d.status !== "paid" &&
                    d.status !== "cancelled" &&
                    !isOutdatedMoneybirdDraft(d) ? (
                      <Button
                        size="sm"
                        className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
                        onClick={() => setConfirmDraft(d)}
                        disabled={pending}
                      >
                        <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                        Bevestig factuur
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCsv(d)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> CSV
                    </Button>
                  </div>
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
        {moneybirdConfigured ? (
          <>
            <MvpBadge tone={moneybirdInvoiceReady ? "ok" : "warn"}>
              Moneybird —{" "}
              {moneybirdInvoiceReady ? "klaar voor facturen" : "token OK"}
            </MvpBadge>
            <p className="mt-2">
              {moneybirdInvoiceReady
                ? "Stap 1: “Naar Moneybird als concept”. Stap 2: “Bevestig factuur” om te verzenden — nooit automatisch."
                : "Token werkt (contacts), maar er is geen standaard BTW-tarief of omzetrekening gevonden. Controleer actieve sales-tarieven/omzetrekeningen in Moneybird, of zet optioneel MONEYBIRD_DEFAULT_TAX_RATE_ID en MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID."}
            </p>
            {!moneybirdInvoiceReady ? (
              <p className="mt-2">
                Uitleg:{" "}
                <Link
                  href="/dashboard/intern/integraties"
                  className="font-semibold text-[#173A8A] underline-offset-2 hover:underline"
                >
                  Integraties
                </Link>{" "}
                · docs/moneybird-integration.md
              </p>
            ) : null}
          </>
        ) : (
          <>
            <MvpBadge tone="warn">Moneybird — niet gekoppeld</MvpBadge>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Maak een Personal Access Token in Moneybird (scopes: sales
                invoices + contacts).
              </li>
              <li>
                Zet in Vercel:{" "}
                <code className="text-xs">MONEYBIRD_ACCESS_TOKEN</code> (of{" "}
                <code className="text-xs">MONEYBIRD_API_TOKEN</code>) en{" "}
                <code className="text-xs">MONEYBIRD_ADMINISTRATION_ID</code>.
              </li>
              <li>
                Optioneel: TAX/LEDGER IDs als overrides; anders worden die
                automatisch uit Moneybird gehaald.
              </li>
              <li>Redeploy, daarna testen via Integraties → Moneybird.</li>
            </ol>
            <p className="mt-2">
              Details:{" "}
              <Link
                href="/dashboard/intern/integraties"
                className="font-semibold text-[#173A8A] underline-offset-2 hover:underline"
              >
                Integraties
              </Link>{" "}
              · docs/moneybird-integration.md
            </p>
          </>
        )}
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

      <MvpFormDialog
        open={recoverOpen}
        onOpenChange={setRecoverOpen}
        title="Herstel concept uit gefactureerde uren"
        description="Maakt een nieuw factuurconcept voor uren die al op Gefactureerd staan maar geen actief concept hebben."
        pending={pending}
        submitLabel="Concept herstellen"
        onSubmit={async (fd) => {
          startTransition(async () => {
            const res = await createInvoiceDraftFromInvoicedHoursAction(fd);
            if (res.ok) {
              setRecoverOpen(false);
              showToast("Factuurconcept hersteld.");
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
            {projectsWithOrphans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </TextSelect>
        </Field>
      </MvpFormDialog>

      <MvpFormDialog
        open={Boolean(moneybirdDraft)}
        onOpenChange={(next) => {
          if (!next) setMoneybirdDraft(null);
        }}
        title="Naar Moneybird als concept"
        description="Maakt of vernieuwt alleen een concept in Moneybird. Verzenden gebeurt apart via “Bevestig factuur”."
        pending={pending}
        submitLabel="Naar Moneybird als concept"
        onSubmit={async (fd) => {
          if (!moneybirdDraft) return;
          startTransition(async () => {
            const contactId = String(fd.get("contact_id") ?? "");
            const res = await pushInvoiceDraftToMoneybirdAction(
              moneybirdDraft.id,
              contactId,
              false,
            );
            if (res.ok) {
              setMoneybirdDraft(null);
              showToast(res.data.message);
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        {moneybirdDraft ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {moneybirdDraft.invoice_number} ·{" "}
              {moneybirdDraft.clients?.company_name || "Geen klant"} ·{" "}
              {formatCurrency(moneybirdDraft.total_amount)}
            </p>
            {isOutdatedMoneybirdDraft(moneybirdDraft) ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                {OUTDATED_MONEYBIRD_DRAFT_MSG}. Dit werkt het Moneybird-concept
                bij met de huidige uren.
              </p>
            ) : null}
            <Field label="Moneybird contact-id" name="contact_id">
              <TextInput
                name="contact_id"
                required
                defaultValue={
                  moneybirdDraft.clients?.moneybird_contact_id ?? ""
                }
                placeholder="Bijv. 123456789012345678"
              />
            </Field>
          </div>
        ) : null}
      </MvpFormDialog>

      <MvpFormDialog
        open={Boolean(confirmDraft)}
        onOpenChange={(next) => {
          if (!next) setConfirmDraft(null);
        }}
        title="Bevestig factuur"
        description="Weet je zeker dat je deze factuur wilt bevestigen/verzenden naar de klant?"
        pending={pending}
        submitLabel="Ja, bevestig en verzend"
        onSubmit={async () => {
          if (!confirmDraft) return;
          startTransition(async () => {
            const res = await confirmInvoiceDraftInMoneybirdAction(
              confirmDraft.id,
            );
            if (res.ok) {
              setConfirmDraft(null);
              showToast(res.data.message);
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        {confirmDraft ? (
          <p className="text-sm text-slate-600">
            {confirmDraft.invoice_number} ·{" "}
            {confirmDraft.clients?.company_name || "Geen klant"} ·{" "}
            {formatCurrency(confirmDraft.total_amount)}
          </p>
        ) : null}
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
