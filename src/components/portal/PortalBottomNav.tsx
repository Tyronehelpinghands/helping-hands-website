"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type PortalBottomNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function PortalBottomNav({
  items,
  basePath,
}: {
  items: PortalBottomNavItem[];
  basePath: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Mobiele navigatie"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === basePath
              ? pathname === basePath
              : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold",
                  active ? "text-[#173A8A]" : "text-slate-500",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-[#F28C28]" : "text-slate-400",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
