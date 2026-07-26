import type { Metadata } from "next";
import { requireDashboardAccess } from "@/lib/auth-server";
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
  await requireDashboardAccess(["opdrachtgever"]);
  return children;
}
