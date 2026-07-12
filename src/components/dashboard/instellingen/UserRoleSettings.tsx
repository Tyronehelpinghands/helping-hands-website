"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserRole } from "@/lib/settings";

const ALL_PERMISSIONS = [
  "Alles beheren",
  "Financiën bekijken",
  "Facturatie beheren",
  "Instellingen aanpassen",
  "Planning beheren",
  "Crew beheren",
  "Berichten sturen",
  "Uren controleren",
  "Uren bekijken",
  "Moneybird koppeling gebruiken",
  "Leads beheren",
  "Opdrachtgevers bekijken",
  "Projectaanvragen bekijken",
  "Eigen shifts bekijken",
  "Beschikbaarheid doorgeven",
  "Eigen uren bekijken",
  "Eigen aanvragen bekijken",
  "Briefing delen",
  "Planningstatus bekijken",
];

type Props = {
  roles: UserRole[];
  onChange: (roles: UserRole[]) => void;
};

export default function UserRoleSettingsPanel({ roles, onChange }: Props) {
  function togglePermission(roleId: string, permission: string) {
    onChange(
      roles.map((role) => {
        if (role.id !== roleId) return role;
        const has = role.permissions.includes(permission);
        return {
          ...role,
          permissions: has
            ? role.permissions.filter((p) => p !== permission)
            : [...role.permissions, permission],
        };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#101828]/60">
        Echte rollen worden later gekoppeld aan auth en Supabase.
      </p>

      {roles.map((role) => (
        <Card
          key={role.id}
          className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
        >
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#0B1F4D]">
              {role.name}
            </CardTitle>
            <CardDescription>{role.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_PERMISSIONS.map((permission) => {
                const checked = role.permissions.includes(permission);
                return (
                  <label
                    key={permission}
                    className="flex items-center gap-2 text-sm text-[#0B1F4D]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(role.id, permission)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    {permission}
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
