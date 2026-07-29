import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EmployeeDocuments from "@/components/employee-portal/EmployeeDocuments";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Documenten | Medewerkersportaal",
};

export default async function EmployeeDocumentsPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return <EmployeeDocuments documents={bundle.documents} />;
}
