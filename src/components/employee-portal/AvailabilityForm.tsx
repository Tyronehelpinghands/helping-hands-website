"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
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
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeAvailability } from "@/lib/employeePortal";

type AvailabilityFormProps = {
  onSave?: (entry: EmployeeAvailability) => void;
};

export default function AvailabilityForm({ onSave }: AvailabilityFormProps) {
  const [date, setDate] = useState("");
  const [availability, setAvailability] = useState<EmployeeAvailability["availability"]>("Beschikbaar");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("22:00");
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!date) return;

    const entry: EmployeeAvailability = {
      id: `av-local-${Date.now()}`,
      date,
      availability,
      startTime: availability === "Niet beschikbaar" ? undefined : startTime,
      endTime: availability === "Niet beschikbaar" ? undefined : endTime,
      notes: notes || undefined,
    };

    onSave?.(entry);
    setSavedMessage(
      "Beschikbaarheid lokaal opgeslagen. Later wordt dit gekoppeld aan Shiftbase of Supabase.",
    );
    setDate("");
    setNotes("");
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-black text-[#0B1F4D]">
          <CalendarCheck className="h-5 w-5 text-[#173A8A]" />
          Beschikbaarheid doorgeven
        </CardTitle>
        <CardDescription>Kies een dag en geef aan wanneer je kunt werken.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="av-date">Datum</Label>
              <Input
                id="av-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Beschikbaarheid</Label>
              <Select
                value={availability}
                onValueChange={(v) =>
                  setAvailability(v as EmployeeAvailability["availability"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beschikbaar">Beschikbaar</SelectItem>
                  <SelectItem value="Niet beschikbaar">Niet beschikbaar</SelectItem>
                  <SelectItem value="Misschien">Misschien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {availability !== "Niet beschikbaar" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="av-start">Van</Label>
                <Input
                  id="av-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av-end">Tot</Label>
                <Input
                  id="av-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="av-notes">Notitie (optioneel)</Label>
            <Input
              id="av-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijv. alleen avond beschikbaar"
            />
          </div>

          {savedMessage ? (
            <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {savedMessage}
            </p>
          ) : null}

          <Button type="submit" className="min-h-11 w-full bg-[#173A8A] hover:bg-[#0B1F4D] sm:w-auto">
            Opslaan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
