"use client";

import { useState } from "react";
import { Car, CreditCard, FileCheck, Save } from "lucide-react";
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
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeProfile } from "@/lib/employeePortal";
import { DEMO_EMPLOYEE_PROFILE } from "@/lib/employeePortal";

export default function EmployeeProfileCard({
  profile = DEMO_EMPLOYEE_PROFILE,
}: {
  profile?: EmployeeProfile;
}) {
  const [form, setForm] = useState({
    displayName: profile.displayName,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    address: profile.address ?? "",
    hasDriversLicense: profile.hasDriversLicense,
    hasCar: profile.hasCar,
    planningNotes: profile.planningNotes ?? "",
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
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Persoonlijke gegevens</CardTitle>
          <CardDescription>
            Bewerk je contactgegevens. Wijzigingen worden lokaal opgeslagen (demo).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Naam</Label>
                <Input
                  id="name"
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
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
                <Label htmlFor="city">Woonplaats</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasDriversLicense}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hasDriversLicense: e.target.checked }))
                  }
                  className="rounded border-slate-300"
                />
                Rijbewijs
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasCar}
                  onChange={(e) => setForm((f) => ({ ...f, hasCar: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                Eigen auto
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notities voor planning</Label>
              <Input
                id="notes"
                value={form.planningNotes}
                onChange={(e) => setForm((f) => ({ ...f, planningNotes: e.target.value }))}
              />
            </div>

            {saved ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Profielwijziging lokaal opgeslagen. Later wordt dit ter controle naar
                administratie gestuurd.
              </p>
            ) : null}

            <Button type="submit" className="bg-[#173A8A] hover:bg-[#0B1F4D]">
              <Save className="mr-2 h-4 w-4" />
              Opslaan
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black text-[#0B1F4D]">Dienstverband</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="font-semibold">{profile.employmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <EmployeeStatusBadge status={profile.status} />
            </div>
            <div>
              <p className="text-slate-500">Rollen</p>
              <p className="mt-1 font-medium text-[#0B1F4D]">{profile.roles.join(", ")}</p>
            </div>
            <div>
              <p className="text-slate-500">Skills</p>
              <p className="mt-1 font-medium text-[#0B1F4D]">{profile.skills.join(", ")}</p>
            </div>
            <div>
              <p className="text-slate-500">Certificaten</p>
              <p className="mt-1 font-medium text-[#0B1F4D]">{profile.certificates.join(", ")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black text-[#0B1F4D]">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-slate-600">
                <CreditCard className="h-4 w-4" />
                IBAN
              </span>
              <EmployeeStatusBadge status={profile.ibanStatus} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-slate-600">
                <FileCheck className="h-4 w-4" />
                Documenten
              </span>
              <EmployeeStatusBadge status={profile.documentStatus} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-slate-600">
                <Car className="h-4 w-4" />
                Vervoer
              </span>
              <span className="font-medium">
                {profile.hasDriversLicense ? "Rijbewijs" : "—"}
                {profile.hasCar ? " · Auto" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
