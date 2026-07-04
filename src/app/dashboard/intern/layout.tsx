import InternDashboardShell from "@/components/dashboard/InternDashboardShell";
import { requireDashboardAccess } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

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
