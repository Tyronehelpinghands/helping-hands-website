import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AvailabilityPanel from "@/components/employee-portal/AvailabilityPanel";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Beschikbaarheid | Medewerkersportaal",
};

export default async function EmployeeAvailabilityPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return <AvailabilityPanel initial={bundle.availability} />;
}
