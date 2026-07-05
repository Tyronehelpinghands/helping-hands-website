"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_OWNERS, type Lead } from "@/data/leadsMockData";
import { formatLeadCurrency } from "@/lib/leads-utils";

const pipelineStages = [
  { id: "nieuw", label: "Nieuw" },
  { id: "contact", label: "Contact" },
  { id: "offerte", label: "Offerte" },
  { id: "onderhandeling", label: "Onderhandeling" },
];

type ConvertToDealModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onConvert: (deal: {
    dealName: string;
    bedrijf: string;
    contact: string;
    waarde: number;
    sluitdatum: string;
    fase: string;
    eigenaar: string;
  }) => Promise<void>;
};

export default function ConvertToDealModal({
  open,
  onOpenChange,
  lead,
  onConvert,
}: ConvertToDealModalProps) {
  const [dealName, setDealName] = useState("");
  const [waarde, setWaarde] = useState("");
  const [sluitdatum, setSluitdatum] = useState("");
  const [fase, setFase] = useState("nieuw");
  const [eigenaar, setEigenaar] = useState(LEAD_OWNERS[0]);
  const [saving, setSaving] = useState(false);

  function resetFromLead() {
    if (!lead) return;
    setDealName(`${lead.bedrijf} — deal`);
    setWaarde(String(lead.waarde || ""));
    setEigenaar(lead.eigenaar);
    setFase("nieuw");
    setSluitdatum("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!lead) return;

    setSaving(true);
    try {
      await onConvert({
        dealName: dealName.trim() || `${lead.bedrijf} — deal`,
        bedrijf: lead.bedrijf,
        contact: lead.contact,
        waarde: waarde.trim() ? Number(waarde) : lead.waarde,
        sluitdatum,
        fase,
        eigenaar,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) resetFromLead();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">Omzetten naar deal</DialogTitle>
          <DialogDescription>
            {lead
              ? `Maak een deal aan voor ${lead.bedrijf} (${formatLeadCurrency(lead.waarde)}).`
              : "Selecteer eerst een lead."}
          </DialogDescription>
        </DialogHeader>

        {lead && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dealName">Dealnaam</Label>
              <Input
                id="dealName"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Bedrijf</Label>
                <Input value={lead.bedrijf} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Contactpersoon</Label>
                <Input value={lead.contact} disabled />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="waarde">Waarde (€)</Label>
                <Input
                  id="waarde"
                  type="number"
                  min="0"
                  value={waarde}
                  onChange={(e) => setWaarde(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sluitdatum">Verwachte sluitdatum</Label>
                <Input
                  id="sluitdatum"
                  type="date"
                  value={sluitdatum}
                  onChange={(e) => setSluitdatum(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Pipeline fase</Label>
                <Select value={fase} onValueChange={(v) => v && setFase(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Eigenaar</Label>
                <Select value={eigenaar} onValueChange={(v) => v && setEigenaar(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_OWNERS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Deal aanmaken
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
