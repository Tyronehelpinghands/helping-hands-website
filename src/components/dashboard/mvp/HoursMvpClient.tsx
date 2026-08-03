"use client";

import { useMemo, useState, useTransition } from "react";
import { ExternalLink, Loader2, Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { calculateWorkedHours } from "@/lib/dashboard/calculations";
import {
  approveTimeEntryAction,
  createTimeEntryAction,
  rejectTimeEntryAction,
  updateTimeEntryAction,
} from "@/lib/dashboard/mutations";
import {
  formatDate,
  formatHours,
  formatNumber,
  formatTime,
  timeEntryStatusLabel,
} from "@/lib/dashboard/formatters";
import type { CrewMember, Project, TimeEntry } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function toTimeInputValue(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  return value.slice(0, 5);
}

function canEditTimeEntry(entry: TimeEntry) {
  return entry.status !== "invoiced";
}

export function HoursMvpClient({
  entries,
  projects,
  crew,
  tablesReady,
}: {
  entries: TimeEntry[];
  projects: Project[];
  crew: CrewMember[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<TimeEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [crewFilter, setCrewFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [bulkSyncing, setBulkSyncing] = useState(false);

  function openCreate() {
    setEdit(null);
    setStartTime("09:00");
    setEndTime("17:00");
    setBreakMinutes("30");
    setOpen(true);
  }

  function openEdit(entry: TimeEntry) {
    if (!canEditTimeEntry(entry)) {
      showToast(
        "Deze registratie staat al op een factuurconcept en kan niet meer worden aangepast.",
      );
      return;
    }
    setEdit(entry);
    setStartTime(toTimeInputValue(entry.start_time, "09:00"));
    setEndTime(toTimeInputValue(entry.end_time, "17:00"));
    setBreakMinutes(String(entry.break_minutes ?? 0));
    setOpen(true);
  }

  const previewHours = calculateWorkedHours(
    startTime,
    endTime,
    Number(breakMinutes) || 0,
  );

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (crewFilter !== "all" && e.crew_member_id !== crewFilter) return false;
      if (dateFrom && e.work_date < dateFrom) return false;
      if (dateTo && e.work_date > dateTo) return false;
      return true;
    });
  }, [entries, statusFilter, crewFilter, dateFrom, dateTo]);

  const openCount = entries.filter((e) => e.status === "submitted").length;

  async function pushHoursToShiftbase(body: {
    entryIds?: string[];
    start_date?: string;
    end_date?: string;
  }) {
    const res = await fetch("/api/shiftbase/push-hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      message?: string;
      error?: string;
      errors?: string[];
    };
    if (!res.ok || data.ok === false) {
      const detail =
        data.errors?.slice(0, 2).join(" · ") ||
        data.error ||
        data.message ||
        "Sync mislukt";
      showToast(detail);
      return;
    }
    showToast(data.message ?? "Uren gesynchroniseerd.");
  }

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Urenregistratie"
        description={`${openCount} uren ter controle. Alleen intern mag goedkeuren.`}
        notice={
          tablesReady
            ? "Helping Hands is bron van waarheid. Sync naar Shiftbase is optioneel (API write kan beperkt zijn — dan handmatig in Shiftbase)."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <Button
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={openCreate}
          >
            <Plus className="mr-1 h-4 w-4" /> Uren invoeren
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-[#101828]/75 shadow-sm">
        <p className="font-semibold text-[#0B1F4D]">Fabrice / 28 juni vinden</p>
        <p className="mt-1 text-xs leading-relaxed">
          Filter hieronder op crewlid <strong>Fabrice</strong> en datum{" "}
          <strong>2026-06-28</strong> (of 2025-06-28). De regel staat in
          Supabase (`time_entries`) — niet automatisch in Shiftbase. Gebruik
          &quot;Sync naar Shiftbase&quot; of voer dezelfde uren handmatig in in
          Shiftbase als de API write weigert.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const fabrice = crew.find((c) =>
                c.full_name.toLowerCase().includes("fabrice"),
              );
              if (fabrice) setCrewFilter(fabrice.id);
              setDateFrom("2026-06-28");
              setDateTo("2026-06-28");
              setStatusFilter("all");
            }}
          >
            Zoek Fabrice 28 juni 2026
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const fabrice = crew.find((c) =>
                c.full_name.toLowerCase().includes("fabrice"),
              );
              if (fabrice) setCrewFilter(fabrice.id);
              setDateFrom("2025-06-28");
              setDateTo("2025-06-28");
              setStatusFilter("all");
            }}
          >
            Zoek 28 juni 2025
          </Button>
          <a
            href="https://app.shiftbase.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5",
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Shiftbase
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Status
          </label>
          <TextSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44"
          >
            <option value="all">Alle statussen</option>
            <option value="submitted">Ingediend</option>
            <option value="approved">Goedgekeurd</option>
            <option value="rejected">Afgekeurd</option>
            <option value="invoiced">Gefactureerd</option>
            <option value="draft">Concept</option>
          </TextSelect>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Crew
          </label>
          <TextSelect
            value={crewFilter}
            onChange={(e) => setCrewFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">Alle crew</option>
            {crew.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </TextSelect>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Van
          </label>
          <TextInput
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Tot
          </label>
          <TextInput
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={bulkSyncing || filtered.length === 0}
          onClick={() => {
            setBulkSyncing(true);
            void pushHoursToShiftbase({
              entryIds: filtered
                .filter((e) => e.status === "submitted" || e.status === "approved")
                .map((e) => e.id),
              start_date: dateFrom || undefined,
              end_date: dateTo || undefined,
            }).finally(() => setBulkSyncing(false));
          }}
        >
          {bulkSyncing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Sync uren naar Shiftbase
        </Button>
      </div>

      {filtered.length === 0 ? (
        <MvpEmptyState
          title="Nog geen urenregels"
          description="Pas filters aan, of voer uren in. Voor Fabrice 28 juni: check of de regel bestaat en filter op naam + datum."
          action={<Button onClick={openCreate}>Uren invoeren</Button>}
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Project / crew</th>
              <th className="px-3 py-2">Tijd</th>
              <th className="px-3 py-2">Uren</th>
              <th className="px-3 py-2">Km / reistijd</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                  {formatDate(e.work_date)}
                </td>
                <td className="px-3 py-2">
                  <div>{e.projects?.project_name || "—"}</div>
                  <div className="text-xs text-slate-500">
                    {e.crew_members?.full_name || "—"}
                    {e.crew_members?.shiftbase_user_id ? (
                      <span className="ml-1 text-emerald-700">
                        · SB {e.crew_members.shiftbase_user_id}
                      </span>
                    ) : (
                      <span className="ml-1 text-amber-700">
                        · geen Shiftbase-ID
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs">
                  {formatTime(e.start_time)}–{formatTime(e.end_time)}
                  <div>Pauze {e.break_minutes}m</div>
                </td>
                <td className="px-3 py-2">{formatHours(e.hours)}</td>
                <td className="px-3 py-2 text-xs">
                  {formatNumber(e.kilometers)} km
                  <div>{formatHours(e.travel_time_hours)}</div>
                </td>
                <td className="px-3 py-2">
                  <MvpBadge
                    tone={
                      e.status === "approved"
                        ? "ok"
                        : e.status === "rejected"
                          ? "danger"
                          : e.status === "submitted"
                            ? "warn"
                            : "neutral"
                    }
                  >
                    {timeEntryStatusLabel(e.status)}
                  </MvpBadge>
                  {e.correction_reason ? (
                    <div className="mt-1 text-xs text-red-600">
                      {e.correction_reason}
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-right space-x-1">
                  {canEditTimeEntry(e) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(e)}
                    >
                      Aanpassen
                    </Button>
                  ) : null}
                  {(e.status === "submitted" || e.status === "approved") && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={syncingId === e.id}
                      onClick={() => {
                        setSyncingId(e.id);
                        void pushHoursToShiftbase({ entryIds: [e.id] }).finally(
                          () => setSyncingId(null),
                        );
                      }}
                    >
                      {syncingId === e.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      Sync naar Shiftbase
                    </Button>
                  )}
                  {e.status === "submitted" ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        disabled={pending}
                        onClick={() => {
                          startTransition(async () => {
                            const res = await approveTimeEntryAction(e.id);
                            showToast(res.ok ? "Uren goedgekeurd." : res.error);
                            router.refresh();
                          });
                        }}
                      >
                        Goedkeuren
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejectId(e.id);
                          setRejectReason("");
                        }}
                      >
                        Afkeuren
                      </Button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </MvpTableShell>
      )}

      <MvpFormDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEdit(null);
        }}
        title={edit ? "Uren aanpassen" : "Uren invoeren"}
        pending={pending}
        onSubmit={async (fd) => {
          fd.set("hours", String(previewHours));
          startTransition(async () => {
            if (edit) fd.set("id", edit.id);
            const res = edit
              ? await updateTimeEntryAction(fd)
              : await createTimeEntryAction(fd);
            if (res.ok) {
              setOpen(false);
              setEdit(null);
              showToast(
                edit ? "Registratie bijgewerkt." : "Urenregel opgeslagen.",
              );
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <div key={edit?.id ?? "new-hours"} className="space-y-3">
          <Field label="Project" name="project_id">
            <TextSelect
              name="project_id"
              required
              defaultValue={edit?.project_id ?? ""}
            >
              <option value="" disabled>
                Kies project
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Crewlid" name="crew_member_id">
            <TextSelect
              name="crew_member_id"
              required
              defaultValue={edit?.crew_member_id ?? ""}
            >
              <option value="" disabled>
                Kies crewlid
              </option>
              {crew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Datum" name="work_date">
            <TextInput
              name="work_date"
              type="date"
              required
              defaultValue={edit?.work_date ?? ""}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Start" name="start_time">
              <TextInput
                name="start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Field>
            <Field label="Eind" name="end_time">
              <TextInput
                name="end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Field>
            <Field label="Pauze (min)" name="break_minutes">
              <TextInput
                name="break_minutes"
                type="number"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
              />
            </Field>
          </div>
          <p className="text-sm font-semibold text-[#173A8A]">
            Berekend: {formatHours(previewHours)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kilometers" name="kilometers">
              <TextInput
                name="kilometers"
                type="number"
                step="0.1"
                defaultValue={String(edit?.kilometers ?? 0)}
              />
            </Field>
            <Field label="Reistijd (u)" name="travel_time_hours">
              <TextInput
                name="travel_time_hours"
                type="number"
                step="0.25"
                defaultValue={String(edit?.travel_time_hours ?? 0)}
              />
            </Field>
          </div>
          <Field label="Interne notities" name="internal_notes">
            <TextTextarea
              name="internal_notes"
              defaultValue={edit?.internal_notes ?? ""}
            />
          </Field>
        </div>
      </MvpFormDialog>

      <MvpFormDialog
        open={!!rejectId}
        onOpenChange={(v) => {
          if (!v) setRejectId(null);
        }}
        title="Uren afkeuren"
        description="Geef een correctiereden op."
        pending={pending}
        submitLabel="Afkeuren"
        onSubmit={async () => {
          if (!rejectId) return;
          startTransition(async () => {
            const res = await rejectTimeEntryAction(rejectId, rejectReason);
            if (res.ok) {
              setRejectId(null);
              showToast("Uren afgekeurd.");
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Correctiereden">
          <TextTextarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
