import type { Metadata } from "next";
import SettingsDashboardClient from "@/components/dashboard/instellingen/SettingsDashboardClient";

export const metadata: Metadata = {
  title: "Instellingen | Intern dashboard",
  description:
    "Beheer bedrijfsgegevens, tarieven, e-mails, koppelingen, meldingen en dashboardvoorkeuren.",
};

// TODO: later alleen interne admins/planners toegang geven via echte auth/rollen

export default function InternInstellingenPage() {
  return <SettingsDashboardClient />;
}
