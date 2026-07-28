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
  createTaskAction,
  updateTaskStatusAction,
} from "@/lib/dashboard/mutations";
import {
  formatDate,
  taskPriorityLabel,
  taskStatusLabel,
} from "@/lib/dashboard/formatters";
import type { Task, TaskStatus } from "@/lib/dashboard/types";

export function TasksMvpClient({
  tasks,
  tablesReady,
}: {
  tasks: Task[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const critical = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.priority === "critical" &&
          ["open", "in_progress"].includes(t.status),
      ),
    [tasks],
  );

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Risico & Acties"
        description="Operationele taken en deadlines."
        notice={
          tablesReady
            ? null
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <Button
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> Actie toevoegen
          </Button>
        }
      />

      {critical.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-800">
            {critical.length} kritieke open actie(s)
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            {critical.map((t) => (
              <li key={t.id}>
                {t.title}
                {t.due_date ? ` · deadline ${formatDate(t.due_date)}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tasks.length === 0 ? (
        <MvpEmptyState
          title="Nog geen acties"
          description="Voeg risico's en follow-ups toe om niets te missen."
          action={
            <Button onClick={() => setOpen(true)}>Actie toevoegen</Button>
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Titel</th>
              <th className="px-3 py-2">Prioriteit</th>
              <th className="px-3 py-2">Deadline</th>
              <th className="px-3 py-2">Koppeling</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="px-3 py-2">
                  <div className="font-semibold text-[#0B1F4D]">{t.title}</div>
                  {t.description ? (
                    <div className="text-xs text-slate-500 line-clamp-2">
                      {t.description}
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <MvpBadge
                    tone={
                      t.priority === "critical"
                        ? "danger"
                        : t.priority === "high"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {taskPriorityLabel(t.priority)}
                  </MvpBadge>
                </td>
                <td className="px-3 py-2">{formatDate(t.due_date)}</td>
                <td className="px-3 py-2 text-xs">
                  {t.linked_type || "—"}
                  {t.linked_id ? ` · ${t.linked_id.slice(0, 8)}…` : ""}
                </td>
                <td className="px-3 py-2">
                  <TextSelect
                    value={t.status}
                    onChange={(e) => {
                      startTransition(async () => {
                        const res = await updateTaskStatusAction(
                          t.id,
                          e.target.value as TaskStatus,
                        );
                        showToast(res.ok ? "Status bijgewerkt." : res.error);
                        router.refresh();
                      });
                    }}
                  >
                    {(["open", "in_progress", "done", "cancelled"] as const).map(
                      (s) => (
                        <option key={s} value={s}>
                          {taskStatusLabel(s)}
                        </option>
                      ),
                    )}
                  </TextSelect>
                </td>
              </tr>
            ))}
          </tbody>
        </MvpTableShell>
      )}

      <MvpFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Actie toevoegen"
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            const res = await createTaskAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast("Actie aangemaakt.");
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Titel" name="title">
          <TextInput name="title" required />
        </Field>
        <Field label="Beschrijving" name="description">
          <TextTextarea name="description" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Prioriteit" name="priority">
            <TextSelect name="priority" defaultValue="normal">
              <option value="low">Laag</option>
              <option value="normal">Normaal</option>
              <option value="high">Hoog</option>
              <option value="critical">Kritiek</option>
            </TextSelect>
          </Field>
          <Field label="Deadline" name="due_date">
            <TextInput name="due_date" type="date" />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Koppeltype" name="linked_type">
            <TextSelect name="linked_type" defaultValue="">
              <option value="">—</option>
              <option value="project">Project</option>
              <option value="client">Opdrachtgever</option>
              <option value="lead">Lead</option>
            </TextSelect>
          </Field>
          <Field label="Koppel-id (uuid)" name="linked_id">
            <TextInput name="linked_id" placeholder="optioneel" />
          </Field>
        </div>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
