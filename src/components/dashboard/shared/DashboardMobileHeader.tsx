"use client";

import { Menu } from "lucide-react";
import { BrandLogoImage } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardMobileHeaderProps = {
  portalLabel: string;
  title?: string;
  onMenuOpen: () => void;
  className?: string;
  logoHref?: string;
};

/**
 * Compact mobile top bar for dashboard/portals (shown below lg breakpoint).
 */
export default function DashboardMobileHeader({
  portalLabel,
  title = "Helping Hands",
  onMenuOpen,
  className,
}: DashboardMobileHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-slate-200 bg-[#0B1F4D] px-4 py-3 lg:hidden",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <BrandLogoImage variant="markWhite" imageClassName="h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc]">
            {portalLabel}
          </p>
          <p className="truncate text-sm font-bold text-white">{title}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 shrink-0 border-white/20 bg-transparent text-white hover:bg-white/10"
        onClick={onMenuOpen}
        aria-label="Menu openen"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
