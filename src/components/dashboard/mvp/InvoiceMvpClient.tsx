"use client";

import { useMemo, useState, useTransition } from "react";
import {
  BadgeCheck,
  Download,
  FilePlus,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
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
  creditInvoiceDraftAction,
  deleteInvoiceDraftAction,
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
import type { UserRole } from "@/lib/supabase/types";
import type {
  InvoiceDraft,
  InvoiceDraftStatus,
  Project,
  TimeEntry,
} from "@/lib/dashboard/types";

const FINANCE_ROLES: UserRole[] = ["owner", "admin", "finance"];

function canManageFinance(role: UserRole): boolean {
  return FINANCE_ROLES.includes(role);
}

function isOutdatedMoneybirdDraft(d: InvoiceDraft): boolean {
  return Boolean(
    d.moneybird_invoice_id &&
      d.moneybird_sync_status !== "verzonden" &&
      (d.moneybird_sync_status === "niet_gesynct" ||
        d.moneybird_sync_error === OUTDATED_MONEYBIRD_DRAFT_MSG),
  );
}

function canDeleteDraft(d: InvoiceDraft): boolean {
  if (
    d.status === "sent" ||
    d.status === "paid" ||
    d.status === "cancelled" ||
    d.status === "gecrediteerd"
  ) {
    return false;
  }
  if (d.moneybird_sync_status === "verzonden") return false;
  return d.status === "draft" || d.status === "ready";
}

function canCreditDraft(d: InvoiceDraft): boolean {
  if (d.status === "cancelled" || d.status === "gecrediteerd") return false;
  return (
    d.status === "sent" ||
    d.status === "paid" ||
    d.moneybird_sync_status === "verzonden"
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
  userRole,
}: {
  drafts: InvoiceDraft[];
  draftsError: string | null;
  projects: Project[];
  approvedEntries: TimeEntry[];
  orphanInvoicedEntries: TimeEntry[];
  tablesReady: boolean;
  moneybirdConfigured: boolean;
  moneybirdInvoiceReady: boolean;
  userRole: UserRole;
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
  const [deleteDraft, setDeleteDraft] = useState<InvoiceDraft | null>(null);
  const [creditDraft, setCreditDraft] = useState<InvoiceDraft | null>(null);

  const canFinance = canManageFinance(userRole);

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
          canFinance ? (
            <Button
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
              onClick={() => setOpen(true)}
              disabled={projectsWithApproved.length === 0}
            >
              <FilePlus className="mr-1 h-4 w-4" /> Concept uit uren
            </Button>
          ) : undefined
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
            {canFinance ? (
              <>
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
              </>
            ) : null}
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
            canFinance && projectsWithApproved.length > 0 ? (
              <Button onClick={() => setOpen(true)}>Concept maken</Button>
            ) : canFinance && orphanInvoicedEntries.length > 0 ? (
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
                  {canFinance ? (
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
                        [
                          "draft",
                          "ready",
                          "sent",
                          "paid",
                          "cancelled",
                          "gecrediteerd",
                        ] as const
                      ).map((s) => (
                        <option key={s} value={s}>
                          {invoiceStatusLabel(s)}
                        </option>
                      ))}
                    </TextSelect>
                  ) : (
                    <span className="text-sm font-medium text-slate-700">
                      {invoiceStatusLabel(d.status)}
                    </span>
                  )}
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
                      className="max-w-[14rem] cursor-help text-red-600"
                      title={d.moneybird_sync_error ?? ""}
                    >
                      Fout
                      {d.moneybird_sync_error ? (
                        <span className="mt-0.5 block truncate text-[10px] font-normal leading-snug text-red-500/90">
                          {d.moneybird_sync_error}
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {canFinance &&
                    moneybirdInvoiceReady &&
                    d.moneybird_sync_status !== "verzonden" &&
                    d.status !== "sent" &&
                    d.status !== "paid" &&
                    d.status !== "cancelled" &&
                    d.status !== "gecrediteerd" ? (
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
                    {canFinance &&
                    moneybirdInvoiceReady &&
                    d.moneybird_invoice_id &&
                    d.moneybird_sync_status !== "verzonden" &&
                    d.status !== "sent" &&
                    d.status !== "paid" &&
                    d.status !== "cancelled" &&
                    d.status !== "gecrediteerd" &&
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
                    {canFinance && canDeleteDraft(d) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteDraft(d)}
                        disabled={pending}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Verwijderen
                      </Button>
                    ) : null}
                    {canFinance && canCreditDraft(d) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCreditDraft(d)}
                        disabled={pending}
                      >
                        <Undo2 className="mr-1 h-3.5 w-3.5" />
                        Crediteren
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
                ? "Stap 1: “Naar Moneybird als concept” (contact wordt automatisch gekoppeld/aangemaakt). Stap 2: “Bevestig factuur” om te verzenden — nooit automatisch. Verwijderen/Crediteren zijn aparte, expliciete acties."
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
        description="Maakt of vernieuwt alleen een concept in Moneybird. Het Moneybird-contact wordt automatisch gekoppeld of aangemaakt. Verzenden gebeurt apart via “Bevestig factuur”."
        pending={pending}
        submitLabel="Naar Moneybird als concept"
        onSubmit={async () => {
          if (!moneybirdDraft) return;
          startTransition(async () => {
            const res = await pushInvoiceDraftToMoneybirdAction(
              moneybirdDraft.id,
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
            {moneybirdDraft.clients?.moneybird_contact_id ? (
              <p className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-700">
                Gekoppeld Moneybird-contact:{" "}
                <span className="font-mono">
                  {moneybirdDraft.clients.moneybird_contact_id}
                </span>
              </p>
            ) : (
              <p className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-700">
                Nog geen Moneybird-koppeling. We zoeken op e-mail of
                bedrijfsnaam, of maken een nieuw contact aan (e-mail bij de
                opdrachtgever is verplicht om aan te maken).
              </p>
            )}
            {isOutdatedMoneybirdDraft(moneybirdDraft) ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                {OUTDATED_MONEYBIRD_DRAFT_MSG}. Regels (week/datum) worden
                herberekend uit uren en het Moneybird-concept wordt bijgewerkt.
              </p>
            ) : null}
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

      <MvpFormDialog
        open={Boolean(deleteDraft)}
        onOpenChange={(next) => {
          if (!next) setDeleteDraft(null);
        }}
        title="Concept verwijderen"
        description="Concept verwijderen? Uren worden weer goedgekeurd en kunnen opnieuw gefactureerd worden."
        pending={pending}
        submitLabel="Ja, verwijderen"
        onSubmit={async () => {
          if (!deleteDraft) return;
          startTransition(async () => {
            const res = await deleteInvoiceDraftAction(deleteDraft.id);
            if (res.ok) {
              setDeleteDraft(null);
              showToast(res.data.message);
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        {deleteDraft ? (
          <p className="text-sm text-slate-600">
            {deleteDraft.invoice_number} ·{" "}
            {deleteDraft.clients?.company_name || "Geen klant"} ·{" "}
            {formatCurrency(deleteDraft.total_amount)}
          </p>
        ) : null}
      </MvpFormDialog>

      <MvpFormDialog
        open={Boolean(creditDraft)}
        onOpenChange={(next) => {
          if (!next) setCreditDraft(null);
        }}
        title="Creditnota aanmaken"
        description="Creditnota aanmaken? Dit maakt de factuur ongedaan (Moneybird credit indien gekoppeld)."
        pending={pending}
        submitLabel="Ja, crediteren"
        onSubmit={async () => {
          if (!creditDraft) return;
          startTransition(async () => {
            const res = await creditInvoiceDraftAction(creditDraft.id);
            if (res.ok) {
              setCreditDraft(null);
              showToast(res.data.message);
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        {creditDraft ? (
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              {creditDraft.invoice_number} ·{" "}
              {creditDraft.clients?.company_name || "Geen klant"} ·{" "}
              {formatCurrency(creditDraft.total_amount)}
            </p>
            <p className="text-xs text-slate-500">
              Er wordt geen factuur automatisch verzonden. Uren blijven
              gefactureerd (geen dubbele factuur).
            </p>
          </div>
        ) : null}
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
