import type { Metadata } from "next";
import { redirect } from "next/navigation";
import HoursCheckTable from "@/components/employee-portal/HoursCheckTable";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Mijn uren | Medewerkersportaal",
  description:
    "Bekijk je gewerkte uren en geef wijzigingen door. Goedkeuring gebeurt door planning.",
};

export default async function EmployeeHoursPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return <HoursCheckTable entries={bundle.hours} />;
}
