import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // TODO: Supabase Auth koppelen — role-based portal toegang afdwingen
  // TODO: /portaal/medewerkers en /portaal/opdrachtgevers niet naar intern redirecten
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
