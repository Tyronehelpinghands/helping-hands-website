"use client";

import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientProfile } from "@/lib/clientPortal";
import { DEMO_CLIENT_PROFILE } from "@/lib/clientPortal";

const CUSTOMER_TYPES = [
  "Evenementenbureau",
  "Horeca",
  "Productie",
  "Restaurant",
  "Locatie",
  "Overig",
] as const;

export default function ClientProfileCard({
  profile = DEMO_CLIENT_PROFILE,
}: {
  profile?: ClientProfile;
}) {
  const [form, setForm] = useState({
    companyName: profile.companyName,
    contactName: profile.contactName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address ?? "",
    city: profile.city,
    customerType: profile.customerType,
    billingEmail: profile.billingEmail ?? "",
    projectPreferences: profile.projectPreferences ?? "",
    notes: profile.notes ?? "",
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-slate-200/80 bg-white shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Bedrijfsgegevens</CardTitle>
          <CardDescription>
            Bekijk en bewerk je profiel. Wijzigingen worden lokaal opgeslagen (demo).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyName">Bedrijfsnaam</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contactpersoon</Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerType">Type opdrachtgever</Label>
                <Select
                  value={form.customerType}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      customerType: (v ?? "Overig") as ClientProfile["customerType"],
                    }))
                  }
                >
                  <SelectTrigger id="customerType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Facturatie e-mail</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={form.billingEmail}
                  onChange={(e) => setForm((f) => ({ ...f, billingEmail: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="projectPreferences">Projectvoorkeuren</Label>
                <textarea
                  id="projectPreferences"
                  rows={2}
                  value={form.projectPreferences}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, projectPreferences: e.target.value }))
                  }
                  className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Opmerkingen</Label>
                <textarea
                  id="notes"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
                />
              </div>
            </div>

            {saved ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Profielwijziging lokaal opgeslagen. Later wordt dit ter controle naar Helping Hands
                gestuurd.
              </p>
            ) : null}

            <Button type="submit" className="bg-[#173A8A] hover:bg-[#0B1F4D]">
              <Save className="mr-2 h-4 w-4" />
              Opslaan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-[#0B1F4D]">
            <Building2 className="h-5 w-5 text-[#F28C28]" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-slate-500">Status</p>
            <ClientStatusBadge status={profile.status} className="mt-1" />
          </div>
          <div>
            <p className="text-slate-500">Klanttype</p>
            <p className="font-semibold text-[#0B1F4D]">{profile.customerType}</p>
          </div>
          <p className="text-xs text-slate-500">
            TODO: Supabase client_profiles koppelen met Row Level Security per opdrachtgever.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
