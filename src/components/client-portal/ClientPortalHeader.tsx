"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEMO_CLIENT_PROFILE } from "@/lib/clientPortal";
import { getClientPortalPageMeta } from "@/lib/clientPortalNavigation";

export default function ClientPortalHeader() {
  const pathname = usePathname() ?? "";
  const { title, subtitle } = getClientPortalPageMeta(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-[#0B1F4D] sm:text-2xl">
              {title}
            </h1>
            {pathname === "/portaal/opdrachtgevers" ? (
              <Badge className="border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c46a12]">
                Demo
              </Badge>
            ) : null}
          </div>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
            aria-label="Meldingen"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#0B1F4D]">
              {DEMO_CLIENT_PROFILE.companyName}
            </p>
            <p className="text-xs text-slate-500">Demo-account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
