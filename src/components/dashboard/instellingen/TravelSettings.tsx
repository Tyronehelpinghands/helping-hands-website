"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
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
import type { TravelSettings } from "@/lib/settings";

type Props = {
  settings: TravelSettings;
  onChange: (settings: TravelSettings) => void;
};

export default function TravelSettingsPanel({ settings, onChange }: Props) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  function update<K extends keyof TravelSettings>(key: K, value: TravelSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  async function testGoogleMaps() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/kilometers/status");
      const data = (await res.json()) as {
        ok?: boolean;
        configured?: boolean;
        message?: string;
        error?: string;
      };
      if (data.ok) {
        setTestResult(data.message ?? "Google Maps koppeling is beschikbaar.");
      } else {
        setTestResult(
          data.message ?? data.error ?? "Koppeling niet beschikbaar.",
        );
      }
    } catch {
      setTestResult("Google Maps statuscontrole mislukt.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Reiskosten
          </CardTitle>
          <CardDescription>
            Kilometers worden later via Google Maps berekend. API-key blijft
            server-side in Vercel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="travelRate">Standaard reiskostenvergoeding per km (€)</Label>
            <Input
              id="travelRate"
              type="number"
              step="0.01"
              min="0"
              value={settings.defaultTravelRatePerKm}
              onChange={(e) =>
                update("defaultTravelRatePerKm", parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maxKm">Maximale km zonder akkoord</Label>
            <Input
              id="maxKm"
              type="number"
              min="0"
              value={settings.maxKmWithoutApproval}
              onChange={(e) =>
                update("maxKmWithoutApproval", parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="origin">Standaard vertrekadres</Label>
            <Input
              id="origin"
              value={settings.defaultOriginAddress}
              onChange={(e) => update("defaultOriginAddress", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#0B1F4D]">
            <input
              type="checkbox"
              checked={settings.calculateReturnTripByDefault}
              onChange={(e) =>
                update("calculateReturnTripByDefault", e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            Retour standaard berekenen
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0B1F4D]">
            <input
              type="checkbox"
              checked={settings.googleMapsEnabled}
              onChange={(e) => update("googleMapsEnabled", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Google Maps kilometerberekening
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0B1F4D] sm:col-span-2">
            <input
              type="checkbox"
              checked={settings.publicTransportOnDeclaration}
              onChange={(e) =>
                update("publicTransportOnDeclaration", e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            OV-kosten op declaratie toestaan
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={testGoogleMaps} disabled={testing}>
          {testing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          Google Maps koppeling testen
        </Button>
        {testResult && (
          <p className="text-sm text-[#101828]/70">{testResult}</p>
        )}
      </div>
    </div>
  );
}
