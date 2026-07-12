"use client";

import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmailSettings } from "@/lib/settings";

type Props = {
  settings: EmailSettings;
  onChange: (settings: EmailSettings) => void;
};

export default function EmailSettingsPanel({ settings, onChange }: Props) {
  function update<K extends keyof EmailSettings>(key: K, value: EmailSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  const fields: { key: keyof EmailSettings; label: string; hint: string }[] = [
    {
      key: "generalEmail",
      label: "Algemene vragen / personeelsaanvragen",
      hint: "info@helpinghandsagency.nl",
    },
    {
      key: "crewApplicationsEmail",
      label: "Crew-aanmeldingen / sollicitaties",
      hint: "aanmeldingen@helpinghandsagency.nl",
    },
    {
      key: "planningEmail",
      label: "Planning",
      hint: "planning@helpinghandsagency.nl",
    },
    {
      key: "financeEmail",
      label: "Administratie",
      hint: "administratie@helpinghandsagency.nl",
    },
    {
      key: "salesEmail",
      label: "Sales",
      hint: "sales@helpinghandsagency.nl",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            E-mailadressen
          </CardTitle>
          <CardDescription>
            Mailboxen voor communicatie, planning, administratie en sales.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type="email"
                value={settings[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.hint}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="text-sm text-amber-900">
          Controleer dat deze mailboxen bestaan in Google Workspace voordat je
          automatische verzending activeert.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled title="Binnenkort">
          <Mail className="h-4 w-4" />
          Test e-mail — Binnenkort
        </Button>
        <Button type="button" variant="outline" disabled title="Binnenkort">
          Gmail koppelen — Binnenkort
        </Button>
      </div>
    </div>
  );
}
