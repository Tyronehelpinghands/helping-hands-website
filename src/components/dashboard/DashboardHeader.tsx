"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Bell, Calendar, ChevronDown, Loader2, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { dashboardNotifications } from "@/data/dashboardMockData";

type DashboardHeaderProps = {
  profile: Profile;
  title?: string;
  subtitle?: string;
};

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

function LogoutMenuItem() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {loading ? "Uitloggen…" : "Uitloggen"}
    </DropdownMenuItem>
  );
}

export default function DashboardHeader({
  profile,
  title = "Intern dashboard",
  subtitle = "Overzicht van Helping Hands Agency",
}: DashboardHeaderProps) {
  const initials = (profile.full_name ?? profile.email ?? "HH")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const unreadCount = dashboardNotifications.length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#38bdf8]">
            Helping Hands Agency
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-[#0B1F4D] sm:text-2xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#101828]/65">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-[#F5F7FA] px-3 py-1.5">
            <Calendar className="h-4 w-4 text-[#173A8A]" aria-hidden="true" />
            <Select defaultValue="month">
              <SelectTrigger className="h-7 min-w-[120px] border-0 bg-transparent shadow-none focus-visible:ring-0">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Deze week</SelectItem>
                <SelectItem value="month">Deze maand</SelectItem>
                <SelectItem value="quarter">Dit kwartaal</SelectItem>
                <SelectItem value="year">Dit jaar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="relative border-slate-200/80 bg-white"
                  aria-label="Meldingen"
                />
              }
            >
              <Bell className="h-4 w-4 text-[#173A8A]" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-0 bg-[#F28C28] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </Badge>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-[#0B1F4D]">Meldingen</p>
                <p className="text-xs text-[#101828]/60">
                  {unreadCount} recente updates
                </p>
              </div>
              <DropdownMenuSeparator />
              {dashboardNotifications.slice(0, 3).map((item) => (
                <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-0.5 py-2.5">
                  <span className="text-sm font-semibold text-[#0B1F4D]">
                    {item.title}
                  </span>
                  <span className="text-xs text-[#101828]/60">{item.time}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/intern/berichten" />}>
                Alle meldingen bekijken
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="gap-2 border-slate-200/80 bg-white pl-2 pr-3"
                />
              }
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#173A8A] text-[10px] font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-[#0B1F4D] sm:inline">
                {profile.full_name ?? profile.email}
              </span>
              <ChevronDown className="h-4 w-4 text-[#101828]/50" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-[#0B1F4D]">
                  {profile.full_name ?? profile.email}
                </p>
                <p className="text-xs text-[#101828]/60">
                  {getRoleLabel(profile.role)}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/intern/instellingen" />}>
                <User className="h-4 w-4" />
                Mijn profiel
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/intern/instellingen" />}>
                <Settings className="h-4 w-4" />
                Instellingen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
