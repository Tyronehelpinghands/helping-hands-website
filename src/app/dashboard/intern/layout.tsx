import { requireDashboardAccess } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function InternDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardAccess(["admin", "planner"]);
  return children;
}
