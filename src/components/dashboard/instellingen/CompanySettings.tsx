"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanySettings } from "@/lib/settings";

type Props = {
  settings: CompanySettings;
  onChange: (settings: CompanySettings) => void;
};

export default function CompanySettingsPanel({ settings, onChange }: Props) {
  function update<K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Bedrijfsgegevens
          </CardTitle>
          <CardDescription>
            Deze gegevens worden later gebruikt voor facturen, offertes, e-mails en
            dashboarddocumenten.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Bedrijfsnaam</Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tradeName">Handelsnaam</Label>
            <Input
              id="tradeName"
              value={settings.tradeName}
              onChange={(e) => update("tradeName", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kvkNumber">KvK-nummer</Label>
            <Input
              id="kvkNumber"
              value={settings.kvkNumber}
              onChange={(e) => update("kvkNumber", e.target.value)}
              placeholder="Optioneel"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vatNumber">BTW-nummer</Label>
            <Input
              id="vatNumber"
              value={settings.vatNumber}
              onChange={(e) => update("vatNumber", e.target.value)}
              placeholder="NL000000000B00"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postalCode">Postcode</Label>
            <Input
              id="postalCode"
              value={settings.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Plaats</Label>
            <Input
              id="city"
              value={settings.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Land</Label>
            <Input
              id="country"
              value={settings.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={settings.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefoon</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+31 ..."
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="defaultEmail">Standaard e-mailadres</Label>
            <Input
              id="defaultEmail"
              type="email"
              value={settings.defaultEmail}
              onChange={(e) => update("defaultEmail", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
