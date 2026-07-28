import type { Metadata } from "next";
import EmployeePortalShell from "@/components/employee-portal/EmployeePortalShell";
import { employeeRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata(
  "Medewerkersportaal",
  "Planning, beschikbaarheid, uren en berichten voor crewleden.",
);

export default async function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(employeeRoles, {
    redirectTo: "/portaal/medewerkers",
  });

  return <EmployeePortalShell profile={profile}>{children}</EmployeePortalShell>;
}
