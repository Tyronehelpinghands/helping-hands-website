"use client";

import { useState } from "react";
import { Copy, Eye, Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoMessageTemplates } from "@/lib/messages";
import type { SettingsTemplate } from "@/lib/settings";

type Props = {
  templates: SettingsTemplate[];
  onChange: (templates: SettingsTemplate[]) => void;
};

function templateFromDemo(t: (typeof demoMessageTemplates)[0]): SettingsTemplate {
  return {
    id: t.id,
    title: t.title,
    audience: t.audience,
    subject: t.subject,
    body: t.body,
    variables: t.variables,
  };
}

export default function TemplateSettingsPanel({ templates, onChange }: Props) {
  const [editing, setEditing] = useState<SettingsTemplate | null>(null);
  const [preview, setPreview] = useState<SettingsTemplate | null>(null);

  function updateTemplate(updated: SettingsTemplate) {
    onChange(templates.map((t) => (t.id === updated.id ? updated : t)));
    setEditing(null);
  }

  function duplicateTemplate(tpl: SettingsTemplate) {
    const copy: SettingsTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      title: `${tpl.title} (kopie)`,
    };
    onChange([copy, ...templates]);
  }

  function resetTemplates() {
    onChange(demoMessageTemplates.map(templateFromDemo));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          Standaardtemplates voor crew, opdrachtgevers en opvolging. Geen echte
          berichten versturen.
        </p>
        <Button type="button" size="sm" variant="outline" onClick={resetTemplates}>
          <RotateCcw className="h-4 w-4" />
          Templates resetten
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-[#0B1F4D]">
                {tpl.title}
              </CardTitle>
              <CardDescription>
                {tpl.audience} · {tpl.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {tpl.variables.map((v) => (
                  <span
                    key={v}
                    className="rounded-md border border-[#F28C28]/30 bg-[#F28C28]/10 px-2 py-0.5 text-xs font-mono text-[#0B1F4D]"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing({ ...tpl })}
                >
                  <Pencil className="h-4 w-4" />
                  Bewerken
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => duplicateTemplate(tpl)}
                >
                  <Copy className="h-4 w-4" />
                  Dupliceren
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPreview(tpl)}
                >
                  <Eye className="h-4 w-4" />
                  Bekijken
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1F4D]">Template bewerken</DialogTitle>
                <DialogDescription>
                  Wijzigingen worden lokaal opgeslagen (demo).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tplTitle">Titel</Label>
                  <Input
                    id="tplTitle"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tplSubject">Onderwerp</Label>
                  <Input
                    id="tplSubject"
                    value={editing.subject}
                    onChange={(e) =>
                      setEditing({ ...editing, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tplBody">Body</Label>
                  <textarea
                    id="tplBody"
                    value={editing.body}
                    onChange={(e) =>
                      setEditing({ ...editing, body: e.target.value })
                    }
                    rows={10}
                    className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 font-mono text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
                <Button type="button" onClick={() => updateTemplate(editing)}>
                  Opslaan
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1F4D]">{preview.title}</DialogTitle>
                <DialogDescription>{preview.audience}</DialogDescription>
              </DialogHeader>
              <p className="font-medium text-[#0B1F4D]">{preview.subject}</p>
              <pre className="whitespace-pre-wrap rounded-xl border border-slate-200/80 bg-[#F5F7FA]/60 p-4 text-sm">
                {preview.body}
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
