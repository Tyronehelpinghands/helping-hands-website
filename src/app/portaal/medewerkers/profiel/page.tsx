import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EmployeeProfileCard from "@/components/employee-portal/EmployeeProfileCard";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Mijn profiel | Medewerkersportaal",
};

export default async function EmployeeProfilePage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile || !bundle.employeeProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return <EmployeeProfileCard profile={bundle.employeeProfile} />;
}
