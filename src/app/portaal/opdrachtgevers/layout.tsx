import type { Metadata } from "next";
import ClientPortalShell from "@/components/client-portal/ClientPortalShell";
import { clientRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata(
  "Opdrachtgeversportaal",
  "Bekijk aanvragen, projecten, planning, briefings, urenstatus en facturen als opdrachtgever.",
);

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(clientRoles, {
    redirectTo: "/portaal/opdrachtgevers",
  });

  return <ClientPortalShell profile={profile}>{children}</ClientPortalShell>;
}
