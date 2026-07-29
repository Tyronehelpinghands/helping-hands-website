import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EmployeeMessages from "@/components/employee-portal/EmployeeMessages";
import NoCrewProfileState from "@/components/employee-portal/NoCrewProfileState";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";

export const metadata: Metadata = {
  title: "Berichten | Medewerkersportaal",
};

export default async function EmployeeMessagesPage() {
  const bundle = await getEmployeePortalBundle();
  if (!bundle) redirect("/login");
  if (!bundle.hasCrewProfile) {
    return <NoCrewProfileState displayName={bundle.displayName} />;
  }

  return <EmployeeMessages messages={bundle.messages} />;
}
