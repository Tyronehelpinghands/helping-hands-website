import { cn } from "@/lib/utils";

type ResponsiveCardGridProps = {
  children: React.ReactNode;
  className?: string;
  /** Default: 1 col mobile, 2 tablet, 3 desktop, 4 xl */
  cols?: "stats" | "cards" | "dense";
};

const colClasses: Record<NonNullable<ResponsiveCardGridProps["cols"]>, string> = {
  stats: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
  cards: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  dense: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function ResponsiveCardGrid({
  children,
  className,
  cols = "cards",
}: ResponsiveCardGridProps) {
  return (
    <div className={cn("grid gap-4 sm:gap-6", colClasses[cols], className)}>{children}</div>
  );
}
