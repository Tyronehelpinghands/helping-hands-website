import type { Metadata } from "next";
import { employeeRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata(
  "Medewerker dashboard",
  "Dashboard voor medewerkers van Helping Hands Agency.",
);

export default async function MedewerkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(employeeRoles, { redirectTo: "/dashboard/medewerker" });
  return children;
}
