"use client";

import { Info } from "lucide-react";
import EmployeePortalHeader from "@/components/employee-portal/EmployeePortalHeader";
import EmployeePortalSidebar from "@/components/employee-portal/EmployeePortalSidebar";

type EmployeePortalShellProps = {
  children: React.ReactNode;
};

export default function EmployeePortalShell({ children }: EmployeePortalShellProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <EmployeePortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <EmployeePortalHeader />
        <div className="border-b border-[#38bdf8]/20 bg-[#38bdf8]/5 px-4 py-2.5 sm:px-6">
          <p className="flex items-start gap-2 text-xs text-[#0284c7] sm:text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Demo-portaal. Echte toegang wordt later gekoppeld aan veilige login.
          </p>
        </div>
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
