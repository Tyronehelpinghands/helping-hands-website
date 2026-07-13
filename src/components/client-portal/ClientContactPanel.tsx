"use client";

import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
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
import { DEMO_CLIENT_PROJECTS } from "@/lib/clientPortal";

const CONTACT_CHANNELS = [
  {
    title: "Algemeen",
    email: "info@helpinghandsagency.nl",
    description: "Voor algemene vragen over samenwerking.",
  },
  {
    title: "Planning",
    email: "info@helpinghandsagency.nl",
    description: "Voor aanvragen, planning en briefings.",
  },
  {
    title: "Administratie",
    email: "administratie@helpinghandsagency.nl",
    description: "Voor facturen en administratieve zaken.",
  },
  {
    title: "Sales",
    email: "sales@helpinghandsagency.nl",
    description: "Voor nieuwe samenwerkingen en offertes.",
  },
];

export default function ClientContactPanel({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    projectId: "",
    priority: "Normaal",
  });
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  if (compact) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Contact met planning</CardTitle>
          <CardDescription>Je vaste aanspreekpunten bij Helping Hands.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CONTACT_CHANNELS.slice(0, 2).map((channel) => (
            <div
              key={channel.title}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <p className="font-semibold text-[#0B1F4D]">{channel.title}</p>
              <a
                href={`mailto:${channel.email}`}
                className="text-[#173A8A] hover:underline"
              >
                {channel.email}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Contactgegevens</CardTitle>
          <CardDescription>Neem contact op met het juiste team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {CONTACT_CHANNELS.map((channel) => (
            <div
              key={channel.title}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="font-bold text-[#0B1F4D]">{channel.title}</p>
              <p className="mt-1 text-sm text-slate-600">{channel.description}</p>
              <a
                href={`mailto:${channel.email}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#173A8A] hover:underline"
              >
                <Mail className="h-4 w-4" />
                {channel.email}
              </a>
            </div>
          ))}
          <p className="text-xs text-slate-500">
            <Phone className="mr-1 inline h-3.5 w-3.5" />
            Telefonisch contact op aanvraag via planning.
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Nieuw bericht</CardTitle>
          <CardDescription>Stuur een bericht naar Helping Hands (demo UI).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Onderwerp *</Label>
              <Input
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Bericht *</Label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Gerelateerd project</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(v) => setForm((f) => ({ ...f, projectId: v ?? "" }))}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Optioneel" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_CLIENT_PROJECTS.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioriteit</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((f) => ({ ...f, priority: v ?? "Normaal" }))}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laag">Laag</SelectItem>
                    <SelectItem value="Normaal">Normaal</SelectItem>
                    <SelectItem value="Hoog">Hoog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sent ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Bericht voorbereid. Later wordt dit gekoppeld aan Gmail, HubSpot of WhatsApp
                Business.
              </p>
            ) : null}

            <Button type="submit" className="w-full bg-[#173A8A] hover:bg-[#0B1F4D]">
              <Send className="mr-2 h-4 w-4" />
              Versturen
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
