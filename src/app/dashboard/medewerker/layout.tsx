import type { Metadata } from "next";
import { requireDashboardAccess } from "@/lib/auth-server";
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
  await requireDashboardAccess(["medewerker"]);
  return children;
}
