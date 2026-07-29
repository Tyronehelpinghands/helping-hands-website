"use client";

import {
  CalendarCheck,
  CalendarDays,
  Clock,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import EmployeePortalHeader from "@/components/employee-portal/EmployeePortalHeader";
import EmployeePortalSidebar from "@/components/employee-portal/EmployeePortalSidebar";
import PortalBanner from "@/components/PortalBanner";
import PortalBottomNav from "@/components/portal/PortalBottomNav";
import type { Profile } from "@/lib/auth";
import { EMPLOYEE_PORTAL_BASE } from "@/lib/employeePortalNavigation";

const bottomItems = [
  { label: "Home", href: EMPLOYEE_PORTAL_BASE, icon: LayoutDashboard },
  { label: "Planning", href: `${EMPLOYEE_PORTAL_BASE}/planning`, icon: CalendarDays },
  {
    label: "Beschikbaar",
    href: `${EMPLOYEE_PORTAL_BASE}/beschikbaarheid`,
    icon: CalendarCheck,
  },
  { label: "Uren", href: `${EMPLOYEE_PORTAL_BASE}/uren`, icon: Clock },
  {
    label: "Berichten",
    href: `${EMPLOYEE_PORTAL_BASE}/berichten`,
    icon: MessageSquare,
  },
];

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
        <main className="flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
        <PortalBottomNav items={bottomItems} basePath={EMPLOYEE_PORTAL_BASE} />
      </div>
    </div>
  );
}
