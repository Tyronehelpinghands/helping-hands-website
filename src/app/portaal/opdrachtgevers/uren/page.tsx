import type { Metadata } from "next";
import ClientHoursOverview from "@/components/client-portal/ClientHoursOverview";
import { getClientPortalHoursBundle } from "@/lib/client-portal/data";

export const metadata: Metadata = {
  title: "Urenstatus | Opdrachtgeversportaal",
  description: "Samenvatting van gewerkte uren en kilometers per project.",
};

export default async function ClientHoursPage() {
  const bundle = await getClientPortalHoursBundle();

  return (
    <ClientHoursOverview
      entries={bundle.hours}
      errorMessage={bundle.errorMessage}
      kmRate={bundle.kmRate}
    />
  );
}
