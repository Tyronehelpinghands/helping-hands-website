import type { Metadata } from "next";
import { clientRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata(
  "Opdrachtgever dashboard",
  "Dashboard voor opdrachtgevers van Helping Hands Agency.",
);

export default async function OpdrachtgeverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(clientRoles, { redirectTo: "/dashboard/opdrachtgever" });
  return children;
}
