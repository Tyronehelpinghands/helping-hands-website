"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Menu } from "lucide-react";
import { BrandLogoImage } from "@/components/BrandLogo";
import LogoutButton from "@/components/LogoutButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Profile } from "@/lib/auth";
import { internNavItems, isInternNavActive } from "@/lib/intern-nav";
import { cn } from "@/lib/utils";

function getRoleLabel(role: Profile["role"]): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "planner":
      return "Planner";
    default:
      return "Gebruiker";
  }
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5">
      {internNavItems.map((item) => {
        const active = isInternNavActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-[#173A8A] text-white shadow-sm shadow-[#38bdf8]/10"
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

function SidebarContent({
  profile,
  pathname,
  onNavigate,
}: {
  profile: Profile;
  pathname: string;
  onNavigate?: () => void;
}) {
  const initials = (profile.full_name ?? profile.email ?? "HH")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <BrandLogoImage variant="markWhite" imageClassName="h-9 w-9" />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
          Intern portaal
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
            <Home className="h-4 w-4" aria-hidden="true" />
            Website
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/20">
            <AvatarFallback className="bg-[#173A8A] text-xs font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {profile.full_name ?? profile.email}
            </p>
            <p className="text-xs text-white/55">{getRoleLabel(profile.role)}</p>
          </div>
        </div>
        <div className="mt-3">
          <LogoutButton variant="sidebar" />
        </div>
      </div>
    </div>
  );
}

export default function InternDashboardSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 bg-[#0B1F4D] lg:flex lg:flex-col lg:border-r lg:border-[#173A8A]/40">
        <SidebarContent profile={profile} pathname={pathname} />
      </aside>

      <div className="flex items-center justify-between border-b border-[#173A8A]/40 bg-[#0B1F4D] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <BrandLogoImage variant="markWhite" imageClassName="h-8 w-8" />
          <span className="text-sm font-bold text-white">Intern portaal</span>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 border-white/20 bg-transparent text-white hover:bg-white/10"
              />
            }
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu openen</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-full border-[#173A8A]/40 bg-[#0B1F4D] p-0 text-white sm:max-w-xs"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigatie</SheetTitle>
            </SheetHeader>
            <SidebarContent profile={profile} pathname={pathname} onNavigate={closeMenu} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
