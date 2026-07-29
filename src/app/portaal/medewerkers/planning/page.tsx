import type { Metadata } from "next";
import { redirect } from "next/navigation";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import UpcomingShifts from "@/components/employee-portal/UpcomingShifts";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Mijn planning | Medewerkersportaal",
};

export default async function EmployeePlanningPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return (
    <UpcomingShifts
      shifts={bundle.shifts}
      showFilters
      title="Mijn planning"
      description="Alle aankomende diensten en projectdetails"
    />
  );
}
