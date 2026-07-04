import { requireDashboardAccess } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function MedewerkerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardAccess(["medewerker"]);
  return children;
}
