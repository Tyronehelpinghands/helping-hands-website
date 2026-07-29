import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EmployeePortalShell from "@/components/employee-portal/EmployeePortalShell";
import { employeeRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { getEmployeePortalBundle } from "@/lib/employee-portal/data";
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
  await requireRole(employeeRoles, {
    redirectTo: "/portaal/medewerkers",
  });

  const bundle = await getEmployeePortalBundle();
  if (!bundle) {
    redirect("/login");
  }

  return (
    <EmployeePortalShell
      profile={bundle.authProfile}
      displayName={bundle.displayName}
    >
      {children}
    </EmployeePortalShell>
  );
}
