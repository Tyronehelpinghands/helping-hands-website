import type { Metadata } from "next";
import ClientPortalShell from "@/components/client-portal/ClientPortalShell";
import { requirePortalAccess } from "@/lib/auth-server";
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
  await requirePortalAccess("opdrachtgever");

  return <ClientPortalShell>{children}</ClientPortalShell>;
}
