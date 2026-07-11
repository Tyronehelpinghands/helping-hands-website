"use client";

import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_CONTACTS } from "@/lib/invoicing";

export type MoneybirdContactOption = {
  id: string;
  company_name: string;
  email: string;
  city: string;
};

type MoneybirdContactSelectorProps = {
  value: string;
  onChange: (contactId: string, contact?: MoneybirdContactOption) => void;
  clientName?: string;
};

export default function MoneybirdContactSelector({
  value,
  onChange,
  clientName,
}: MoneybirdContactSelectorProps) {
  const [contacts, setContacts] = useState<MoneybirdContactOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [useDemo, setUseDemo] = useState(false);
  const [manualId, setManualId] = useState(value);

  useEffect(() => {
    void loadContacts();
  }, []);

  useEffect(() => {
    setManualId(value);
  }, [value]);

  async function loadContacts() {
    setLoading(true);
    try {
      const res = await fetch("/api/moneybird/contacts");
      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.contacts)) {
        setContacts(data.contacts);
        setUseDemo(false);
      } else {
        setContacts([...DEMO_CONTACTS]);
        setUseDemo(true);
      }
    } catch {
      setContacts([...DEMO_CONTACTS]);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  }

  const filtered = clientName
    ? contacts.filter((c) =>
        c.company_name.toLowerCase().includes(clientName.toLowerCase()),
      )
    : contacts;

  const options = filtered.length > 0 ? filtered : contacts;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Moneybird contact</Label>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-[#101828]/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Contacten laden…
          </div>
        ) : (
          <Select
            value={value || undefined}
            onValueChange={(v) => {
              const contact = options.find((c) => c.id === v);
              onChange(v ?? "", contact);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer contact" />
            </SelectTrigger>
            <SelectContent>
              {options.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.company_name} · {c.email} · {c.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {useDemo && (
          <p className="text-xs text-[#101828]/55">
            Demo-contacten — Moneybird API niet bereikbaar of niet geconfigureerd.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="manualContactId">Of handmatig contact ID</Label>
        <Input
          id="manualContactId"
          value={manualId}
          onChange={(e) => {
            setManualId(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Moneybird contact_id"
        />
      </div>

      <Button type="button" size="sm" variant="outline" disabled className="opacity-60">
        <UserPlus className="h-4 w-4" />
        Nieuw contact maken — Binnenkort
      </Button>
    </div>
  );
}
