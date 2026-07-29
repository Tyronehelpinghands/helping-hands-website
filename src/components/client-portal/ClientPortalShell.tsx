"use client";

import {
  CalendarDays,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import ClientPortalHeader from "@/components/client-portal/ClientPortalHeader";
import ClientPortalSidebar from "@/components/client-portal/ClientPortalSidebar";
import PortalBanner from "@/components/PortalBanner";
import PortalBottomNav from "@/components/portal/PortalBottomNav";
import type { Profile } from "@/lib/auth";
import { CLIENT_PORTAL_BASE } from "@/lib/clientPortalNavigation";

const bottomItems = [
  { label: "Home", href: CLIENT_PORTAL_BASE, icon: LayoutDashboard },
  { label: "Aanvragen", href: `${CLIENT_PORTAL_BASE}/aanvragen`, icon: ClipboardList },
  { label: "Projecten", href: `${CLIENT_PORTAL_BASE}/projecten`, icon: FolderKanban },
  { label: "Planning", href: `${CLIENT_PORTAL_BASE}/planning`, icon: CalendarDays },
  { label: "Facturen", href: `${CLIENT_PORTAL_BASE}/facturen`, icon: Receipt },
];

type ClientPortalShellProps = {
  profile: Profile;
  children: React.ReactNode;
};

export default function ClientPortalShell({
  profile,
  children,
}: ClientPortalShellProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      <ClientPortalSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <ClientPortalHeader profile={profile} />
        <PortalBanner variant="client" />
        <main className="flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
        <PortalBottomNav items={bottomItems} basePath={CLIENT_PORTAL_BASE} />
      </div>
    </div>
  );
}
