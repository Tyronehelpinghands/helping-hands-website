"use client";

import { AlertTriangle, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsStatusBadge from "@/components/dashboard/instellingen/SettingsStatusBadge";
import {
  SECURITY_CHECKLIST,
  SECURITY_STATUS_CARDS,
} from "@/lib/settings";

export default function SecuritySettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/60 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
        <p className="text-sm text-red-900">
          Dit dashboard is nu een frontend/demo-omgeving. Voor echte bedrijfsdata
          moet eerst auth, rollen en databasebeveiliging worden toegevoegd.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECURITY_STATUS_CARDS.map((card) => (
          <Card
            key={card.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold text-[#0B1F4D]">
                  {card.label}
                </CardTitle>
                <SettingsStatusBadge status={card.status} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#173A8A]" />
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Security checklist
            </CardTitle>
          </div>
          <CardDescription>
            Richtlijnen voor veilige configuratie van API-koppelingen en toegang.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {SECURITY_CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#0B1F4D]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
