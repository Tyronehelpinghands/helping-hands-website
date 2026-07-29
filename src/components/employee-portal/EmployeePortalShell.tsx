"use client";

import EmployeePortalHeader from "@/components/employee-portal/EmployeePortalHeader";
import EmployeePortalSidebar from "@/components/employee-portal/EmployeePortalSidebar";
import PortalBanner from "@/components/PortalBanner";
import type { Profile } from "@/lib/auth";

type EmployeePortalShellProps = {
  profile: Profile;
  displayName?: string | null;
  children: React.ReactNode;
};

export default function EmployeePortalShell({
  profile,
  displayName,
  children,
}: EmployeePortalShellProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      <EmployeePortalSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <EmployeePortalHeader profile={profile} displayName={displayName} />
        <PortalBanner variant="employee" />
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
