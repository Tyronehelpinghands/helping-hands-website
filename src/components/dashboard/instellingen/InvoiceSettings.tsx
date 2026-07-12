"use client";

import { useState } from "react";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
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
import type { InvoiceSettings } from "@/lib/settings";

type Props = {
  settings: InvoiceSettings;
  onChange: (settings: InvoiceSettings) => void;
};

export default function InvoiceSettingsPanel({ settings, onChange }: Props) {
  const [checking, setChecking] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  function update<K extends keyof InvoiceSettings>(key: K, value: InvoiceSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  async function checkMoneybirdStatus() {
    setChecking(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/moneybird/status");
      const data = (await res.json()) as {
        ok?: boolean;
        configured?: boolean;
        message?: string;
      };
      setStatusMsg(
        data.message ??
          (data.configured
            ? "Moneybird is server-side geconfigureerd."
            : "Moneybird configuratie ontbreekt."),
      );
      if (data.configured) {
        update("moneybirdEnabled", true);
      }
    } catch {
      setStatusMsg("Statuscontrole mislukt.");
    } finally {
      setChecking(false);
    }
  }

  async function fetchContacts() {
    setContactsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/moneybird/contacts");
      const data = (await res.json()) as {
        ok?: boolean;
        contacts?: unknown[];
        error?: string;
        message?: string;
      };
      if (data.ok && Array.isArray(data.contacts)) {
        setStatusMsg(`${data.contacts.length} Moneybird-contacten opgehaald.`);
      } else {
        setStatusMsg(data.error ?? data.message ?? "Contacten ophalen mislukt.");
      }
    } catch {
      setStatusMsg("Contacten ophalen mislukt.");
    } finally {
      setContactsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Facturatie-instellingen
          </CardTitle>
          <CardDescription>
            Betaaltermijnen, btw, valuta en Moneybird-standaardwaarden.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="paymentTerm">Betaaltermijn (dagen)</Label>
            <Input
              id="paymentTerm"
              type="number"
              min="0"
              value={settings.paymentTermDays}
              onChange={(e) =>
                update("paymentTermDays", parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoiceVat">Standaard btw (%)</Label>
            <Input
              id="invoiceVat"
              type="number"
              step="0.1"
              min="0"
              value={settings.defaultVatRate}
              onChange={(e) =>
                update("defaultVatRate", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Valuta</Label>
            <Input id="currency" value={settings.defaultCurrency} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prefix">Factuurprefix</Label>
            <Input
              id="prefix"
              value={settings.invoicePrefix}
              onChange={(e) => update("invoicePrefix", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ledgerId">Moneybird standaard grootboekrekening ID</Label>
            <Input
              id="ledgerId"
              value={settings.defaultLedgerAccountId ?? ""}
              onChange={(e) => update("defaultLedgerAccountId", e.target.value)}
              placeholder="Technisch ID"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="taxId">Moneybird standaard btw-tarief ID</Label>
            <Input
              id="taxId"
              value={settings.defaultTaxRateId ?? ""}
              onChange={(e) => update("defaultTaxRateId", e.target.value)}
              placeholder="Technisch ID"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#0B1F4D] sm:col-span-2">
            <input
              type="checkbox"
              checked={settings.moneybirdEnabled}
              onChange={(e) => update("moneybirdEnabled", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Moneybird koppeling actief (demo)
          </label>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="text-sm text-amber-900">
          Moneybird IDs zijn technische instellingen. Pas deze alleen aan als je zeker
          weet welke grootboekrekening en btw-code gebruikt moeten worden.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={checkMoneybirdStatus}
          disabled={checking}
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Moneybird status controleren
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={fetchContacts}
          disabled={contactsLoading}
        >
          {contactsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Moneybird contacten ophalen
        </Button>
        <Button
          type="button"
          variant="outline"
          render={
            <a
              href="https://moneybird.com"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <ExternalLink className="h-4 w-4" />
          Open Moneybird
        </Button>
      </div>

      {statusMsg && <p className="text-sm text-[#101828]/70">{statusMsg}</p>}
    </div>
  );
}
