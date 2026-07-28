"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
  TextTextarea,
  useToast,
} from "@/components/dashboard/mvp/MvpShared";
import {
  createProjectAction,
  updateProjectAction,
} from "@/lib/dashboard/mutations";
import {
  formatCurrency,
  formatDate,
  projectStatusLabel,
  projectTypeLabel,
} from "@/lib/dashboard/formatters";
import type {
  Client,
  InvoiceDraft,
  Project,
  ProjectStatus,
  ProjectType,
  Shift,
  Task,
  TimeEntry,
} from "@/lib/dashboard/types";

const STATUSES: ProjectStatus[] = [
  "draft",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const TYPES: ProjectType[] = [
  "event",
  "horeca",
  "restaurant",
  "keuken",
  "bar",
  "stagebouw",
  "productie",
  "logistiek",
  "hospitality",
  "overig",
];

export function ProjectsMvpClient({
  projects,
  clients,
  shifts,
  timeEntries,
  invoices,
  tasks,
  tablesReady,
}: {
  projects: Project[];
  clients: Client[];
  shifts: Shift[];
  timeEntries: TimeEntry[];
  invoices: InvoiceDraft[];
  tasks: Task[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Project | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.project_type !== typeFilter) return false;
      return true;
    });
  }, [projects, statusFilter, typeFilter]);

  const detailShifts = detail
    ? shifts.filter((s) => s.project_id === detail.id)
    : [];
  const detailHours = detail
    ? timeEntries.filter((t) => t.project_id === detail.id)
    : [];
  const detailInvoices = detail
    ? invoices.filter((i) => i.project_id === detail.id)
    : [];
  const detailTasks = detail
    ? tasks.filter(
        (t) => t.linked_type === "project" && t.linked_id === detail.id,
      )
    : [];

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Projecten"
        description="Opdrachten met briefing, tarief en status."
        notice={
          tablesReady
            ? null
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <Button
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={() => {
              setEdit(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Nieuw project
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <TextSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Alle statussen</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {projectStatusLabel(s)}
            </option>
          ))}
        </TextSelect>
        <TextSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Alle types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {projectTypeLabel(t)}
            </option>
          ))}
        </TextSelect>
      </div>

      {filtered.length === 0 ? (
        <MvpEmptyState
          title="Nog geen projecten aangemaakt"
          description="Maak je eerste project aan en koppel een opdrachtgever."
          action={
            <Button onClick={() => setOpen(true)}>Project toevoegen</Button>
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Klant</th>
              <th className="px-3 py-2">Periode</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Tarief</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-3 py-2">
                  <div className="font-semibold text-[#0B1F4D]">
                    {p.project_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {projectTypeLabel(p.project_type)} · {p.location || "—"}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {p.clients?.company_name || "—"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {formatDate(p.start_date)} → {formatDate(p.end_date)}
                </td>
                <td className="px-3 py-2">
                  <MvpBadge
                    tone={
                      p.status === "in_progress"
                        ? "ok"
                        : p.status === "cancelled"
                          ? "danger"
                          : "info"
                    }
                  >
                    {projectStatusLabel(p.status)}
                  </MvpBadge>
                </td>
                <td className="px-3 py-2">
                  {formatCurrency(p.default_hourly_rate)}
                </td>
                <td className="px-3 py-2 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => setDetail(p)}>
                    Detail
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEdit(p);
                      setOpen(true);
                    }}
                  >
                    Bewerken
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </MvpTableShell>
      )}

      {detail ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#0B1F4D]">
                {detail.project_name}
              </h3>
              <p className="text-sm text-slate-600">
                {detail.clients?.company_name || "Geen klant"} ·{" "}
                {detail.location || "—"}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setDetail(null)}>
              Sluiten
            </Button>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {detail.briefing || "Nog geen briefing."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Shifts
              </p>
              <p className="font-bold text-[#0B1F4D]">{detailShifts.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Urenregels
              </p>
              <p className="font-bold text-[#0B1F4D]">{detailHours.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Facturen
              </p>
              <p className="font-bold text-[#0B1F4D]">{detailInvoices.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Acties
              </p>
              <p className="font-bold text-[#0B1F4D]">{detailTasks.length}</p>
            </div>
          </div>
          {(detail.clothing || detail.ppe || detail.certificates_required) && (
            <div className="text-sm text-slate-600 space-y-1">
              {detail.clothing ? <p>Kleding: {detail.clothing}</p> : null}
              {detail.ppe ? <p>PBM: {detail.ppe}</p> : null}
              {detail.certificates_required ? (
                <p>Certificaten: {detail.certificates_required}</p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <MvpFormDialog
        open={open}
        onOpenChange={setOpen}
        title={edit ? "Project bewerken" : "Nieuw project"}
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            if (edit) fd.set("id", edit.id);
            const res = edit
              ? await updateProjectAction(fd)
              : await createProjectAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast(edit ? "Project bijgewerkt." : "Project aangemaakt.");
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Projectnaam" name="project_name">
          <TextInput
            name="project_name"
            required
            defaultValue={edit?.project_name}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Opdrachtgever" name="client_id">
            <TextSelect name="client_id" defaultValue={edit?.client_id ?? ""}>
              <option value="">— Geen —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Type" name="project_type">
            <TextSelect
              name="project_type"
              defaultValue={edit?.project_type ?? "event"}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {projectTypeLabel(t)}
                </option>
              ))}
            </TextSelect>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Status" name="status">
            <TextSelect name="status" defaultValue={edit?.status ?? "draft"}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {projectStatusLabel(s)}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Uurtarief (€)" name="default_hourly_rate">
            <TextInput
              name="default_hourly_rate"
              type="number"
              step="0.01"
              defaultValue={edit?.default_hourly_rate ?? "31.50"}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Locatie" name="location">
            <TextInput name="location" defaultValue={edit?.location ?? ""} />
          </Field>
          <Field label="Adres" name="address">
            <TextInput name="address" defaultValue={edit?.address ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Startdatum" name="start_date">
            <TextInput
              name="start_date"
              type="date"
              defaultValue={edit?.start_date ?? ""}
            />
          </Field>
          <Field label="Einddatum" name="end_date">
            <TextInput
              name="end_date"
              type="date"
              defaultValue={edit?.end_date ?? ""}
            />
          </Field>
        </div>
        <Field label="Contact op locatie" name="contact_on_site">
          <TextInput
            name="contact_on_site"
            defaultValue={edit?.contact_on_site ?? ""}
          />
        </Field>
        <Field label="Briefing" name="briefing">
          <TextTextarea name="briefing" defaultValue={edit?.briefing ?? ""} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Kleding" name="clothing">
            <TextInput name="clothing" defaultValue={edit?.clothing ?? ""} />
          </Field>
          <Field label="PBM" name="ppe">
            <TextInput name="ppe" defaultValue={edit?.ppe ?? ""} />
          </Field>
          <Field label="Certificaten" name="certificates_required">
            <TextInput
              name="certificates_required"
              defaultValue={edit?.certificates_required ?? ""}
            />
          </Field>
        </div>
        <Field label="Reisafspraken" name="travel_agreements">
          <TextTextarea
            name="travel_agreements"
            defaultValue={edit?.travel_agreements ?? ""}
          />
        </Field>
        <Field label="Notities" name="notes">
          <TextTextarea name="notes" defaultValue={edit?.notes ?? ""} />
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
