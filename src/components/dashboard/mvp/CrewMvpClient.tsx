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
  createCrewMemberAction,
  updateCrewMemberAction,
} from "@/lib/dashboard/mutations";
import {
  crewStatusLabel,
  employmentTypeLabel,
  formatCurrency,
} from "@/lib/dashboard/formatters";
import type { CrewMember } from "@/lib/dashboard/types";

export function CrewMvpClient({
  crew,
  tablesReady,
}: {
  crew: CrewMember[];
  tablesReady: boolean;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<CrewMember | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return crew.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q.trim()) return true;
      const hay =
        `${c.full_name} ${c.city ?? ""} ${c.role_type ?? ""} ${(c.skills || []).join(" ")}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [crew, q, statusFilter]);

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Crew"
        description="Medewerkers zonder BSN/IBAN — alleen operationele gegevens."
        notice={
          tablesReady
            ? "Shiftbase-sync: Voorbereid — nog niet gekoppeld."
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
            <Plus className="mr-1 h-4 w-4" /> Crew toevoegen
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <TextInput
          placeholder="Zoek op naam, stad, skill…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-56"
        />
        <TextSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="onboarding">Onboarding</option>
          <option value="inactive">Inactief</option>
        </TextSelect>
      </div>

      {filtered.length === 0 ? (
        <MvpEmptyState
          title="Nog geen crewleden"
          description="Voeg crew toe om shifts te kunnen bezetten."
          action={
            <Button onClick={() => setOpen(true)}>Crew toevoegen</Button>
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Naam</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Stad</th>
              <th className="px-3 py-2">Skills</th>
              <th className="px-3 py-2">Kosten</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-3 py-2">
                  <div className="font-semibold text-[#0B1F4D]">
                    {c.full_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {c.role_type || "—"} · {c.email || c.phone || ""}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {employmentTypeLabel(c.employment_type)}
                </td>
                <td className="px-3 py-2">{c.city || "—"}</td>
                <td className="px-3 py-2 text-xs max-w-[180px]">
                  {(c.skills || []).join(", ") || "—"}
                  <div className="text-slate-400">
                    {c.has_drivers_license ? "Rijbewijs" : ""}
                    {c.has_car ? " · Auto" : ""}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {formatCurrency(c.hourly_cost)}
                </td>
                <td className="px-3 py-2">
                  <MvpBadge tone={c.status === "active" ? "ok" : "neutral"}>
                    {crewStatusLabel(c.status)}
                  </MvpBadge>
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEdit(c);
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

      <MvpFormDialog
        open={open}
        onOpenChange={setOpen}
        title={edit ? "Crew bewerken" : "Crew toevoegen"}
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            if (edit) fd.set("id", edit.id);
            const res = edit
              ? await updateCrewMemberAction(fd)
              : await createCrewMemberAction(fd);
            if (res.ok) {
              setOpen(false);
              showToast(edit ? "Crew bijgewerkt." : "Crew toegevoegd.");
              router.refresh();
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Naam" name="full_name">
          <TextInput name="full_name" required defaultValue={edit?.full_name} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="E-mail" name="email">
            <TextInput
              name="email"
              type="email"
              defaultValue={edit?.email ?? ""}
            />
          </Field>
          <Field label="Telefoon" name="phone">
            <TextInput name="phone" defaultValue={edit?.phone ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Stad" name="city">
            <TextInput name="city" defaultValue={edit?.city ?? ""} />
          </Field>
          <Field label="Functie" name="role_type">
            <TextInput name="role_type" defaultValue={edit?.role_type ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Contract" name="employment_type">
            <TextSelect
              name="employment_type"
              defaultValue={edit?.employment_type ?? "payroll"}
            >
              <option value="payroll">Payroll</option>
              <option value="zzp">ZZP</option>
              <option value="freelance">Freelance</option>
              <option value="other">Overig</option>
            </TextSelect>
          </Field>
          <Field label="Status" name="status">
            <TextSelect name="status" defaultValue={edit?.status ?? "active"}>
              <option value="active">Actief</option>
              <option value="onboarding">Onboarding</option>
              <option value="inactive">Inactief</option>
            </TextSelect>
          </Field>
          <Field label="Uurkost (€)" name="hourly_cost">
            <TextInput
              name="hourly_cost"
              type="number"
              step="0.01"
              defaultValue={edit?.hourly_cost ?? ""}
            />
          </Field>
        </div>
        <Field label="Skills (komma)" name="skills">
          <TextInput
            name="skills"
            defaultValue={(edit?.skills || []).join(", ")}
            placeholder="horeca, bar, event"
          />
        </Field>
        <Field label="Certificaten (komma)" name="certificates">
          <TextInput
            name="certificates"
            defaultValue={(edit?.certificates || []).join(", ")}
          />
        </Field>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="has_drivers_license"
              defaultChecked={edit?.has_drivers_license}
            />
            Rijbewijs
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="has_car" defaultChecked={edit?.has_car} />
            Auto
          </label>
        </div>
        <Field label="Notities" name="notes">
          <TextTextarea name="notes" defaultValue={edit?.notes ?? ""} />
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
