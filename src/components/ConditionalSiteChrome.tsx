"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/layout/PublicHeader";
import SiteChromeExtras from "@/components/SiteChromeExtras";

export default function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/portaal/medewerkers") ||
    pathname?.startsWith("/portaal/opdrachtgevers");

  if (isDashboard) {
    return children;
  }

  return (
    <>
      <PublicHeader />
      {children}
      <Footer />
      <SiteChromeExtras />
    </>
  );
}
