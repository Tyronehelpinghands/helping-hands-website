import type { Metadata } from "next";
import ClientPlanningOverview from "@/components/client-portal/ClientPlanningOverview";

export const metadata: Metadata = {
  title: "Planning | Opdrachtgeversportaal",
  description: "Bekijk geplande inzet per project en functie.",
};

export default function ClientPlanningPage() {
  return <ClientPlanningOverview />;
}
