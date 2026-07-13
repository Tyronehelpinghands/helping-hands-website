import type { Metadata } from "next";
import ClientHoursOverview from "@/components/client-portal/ClientHoursOverview";

export const metadata: Metadata = {
  title: "Urenstatus | Opdrachtgeversportaal",
  description: "Samenvatting van gewerkte uren per project.",
};

export default function ClientHoursPage() {
  return <ClientHoursOverview />;
}
