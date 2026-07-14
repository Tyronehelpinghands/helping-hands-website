"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, LogOut, Menu } from "lucide-react";
import { BrandLogoImage } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DEMO_CLIENT_PROFILE } from "@/lib/clientPortal";
import { performPortalLogout } from "@/lib/authRedirects";
import {
  clientPortalNavItems,
  isClientPortalNavActive,
} from "@/lib/clientPortalNavigation";
import { cn } from "@/lib/utils";

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {clientPortalNavItems.map((item) => {
        const active = isClientPortalNavActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-[#173A8A] text-white shadow-sm"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Link href="/" onClick={onNavigate} className="inline-block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38bdf8]">
          <BrandLogoImage variant="markWhite" imageClassName="h-9 w-9" />
        </Link>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
          Opdrachtgeversportaal
        </p>
        <p className="mt-1 text-lg font-black text-white">Helping Hands</p>
      </div>
      <Separator className="bg-white/10" />
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav pathname={pathname} onNavigate={onNavigate} />
        <div className="mt-4 border-t border-white/10 pt-4">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            Terug naar website
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold text-white">
          {DEMO_CLIENT_PROFILE.companyName}
        </p>
        <p className="text-xs text-white/55">{DEMO_CLIENT_PROFILE.customerType}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full border-white/20 bg-transparent text-white hover:bg-white/10"
          onClick={() => void performPortalLogout("opdrachtgever")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Uitloggen
        </Button>
      </div>
    </div>
  );
}

export default function ClientPortalSidebar() {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0B1F4D] lg:flex">
        <SidebarInner pathname={pathname} />
      </aside>
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#0B1F4D] px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38bdf8]">
          <BrandLogoImage variant="markWhite" imageClassName="h-8 w-8" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc]">
              Opdrachtgeversportaal
            </p>
            <p className="text-sm font-bold text-white">Helping Hands</p>
          </div>
        </Link>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 border-white/20 bg-transparent text-white hover:bg-white/10"
              />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu openen</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-full border-0 bg-[#0B1F4D] p-0 text-white sm:max-w-xs">
            <SheetHeader className="sr-only">
              <SheetTitle>Opdrachtgeversportaal menu</SheetTitle>
            </SheetHeader>
            <SidebarInner pathname={pathname} onNavigate={closeMenu} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
