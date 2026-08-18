"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
  TextTextarea,
  useToast,
} from "@/components/dashboard/mvp/MvpShared";
import {
  assignCrewToShiftAction,
  createShiftAction,
  updateShiftStatusAction,
} from "@/lib/dashboard/mutations";
import {
  endOfWeek,
  startOfWeek,
  toDateString,
} from "@/lib/dashboard/calculations";
import {
  formatDate,
  formatTime,
  shiftStatusLabel,
} from "@/lib/dashboard/formatters";
import type {
  CrewMember,
  Project,
  Shift,
  ShiftStatus,
} from "@/lib/dashboard/types";

const STATUSES: ShiftStatus[] = [
  "open",
  "assigned",
  "confirmed",
  "completed",
  "cancelled",
];

export function PlanningMvpClient({
  shifts,
  projects,
  crew,
  tablesReady,
}: {
  shifts: Shift[];
  projects: Project[];
  crew: CrewMember[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [weekOnly, setWeekOnly] = useState(true);

  const weekFrom = toDateString(startOfWeek());
  const weekTo = toDateString(endOfWeek());

  const visible = useMemo(() => {
    if (!weekOnly) return shifts;
    return shifts.filter(
      (s) => s.shift_date >= weekFrom && s.shift_date <= weekTo,
    );
  }, [shifts, weekOnly, weekFrom, weekTo]);

  const openCount = visible.filter((s) => s.status === "open").length;
  const understaffed = visible.filter(
    (s) => (s.assigned_people || 0) < (s.required_people || 1),
  ).length;

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Planning"
        description={`Week ${formatDate(weekFrom)} – ${formatDate(weekTo)}. Planning in Supabase.`}
        notice={
          tablesReady
            ? null
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              render={<Link href="/dashboard/intern/berichten" />}
            >
              Accreditatielijst
            </Button>
            <Button
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
              onClick={() => setOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" /> Shift toevoegen
            </Button>
          </div>
        }
      />

      <p className="text-sm text-slate-600">
        Shifts worden opgeslagen in Supabase. Crew kan accepteren of afwijzen in
        het medewerkersportaal.
      </p>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <MvpBadge tone="warn">{openCount} open</MvpBadge>
        <MvpBadge tone="danger">{understaffed} onderbezet</MvpBadge>
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={weekOnly}
            onChange={(e) => setWeekOnly(e.target.checked)}
          />
          Alleen deze week
        </label>
      </div>

      {visible.length === 0 ? (
        <MvpEmptyState
          title="Nog geen shifts gepland"
          description="Maak een shift aan en wijs crew toe."
          action={
            <Button onClick={() => setOpen(true)}>Shift toevoegen</Button>
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Tijd / rol</th>
              <th className="px-3 py-2">Bezetting</th>
              <th className="px-3 py-2">Crew</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => {
              const short = (s.assigned_people || 0) < (s.required_people || 1);
              return (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                    {formatDate(s.shift_date)}
                  </td>
                  <td className="px-3 py-2">
                    {s.projects?.project_name || "—"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {formatTime(s.start_time)}–{formatTime(s.end_time)}
                    <div>{s.role_name || "—"}</div>
                  </td>
                  <td className="px-3 py-2">
                    <MvpBadge tone={short ? "danger" : "ok"}>
                      {s.assigned_people}/{s.required_people}
                    </MvpBadge>
                  </td>
                  <td className="px-3 py-2">
                    <TextSelect
                      value={s.crew_member_id ?? ""}
                      onChange={(e) => {
                        startTransition(async () => {
                          const res = await assignCrewToShiftAction(
                            s.id,
                            e.target.value || null,
                          );
                          showToast(
                            res.ok ? "Crew toegewezen." : res.error,
                          );
                          router.refresh();
                        });
                      }}
                    >
                      <option value="">— Open —</option>
                      {crew
                        .filter((c) => c.status === "active")
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.full_name}
                          </option>
                        ))}
                    </TextSelect>
                  </td>
                  <td className="px-3 py-2">
                    <TextSelect
                      value={s.status}
                      onChange={(e) => {
                        startTransition(async () => {
                          const res = await updateShiftStatusAction(
                            s.id,
                            e.target.value as ShiftStatus,
                          );
                          showToast(res.ok ? "Status bijgewerkt." : res.error);
                          router.refresh();
                        });
                      }}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {shiftStatusLabel(st)}
                        </option>
                      ))}
                    </TextSelect>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </MvpTableShell>
      )}

      <MvpFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Shift toevoegen"
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            const res = await createShiftAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast(res.data.message ?? "Shift aangemaakt.");
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
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Datum" name="shift_date">
            <TextInput name="shift_date" type="date" required />
          </Field>
          <Field label="Start" name="start_time">
            <TextInput name="start_time" type="time" defaultValue="09:00" />
          </Field>
          <Field label="Eind" name="end_time">
            <TextInput name="end_time" type="time" defaultValue="17:00" />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Functie / rol" name="role_name">
            <TextInput name="role_name" placeholder="Eventmedewerker" />
          </Field>
          <Field label="Benodigd" name="required_people">
            <TextInput name="required_people" type="number" defaultValue="1" />
          </Field>
        </div>
        <Field label="Crew toewijzen" name="crew_member_id">
          <TextSelect name="crew_member_id" defaultValue="">
            <option value="">— Later —</option>
            {crew
              .filter((c) => c.status === "active")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
          </TextSelect>
        </Field>
        <Field label="Notities" name="notes">
          <TextTextarea name="notes" />
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
