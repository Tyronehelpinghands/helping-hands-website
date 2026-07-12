"use client";

import { useEffect, useState } from "react";
import { Eye, FileText, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createMessageFromForm,
  demoMessageTemplates,
  MESSAGE_AUDIENCES,
  MESSAGE_CHANNELS,
  MESSAGE_MODULES,
  MESSAGE_PRIORITIES,
  type MessageFormData,
  type MessageItem,
  type MessageTemplate,
} from "@/lib/messages";

const emptyForm: MessageFormData = {
  channel: "E-mail",
  audience: "Crew",
  recipientName: "",
  recipientEmail: "",
  recipientPhone: "",
  subject: "",
  body: "",
  relatedProject: "",
  relatedClient: "",
  relatedModule: "",
  priority: "Normaal",
  tags: "",
  scheduledAt: "",
  notes: "",
  status: "Concept",
};

type MessageComposerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: MessageItem) => void;
  onSendAttempt?: () => void;
  initialData?: Partial<MessageFormData>;
  existingId?: string;
  existingCreatedAt?: string;
  mode?: "create" | "edit";
};

export default function MessageComposer({
  open,
  onOpenChange,
  onSave,
  onSendAttempt,
  initialData,
  existingId,
  existingCreatedAt,
  mode = "create",
}: MessageComposerProps) {
  const [form, setForm] = useState<MessageFormData>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
      setSelectedTemplate("");
      setShowPreview(false);
    }
  }, [open, initialData]);

  function update<K extends keyof MessageFormData>(field: K, value: MessageFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function applyTemplate(tpl: MessageTemplate) {
    update("subject", tpl.subject);
    update("body", tpl.body);
    update("channel", tpl.channel);
    update("audience", tpl.audience);
    setSelectedTemplate(tpl.id);
  }

  function handleTemplateSelect(id: string | null) {
    if (!id) return;
    const tpl = demoMessageTemplates.find((t) => t.id === id);
    if (tpl) applyTemplate(tpl);
    setSelectedTemplate(id);
  }

  function saveWithStatus(status: MessageFormData["status"]) {
    if (!form.subject.trim() || !form.recipientName.trim()) return;
    setSaving(true);
    try {
      const message = createMessageFromForm(
        { ...form, status },
        existingId,
        existingCreatedAt,
      );
      onSave(message);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveWithStatus("Concept");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {mode === "edit" ? "Bericht bewerken" : "Nieuw bericht"}
          </DialogTitle>
          <DialogDescription>
            Bereid communicatie voor. Verzenden wordt later gekoppeld aan Gmail, WhatsApp of HubSpot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Template kiezen</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Kies een template (optioneel)" />
              </SelectTrigger>
              <SelectContent>
                {demoMessageTemplates.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Kanaal</Label>
              <Select
                value={form.channel}
                onValueChange={(v) => {
                  if (v) update("channel", v as MessageFormData["channel"]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Doelgroep</Label>
              <Select
                value={form.audience}
                onValueChange={(v) => {
                  if (v) update("audience", v as MessageFormData["audience"]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="recipientName">Ontvanger naam *</Label>
              <Input
                id="recipientName"
                value={form.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recipientEmail">Ontvanger e-mail</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={form.recipientEmail}
                onChange={(e) => update("recipientEmail", e.target.value)}
                placeholder="demo@example.nl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recipientPhone">Ontvanger telefoon</Label>
              <Input
                id="recipientPhone"
                value={form.recipientPhone}
                onChange={(e) => update("recipientPhone", e.target.value)}
                placeholder="+31 6 0000 0000"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Onderwerp *</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Bericht *</Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowPreview((p) => !p)}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Verberg preview" : "Preview"}
              </Button>
            </div>
            <textarea
              id="body"
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              rows={8}
              required
              className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            {showPreview && (
              <pre className="whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#F5F7FA]/60 p-4 text-sm text-[#0B1F4D]">
                {form.body || "Geen inhoud"}
              </pre>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="relatedProject">Project</Label>
              <Input
                id="relatedProject"
                value={form.relatedProject}
                onChange={(e) => update("relatedProject", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="relatedClient">Klant</Label>
              <Input
                id="relatedClient"
                value={form.relatedClient}
                onChange={(e) => update("relatedClient", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gerelateerde module</Label>
              <Select
                value={form.relatedModule || "none"}
                onValueChange={(v) => update("relatedModule", !v || v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Geen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Geen</SelectItem>
                  {MESSAGE_MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Prioriteit</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => {
                  if (v) update("priority", v as MessageFormData["priority"]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="crew-oproep, briefing"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scheduledAt">Gepland verzenden op</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => update("scheduledAt", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Interne notitie</Label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={2}
              placeholder="Alleen zichtbaar voor intern team"
              className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="submit" variant="outline" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Opslaan als concept
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => saveWithStatus("Klaar om te versturen")}
            >
              Klaar om te versturen
            </Button>
            <Button
              type="button"
              disabled
              title="Echt verzenden wordt later gekoppeld aan Gmail, WhatsApp Business of HubSpot."
              onClick={onSendAttempt}
            >
              <Send className="h-4 w-4" />
              Verzenden — Binnenkort
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
