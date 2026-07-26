import type { Metadata } from "next";
import EmployeePortalShell from "@/components/employee-portal/EmployeePortalShell";
import { requirePortalAccess } from "@/lib/auth-server";
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
  await requirePortalAccess("medewerker");

  return <EmployeePortalShell>{children}</EmployeePortalShell>;
}
