"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  Menu,
} from "lucide-react";
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
import type { Profile, UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "admin":
    case "planner":
      return [
        { href: "/dashboard/intern", label: "Overzicht", icon: LayoutDashboard },
        { href: "/dashboard/intern#aanvragen", label: "Aanvragen", icon: ClipboardList },
      ];
    case "medewerker":
      return [
        { href: "/dashboard/medewerker", label: "Mijn shifts", icon: CalendarDays },
      ];
    case "opdrachtgever":
      return [
        { href: "/dashboard/opdrachtgever", label: "Projecten", icon: Building2 },
      ];
    default:
      return [];
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "planner":
      return "Planner";
    case "medewerker":
      return "Medewerker";
    case "opdrachtgever":
      return "Opdrachtgever";
    default:
      return "Gebruiker";
  }
}

function getPortalTitle(role: UserRole): string {
  switch (role) {
    case "admin":
    case "planner":
      return "Intern portaal";
    case "medewerker":
      return "Medewerkersportaal";
    case "opdrachtgever":
      return "Opdrachtgeversportaal";
    default:
      return "Portaal";
  }
}

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
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
        <BrandLogoImage
          variant="markWhite"
          imageClassName="h-9 w-9"
        />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
          {getPortalTitle(profile.role)}
        </p>
        <p className="mt-1 text-lg font-black text-white">Helping Hands</p>
      </div>

      <Separator className="bg-white/10" />

      <div className="flex-1 px-3 py-4">
        <SidebarNav
          items={getNavItems(profile.role)}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <div className="mt-4">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
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

export default function DashboardSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 bg-[#0B1F4D] lg:flex lg:flex-col lg:border-r lg:border-[#173A8A]/40">
        <SidebarContent profile={profile} pathname={pathname} />
      </aside>

      <div className="flex items-center justify-between border-b border-[#173A8A]/40 bg-[#0B1F4D] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <BrandLogoImage variant="markWhite" imageClassName="h-8 w-8" />
          <span className="text-sm font-bold text-white">
            {getPortalTitle(profile.role)}
          </span>
        </div>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
              />
            }
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu openen</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-[#173A8A]/40 bg-[#0B1F4D] p-0 text-white">
            <SheetHeader className="sr-only">
              <SheetTitle>Dashboard navigatie</SheetTitle>
            </SheetHeader>
            <SidebarContent profile={profile} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
