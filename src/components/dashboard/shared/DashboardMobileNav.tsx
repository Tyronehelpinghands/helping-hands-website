"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import DashboardMobileHeader from "@/components/dashboard/shared/DashboardMobileHeader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type DashboardMobileNavProps = {
  portalLabel: string;
  title?: string;
  items: DashboardNavItem[];
  isActive: (pathname: string, href: string) => boolean;
  footer?: React.ReactNode;
  extraLinks?: React.ReactNode;
  sheetClassName?: string;
};

/**
 * Mobile hamburger + slide-over navigation for dashboards and portals.
 */
export default function DashboardMobileNav({
  portalLabel,
  title,
  items,
  isActive,
  footer,
  extraLinks,
  sheetClassName,
}: DashboardMobileNavProps) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <DashboardMobileHeader
        portalLabel={portalLabel}
        title={title}
        onMenuOpen={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className={cn(
            "w-full max-w-full border-0 bg-[#0B1F4D] p-0 text-white sm:max-w-xs",
            sheetClassName,
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{portalLabel} navigatie</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col overflow-y-auto">
            <nav className="flex-1 space-y-0.5 px-3 py-4">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
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
              {extraLinks ? (
                <div className="mt-4 border-t border-white/10 pt-4">{extraLinks}</div>
              ) : null}
            </nav>
            {footer ? <div className="border-t border-white/10 p-4">{footer}</div> : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
