import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Legacy WordPress `?page_id=` cleanup → canonical marketing routes. */
const PAGE_ID_REDIRECTS: Record<string, string> = {
  "19": "/contact",
  "16": "/opdrachtgevers",
  "17": "/vacatures",
  "23": "/over-ons",
};

/**
 * Next.js 16: Proxy (voorheen middleware).
 * - Redirect oude page_id query-URL's
 * - Ververst Supabase-sessie en bewaakt portaal/dashboard routes
 */
export async function proxy(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get("page_id");
  if (pageId && PAGE_ID_REDIRECTS[pageId]) {
    const url = request.nextUrl.clone();
    url.pathname = PAGE_ID_REDIRECTS[pageId];
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/index.php",
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
