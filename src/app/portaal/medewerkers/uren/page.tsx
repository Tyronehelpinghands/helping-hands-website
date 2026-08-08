import type { Metadata } from "next";
import { redirect } from "next/navigation";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";
import EmployeeHoursPageClient from "./EmployeeHoursPageClient";

export const metadata: Metadata = {
  title: "Mijn uren | Medewerkersportaal",
  description:
    "Bekijk, dien in en bewerk je uren en kilometers. Goedkeuring gebeurt door planning.",
};

export default async function EmployeeHoursPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return (
    <EmployeeHoursPageClient
      entries={bundle.hours}
      shiftOptions={bundle.hoursShiftOptions}
    />
  );
}
