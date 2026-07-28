import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16: Proxy (voorheen middleware).
 * Ververst de Supabase-sessie en bewaakt interne/medewerkers/opdrachtgevers
 * routes server-side. Publieke pagina's blijven publiek.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portaal/medewerkers",
    "/portaal/medewerkers/:path*",
    "/portaal/opdrachtgevers",
    "/portaal/opdrachtgevers/:path*",
    "/login",
    "/forgot-password",
    "/update-password",
  ],
};
