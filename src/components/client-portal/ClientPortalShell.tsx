"use client";

import ClientPortalHeader from "@/components/client-portal/ClientPortalHeader";
import ClientPortalSidebar from "@/components/client-portal/ClientPortalSidebar";
import PortalBanner from "@/components/PortalBanner";

export default function ClientPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      <ClientPortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F7FA]">
        <ClientPortalHeader />
        <PortalBanner variant="client" />
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
