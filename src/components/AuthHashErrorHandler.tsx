"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Supabase sometimes returns auth failures in the URL hash
 * (`#error=access_denied&error_code=otp_expired&…`), which the server
 * never sees. Catch them client-side and send the user to a clear login message.
 */
export default function AuthHashErrorHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || !hash.includes("error=")) return;

    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const params = new URLSearchParams(raw);
    const error = params.get("error");
    if (!error) return;

    const errorCode = params.get("error_code") ?? "";
    const description = (
      params.get("error_description") ?? ""
    ).toLowerCase();
    const isOtpExpired =
      errorCode === "otp_expired" ||
      description.includes("expired") ||
      (description.includes("email link") && description.includes("invalid"));

    // Strip hash so a refresh does not re-trigger.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    if (isOtpExpired) {
      router.replace("/login?type=opdrachtgever&error=otp_expired");
      return;
    }

    if (pathname !== "/login") {
      router.replace("/login?error=auth");
    }
  }, [router, pathname]);

  return null;
}
