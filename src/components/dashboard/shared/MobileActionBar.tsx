"use client";

import { cn } from "@/lib/utils";

type MobileActionBarProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Sticky action bar for primary mobile CTAs (hidden on lg+).
 */
export default function MobileActionBar({ children, className }: MobileActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-sm lg:hidden",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg flex-col gap-2">{children}</div>
    </div>
  );
}
