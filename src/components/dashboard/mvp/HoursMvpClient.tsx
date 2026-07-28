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
import { calculateWorkedHours } from "@/lib/dashboard/calculations";
import {
  approveTimeEntryAction,
  createTimeEntryAction,
  rejectTimeEntryAction,
} from "@/lib/dashboard/mutations";
import {
  formatDate,
  formatHours,
  formatNumber,
  formatTime,
  timeEntryStatusLabel,
} from "@/lib/dashboard/formatters";
import type { CrewMember, Project, TimeEntry } from "@/lib/dashboard/types";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("30");

  const previewHours = calculateWorkedHours(
    startTime,
    endTime,
    Number(breakMinutes) || 0,
  );

  const filtered = useMemo(() => {
    if (statusFilter === "all") return entries;
    return entries.filter((e) => e.status === statusFilter);
  }, [entries, statusFilter]);

  const openCount = entries.filter((e) => e.status === "submitted").length;

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Urenregistratie"
        description={`${openCount} uren ter controle. Alleen intern mag goedkeuren.`}
        notice={
          tablesReady
            ? "Shiftbase-import: Voorbereid — nog niet gekoppeld."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <Button
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> Uren invoeren
          </Button>
        }
      />

      <TextSelect
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-48"
      >
        <option value="all">Alle statussen</option>
        <option value="submitted">Ingediend</option>
        <option value="approved">Goedgekeurd</option>
        <option value="rejected">Afgekeurd</option>
        <option value="invoiced">Gefactureerd</option>
        <option value="draft">Concept</option>
      </TextSelect>

      {filtered.length === 0 ? (
        <MvpEmptyState
          title="Nog geen urenregels"
          description="Voer uren in of keur later goedgekeurde uren goed voor facturatie."
          action={<Button onClick={() => setOpen(true)}>Uren invoeren</Button>}
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
        onOpenChange={setOpen}
        title="Uren invoeren"
        pending={pending}
        onSubmit={async (fd) => {
          fd.set("hours", String(previewHours));
          startTransition(async () => {
            const res = await createTimeEntryAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast("Urenregel opgeslagen.");
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
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name}
              </option>
            ))}
          </TextSelect>
        </Field>
        <Field label="Crewlid" name="crew_member_id">
          <TextSelect name="crew_member_id" required defaultValue="">
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
          <TextInput name="work_date" type="date" required />
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
            <TextInput name="kilometers" type="number" step="0.1" defaultValue="0" />
          </Field>
          <Field label="Reistijd (u)" name="travel_time_hours">
            <TextInput
              name="travel_time_hours"
              type="number"
              step="0.25"
              defaultValue="0"
            />
          </Field>
        </div>
        <Field label="Interne notities" name="internal_notes">
          <TextTextarea name="internal_notes" />
        </Field>
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
