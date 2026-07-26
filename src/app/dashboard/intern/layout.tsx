import type { Metadata } from "next";
import InternDashboardShell from "@/components/dashboard/InternDashboardShell";
import { requireDashboardAccess } from "@/lib/auth-server";
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
  const profile = await requireDashboardAccess(["admin", "planner"]);

  return (
    <InternDashboardShell profile={profile}>{children}</InternDashboardShell>
  );
}
