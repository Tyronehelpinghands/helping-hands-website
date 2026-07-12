"use client";

import { Plus, RotateCcw } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateRateMargin,
  formatEuro,
  formatPercent,
  type RateSettings,
  type RoleRate,
} from "@/lib/settings";

type Props = {
  settings: RateSettings;
  onChange: (settings: RateSettings) => void;
  onSave?: () => void;
};

export default function RateSettingsPanel({ settings, onChange, onSave }: Props) {
  function updateRole(index: number, patch: Partial<RoleRate>) {
    const roles = settings.roles.map((r, i) =>
      i === index ? { ...r, ...patch } : r,
    );
    onChange({ ...settings, roles });
  }

  function addRole() {
    onChange({
      ...settings,
      roles: [
        ...settings.roles,
        {
          role: "Nieuwe functie",
          clientRate: settings.defaultClientHourlyRate,
          crewRate: settings.defaultCrewHourlyRate,
          active: true,
        },
      ],
    });
  }

  function resetRates() {
    onChange({
      ...settings,
      defaultClientHourlyRate: 35.0,
      defaultCrewHourlyRate: 25.0,
      vatRate: 21,
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Standaard tarieven
          </CardTitle>
          <CardDescription>
            Basis klant- en crewtarieven plus btw-percentage.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="defaultClient">Standaard klanttarief (€/u)</Label>
            <Input
              id="defaultClient"
              type="number"
              step="0.01"
              min="0"
              value={settings.defaultClientHourlyRate}
              onChange={(e) =>
                onChange({
                  ...settings,
                  defaultClientHourlyRate: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="defaultCrew">Standaard crewtarief (€/u)</Label>
            <Input
              id="defaultCrew"
              type="number"
              step="0.01"
              min="0"
              value={settings.defaultCrewHourlyRate}
              onChange={(e) =>
                onChange({
                  ...settings,
                  defaultCrewHourlyRate: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vatRate">Btw-percentage (%)</Label>
            <Input
              id="vatRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.vatRate}
              onChange={(e) =>
                onChange({
                  ...settings,
                  vatRate: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Tarieven per functie
            </CardTitle>
            <CardDescription>
              Klanttarieven per rol met marge-indicatie.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={addRole}>
              <Plus className="h-4 w-4" />
              Functie toevoegen
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={resetRates}>
              <RotateCcw className="h-4 w-4" />
              Tarief resetten
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="-mx-4 overflow-x-auto sm:-mx-6">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Functie</TableHead>
                  <TableHead>Klanttarief</TableHead>
                  <TableHead>Crewtarief</TableHead>
                  <TableHead>Marge</TableHead>
                  <TableHead>Actief</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.roles.map((role, index) => {
                  const margin = calculateRateMargin(
                    role.clientRate,
                    role.crewRate ?? settings.defaultCrewHourlyRate,
                  );
                  return (
                    <TableRow key={`${role.role}-${index}`}>
                      <TableCell className="pl-6">
                        <Input
                          value={role.role}
                          onChange={(e) => updateRole(index, { role: e.target.value })}
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={role.clientRate}
                          onChange={(e) =>
                            updateRole(index, {
                              clientRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={role.crewRate ?? ""}
                          placeholder={String(settings.defaultCrewHourlyRate)}
                          onChange={(e) =>
                            updateRole(index, {
                              crewRate: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-[#101828]/70">
                        {margin ? (
                          <>
                            {formatEuro(margin.margin)} (
                            {formatPercent(margin.marginPercent)})
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={role.active}
                          onChange={(e) =>
                            updateRole(index, { active: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {onSave && (
            <Button type="button" size="sm" className="mt-4" onClick={onSave}>
              Tarieven opslaan
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
