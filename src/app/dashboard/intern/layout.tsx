import type { Metadata } from "next";
import InternDashboardShell from "@/components/dashboard/InternDashboardShell";
import { internalRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { noIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata(
  "Intern dashboard",
  "Intern dashboard voor planning, crew en projectadministratie.",
);

export default async function InternDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(internalRoles, { redirectTo: "/dashboard/intern" });

  return (
    <InternDashboardShell profile={profile}>{children}</InternDashboardShell>
  );
}
