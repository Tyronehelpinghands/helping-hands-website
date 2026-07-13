"use client";

import { useState } from "react";
import { Save } from "lucide-react";
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
import type { ClientBriefing } from "@/lib/clientPortal";
import { DEMO_CLIENT_PROJECTS } from "@/lib/clientPortal";

export default function ClientBriefingForm({
  onSubmit,
  initialProjectId,
}: {
  onSubmit?: (briefing: ClientBriefing) => void;
  initialProjectId?: string;
}) {
  const [form, setForm] = useState({
    projectId: initialProjectId ?? "",
    contactPerson: "",
    contactPhone: "",
    locationAddress: "",
    meetingPoint: "",
    parkingInfo: "",
    loadingInfo: "",
    clothing: "",
    safetyInfo: "",
    certificatesRequired: "",
    breakAgreements: "",
    notes: "",
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const project = DEMO_CLIENT_PROJECTS.find((p) => p.id === form.projectId);
    const briefing: ClientBriefing = {
      id: `brief-${Date.now()}`,
      projectId: form.projectId,
      projectName: project?.projectName ?? "Onbekend project",
      contactPerson: form.contactPerson,
      contactPhone: form.contactPhone || undefined,
      locationAddress: form.locationAddress,
      meetingPoint: form.meetingPoint,
      clothing: form.clothing,
      parkingInfo: form.parkingInfo || undefined,
      loadingInfo: form.loadingInfo || undefined,
      safetyInfo: form.safetyInfo || undefined,
      certificatesRequired: form.certificatesRequired || undefined,
      breakAgreements: form.breakAgreements || undefined,
      notes: form.notes || undefined,
      status: "Ingediend",
      updatedAt: new Date().toISOString(),
    };
    onSubmit?.(briefing);
    setSaved(true);
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">Briefing invullen</CardTitle>
        <CardDescription>
          Geef locatie-, veiligheids- en praktische informatie door aan de crew.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select
              value={form.projectId}
              onValueChange={(v) => setForm((f) => ({ ...f, projectId: v ?? "" }))}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Kies project" />
              </SelectTrigger>
              <SelectContent>
                {DEMO_CLIENT_PROJECTS.filter(
                  (p) => p.status !== "Afgerond" && p.status !== "Geannuleerd",
                ).map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contactpersoon locatie *</Label>
              <Input
                id="contactPerson"
                required
                value={form.contactPerson}
                onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefoon contactpersoon</Label>
              <Input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="locationAddress">Exact adres *</Label>
              <Input
                id="locationAddress"
                required
                value={form.locationAddress}
                onChange={(e) => setForm((f) => ({ ...f, locationAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="meetingPoint">Meeting point *</Label>
              <Input
                id="meetingPoint"
                required
                value={form.meetingPoint}
                onChange={(e) => setForm((f) => ({ ...f, meetingPoint: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingInfo">Parkeerinformatie</Label>
              <Input
                id="parkingInfo"
                value={form.parkingInfo}
                onChange={(e) => setForm((f) => ({ ...f, parkingInfo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadingInfo">Laad/los informatie</Label>
              <Input
                id="loadingInfo"
                value={form.loadingInfo}
                onChange={(e) => setForm((f) => ({ ...f, loadingInfo: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clothing">Kledingvoorschrift *</Label>
              <Input
                id="clothing"
                required
                value={form.clothing}
                onChange={(e) => setForm((f) => ({ ...f, clothing: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="safetyInfo">PBM/veiligheidsregels</Label>
              <textarea
                id="safetyInfo"
                rows={2}
                value={form.safetyInfo}
                onChange={(e) => setForm((f) => ({ ...f, safetyInfo: e.target.value }))}
                className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificates">Certificaten nodig</Label>
              <Input
                id="certificates"
                value={form.certificatesRequired}
                onChange={(e) =>
                  setForm((f) => ({ ...f, certificatesRequired: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakAgreements">Pauze-afspraken</Label>
              <Input
                id="breakAgreements"
                value={form.breakAgreements}
                onChange={(e) => setForm((f) => ({ ...f, breakAgreements: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Bijzonderheden</Label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bijlage upload</Label>
            <Input type="file" disabled className="cursor-not-allowed opacity-60" />
            <p className="text-xs text-slate-500">Binnenkort</p>
          </div>

          {saved ? (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Briefing opgeslagen in demo. Later wordt dit gekoppeld aan interne planning.
            </p>
          ) : null}

          <Button type="submit" className="bg-[#173A8A] hover:bg-[#0B1F4D]">
            <Save className="mr-2 h-4 w-4" />
            Briefing opslaan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
