import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Legacy WordPress `?page_id=` → canonical marketing routes. */
const PAGE_ID_REDIRECTS: Record<string, string> = {
  "19": "/contact",
  "16": "/opdrachtgevers",
  "17": "/vacatures",
  "23": "/over-ons",
};

/**
 * WordPress archive/feed/post query noise. Presence of any of these means the
 * URL is a legacy WP crawl target — strip them (and redirect unknown page_id).
 */
const WP_JUNK_PARAMS = [
  "p",
  "feed",
  "cat",
  "m",
  "paged",
  "attachment_id",
  "author",
] as const;

function isEnglishPath(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/");
}

function normalizeLegacyPath(pathname: string): string {
  if (pathname === "/index.php" || isEnglishPath(pathname)) {
    return "/";
  }
  return pathname;
}

/**
 * Permanent redirect for legacy WordPress query URLs and /en paths.
 * Never throws — failures fall through to a safe home redirect.
 */
function legacyWordpressRedirect(request: NextRequest): NextResponse | null {
  try {
    const url = request.nextUrl.clone();
    const { searchParams } = url;
    const pageId = searchParams.get("page_id");
    const hasWpJunk = WP_JUNK_PARAMS.some((key) => searchParams.has(key));
    const pathNeedsCleanup =
      url.pathname === "/index.php" || isEnglishPath(url.pathname);

    if (!pageId && !hasWpJunk && !pathNeedsCleanup) {
      return null;
    }

    if (pageId) {
      url.pathname = PAGE_ID_REDIRECTS[pageId] ?? "/";
      url.search = "";
      return NextResponse.redirect(url, 301);
    }

    for (const key of WP_JUNK_PARAMS) {
      searchParams.delete(key);
    }

    url.pathname = normalizeLegacyPath(url.pathname);
    // Drop remaining query noise from WP archives; keep unrelated params
    // only when the path is a real page (not home / index.php /en).
    if (url.pathname === "/") {
      url.search = "";
    } else {
      url.search = searchParams.toString() ? `?${searchParams.toString()}` : "";
    }

    return NextResponse.redirect(url, 301);
  } catch {
    const fallback = request.nextUrl.clone();
    fallback.pathname = "/";
    fallback.search = "";
    return NextResponse.redirect(fallback, 301);
  }
}

/**
 * Next.js 16: Proxy (voorheen middleware).
 * - Redirect oude WordPress query-URL's (page_id, p, feed, m, …)
 * - Ververst Supabase-sessie en bewaakt portaal/dashboard routes
 */
export async function proxy(request: NextRequest) {
  const legacy = legacyWordpressRedirect(request);
  if (legacy) return legacy;

  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/index.php",
    "/en",
    "/en/:path*",
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
