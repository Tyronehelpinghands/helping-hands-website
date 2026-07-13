"use client";

import { useState } from "react";
import { Save, Send } from "lucide-react";
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
import type { ClientRequest } from "@/lib/clientPortal";
import { CLIENT_DEPLOYMENT_TYPES, CLIENT_ROLE_OPTIONS } from "@/lib/clientPortal";

type RequestFormData = {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  numberOfPeople: string;
  rolesNeeded: string[];
  deploymentType: string;
  clothing: string;
  onSiteContact: string;
  onSitePhone: string;
  notes: string;
  urgent: boolean;
};

const emptyForm: RequestFormData = {
  title: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  locationName: "",
  locationAddress: "",
  numberOfPeople: "",
  rolesNeeded: [],
  deploymentType: "",
  clothing: "",
  onSiteContact: "",
  onSitePhone: "",
  notes: "",
  urgent: false,
};

function generateId() {
  return `req-${Date.now()}`;
}

export default function ClientRequestForm({
  onSubmit,
  onSaveDraft,
}: {
  onSubmit: (request: ClientRequest) => void;
  onSaveDraft?: (request: ClientRequest) => void;
}) {
  const [form, setForm] = useState<RequestFormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  function buildRequest(status: ClientRequest["status"]): ClientRequest {
    return {
      id: generateId(),
      title: form.title,
      requestedDate: new Date().toISOString().slice(0, 10),
      eventDate: form.eventDate,
      locationName: form.locationName,
      locationAddress: form.locationAddress || undefined,
      rolesNeeded: form.rolesNeeded,
      numberOfPeople: Number(form.numberOfPeople) || 0,
      startTime: form.startTime,
      endTime: form.endTime,
      deploymentType: form.deploymentType || undefined,
      clothing: form.clothing || undefined,
      onSiteContact: form.onSiteContact || undefined,
      onSitePhone: form.onSitePhone || undefined,
      urgent: form.urgent,
      notes: form.notes || undefined,
      status,
      createdAt: new Date().toISOString(),
    };
  }

  function toggleRole(role: string) {
    setForm((f) => ({
      ...f,
      rolesNeeded: f.rolesNeeded.includes(role)
        ? f.rolesNeeded.filter((r) => r !== role)
        : [...f.rolesNeeded, role],
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const request = buildRequest("Ingediend");
    onSubmit(request);
    setSubmitted(true);
    setForm(emptyForm);
  }

  function handleSaveDraft() {
    const request = buildRequest("Concept");
    onSaveDraft?.(request);
    setDraftSaved(true);
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">Nieuwe personeelsaanvraag</CardTitle>
        <CardDescription>
          Vul de gegevens in. In demo-modus wordt de aanvraag lokaal opgeslagen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Projectnaam / titel *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Datum evenement *</Label>
              <Input
                id="eventDate"
                type="date"
                required
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deploymentType">Type inzet</Label>
              <Select
                value={form.deploymentType}
                onValueChange={(v) => setForm((f) => ({ ...f, deploymentType: v ?? "" }))}
              >
                <SelectTrigger id="deploymentType">
                  <SelectValue placeholder="Kies type" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_DEPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Starttijd *</Label>
              <Input
                id="startTime"
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Eindtijd *</Label>
              <Input
                id="endTime"
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationName">Locatie *</Label>
              <Input
                id="locationName"
                required
                value={form.locationName}
                onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationAddress">Locatie adres</Label>
              <Input
                id="locationAddress"
                value={form.locationAddress}
                onChange={(e) => setForm((f) => ({ ...f, locationAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Aantal personen *</Label>
              <Input
                id="numberOfPeople"
                type="number"
                min={1}
                required
                value={form.numberOfPeople}
                onChange={(e) => setForm((f) => ({ ...f, numberOfPeople: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clothing">Kledingvoorschrift</Label>
              <Input
                id="clothing"
                value={form.clothing}
                onChange={(e) => setForm((f) => ({ ...f, clothing: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onSiteContact">Contactpersoon op locatie</Label>
              <Input
                id="onSiteContact"
                value={form.onSiteContact}
                onChange={(e) => setForm((f) => ({ ...f, onSiteContact: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onSitePhone">Telefoon contactpersoon</Label>
              <Input
                id="onSitePhone"
                value={form.onSitePhone}
                onChange={(e) => setForm((f) => ({ ...f, onSitePhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Functies nodig</Label>
            <div className="flex flex-wrap gap-2">
              {CLIENT_ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    form.rolesNeeded.includes(role)
                      ? "border-[#173A8A] bg-[#173A8A] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#173A8A]/30"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Opmerkingen</Label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-[#0B1F4D]">
            <input
              type="checkbox"
              checked={form.urgent}
              onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))}
            />
            Spoedaanvraag
          </label>

          {submitted ? (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Aanvraag ingediend in demo. Later wordt dit gekoppeld aan Supabase, HubSpot en interne
              planning.
            </p>
          ) : null}
          {draftSaved ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Concept lokaal opgeslagen.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="bg-[#173A8A] hover:bg-[#0B1F4D]">
              <Send className="mr-2 h-4 w-4" />
              Aanvraag indienen
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Concept opslaan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
