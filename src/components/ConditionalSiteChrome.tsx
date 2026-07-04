"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteChromeExtras from "@/components/SiteChromeExtras";

export default function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <SiteChromeExtras />
    </>
  );
}
