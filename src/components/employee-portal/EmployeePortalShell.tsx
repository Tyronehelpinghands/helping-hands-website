"use client";

import EmployeePortalHeader from "@/components/employee-portal/EmployeePortalHeader";
import EmployeePortalSidebar from "@/components/employee-portal/EmployeePortalSidebar";
import PortalBanner from "@/components/PortalBanner";

type EmployeePortalShellProps = {
  children: React.ReactNode;
};

export default function EmployeePortalShell({ children }: EmployeePortalShellProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      <EmployeePortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <EmployeePortalHeader />
        <PortalBanner variant="employee" />
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
