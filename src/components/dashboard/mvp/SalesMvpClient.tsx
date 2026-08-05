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
  createClientAction,
  createLeadAction,
  inviteClientPortalAction,
  syncClientToMoneybirdAction,
  updateClientAction,
  updateLeadAction,
  updateLeadStatusAction,
} from "@/lib/dashboard/mutations";
import {
  clientStatusLabel,
  formatCurrency,
  formatDate,
  leadStatusLabel,
} from "@/lib/dashboard/formatters";
import type { Client, Lead, LeadStatus } from "@/lib/dashboard/types";

const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "proposal_sent",
  "won",
  "lost",
];

export function SalesMvpClient({
  clients,
  leads,
  tablesReady,
  errorMessage,
  mode = "sales",
}: {
  clients: Client[];
  leads: Lead[];
  tablesReady: boolean;
  errorMessage?: string | null;
  mode?: "sales" | "leads";
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [clientOpen, setClientOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [q, setQ] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q.trim()) return true;
      const hay = `${l.company_name} ${l.contact_name ?? ""} ${l.email ?? ""}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [leads, statusFilter, q]);

  function refresh(msg: string) {
    showToast(msg);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title={mode === "leads" ? "Leads" : "Sales"}
        description={
          mode === "leads"
            ? "Kansen, status en follow-ups voor sales."
            : "Opdrachtgevers, leads en opvolging."
        }
        notice={
          tablesReady
            ? errorMessage
            : "Voer docs/internal-dashboard-database.md uit in Supabase om data op te slaan."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            {mode === "sales" ? (
              <Button
                className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
                onClick={() => {
                  setEditClient(null);
                  setClientOpen(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Opdrachtgever
              </Button>
            ) : null}
            <Button
              variant={mode === "leads" ? "default" : "outline"}
              className={
                mode === "leads"
                  ? "bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
                  : undefined
              }
              onClick={() => {
                setEditLead(null);
                setLeadOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Lead
            </Button>
          </div>
        }
      />

      {mode === "sales" ? (
      <section className="space-y-3">
        <h2 className="text-lg font-black text-[#0B1F4D]">Opdrachtgevers</h2>
        {clients.length === 0 ? (
          <MvpEmptyState
            title="Nog geen opdrachtgevers"
            description="Voeg je eerste klant toe om projecten te kunnen koppelen."
            action={
              <Button onClick={() => setClientOpen(true)}>
                Opdrachtgever toevoegen
              </Button>
            }
          />
        ) : (
          <MvpTableShell>
            <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Bedrijf</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Stad</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Portaal</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                    {c.company_name}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {c.contact_name || "—"}
                    <div className="text-xs">{c.email || c.phone || ""}</div>
                  </td>
                  <td className="px-3 py-2">{c.city || "—"}</td>
                  <td className="px-3 py-2">
                    <MvpBadge tone={c.status === "active" ? "ok" : "neutral"}>
                      {clientStatusLabel(c.status)}
                    </MvpBadge>
                  </td>
                  <td className="px-3 py-2">
                    {c.profile_id ? (
                      <MvpBadge tone="ok">Gekoppeld</MvpBadge>
                    ) : c.email ? (
                      <MvpBadge tone="neutral">Niet uitgenodigd</MvpBadge>
                    ) : (
                      <span className="text-xs text-slate-400">Geen e-mail</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {c.email ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={pending}
                          onClick={() => {
                            startTransition(async () => {
                              const res = await inviteClientPortalAction(c.id);
                              refresh(
                                res.ok
                                  ? res.data.message
                                  : res.error,
                              );
                            });
                          }}
                        >
                          {c.profile_id ? "Opnieuw uitnodigen" : "Uitnodigen"}
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        title={
                          c.moneybird_contact_id
                            ? `Gekoppeld: ${c.moneybird_contact_id}`
                            : "Zoek of maak Moneybird-contact"
                        }
                        onClick={() => {
                          startTransition(async () => {
                            const res = await syncClientToMoneybirdAction(c.id);
                            refresh(
                              res.ok ? res.data.message : res.error,
                            );
                          });
                        }}
                      >
                        {c.moneybird_contact_id
                          ? "Moneybird gekoppeld"
                          : "Koppel Moneybird"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditClient(c);
                          setClientOpen(true);
                        }}
                      >
                        Bewerken
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </MvpTableShell>
        )}
      </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-black text-[#0B1F4D]">
            {mode === "leads" ? "Overzicht" : "Leads"}
          </h2>
          <div className="flex flex-wrap gap-2">
            <TextInput
              placeholder="Zoeken…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-44"
            />
            <TextSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Alle statussen</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {leadStatusLabel(s)}
                </option>
              ))}
            </TextSelect>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <MvpEmptyState
            title="Nog geen leads"
            description="Voeg een lead toe of pas je filters aan."
            action={
              <Button onClick={() => setLeadOpen(true)}>Lead toevoegen</Button>
            }
          />
        ) : (
          <MvpTableShell>
            <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Bedrijf</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Waarde</th>
                <th className="px-3 py-2">Follow-up</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <div className="font-semibold text-[#0B1F4D]">
                      {l.company_name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {l.contact_name || "—"} · {l.source || "handmatig"}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <TextSelect
                      value={l.status}
                      onChange={(e) => {
                        startTransition(async () => {
                          const res = await updateLeadStatusAction(
                            l.id,
                            e.target.value as LeadStatus,
                          );
                          refresh(
                            res.ok
                              ? "Leadstatus bijgewerkt."
                              : res.error,
                          );
                        });
                      }}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {leadStatusLabel(s)}
                        </option>
                      ))}
                    </TextSelect>
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(l.value_estimate)}
                  </td>
                  <td className="px-3 py-2">
                    {formatDate(l.next_follow_up)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditLead(l);
                        setLeadOpen(true);
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
      </section>

      <MvpFormDialog
        open={clientOpen}
        onOpenChange={setClientOpen}
        title={editClient ? "Opdrachtgever bewerken" : "Nieuwe opdrachtgever"}
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            if (editClient) fd.set("id", editClient.id);
            const res = editClient
              ? await updateClientAction(fd)
              : await createClientAction(fd);
            if (res.ok) {
              setClientOpen(false);
              refresh(res.data.message);
            } else showToast(res.error);
          });
        }}
      >
        <div key={editClient?.id ?? "new-client"} className="space-y-3">
        <Field label="Bedrijfsnaam" name="company_name">
          <TextInput
            name="company_name"
            required
            defaultValue={editClient?.company_name}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Contactpersoon" name="contact_name">
            <TextInput
              name="contact_name"
              defaultValue={editClient?.contact_name ?? ""}
            />
          </Field>
          <Field label="Status" name="status">
            <TextSelect name="status" defaultValue={editClient?.status ?? "active"}>
              <option value="active">Actief</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactief</option>
            </TextSelect>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="E-mail" name="email">
            <TextInput
              name="email"
              type="email"
              defaultValue={editClient?.email ?? ""}
            />
          </Field>
          <Field label="Telefoon" name="phone">
            <TextInput name="phone" defaultValue={editClient?.phone ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Adres" name="address">
            <TextInput name="address" defaultValue={editClient?.address ?? ""} />
          </Field>
          <Field label="Stad" name="city">
            <TextInput name="city" defaultValue={editClient?.city ?? ""} />
          </Field>
        </div>
        <Field label="Notities" name="notes">
          <TextTextarea name="notes" defaultValue={editClient?.notes ?? ""} />
        </Field>
        <Field
          label="Moneybird contact-id (optioneel override)"
          name="moneybird_contact_id"
        >
          <TextInput
            name="moneybird_contact_id"
            defaultValue={editClient?.moneybird_contact_id ?? ""}
            placeholder="Wordt automatisch gezet bij sync"
          />
          <p className="mt-1 text-xs text-slate-500">
            Normaal niet nodig: gebruik “Koppel Moneybird” of sync vanuit
            Facturatie (zoek/maak op e-mail of bedrijfsnaam).
          </p>
        </Field>
        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0B1F4D]">
          <input
            type="checkbox"
            name="invite_portal"
            value="on"
            defaultChecked={!editClient}
            className="mt-0.5 h-4 w-4 accent-[#F28C28]"
          />
          <span>
            <span className="font-semibold">Stuur portaal-uitnodiging</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Branded e-mail om in te loggen op /portaal/opdrachtgevers (alleen
              als er een e-mailadres is).
            </span>
          </span>
        </label>
        </div>
      </MvpFormDialog>

      <MvpFormDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        title={editLead ? "Lead bewerken" : "Nieuwe lead"}
        pending={pending}
        onSubmit={async (fd) => {
          startTransition(async () => {
            if (editLead) fd.set("id", editLead.id);
            const res = editLead
              ? await updateLeadAction(fd)
              : await createLeadAction(fd);
            if (res.ok) {
              setLeadOpen(false);
              refresh(editLead ? "Lead bijgewerkt." : "Lead aangemaakt.");
            } else showToast(res.error);
          });
        }}
      >
        <Field label="Bedrijfsnaam" name="company_name">
          <TextInput
            name="company_name"
            required
            defaultValue={editLead?.company_name}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Contact" name="contact_name">
            <TextInput
              name="contact_name"
              defaultValue={editLead?.contact_name ?? ""}
            />
          </Field>
          <Field label="Bron" name="source">
            <TextInput name="source" defaultValue={editLead?.source ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="E-mail" name="email">
            <TextInput
              name="email"
              type="email"
              defaultValue={editLead?.email ?? ""}
            />
          </Field>
          <Field label="Telefoon" name="phone">
            <TextInput name="phone" defaultValue={editLead?.phone ?? ""} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Status" name="status">
            <TextSelect name="status" defaultValue={editLead?.status ?? "new"}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {leadStatusLabel(s)}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Waarde (€)" name="value_estimate">
            <TextInput
              name="value_estimate"
              type="number"
              step="0.01"
              defaultValue={editLead?.value_estimate ?? ""}
            />
          </Field>
          <Field label="Follow-up" name="next_follow_up">
            <TextInput
              name="next_follow_up"
              type="date"
              defaultValue={editLead?.next_follow_up ?? ""}
            />
          </Field>
        </div>
        <Field label="Notities" name="notes">
          <TextTextarea name="notes" defaultValue={editLead?.notes ?? ""} />
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}

export function LeadsMvpClient(props: {
  leads: Lead[];
  tablesReady: boolean;
  errorMessage?: string | null;
}) {
  return (
    <SalesMvpClient
      clients={[]}
      leads={props.leads}
      tablesReady={props.tablesReady}
      errorMessage={props.errorMessage}
      mode="leads"
    />
  );
}
