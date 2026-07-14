import { cn } from "@/lib/utils";

type ResponsiveTableProps = {
  children: React.ReactNode;
  /** Minimum table width for horizontal scroll, e.g. "min-w-[1100px]" */
  tableMinWidthClass?: string;
  className?: string;
};

/**
 * Wraps wide tables so only the table scrolls horizontally, not the page.
 */
export default function ResponsiveTable({
  children,
  tableMinWidthClass,
  className,
}: ResponsiveTableProps) {
  return (
    <div
      className={cn(
        "w-full max-w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white",
        className,
      )}
    >
      <div className={cn("w-full", tableMinWidthClass)}>{children}</div>
    </div>
  );
}
