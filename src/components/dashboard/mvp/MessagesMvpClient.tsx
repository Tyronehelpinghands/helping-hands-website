"use client";

import { useMemo, useState, useTransition } from "react";
import { Copy, Mail, MessageCircle, Plus, Send } from "lucide-react";
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
import { saveInternalMessageDraftAction } from "@/lib/dashboard/mutations";
import {
  formatDate,
  messageStatusLabel,
  messageTypeLabel,
} from "@/lib/dashboard/formatters";
import type { InternalMessage, Project } from "@/lib/dashboard/types";

function waLink(phone: string | null | undefined, body: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const params = new URLSearchParams();
  if (body) params.set("text", body);
  return `https://wa.me/${digits}?${params.toString()}`;
}

function mailLink(
  email: string | null | undefined,
  subject: string | null,
  body: string | null,
) {
  if (!email) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

export function MessagesMvpClient({
  messages,
  projects,
  tablesReady,
  initialProjectId,
}: {
  messages: InternalMessage[];
  projects: Project[];
  tablesReady: boolean;
  initialProjectId?: string | null;
}) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(Boolean(initialProjectId));
  const [edit, setEdit] = useState<InternalMessage | null>(null);
  const [projectId, setProjectId] = useState(initialProjectId ?? "");
  const [attachAccreditation, setAttachAccreditation] = useState(
    Boolean(initialProjectId),
  );

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === projectId) ?? null,
    [projects, projectId],
  );

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Tekst gekopieerd.");
    } catch {
      showToast("Kopiëren mislukt.");
    }
  }

  function handleSaveResult(
    res: Awaited<ReturnType<typeof saveInternalMessageDraftAction>>,
    intent: "save" | "send",
  ) {
    if (!res.ok) {
      showToast(res.error);
      return;
    }
    setOpen(false);
    router.refresh();
    if (intent === "save") {
      showToast("Concept opgeslagen.");
      return;
    }
    if (res.data.emailSent) {
      const hint = res.data.emailError
        ? ` ${res.data.emailError}`
        : "";
      showToast(`Mail verstuurd.${hint}`);
      return;
    }
    showToast(
      res.data.emailError
        ? `Bericht opgeslagen, maar mail mislukt: ${res.data.emailError}`
        : "Bericht opgeslagen, maar mail is niet verstuurd.",
    );
  }

  function sendExisting(message: InternalMessage) {
    if (!message.recipient_email?.trim()) {
      showToast("Geen ontvanger-e-mailadres — vul eerst een e-mail in.");
      return;
    }
    const fd = new FormData();
    fd.set("id", message.id);
    fd.set("intent", "send");
    fd.set("message_type", message.message_type ?? "other");
    fd.set("recipient_name", message.recipient_name ?? "");
    fd.set("recipient_email", message.recipient_email ?? "");
    fd.set("recipient_phone", message.recipient_phone ?? "");
    fd.set("subject", message.subject ?? "");
    fd.set("body", message.body ?? "");
    fd.set("status", "ready");
    startTransition(async () => {
      const res = await saveInternalMessageDraftAction(fd);
      handleSaveResult(res, "send");
    });
  }

  function openComposer(opts?: {
    message?: InternalMessage | null;
    withAccreditation?: boolean;
    project?: string;
  }) {
    setEdit(opts?.message ?? null);
    setProjectId(opts?.project ?? initialProjectId ?? "");
    setAttachAccreditation(
      Boolean(opts?.withAccreditation ?? (opts?.project || initialProjectId)),
    );
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Berichten"
        description="Concepten opslaan of direct per e-mail versturen via Resend (afzender = ingelogde medewerker)."
        notice={
          tablesReady
            ? "E-mail gaat via Resend met handtekening. Optioneel: accreditatielijst (CSV) van projectcrew bijvoegen."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                openComposer({ withAccreditation: true, project: projectId })
              }
            >
              Accreditatielijst
            </Button>
            <Button
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
              onClick={() => openComposer()}
            >
              <Plus className="mr-1 h-4 w-4" /> Nieuw bericht
            </Button>
          </div>
        }
      />

      {messages.length === 0 ? (
        <MvpEmptyState
          title="Nog geen berichten"
          description="Maak een briefing, reminder of accreditatielijst en verstuur direct per e-mail."
          action={
            <Button onClick={() => openComposer()}>Nieuw bericht</Button>
          }
        />
      ) : (
        <MvpTableShell>
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Ontvanger</th>
              <th className="px-3 py-2">Onderwerp</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Acties</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => {
              const text = [m.subject, m.body].filter(Boolean).join("\n\n");
              const wa = waLink(m.recipient_phone, m.body);
              const mail = mailLink(m.recipient_email, m.subject, m.body);
              return (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <div className="font-semibold text-[#0B1F4D]">
                      {messageTypeLabel(m.message_type)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDate(m.created_at)}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {m.recipient_name || "—"}
                    <div className="text-xs text-slate-500">
                      {m.recipient_email || m.recipient_phone || ""}
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-[220px]">
                    <div className="truncate font-medium">
                      {m.subject || "—"}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {m.body || ""}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <MvpBadge
                      tone={
                        m.status === "sent"
                          ? "ok"
                          : m.status === "ready"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {messageStatusLabel(m.status)}
                    </MvpBadge>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {m.recipient_email && m.status !== "sent" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          title="Direct versturen via Resend"
                          onClick={() => sendExisting(m)}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyText(text)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      {mail ? (
                        <a href={mail}>
                          <Button size="sm" variant="ghost" type="button">
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      ) : null}
                      {wa ? (
                        <a href={wa} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="ghost" type="button">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openComposer({ message: m })}
                      >
                        Bewerken
                      </Button>
                    </div>
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
        title={edit ? "Bericht bewerken" : "Nieuw bericht"}
        description="Versturen stuurt meteen een echte e-mail via Resend, met jouw naam als afzender en handtekening."
        pending={pending}
        submitLabel="Versturen per e-mail"
        secondarySubmit={{
          label: "Opslaan als concept",
          fields: { intent: "save" },
        }}
        onSubmit={async (fd) => {
          if (edit) fd.set("id", edit.id);
          if (attachAccreditation) {
            fd.set("attach_accreditation", "1");
            if (projectId) fd.set("project_id", projectId);
          }
          const intent =
            fd.get("intent") === "send" ? ("send" as const) : ("save" as const);
          if (intent === "save" && !fd.get("status")) {
            fd.set("status", "draft");
          }
          startTransition(async () => {
            const res = await saveInternalMessageDraftAction(fd);
            handleSaveResult(res, intent);
          });
        }}
      >
        <Field label="Type" name="message_type">
          <TextSelect
            name="message_type"
            defaultValue={
              edit?.message_type ??
              (attachAccreditation ? "accreditation_list" : "email_client")
            }
            key={
              edit?.id ??
              (attachAccreditation ? "accreditation_list" : "email_client")
            }
          >
            <option value="email_client">E-mail opdrachtgever</option>
            <option value="accreditation_list">Accreditatielijst</option>
            <option value="whatsapp_briefing">WhatsApp briefing</option>
            <option value="crew_reminder">Crew reminder</option>
            <option value="invoice_reminder">Factuur reminder</option>
            <option value="other">Overig</option>
          </TextSelect>
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Naam" name="recipient_name">
            <TextInput
              name="recipient_name"
              defaultValue={edit?.recipient_name ?? ""}
            />
          </Field>
          <Field label="E-mail" name="recipient_email">
            <TextInput
              name="recipient_email"
              type="email"
              defaultValue={edit?.recipient_email ?? ""}
              placeholder="ontvanger@voorbeeld.nl"
            />
          </Field>
          <Field label="Telefoon" name="recipient_phone">
            <TextInput
              name="recipient_phone"
              defaultValue={edit?.recipient_phone ?? ""}
            />
          </Field>
        </div>
        <Field label="Onderwerp" name="subject">
          <TextInput
            name="subject"
            defaultValue={
              edit?.subject ??
              (attachAccreditation && selectedProject
                ? `Accreditatielijst — ${selectedProject.project_name}`
                : "")
            }
            key={`subject-${edit?.id ?? "new"}-${attachAccreditation}-${projectId}`}
          />
        </Field>
        <Field label="Bericht" name="body">
          <TextTextarea
            name="body"
            defaultValue={
              edit?.body ??
              (attachAccreditation
                ? "In de bijlage en hieronder vind je de accreditatielijst met de ingeplande crew."
                : "")
            }
            key={`body-${edit?.id ?? "new"}-${attachAccreditation}`}
          />
        </Field>

        <div className="rounded-lg border border-slate-200 bg-[#F5F7FA]/60 p-3 space-y-3">
          <label className="flex items-start gap-2 text-sm text-[#0B1F4D]">
            <input
              type="checkbox"
              className="mt-1"
              checked={attachAccreditation}
              onChange={(e) => setAttachAccreditation(e.target.checked)}
            />
            <span>
              <span className="font-semibold">Accreditatielijst bijvoegen</span>
              <span className="block text-xs text-slate-600">
                Tabel in de mail + CSV-bijlage met crew van het gekozen project
                (naam, functie, telefoon, bedrijf, datum, tijd).
              </span>
            </span>
          </label>
          {attachAccreditation ? (
            <Field label="Project" name="project_id">
              <TextSelect
                name="project_id"
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="" disabled>
                  Kies project
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name}
                    {p.location ? ` · ${p.location}` : ""}
                  </option>
                ))}
              </TextSelect>
            </Field>
          ) : null}
        </div>

        <Field label="Status (bij concept)" name="status">
          <TextSelect name="status" defaultValue={edit?.status ?? "draft"}>
            <option value="draft">Concept</option>
            <option value="ready">Klaar</option>
            <option value="sent">Verstuurd</option>
            <option value="archived">Gearchiveerd</option>
          </TextSelect>
        </Field>
      </MvpFormDialog>

      <MvpToast message={toast} />
    </div>
  );
}
