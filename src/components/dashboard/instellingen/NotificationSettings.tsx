"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotificationSettings } from "@/lib/settings";

type Props = {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
};

const TOGGLES: {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "emailNotifications",
    label: "E-mailmeldingen",
    description: "Algemene e-mailnotificaties voor intern team.",
  },
  {
    key: "crewReminders",
    label: "Crew reminders",
    description: "Herinneringen voor crew over shifts en briefings.",
  },
  {
    key: "planningAlerts",
    label: "Planning alerts",
    description: "Meldingen bij wijzigingen in planning en bezetting.",
  },
  {
    key: "invoiceAlerts",
    label: "Facturatie alerts",
    description: "Waarschuwingen bij factuurconcepten en verzending.",
  },
  {
    key: "riskAlerts",
    label: "Risico & acties alerts",
    description: "Meldingen bij openstaande risico's en acties.",
  },
  {
    key: "applicationAlerts",
    label: "Sollicitatie alerts",
    description: "Nieuwe crew-aanmeldingen en opvolging.",
  },
  {
    key: "hoursCheckAlerts",
    label: "Urencontrole alerts",
    description: "Herinneringen voor urencontrole per week.",
  },
  {
    key: "openInvoiceAlerts",
    label: "Openstaande factuur alerts",
    description: "Meldingen bij openstaande of vervallen facturen.",
  },
];

export default function NotificationSettingsPanel({ settings, onChange }: Props) {
  function toggle(key: keyof NotificationSettings) {
    onChange({ ...settings, [key]: !settings[key] });
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Meldingen
          </CardTitle>
          <CardDescription>
            Automatische meldingen worden later gekoppeld aan Gmail, WhatsApp
            Business of interne notificaties.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {TOGGLES.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-4 transition-colors hover:bg-[#F5F7FA]/70"
            >
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={() => toggle(item.key)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <div>
                <p className="font-semibold text-[#0B1F4D]">{item.label}</p>
                <p className="text-sm text-[#101828]/60">{item.description}</p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
