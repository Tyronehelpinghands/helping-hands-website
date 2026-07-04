"use client";

import { usePathname } from "next/navigation";
import FloatingCTA from "@/components/FloatingCTA";

export default function SiteChromeExtras() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return null;
  }

  return <FloatingCTA />;
}
