import { requireDashboardAccess } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function OpdrachtgeverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardAccess(["opdrachtgever"]);
  return children;
}
